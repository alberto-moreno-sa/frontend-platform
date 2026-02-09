# Tracking Service

Microservicio de tracking de interacciones de componentes UI. Registra eventos, los persiste en MongoDB y expone estadísticas en tiempo real vía SSE y REST.

## Stack

| Capa | Tecnología |
| ---- | ---------- |
| Runtime | Node.js 20, TypeScript 5.7 |
| HTTP | Express 5 |
| Base de datos | MongoDB 6+ (Mongoose 8) |
| Broker | KafkaJS (Docker) / EventEmitter (local) |
| JWT | jose (ES256, verificación JWKS contra auth-service) |
| Validación | Zod |
| Logging | Pino (structured JSON) |
| Streaming | Server-Sent Events (SSE) |
| Docs | Swagger UI |

## Arquitectura

El servicio sigue una **arquitectura hexagonal** (ports & adapters) con separación entre dominio, aplicación e infraestructura.

```text
src/
├── tracking/
│   ├── domain/               # Entidades, funciones puras, value objects
│   │   ├── entities/         # TrackingEventEntity
│   │   ├── functions/        # validateTrackingData (Either pattern)
│   │   ├── errors/           # DomainErrors
│   │   └── value-objects/    # Viewport
│   ├── application/          # Casos de uso y puertos (interfaces)
│   │   ├── ports/            # EventBrokerPort, TrackingRepositoryPort, SSEEmitterPort
│   │   └── use-cases/        # TrackComponent, ConsumeEvents, GetStats, Export, StreamStats
│   └── infrastructure/       # Implementaciones concretas
│       ├── adapters/         # KafkaBroker, InMemoryBroker, MongoRepo, SSEEmitter
│       ├── routes/           # Express route handlers
│       ├── schemas/          # Mongoose schemas
│       ├── aggregations/     # MongoDB aggregation pipelines
│       └── validation/       # Zod schemas (track-event, stats-query, export-query)
├── common/                   # Middleware, errores, logger, Either, mappers
├── config/                   # Variables de entorno → AppConfig
├── app.ts                    # Express app factory
├── container.ts              # Dependency Injection container
└── main.ts                   # Bootstrap y graceful shutdown
```

## Flujo de datos

```text
┌──────────┐   POST /track    ┌─────────────────┐    publish     ┌─────────────┐
│  Client   │ ───────────────▶ │ TrackComponent   │ ─────────────▶│   Broker     │
│ (browser) │    202 Accepted  │ (validate+create)│               │ Kafka / Mem  │
└──────────┘                   └─────────────────┘               └──────┬──────┘
                                                                        │ subscribe
                                                                 ┌──────▼──────┐
                                                                 │ConsumeEvents │
                                                                 │  use case    │
                                                                 └──┬───────┬──┘
                                                        save        │       │  emit
                                                    ┌───────────────▼┐  ┌───▼──────────┐
                                                    │    MongoDB      │  │  SSE Emitter  │
                                                    │ (persistence)   │  │ (broadcast)   │
                                                    └───────┬────────┘  └───┬──────────┘
                                                            │               │
┌──────────┐  GET /stats       ┌─────────────────┐         │               │
│  Client   │ ◀──────────────── │  GetStats UC     │◀───────┘               │
└──────────┘  aggregated JSON  │ (7 pipelines)    │                        │
                                └─────────────────┘                        │
┌──────────┐  GET /stats/stream ┌─────────────────┐                        │
│  Client   │ ◀════════════════ │  StreamStats UC  │◀───────────────────────┘
└──────────┘  SSE (real-time)   │ (snapshot+live)  │
                                └─────────────────┘

┌──────────┐  GET /export      ┌─────────────────┐   ┌───────────┐
│  Client   │ ◀──────────────── │  ExportData UC   │──▶│  MongoDB   │
│ (auth JWT)│  CSV / JSON file  │                  │   └───────────┘
└──────────┘                   └─────────────────┘
```

### Broker: Kafka vs In-Memory

| Aspecto | Kafka (Docker) | In-Memory (local) |
| ------- | -------------- | ----------------- |
| Config | `BROKER_TYPE=kafka` | `BROKER_TYPE=memory` (default) |
| Uso | Producción, multi-instancia | Desarrollo local, testing |
| Persistencia | Sí (cluster Kafka) | No (se pierde al reiniciar) |
| Dependencias | Requiere Kafka corriendo | Ninguna externa |
| Escalado | Múltiples consumidores | Proceso único |
| Implementación | KafkaJS producer/consumer | Node.js EventEmitter |

> **En desarrollo local no se usa Kafka.** El broker por defecto es `memory` (EventEmitter), lo que permite arrancar el servicio sin dependencias externas más allá de MongoDB. Kafka solo se activa en Docker o cuando se configura explícitamente `BROKER_TYPE=kafka`.

## Prerequisitos

- Node.js >= 20
- MongoDB >= 6.0
- Kafka (solo para Docker, no necesario en local)

## Configuración

### 1. Instalar dependencias

```bash
cd services/tracking-service
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env
```

| Variable | Default | Descripción |
| -------- | ------- | ----------- |
| `PORT` | `3002` | Puerto del servidor |
| `NODE_ENV` | `development` | Entorno |
| `MONGODB_URI` | `mongodb://localhost:27017/component_tracking` | Conexión a MongoDB |
| `BROKER_TYPE` | `memory` | Tipo de broker: `kafka` o `memory` |
| `KAFKA_BROKERS` | `localhost:9092` | Direcciones de Kafka (solo si `BROKER_TYPE=kafka`) |
| `KAFKA_TOPIC` | `component.tracking` | Topic de Kafka |
| `KAFKA_CLIENT_ID` | `tracking-service` | Client ID de Kafka |
| `KAFKA_GROUP_ID` | `tracking-consumer-group` | Consumer group de Kafka |
| `AUTH_SERVICE_URL` | `http://localhost:3001` | URL del auth-service (para verificar JWKS en `/export`) |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Orígenes CORS (separados por coma) |
| `LOG_LEVEL` | `info` | Nivel de log (`debug`, `info`, `warn`, `error`) |

## Ejecución

### Desarrollo (local)

En local se usa el broker **in-memory** (EventEmitter). Solo necesitas MongoDB.

```bash
# Opción 1: MongoDB instalado en la máquina
npm run start:dev

# Opción 2: MongoDB vía Docker, app en local
docker compose --profile local-db up -d   # levanta mongo
npm run start:dev                          # app con hot reload
```

El servidor arranca en `http://localhost:3002` con hot reload (tsx watch).

> **Nota:** En desarrollo local **no se necesita Kafka**. Los eventos se publican y consumen a través de un EventEmitter en memoria dentro del mismo proceso.

### Docker (con Kafka)

#### Docker compose del servicio (con Kafka)

```bash
cd services/tracking-service

# Levanta tracking-service + Kafka + MongoDB local
docker compose --profile local-db up -d

# Con MongoDB Atlas (configurar MONGODB_URI en .env)
docker compose up -d
```

Este compose configura automáticamente `BROKER_TYPE=kafka` y conecta contra `kafka:9092`.

#### Monorepo completo (desde la raíz)

```bash
cd /ruta/al/frontend-platform

# Todos los servicios (auth + tracking + analytics-dashboard + redis)
docker compose up -d

# Con MongoDB local también
docker compose --profile local-db up -d
```

En el compose raíz, los servicios se comunican por la red interna de Docker:

- `tracking-service` → `auth-service:3001` (verificación JWKS para el endpoint `/export`)
- `auth-service` → `redis:6379`

> **Nota:** El compose raíz usa el `BROKER_TYPE` definido en el `.env` del servicio. Si quieres Kafka en el compose raíz, añade un servicio Kafka al `docker-compose.yml` raíz y configura `BROKER_TYPE=kafka`.

### Producción

```bash
npm run build
npm run start:prod
```

## Endpoints

| Método | Ruta | Auth | Descripción |
| ------ | ---- | ---- | ----------- |
| POST | `/api/components/track` | No | Registrar interacción (responde 202 Accepted) |
| GET | `/api/components/stats` | No | Estadísticas agregadas (filtros: `from`, `to`, `component`, `page`) |
| GET | `/api/components/stats/stream` | No | Stream SSE en tiempo real |
| GET | `/api/components/export` | Bearer JWT | Exportar datos en CSV o JSON (filtros + `format`) |
| GET | `/api/health` | No | Health check (MongoDB + broker + SSE clients) |
| GET | `/api/docs` | No | Swagger UI |

### Timestamps (UTC)

Todos los timestamps se reciben y almacenan en **UTC** (ISO 8601 con sufijo `Z`).

- Los schemas Zod validan `z.string().datetime({ offset: false })` — rechaza offsets como `+05:00`.
- La capa de dominio valida con regex ISO UTC: `YYYY-MM-DDTHH:mm:ss[.sss]Z`.
- MongoDB almacena objetos `Date` que son UTC por definición (BSON).

Ejemplos válidos: `2024-01-15T10:30:00Z`, `2024-01-15T10:30:00.000Z`
Ejemplos rechazados: `2024-01-15T10:30:00+05:00`, `2024-01-15`

## Tests

```bash
npm test               # 89 tests
npm run test:coverage  # con cobertura
```

## Scripts

```bash
npm run build          # Compilar TypeScript
npm run start          # Servidor en producción
npm run start:dev      # Desarrollo con hot reload (broker in-memory)
npm run start:prod     # Producción
npm test               # Tests
npm run test:coverage  # Tests con cobertura
npm run lint           # ESLint
npm run lint:fix       # ESLint auto-fix
npm run format         # Prettier
npm run format:check   # Verificar formato
```

## Troubleshooting

### `TOKEN_INVALID` on `/api/components/export`

**Symptom:** The `/api/components/export` endpoint returns:

```json
{ "error": { "code": "TOKEN_INVALID", "message": "Invalid token" } }
```

**Cause:** The tracking-service verifies JWTs by fetching the auth-service's JWKS endpoint (`/.well-known/jwks.json`). Inside a Docker container, `AUTH_SERVICE_URL` must point to the Docker network hostname (`auth-service`), not `localhost`. Since Docker Compose automatically reads the `.env` file in the service directory for variable substitution, a value like `AUTH_SERVICE_URL=http://localhost:3001` in `.env` will override any default set in `docker-compose.yml`, causing the container to try to reach `localhost:3001` (itself) instead of the auth-service container.

**Fix:** In `docker-compose.yml`, hardcode the Docker network URL without variable substitution:

```yaml
# Wrong - .env value overrides the default
- AUTH_SERVICE_URL=${AUTH_SERVICE_URL:-http://auth-service:3001}

# Correct - always uses Docker network hostname
- AUTH_SERVICE_URL=http://auth-service:3001
```

**Verify:** Check the resolved value inside the container:

```bash
docker exec tracking-service-tracking-service-1 printenv AUTH_SERVICE_URL
# Expected: http://auth-service:3001
```

### `ECONNREFUSED` on startup

**Symptom:** Logs show `connect ECONNREFUSED ::1:3001` or `127.0.0.1:3001`.

**Cause:** Same root cause as above. The service is trying to reach the auth-service on localhost instead of the Docker network.

**Fix:** Apply the same `AUTH_SERVICE_URL` fix described above.

### Kafka `This server does not host this topic-partition`

**Symptom:** The service crashes on startup with a KafkaJS error about topic-partitions.

**Cause:** Kafka auto-creates topics on first use, but the topic metadata might not be available immediately after Kafka starts.

**Fix:** The service has a built-in retry mechanism. If it fails on the first attempt, it will restart automatically (`restart: unless-stopped`) and succeed once Kafka has fully initialized. Ensure `KAFKA_AUTO_CREATE_TOPICS_ENABLE=true` is set on the Kafka container.

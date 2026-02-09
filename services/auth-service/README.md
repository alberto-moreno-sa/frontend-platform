# Auth Service

Microservicio de autenticación y autorización con JWT ES256, rotación de tokens con detección de robo, sesiones multi-dispositivo y arquitectura hexagonal.

## Stack

| Capa | Tecnología |
|------|-----------|
| Runtime | Node.js 20, TypeScript 5.7 |
| HTTP | Express 5 |
| Base de datos | MongoDB 6+ (Mongoose 8) |
| Cache / Sesiones | Redis 7+ (ioredis) |
| JWT | jose (ES256, JWKS) |
| Validación | Zod |
| Logging | Pino (structured JSON) |
| Seguridad | helmet, bcryptjs, CORS, HSTS |
| Docs | Swagger UI |

## Arquitectura

El servicio sigue una **arquitectura hexagonal** (ports & adapters) con separación estricta entre dominio, aplicación e infraestructura.

```
src/
├── auth/
│   ├── domain/               # Entidades, funciones puras, value objects
│   │   ├── entities/         # UserEntity, RefreshTokenEntity, KeyPairEntity
│   │   ├── functions/        # hashPassword, verifyPassword, createToken, cryptoKeys
│   │   └── value-objects/    # DeviceInfo
│   ├── application/          # Casos de uso y puertos (interfaces)
│   │   ├── ports/            # UserRepository, TokenService, Session, Blacklist, etc.
│   │   └── use-cases/        # RegisterUser, Login, RefreshToken, Logout, etc.
│   └── infrastructure/       # Implementaciones concretas
│       ├── adapters/         # Mongo repos, Redis adapters, JWT service
│       ├── routes/           # Express route handlers
│       ├── schemas/          # Mongoose schemas
│       └── validation/       # Zod schemas (register, login, etc.)
├── common/                   # Middleware, errores, logger, tipos compartidos
├── config/                   # Variables de entorno → AppConfig
├── app.ts                    # Express app factory
├── container.ts              # Dependency Injection container
└── main.ts                   # Bootstrap y graceful shutdown
```

## Flujo de autenticación

```
┌─────────┐     POST /register        ┌──────────────────┐
│  Client  │ ──────────────────────▶   │  RegisterUser UC  │
└─────────┘     POST /login            └────────┬─────────┘
     │     ──────────────────────▶               │
     │                                  ┌────────▼─────────┐
     │          access_token +          │   TokenService    │
     │◀──────── refresh_token ───────── │  (ES256 sign)     │
     │                                  └────────┬─────────┘
     │                                           │ persist refresh token
     │                                  ┌────────▼─────────┐
     │                                  │  MongoDB + Redis  │
     │                                  │  (token + session)│
     │                                  └──────────────────┘
     │
     │     POST /refresh                ┌──────────────────┐
     │ ──────────────────────▶          │ RefreshToken UC   │
     │                                  │ ● verify JWT      │
     │          new token pair          │ ● detect reuse    │
     │◀──────────────────────────────── │ ● rotate token    │
     │                                  │ ● update session  │
     │                                  └──────────────────┘
     │
     │     GET /profile (Bearer)        ┌──────────────────┐
     │ ──────────────────────▶          │  Auth Middleware   │
     │                                  │ ● verify JWT      │
     │                                  │ ● check blacklist │
     │          user data               │ ● validate user   │
     │◀──────────────────────────────── └──────────────────┘
```

### Seguridad de tokens

- **Rotación**: Cada `POST /refresh` invalida el refresh token anterior y emite uno nuevo.
- **Detección de robo**: Si se reutiliza un refresh token ya rotado, se revocan **todos** los tokens de la familia y se eliminan todas las sesiones del usuario.
- **Blacklist**: Los access tokens revocados (logout, delete account) se almacenan en Redis con TTL igual al tiempo restante de vida.
- **Key rotation**: Los JWT se firman con ES256. Las claves privadas se almacenan cifradas con AES-256. El servicio puede rotar claves y verificar tokens firmados con claves anteriores.

## Prerequisitos

- Node.js >= 20
- MongoDB >= 6.0
- Redis >= 7.0

## Configuración

### 1. Instalar dependencias

```bash
cd services/auth-service
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env
```

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT` | `3001` | Puerto del servidor |
| `NODE_ENV` | `development` | Entorno (`development` / `production`) |
| `MONGODB_URI` | `mongodb://localhost:27017/auth_db` | Conexión a MongoDB |
| `REDIS_URI` | `redis://localhost:6379` | Conexión a Redis |
| `JWT_KID` | `2024-02-v1` | ID del key pair activo |
| `KEY_ENCRYPTION_SECRET` | - | Secreto AES-256 para cifrar la clave privada |
| `ACCESS_TOKEN_TTL` | `900` | Vida del access token (segundos) |
| `REFRESH_TOKEN_TTL` | `604800` | Vida del refresh token (segundos, 7 días) |
| `ISSUER_URL` | `https://auth.yourapp.com` | Claim `iss` del JWT |
| `AUDIENCE` | `yourapp-api` | Claim `aud` del JWT |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Orígenes CORS (separados por coma) |
| `LOG_LEVEL` | `info` | Nivel de log (`debug`, `info`, `warn`, `error`) |

## Ejecución

### Desarrollo (local)

Requiere MongoDB y Redis corriendo localmente.

```bash
# Opción 1: MongoDB y Redis instalados en la máquina
npm run start:dev

# Opción 2: MongoDB y Redis vía Docker, app en local
docker compose --profile local-db up -d   # levanta mongo + redis
npm run start:dev                          # app con hot reload
```

El servidor arranca en `http://localhost:3001` con hot reload (tsx watch).

### Docker

#### Servicio aislado

```bash
cd services/auth-service

# Con MongoDB local en Docker
docker compose --profile local-db up -d

# Con MongoDB Atlas (configurar MONGODB_URI en .env)
docker compose up -d
```

#### Monorepo completo (desde la raíz)

```bash
cd /ruta/al/frontend-platform

# Todos los servicios (auth + tracking + analytics-dashboard + redis)
docker compose up -d

# Con MongoDB local también
docker compose --profile local-db up -d
```

Los servicios se comunican entre sí por la red interna de Docker:
- `auth-service` → `redis:6379`
- `tracking-service` → `auth-service:3001` (verificación JWKS)

### Producción

```bash
npm run build
npm run start:prod
```

## Endpoints

### Autenticación (`/api/auth`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Registrar usuario |
| POST | `/api/auth/login` | No | Iniciar sesión |
| POST | `/api/auth/refresh` | No | Rotar tokens (enviar `refresh_token` en body) |
| POST | `/api/auth/logout` | Bearer | Cerrar sesión del dispositivo actual |
| POST | `/api/auth/verify-token` | Header | Verificar validez de un token |

### Usuario (`/api/user`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/user/profile` | Bearer | Obtener perfil |
| PUT | `/api/user/profile` | Bearer | Actualizar nombre |
| DELETE | `/api/user/account` | Bearer | Eliminar cuenta (soft delete, requiere password) |
| GET | `/api/user/sessions` | Bearer | Listar sesiones activas |

### Otros

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/.well-known/jwks.json` | Claves públicas JWKS (cache 24h en Redis) |
| GET | `/health` | Health check (MongoDB + Redis) |
| GET | `/api/docs` | Swagger UI |

## Tests

```bash
npm test               # 102 tests
npm run test:coverage  # con cobertura
```

## Scripts

```bash
npm run build          # Compilar TypeScript
npm run start          # Servidor en producción
npm run start:dev      # Desarrollo con hot reload
npm run start:prod     # Producción
npm test               # Tests
npm run test:coverage  # Tests con cobertura
npm run lint           # ESLint
npm run lint:fix       # ESLint auto-fix
npm run format         # Prettier
npm run format:check   # Verificar formato
```

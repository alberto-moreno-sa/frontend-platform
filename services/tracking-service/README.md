# Tracking Service

Component tracking analytics service that records UI component interactions, persists events, and exposes real-time statistics via SSE + REST API.

## Architecture

Single service with **internal CQRS**: ingesta routes publish to broker, consumer subscribes and persists to MongoDB + emits SSE.

- **Hexagonal architecture** with domain, application, and infrastructure layers
- **Functional programming**: factory functions, immutable entities (Object.freeze), Either monad, no classes in business logic
- **Broker**: Kafka (KafkaJS) or in-memory EventEmitter, selected via `BROKER_TYPE` env var
- **MongoDB**: Separate database (`component_tracking`) from auth-service
- **Auth**: Export endpoint verifies JWT via JWKS from auth-service (ES256, `jose` library)

## Quick Start

### Development (in-memory broker)

```bash
# From repo root
npm run tracking:dev

# Or from this directory
npm run start:dev
```

### Docker (Kafka broker, default)

```bash
# From repo root — starts Zookeeper + Kafka + Redis + auth-service + tracking-service
docker compose up redis auth-service tracking-service -d

# Kafka topic: "component.tracking" on localhost:9092
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/components/track` | No | Track a component interaction (returns 202) |
| GET | `/api/components/stats` | No | Get aggregated statistics |
| GET | `/api/components/stats/stream` | No | SSE real-time stats stream |
| GET | `/api/components/export` | JWT | Export data as CSV or JSON |
| GET | `/api/health` | No | Service health check |
| GET | `/api/docs` | No | Swagger UI |

### POST /api/components/track

```json
{
  "componentName": "Button",
  "variant": "primary",
  "action": "click",
  "timestamp": "2025-02-08T15:30:00.000Z",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "pageUrl": "/checkout",
  "pageTitle": "Checkout",
  "viewport": { "width": 1920, "height": 1080 },
  "userAgent": "Mozilla/5.0...",
  "language": "es-MX",
  "metadata": { "productId": "SKU-123" }
}
```

**Required fields**: `componentName`, `variant`, `action`, `timestamp`, `sessionId`, `pageUrl`

**Valid actions**: `click`, `hover`, `focus`, `blur`, `submit`, `view`, `scroll`, `change`

### GET /api/components/stats

Query params: `from`, `to`, `component`, `page` (all optional, ISO 8601 dates)

Returns: `summary`, `byComponent`, `byAction`, `byPage`, `byDevice`, `topInteractions`, `timeline`

### GET /api/components/stats/stream (SSE)

Sends initial stats snapshot, then `event: interaction` for each new tracking event.

### GET /api/components/export

Query params: `format` (`csv`|`json`), `from`, `to`, `component`, `page`

Requires `Authorization: Bearer <jwt>` header (JWT from auth-service).

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3002` | Server port |
| `NODE_ENV` | `development` | Environment |
| `MONGODB_URI` | `mongodb://localhost:27017/component_tracking` | MongoDB connection |
| `BROKER_TYPE` | `memory` | `kafka` or `memory` |
| `KAFKA_BROKERS` | `localhost:9092` | Kafka broker addresses |
| `KAFKA_TOPIC` | `component.tracking` | Kafka topic name |
| `KAFKA_CLIENT_ID` | `tracking-service` | Kafka client ID |
| `KAFKA_GROUP_ID` | `tracking-consumer-group` | Kafka consumer group |
| `AUTH_SERVICE_URL` | `http://localhost:3001` | Auth service URL for JWKS |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | CORS allowed origins |

## Scripts

```bash
npm run build       # TypeScript compile + path alias resolution
npm run start       # Run compiled JS
npm run start:dev   # Development with hot reload (tsx watch)
npm run lint        # ESLint check
npm run lint:fix    # ESLint auto-fix
npm run format      # Prettier format
```

## Project Structure

```
src/
├── tracking/
│   ├── domain/           # Entities, value objects, validation functions
│   ├── application/      # Ports (interfaces) and use cases
│   └── infrastructure/   # Adapters, routes, schemas, aggregations
├── common/               # Shared utilities (Either, AppError, middleware)
├── config/               # Environment config loader
├── container.ts          # DI composition root
├── app.ts                # Express app setup
├── swagger.ts            # OpenAPI spec
└── main.ts               # Entry point
```

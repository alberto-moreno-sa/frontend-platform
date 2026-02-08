# Tracking Service

UI component interaction tracking service. Records events, persists to MongoDB, and exposes real-time statistics via SSE + REST.

**Stack:** Express 5, TypeScript, MongoDB (Mongoose), KafkaJS / EventEmitter, jose (JWT ES256), Zod

## Prerequisites

- Node.js >= 20
- MongoDB >= 6.0
- Kafka (optional, can use in-memory broker)

## Setup

```bash
npm install
cp .env.example .env
```

## Development

```bash
npm run start:dev
```

Starts the server at `http://localhost:3002` with hot reload (tsx watch) and in-memory broker.

## Production

```bash
npm run build
npm run start:prod
```

## Docker

```bash
# From monorepo root (with Kafka + auth-service)
docker compose up redis auth-service tracking-service -d

# Manual build
docker build -t tracking-service .
docker run -p 3002:3002 --env-file .env tracking-service
```

## Tests

```bash
npm test
npm run test:coverage
```

## Environment Variables

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `PORT` | `3002` | Server port |
| `NODE_ENV` | `development` | Environment |
| `MONGODB_URI` | `mongodb://localhost:27017/component_tracking` | MongoDB connection |
| `BROKER_TYPE` | `memory` | `kafka` or `memory` |
| `KAFKA_BROKERS` | `localhost:9092` | Kafka broker addresses |
| `KAFKA_TOPIC` | `component.tracking` | Kafka topic name |
| `KAFKA_CLIENT_ID` | `tracking-service` | Kafka client ID |
| `KAFKA_GROUP_ID` | `tracking-consumer-group` | Kafka consumer group |
| `AUTH_SERVICE_URL` | `http://localhost:3001` | Auth service URL for JWKS |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | CORS allowed origins (comma-separated) |

## Endpoints

| Method | Route | Auth | Description |
| ------ | ----- | ---- | ----------- |
| POST | `/api/components/track` | No | Track interaction (returns 202) |
| GET | `/api/components/stats` | No | Aggregated statistics |
| GET | `/api/components/stats/stream` | No | Real-time SSE stream |
| GET | `/api/components/export` | JWT | Export data (CSV or JSON) |
| GET | `/api/health` | No | Health check |
| GET | `/api/docs` | No | Swagger UI |

## Scripts

```bash
npm run build          # Compile TypeScript
npm run start          # Production server
npm run start:dev      # Development with hot reload
npm run start:prod     # Production
npm test               # Run tests
npm run test:coverage  # Tests with coverage
npm run lint           # ESLint
npm run lint:fix       # ESLint auto-fix
npm run format         # Prettier
```

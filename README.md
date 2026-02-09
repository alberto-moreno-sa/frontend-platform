# Frontend Platform

Monorepo containing the analytics dashboard, backend microservices (auth and tracking), and the UI Kit component library.

## Architecture

```
frontend-platform/
├── analytics-dashboard/     # Web app (React Router v7)
├── services/
│   ├── auth-service/        # Authentication microservice (JWT ES256)
│   └── tracking-service/    # Component tracking microservice
├── ui-kit/                  # React component library
│   ├── packages/react/      #   React components
│   ├── packages/styles/     #   CSS design tokens
│   └── packages/utils/      #   Utilities (cx/tailwind-merge)
└── docker-compose.yml       # General orchestration
```

| Module | Port | Technology |
|--------|------|------------|
| analytics-dashboard | 3000 | React Router v7, Tailwind CSS v4, @ui-kit |
| auth-service | 3001 | Express 5, MongoDB, Redis, JWT ES256 |
| tracking-service | 3002 | Express 5, MongoDB, Kafka/Memory, SSE |
| ui-kit (Storybook) | 6006 | React 19, Tailwind v4, CVA, Nx |

---

## Running with Docker (full stack)

### Prerequisites

- Docker and Docker Compose v2+
- `.env` files configured for each service (copy from `.env.example`)

```bash
cp services/auth-service/.env.example services/auth-service/.env
cp services/tracking-service/.env.example services/tracking-service/.env
```

### Start everything

```bash
# Full stack (MongoDB Atlas + in-memory broker)
docker compose up --build

# With local MongoDB
docker compose --profile local-db up --build

# With Kafka (set BROKER_TYPE=kafka in services/tracking-service/.env)
docker compose --profile with-kafka up --build

# With local MongoDB + Kafka
docker compose --profile local-db --profile with-kafka up --build
```

Once running:

- Dashboard: http://localhost:3000
- Auth API: http://localhost:3001 (docs: http://localhost:3001/api/docs)
- Tracking API: http://localhost:3002 (docs: http://localhost:3002/api/docs)

### Stop everything

```bash
docker compose down

# Stop and remove volumes (Redis/Mongo/Kafka data)
docker compose down -v
```

---

## Modules

### analytics-dashboard

Web application for visualizing UI component usage metrics. Includes authentication, component showcase pages, and forms.

**Tech stack:** React Router v7 (SSR), React 19, Tailwind CSS v4, react-hook-form + zod, Vite 6.

**Main routes:**

- `/login`, `/register` - Authentication
- `/` - Dashboard
- `/components/*` - Component showcase (Button, Card, Input, Modal, etc.)

#### Standalone Docker

```bash
# From monorepo root (requires ui-kit to be built)
docker build -f analytics-dashboard/Dockerfile -t analytics-dashboard .
docker run -p 3000:3000 \
  -e AUTH_SERVICE_URL=http://host.docker.internal:3001 \
  -e TRACKING_SERVICE_URL=http://host.docker.internal:3002 \
  -e SESSION_SECRET=change-me-min-32-chars-secret-key \
  analytics-dashboard
```

#### Local development

```bash
cd analytics-dashboard
cp .env.example .env
npm install
npm run dev
```

#### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `AUTH_SERVICE_URL` | `http://localhost:3001` | Auth service URL |
| `TRACKING_SERVICE_URL` | `http://localhost:3002` | Tracking service URL |
| `SESSION_SECRET` | - | Session cookie secret (min 32 chars) |
| `NODE_ENV` | `development` | Runtime environment |

#### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run test` | Run tests with Jest |
| `npm run lint` | Linting |
| `npm run typecheck` | Type checking |

---

### auth-service

Authentication and authorization microservice. JWT ES256 with token rotation, refresh token theft detection, multi-device sessions, and hexagonal architecture.

**Tech stack:** Express 5, MongoDB (Mongoose 8), Redis (ioredis), JWT ES256 (jose), Zod, Pino.

**Main endpoints:**

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Token rotation |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/user/profile` | User profile (Bearer token) |
| GET | `/api/user/sessions` | Active sessions (Bearer token) |
| GET | `/.well-known/jwks.json` | JWKS public keys |
| GET | `/health` | Health check |
| GET | `/api/docs` | Swagger UI |

#### Standalone Docker

```bash
cd services/auth-service
cp .env.example .env    # Edit MongoDB and Redis connections

# Local Docker Compose (auth + Redis, optional MongoDB)
docker compose up --build

# With local MongoDB included
docker compose --profile local-db up --build
```

#### Local development

```bash
cd services/auth-service
cp .env.example .env
npm install
npm run start:dev       # http://localhost:3001
```

#### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment |
| `MONGODB_URI` | `mongodb://localhost:27017/auth_db` | MongoDB connection |
| `REDIS_URI` | `redis://localhost:6379` | Redis connection |
| `JWT_KID` | `2024-02-v1` | Active key pair ID |
| `KEY_ENCRYPTION_SECRET` | - | AES-256 secret for private key encryption |
| `ACCESS_TOKEN_TTL` | `900` | Access token TTL (seconds) |
| `REFRESH_TOKEN_TTL` | `604800` | Refresh token TTL (7 days) |
| `ISSUER_URL` | `https://auth.yourapp.com` | JWT `iss` claim |
| `AUDIENCE` | `yourapp-api` | JWT `aud` claim |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | CORS origins (comma-separated) |
| `LOG_LEVEL` | `info` | Log level (debug, info, warn, error) |

#### Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Development with hot reload (tsx watch) |
| `npm run build` | TypeScript build |
| `npm run start` | Run build |
| `npm run test` | Tests (102 tests) |
| `npm run lint` | Linting |

---

### tracking-service

Microservice for recording UI component interactions. Persists events to MongoDB, emits real-time statistics via SSE, and supports in-memory broker (development) or Kafka (production).

**Tech stack:** Express 5, MongoDB (Mongoose 8), KafkaJS / EventEmitter, JWT ES256 (jose), Zod, Pino, SSE.

**Main endpoints:**

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/components/track` | Record interaction (202 Accepted) |
| GET | `/api/components/stats` | Aggregated statistics (filters: from, to, component, page) |
| GET | `/api/components/stats/stream` | SSE real-time statistics |
| GET | `/api/components/export` | Export CSV/JSON (Bearer JWT) |
| GET | `/api/health` | Health check |
| GET | `/api/docs` | Swagger UI |

#### Standalone Docker

```bash
cd services/tracking-service
cp .env.example .env    # Edit BROKER_TYPE and MongoDB connection

# Local Docker Compose (tracking + Kafka, optional MongoDB)
docker compose up --build

# With local MongoDB included
docker compose --profile local-db up --build
```

#### Local development

```bash
cd services/tracking-service
cp .env.example .env    # BROKER_TYPE=memory for development without Kafka
npm install
npm run start:dev       # http://localhost:3002
```

#### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3002` | Server port |
| `NODE_ENV` | `development` | Environment |
| `MONGODB_URI` | - | MongoDB connection |
| `BROKER_TYPE` | `memory` | Broker type: `kafka` or `memory` |
| `KAFKA_BROKERS` | `localhost:9092` | Kafka address (only if `BROKER_TYPE=kafka`) |
| `KAFKA_TOPIC` | `component.tracking` | Kafka topic |
| `KAFKA_CLIENT_ID` | `tracking-service` | Kafka client ID |
| `KAFKA_GROUP_ID` | `tracking-consumer-group` | Kafka consumer group |
| `AUTH_SERVICE_URL` | `http://localhost:3001` | Auth service URL (JWKS verification) |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | CORS origins |
| `LOG_LEVEL` | `info` | Log level |

#### Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Development with hot reload (tsx watch) |
| `npm run build` | TypeScript build |
| `npm run start` | Run build |
| `npm run test` | Tests (89 tests) |
| `npm run lint` | Linting |

---

### ui-kit

React component library with design tokens, utilities, and Storybook documentation. Managed as an Nx monorepo.

**Tech stack:** React 19, Tailwind CSS v4, CVA (class-variance-authority), tailwind-merge, Vite 6, Storybook 8, Jest 30, Nx 22.

#### Sub-packages

| Package | Description |
|---------|-------------|
| `@ui-kit/react` | React components (Button, Input, Card, Modal, Select, DatePickerRange, etc.) |
| `@ui-kit/styles` | CSS design tokens (colors, typography, shadows, spacing) |
| `@ui-kit/utils` | `cx()` utility for Tailwind class merging |

#### Available components

| Component | Variants | Sizes | Features |
|-----------|----------|-------|----------|
| Button | primary, secondaryGray/Color, tertiaryGray/Color, linkGray/Color | sm - 2xl | destructive, loading, icons |
| Input | default, error, success | sm, md, lg | icon, tooltip, shortcut, helperText |
| Select | default, error, success | sm, md, lg | keyboard nav, typeahead, groups |
| Card | default, elevated, outline, ghost | default, sm | interactive, composable |
| Modal | - | sm, md, lg | overlay click, Escape, ModalIcon (5 colors) |
| DatePickerRange | - | - | 2 months, date inputs, Cancel/Apply, i18n |

#### Running

```bash
cd ui-kit
npm install
npm run build                              # Build all packages
npx nx run @ui-kit/react:storybook         # Storybook at http://localhost:6006
npm run test                               # All tests (235 tests)
npx nx test react --testPathPattern="Button"  # Single component tests
```

#### Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build all packages (Nx) |
| `npm run test` | Test all packages |
| `npm run lint` | Lint all packages |
| `npm run format` | Format with Prettier |

---

## Infrastructure

| Service | Image | Port | Purpose | Profile |
|---------|-------|------|---------|---------|
| Redis | `redis:7-alpine` | 6379 | Session and token cache (auth-service) | always active |
| MongoDB | `mongo:7-jammy` | 27017 | Local database | `local-db` |
| Kafka | `apache/kafka:3.9.0` | 9092 | Message broker for tracking | `with-kafka` |

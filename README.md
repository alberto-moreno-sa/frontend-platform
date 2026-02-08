# Frontend Platform

Monorepo containing the frontend, backend services, and shared component library.

## Structure

```
frontend-platform/
├── analytics-demo/          # React app
├── services/
│   ├── auth-service/        # Authentication (Express + MongoDB + Redis)
│   └── tracking-service/    # Component tracking (Express + MongoDB)
├── ui-kit/
│   └── packages/
│       ├── react/           # React components + Storybook
│       ├── styles/          # Design tokens + CSS
│       └── utils/           # Shared utilities
├── docker-compose.yml              # Full stack
├── docker-compose.frontend.yml     # Frontend only
└── docker-compose.backend.yml      # Backend only
```

## Ports

| Service          | Port  |
| ---------------- | ----- |
| analytics-demo   | 3000  |
| auth-service     | 3001  |
| tracking-service | 3002  |
| Storybook        | 6006  |
| Redis            | 6379  |
| MongoDB          | 27017 |

## Docker

```bash
# Full stack
docker compose up --build

# Frontend only
docker compose -f docker-compose.frontend.yml up --build

# Backend only
docker compose -f docker-compose.backend.yml up --build

# With local MongoDB (instead of Atlas)
docker compose --profile local-db up --build
```

## Local Development

```bash
# auth-service
cd services/auth-service
npm install
npm run start:dev

# tracking-service
cd services/tracking-service
npm install
npm run start:dev

# analytics-demo
cd analytics-demo
npm install
npm run dev

# Storybook
cd ui-kit/packages/react
npm install
npm run storybook
```

## Environment Variables

Each service has its own `.env.example`. Copy to `.env` before running:

```bash
cp services/auth-service/.env.example services/auth-service/.env
cp services/tracking-service/.env.example services/tracking-service/.env
```

The root `.env.example` contains optional variables to customize Docker host port mappings.

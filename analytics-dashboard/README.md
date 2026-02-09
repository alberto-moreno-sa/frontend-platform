# Analytics Dashboard

Enterprise analytics dashboard built with React Router v7 (Remix), Tailwind CSS v4, and the `@ui-kit` component library.

## Requirements

- **Node.js** >= 20
- **npm** >= 10
- **Docker** and **Docker Compose** (for backend services)
- **@ui-kit** built (`ui-kit/` must have `dist/` generated)

## Project structure

```
app/
  routes/           # React Router v7 file-based routing
  services/         # BFF layer (server-side only) — auth, session, API clients
  components/       # Custom components (app-specific)
  hooks/            # Custom React hooks
  stores/           # Zustand stores
  lib/              # Shared utilities (api-client, constants, validators, types)
  styles/           # Tailwind CSS entry point + @ui-kit tokens
```

## Getting started

### 1. Start backend services

The dashboard needs `auth-service` (port 3001), Redis, and MongoDB running. From the **monorepo root**:

```bash
# Start infrastructure + auth-service
cd /path/to/frontend-platform

# Copy auth-service env file
cp services/auth-service/.env.example services/auth-service/.env

# Start Redis, MongoDB, and auth-service
docker compose --profile local-db up -d redis mongo auth-service
```

Verify the auth-service is running:

```bash
curl http://localhost:3001/health
```

### 2. Build @ui-kit

The dashboard depends on `@ui-kit/react`, `@ui-kit/styles`, and `@ui-kit/utils` via `file:` references. The `react` and `utils` packages need their `dist/` folders:

```bash
cd ui-kit
npm install
npm run build
```

### 3. Install dashboard dependencies

```bash
cd analytics-dashboard
npm install
```

### 4. Configure environment

```bash
cp .env.example .env
```

| Variable | Default | Description |
| --- | --- | --- |
| `AUTH_SERVICE_URL` | `http://localhost:3001` | Auth service base URL |
| `SESSION_SECRET` | — | Secret for encrypting session cookies (min 32 chars) |
| `NODE_ENV` | `development` | Environment mode |

### 5. Run development server

```bash
npm run dev
```

Open <http://localhost:3000>. You will be redirected to `/login`.

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start development server with HMR (port 3000) |
| `npm run build` | Production build (client + SSR server) |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting without modifying files |
| `npm run test` | Run unit tests with Jest |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run typecheck` | Run TypeScript type checking |

## Docker

### Standalone (from monorepo root)

The `docker-compose.yml` at the monorepo root includes the `analytics-demo` service:

```bash
cd /path/to/frontend-platform
docker compose up -d
```

This starts all services: analytics-dashboard (3000), auth-service (3001), tracking-service (3002), Redis (6379), and MongoDB (27017 with `local-db` profile).

### Build image only

```bash
# From monorepo root (build context needs access to ui-kit/)
docker build -f analytics-dashboard/Dockerfile -t analytics-dashboard .
```

## Auth flow

The dashboard uses a **BFF (Backend for Frontend)** pattern:

1. User submits login/register form
2. React Router `action` sends credentials to `auth-service` **server-side**
3. JWT tokens are stored in an **httpOnly encrypted cookie** (never exposed to the browser)
4. Protected routes check the session via `requireAuth()` in their `loader`
5. Access tokens are auto-refreshed when they expire (60s buffer)
6. Logout destroys the session cookie and revokes the token on the auth-service

## Tech stack

- **React Router v7** (framework mode, SSR)
- **React 19**
- **Tailwind CSS v4** with `@ui-kit/styles` design tokens
- **@ui-kit/react** component library (Button, Input, Card, Modal, etc.)
- **react-hook-form** + **zod** for form validation
- **Vite 6** as bundler
- **ESLint 9** + **Prettier**
- **Jest 30** for testing
- **Docker** multi-stage build

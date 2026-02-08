# Auth Service

Authentication and authorization service with JWT ES256, hexagonal architecture, and functional programming.

**Stack:** Express 5, TypeScript, MongoDB (Mongoose), Redis, jose (JWT ES256), Zod

## Prerequisites

- Node.js >= 20
- MongoDB >= 6.0
- Redis >= 7.0

## Setup

```bash
npm install
cp .env.example .env
```

## Development

```bash
npm run start:dev
```

Starts the server at `http://localhost:3001` with hot reload (tsx watch).

## Production

```bash
npm run build
npm run start:prod
```

## Docker

```bash
# With local MongoDB
docker compose --profile local-db up -d

# With MongoDB Atlas (set MONGODB_URI in .env)
docker compose up -d

# Manual build
docker build -t auth-service .
docker run -p 3001:3001 --env-file .env auth-service
```

## Tests

```bash
npm test
npm run test:coverage
```

## Environment Variables

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment |
| `MONGODB_URI` | `mongodb://localhost:27017/auth_db` | MongoDB connection |
| `REDIS_URI` | `redis://localhost:6379` | Redis connection |
| `JWT_KID` | `2024-02-v1` | Active key pair ID |
| `KEY_ENCRYPTION_SECRET` | - | AES-256 secret for private key encryption |
| `ACCESS_TOKEN_TTL` | `900` | Access token lifetime in seconds |
| `REFRESH_TOKEN_TTL` | `604800` | Refresh token lifetime in seconds |
| `ISSUER_URL` | `https://auth.yourapp.com` | JWT `iss` claim |
| `AUDIENCE` | `yourapp-api` | JWT `aud` claim |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | CORS allowed origins (comma-separated) |

## Endpoints

### Authentication (`/api/auth`)

| Method | Route | Auth | Description |
| ------ | ----- | ---- | ----------- |
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Log in |
| POST | `/api/auth/refresh` | No | Rotate tokens |
| POST | `/api/auth/logout` | Bearer | Log out session |
| POST | `/api/auth/verify-token` | Header | Verify token |

### User (`/api/user`)

| Method | Route | Auth | Description |
| ------ | ----- | ---- | ----------- |
| GET | `/api/user/profile` | Bearer | Get profile |
| PUT | `/api/user/profile` | Bearer | Update name |
| DELETE | `/api/user/account` | Bearer | Delete account |
| GET | `/api/user/sessions` | Bearer | List sessions |

### Other

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | `/.well-known/jwks.json` | JWKS public keys |
| GET | `/health` | Health check |
| GET | `/api/docs` | Swagger UI |

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

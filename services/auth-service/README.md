# Auth Service

Enterprise-grade authentication and authorization service built with Node.js, Express 5, Mongoose, and functional programming following hexagonal architecture.

## Tech Stack

| Technology | Version | Purpose                                        |
| ---------- | ------- | ---------------------------------------------- |
| Express    | 5.x     | HTTP framework                                 |
| TypeScript | 5.7     | Language                                       |
| MongoDB    | 6.0+    | Database (Mongoose 8.x ODM)                   |
| Redis      | 7.0+    | Sessions, blacklist, rate limiting, JWKS cache |
| jose       | 5.x     | JWT ES256 (ECDSA P-256)                        |
| Zod        | 3.x     | Request validation                             |
| Docker     | -       | Containerization                               |
| Swagger UI | 5.x     | Interactive API documentation                  |

## Architecture

The service follows **hexagonal architecture** (ports & adapters) with **functional programming**. All layers use factory functions instead of classes — no decorators, no DI framework.

```
src/
├── auth/
│   ├── domain/                    # Domain layer (no external dependencies)
│   │   ├── entities/              # Entities with pure functions
│   │   │   ├── user.entity.ts
│   │   │   ├── refresh-token.entity.ts
│   │   │   └── key-pair.entity.ts
│   │   ├── value-objects/         # Immutable value objects
│   │   │   ├── email.vo.ts
│   │   │   └── device-info.vo.ts
│   │   └── functions/             # Pure domain functions
│   │       ├── hash-password.fn.ts
│   │       ├── verify-password.fn.ts
│   │       ├── validate-password.fn.ts
│   │       ├── create-token.fn.ts
│   │       ├── crypto-keys.fn.ts      # ES256 key generation, encrypt/decrypt, sign/verify
│   │       └── detect-token-reuse.fn.ts
│   │
│   ├── application/               # Application layer (orchestration)
│   │   ├── ports/                 # Interfaces (contracts)
│   │   │   ├── user-repository.port.ts
│   │   │   ├── token-service.port.ts
│   │   │   ├── refresh-token-repository.port.ts
│   │   │   ├── key-pair-repository.port.ts
│   │   │   ├── session.port.ts
│   │   │   ├── blacklist.port.ts
│   │   │   ├── rate-limiter.port.ts
│   │   │   └── jwks-cache.port.ts
│   │   ├── use-cases/             # Use cases (12 factory functions)
│   │   │   ├── register-user.use-case.ts
│   │   │   ├── login-user.use-case.ts
│   │   │   ├── refresh-token.use-case.ts
│   │   │   ├── logout.use-case.ts
│   │   │   ├── logout-all.use-case.ts
│   │   │   ├── verify-token.use-case.ts
│   │   │   ├── get-jwks.use-case.ts
│   │   │   ├── get-profile.use-case.ts
│   │   │   ├── update-profile.use-case.ts
│   │   │   ├── change-password.use-case.ts
│   │   │   ├── delete-account.use-case.ts
│   │   │   └── get-sessions.use-case.ts
│   │   └── pipes/
│   │       └── compose.ts         # pipe/pipeAsync utilities
│   │
│   └── infrastructure/            # Infrastructure layer (implementations)
│       ├── adapters/              # Port implementations (factory functions)
│       │   ├── mongo-user.repository.ts
│       │   ├── mongo-refresh-token.repository.ts
│       │   ├── mongo-key-pair.repository.ts
│       │   ├── jwt-token.service.ts       # ES256 signing via jose
│       │   ├── redis-session.adapter.ts
│       │   ├── redis-blacklist.adapter.ts
│       │   ├── redis-rate-limiter.adapter.ts
│       │   └── redis-jwks-cache.adapter.ts
│       ├── routes/                # Express routers (factory functions)
│       │   ├── auth.routes.ts             # 6 endpoints
│       │   ├── user.routes.ts             # 5 endpoints
│       │   ├── jwks.routes.ts             # JWKS endpoint
│       │   └── health.routes.ts           # Health check
│       ├── validation/            # Zod schemas (request validation)
│       │   ├── register.schema.ts
│       │   ├── login.schema.ts
│       │   ├── refresh-token.schema.ts
│       │   ├── logout.schema.ts
│       │   ├── logout-all.schema.ts
│       │   ├── update-profile.schema.ts
│       │   ├── change-password.schema.ts
│       │   └── delete-account.schema.ts
│       └── schemas/               # Mongoose schemas
│           ├── user.schema.ts
│           ├── refresh-token.schema.ts
│           └── key-pair.schema.ts
│
├── common/                        # Shared utilities
│   ├── constants/error-codes.ts
│   ├── errors/app-error.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts             # JWT verification
│   │   ├── error-handler.middleware.ts    # Centralized error handler
│   │   ├── security-headers.middleware.ts # Security headers
│   │   └── validate.middleware.ts         # Zod validation
│   └── types/index.ts                     # AuthenticatedUser, Express augmentation
│
├── config/index.ts                # Typed config from env (dotenv)
├── container.ts                   # Manual DI composition (factory wiring)
├── swagger.ts                     # OpenAPI spec as plain TypeScript object
├── app.ts                         # Express app factory
└── main.ts                        # Bootstrap + graceful shutdown
```

## Prerequisites

- **Node.js** >= 20.x
- **MongoDB** >= 6.0 (local or remote)
- **Redis** >= 7.0 (local or remote)
- **Docker** and **Docker Compose** (optional, to run everything with a single command)

## Installation

```bash
# From the monorepo root
cd services/auth-service

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

## Environment Variables

| Variable                | Required | Description                                  | Default                             |
| ----------------------- | -------- | -------------------------------------------- | ----------------------------------- |
| `MONGODB_URI`           | Yes      | MongoDB connection string                    | `mongodb://localhost:27017/auth_db` |
| `REDIS_URI`             | Yes      | Redis connection string                      | `redis://localhost:6379`            |
| `PORT`                  | No       | Server port                                  | `3001`                              |
| `NODE_ENV`              | No       | Runtime environment                          | `development`                       |
| `JWT_KID`               | Yes      | Key ID for the active key pair               | `2024-02-v1`                        |
| `KEY_ENCRYPTION_SECRET` | Yes      | AES-256 secret for encrypting private keys   | -                                   |
| `ACCESS_TOKEN_TTL`      | No       | Access token lifetime in seconds             | `900` (15 min)                      |
| `REFRESH_TOKEN_TTL`     | No       | Refresh token lifetime in seconds            | `604800` (7 days)                   |
| `ISSUER_URL`            | Yes      | JWT `iss` claim value                        | `https://auth.yourapp.com`          |
| `AUDIENCE`              | Yes      | JWT `aud` claim value                        | `yourapp-api`                       |
| `ALLOWED_ORIGINS`       | Yes      | CORS allowed origins (comma-separated)       | `http://localhost:3000`             |
| `LOG_LEVEL`             | No       | Logging level                                | `info`                              |

> **Important:** In production, use a strong secret for `KEY_ENCRYPTION_SECRET` and store it in a secrets manager (AWS Secrets Manager, HashiCorp Vault).

## Running the Service

### Local Development (requires MongoDB and Redis running)

```bash
# Development mode with hot reload (tsx)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### MongoDB Setup

The service requires a MongoDB database. Choose one of the following options:

#### Option A: Local MongoDB

Runs a MongoDB instance locally via Docker Compose alongside the auth-service and Redis:

```bash
cd services/auth-service

# Start everything (auth-service + MongoDB + Redis)
docker compose --profile local-db up -d

# View logs
docker compose logs -f auth-service

# Stop
docker compose down

# Stop and remove volumes
docker compose down -v
```

This starts:
- **auth-service** at `http://localhost:3001`
- **MongoDB** at `localhost:27017`
- **Redis** at `localhost:6379`

MongoDB and Redis data persists in Docker volumes (`mongo-data`, `redis-data`).

#### Option B: MongoDB Atlas

Use a cloud-hosted MongoDB Atlas cluster. The auth-service and Redis still run via Docker Compose, but MongoDB is hosted remotely.

##### Step 1 — Create an Atlas Account and Deploy a Free Cluster

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up using your **Google account**, **GitHub account**, or an **email address**
3. Verify your email if you registered with email
4. Atlas will prompt you to deploy your first cluster. Select the **M0 Free** tier
5. Choose a cloud provider (**AWS**, **Google Cloud**, or **Azure**) and the region closest to you
6. Click **"Create Deployment"** — provisioning takes about 1-3 minutes

> If you already have an account, go to your project dashboard and click **"Create"** to deploy a new cluster.

##### Step 2 — Create a Database User

During cluster creation, Atlas prompts you to set up security. If you skipped it:

1. In the left sidebar, go to **Security > Database Access**
2. Click **"Add New Database User"**
3. Select **Password** as the authentication method
4. Enter a **username** (e.g., `auth_service_user`) and a **password** (or use the auto-generated one)
5. Under **Built-in Role**, select **"Read and write to any database"**
6. Click **"Add User"**

##### Step 3 — Add Your IP to the Access List

1. In the left sidebar, go to **Security > Network Access**
2. Click **"Add IP Address"**
3. For development: click **"Allow Access from Anywhere"** (`0.0.0.0/0`)
4. For production: click **"Add Current IP Address"** or enter your server's IP
5. Click **"Confirm"**

##### Step 4 — Get the Connection String

1. In the left sidebar, go to **Database** (under Deployment)
2. Click **"Connect"** on your cluster
3. Select **"Drivers"**
4. Choose **Driver: Node.js** and **Version: 5.5 or later**
5. Copy the connection string, which looks like:

   ```text
   mongodb+srv://auth_service_user:<db_password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

6. Replace `<db_password>` with the password you created in Step 2
7. Add the database name `auth_db` before the `?` in the URI:

   ```text
   mongodb+srv://auth_service_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/auth_db?retryWrites=true&w=majority&appName=Cluster0
   ```

##### Step 5 — Configure and Run

1. Create a `.env` file (or edit the existing one):

   ```bash
   cp .env.example .env
   ```

2. Set the `MONGODB_URI` variable in `.env`:

   ```env
   MONGODB_URI=mongodb+srv://auth_service_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/auth_db?retryWrites=true&w=majority&appName=Cluster0
   ```

3. Start the service **without** the `local-db` profile (MongoDB will not be started in Docker):

   ```bash
   docker compose up -d
   ```

   This starts only:
   - **auth-service** at `http://localhost:3001` (connecting to Atlas)
   - **Redis** at `localhost:6379`

> **Tip:** You can also pass the URI inline without a `.env` file:
>
> ```bash
> MONGODB_URI="mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/auth_db?retryWrites=true&w=majority&appName=Cluster0" docker compose up -d
> ```

For more details, see the [official MongoDB Atlas documentation](https://www.mongodb.com/docs/atlas/getting-started/).

### Verify the Service is Running

```bash
# Health check
curl http://localhost:3001/health

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2026-02-08T06:00:00Z",
#   "version": "1.0.0",
#   "checks": {
#     "mongodb": { "status": "healthy", "latency_ms": 12, "connected": true },
#     "redis": { "status": "healthy", "latency_ms": 2, "connected": true }
#   }
# }
```

## Swagger (API Documentation)

Once the service is running, navigate to:

```
http://localhost:3001/api/docs
```

Swagger UI allows you to:
- Browse all documented endpoints with request/response examples
- Test each endpoint directly from the browser
- Authenticate with a Bearer token ("Authorize" button in the top-right corner)

### Recommended Testing Flow in Swagger

1. **POST /api/auth/register** - Create a new user
2. Copy the `access_token` from the response
3. Click **Authorize** (lock icon) and paste: `{access_token}`
4. **GET /api/user/profile** - View your profile (authenticated)
5. **POST /api/auth/refresh** - Use the `refresh_token` to get new tokens
6. **GET /api/user/sessions** - View active sessions
7. **POST /api/auth/logout** - Log out current session

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint                 | Auth   | Description                            |
| ------ | ------------------------ | ------ | -------------------------------------- |
| POST   | `/api/auth/register`     | No     | Register a new user                    |
| POST   | `/api/auth/login`        | No     | Log in                                 |
| POST   | `/api/auth/refresh`      | No     | Refresh tokens (with rotation)         |
| POST   | `/api/auth/logout`       | Bearer | Log out current session                |
| POST   | `/api/auth/logout-all`   | Bearer | Log out all sessions                   |
| POST   | `/api/auth/verify-token` | Header | Validate access token (internal use)   |

### User (`/api/user`)

| Method | Endpoint             | Auth   | Description                    |
| ------ | -------------------- | ------ | ------------------------------ |
| GET    | `/api/user/profile`  | Bearer | Get profile                    |
| PUT    | `/api/user/profile`  | Bearer | Update name                    |
| PATCH  | `/api/user/password` | Bearer | Change password                |
| DELETE | `/api/user/account`  | Bearer | Delete account (soft delete)   |
| GET    | `/api/user/sessions` | Bearer | List active sessions           |

### Other

| Method | Endpoint                 | Description                                  |
| ------ | ------------------------ | -------------------------------------------- |
| GET    | `/.well-known/jwks.json` | JWKS public keys (for microservices)         |
| GET    | `/health`                | Health check (MongoDB + Redis)               |

## Security

### JWT ES256 (Asymmetric)

- Algorithm: **ECDSA with P-256 curve and SHA-256**
- Private keys encrypted at rest with **AES-256-GCM**
- Auto-generates ES256 key pair on first boot
- Key rotation support (JWKS endpoint serves all active + rotated keys)
- Access token: 15 minutes | Refresh token: 7 days

### Token Rotation with Family Detection

- Each refresh generates a new token pair and revokes the previous one
- If reuse of an already-rotated refresh token is detected, **all** tokens in the family are revoked (possible theft)
- Tracked via `parentJti` and `rotationCount`

### Storage

- **MongoDB:** users, refresh tokens (with TTL index), key pairs
- **Redis:** sessions (TTL 7d), access token blacklist (dynamic TTL), rate limiting, JWKS cache (24h)

### Rate Limiting

| Endpoint                | Limit              | Window     |
| ----------------------- | ------------------ | ---------- |
| POST /api/auth/login    | 5 attempts per IP  | 15 minutes |
| POST /api/auth/register | 3 attempts per IP  | 1 hour     |
| POST /api/auth/refresh  | 10 per user        | 1 hour     |

### Security Headers

All responses include: `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Content-Security-Policy`, `Referrer-Policy`, `Permissions-Policy`.

## Response Format

### Success

```json
{
  "success": true,
  "data": { ... }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "details": {}
  }
}
```

### Error Codes

| Code                   | HTTP | Description                                         |
| ---------------------- | ---- | --------------------------------------------------- |
| `INVALID_CREDENTIALS`  | 401  | Wrong email or password                             |
| `TOKEN_EXPIRED`        | 401  | Token has expired                                   |
| `TOKEN_INVALID`        | 401  | Token is invalid or malformed                       |
| `TOKEN_REVOKED`        | 401  | Token has been revoked                              |
| `TOKEN_BLACKLISTED`    | 401  | Token is blacklisted                                |
| `TOKEN_REUSE_DETECTED` | 401  | Reuse detected, all sessions revoked                |
| `ACCOUNT_INACTIVE`     | 403  | Account is inactive                                 |
| `EMAIL_ALREADY_EXISTS` | 409  | Email already registered                            |
| `WEAK_PASSWORD`        | 400  | Password does not meet requirements                 |
| `PASSWORD_REUSE`       | 400  | Cannot reuse current password                       |
| `RATE_LIMIT_EXCEEDED`  | 429  | Too many attempts                                   |
| `USER_NOT_FOUND`       | 404  | User not found                                      |

## MongoDB Collections

| Collection       | Description                                                                       |
| ---------------- | --------------------------------------------------------------------------------- |
| `users`          | User accounts (unique email, bcrypt passwordHash with cost factor 12)             |
| `refresh_tokens` | Refresh tokens with device metadata and rotation tracking (TTL index on `expiresAt`) |
| `key_pairs`      | ES256 key pairs (JWK public key + AES-256-GCM encrypted private key)              |

## Available Scripts

```bash
npm run build          # Compile TypeScript (tsc)
npm run start          # Start production server (node dist/main.js)
npm run start:dev      # Development with hot reload (tsx watch)
npm run start:prod     # Production (node dist/main.js)
npm run test           # Run tests
npm run test:coverage  # Tests with coverage
```

## Docker

### Docker Compose

```bash
cd services/auth-service

# With local MongoDB (Docker)
docker compose --profile local-db up -d

# With MongoDB Atlas (or external MongoDB)
MONGODB_URI="your-atlas-uri" docker compose up -d
```

### Manual Build

```bash
cd services/auth-service
docker build -t auth-service .
docker run -p 3001:3001 --env-file .env auth-service
```

## Design Principles

- **Hexagonal Architecture:** The domain has no framework dependencies. Ports (interfaces) define contracts, adapters implement them.
- **Functional Programming:** Entities as immutable types with pure functions (`createUser()`, `isActiveUser()`, `wasRotated()`). No classes in the domain layer.
- **Factory Functions:** All adapters, use cases, routes, and middleware are factory functions — no classes, no decorators. Dependencies are passed as parameters.
- **Manual DI Composition:** `container.ts` wires all factories together. No DI framework or reflection needed.
- **Zod Validation:** Request validation via Zod schemas — composable, type-safe, and framework-agnostic.
- **Single Responsibility:** Each use case has a single responsibility. Routes only orchestrate request -> use case -> response.

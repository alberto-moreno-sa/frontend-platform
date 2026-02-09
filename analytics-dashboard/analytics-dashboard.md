Vamos acrear un proyecto que sera en donde el objetivo es:

Sistema de tracking automático integrado en componentes que registre interacciones relevantes y las envíe al backend de forma transparente para el desarrollador final.

primero vamos a contruir la base y cuando te diga lo del objetivo

Tecnologias:

- Remix uultimaversion
- tailwind css ultima verison
- react (ultima verion)
- tanstack (https://tanstack.com/, table)
- Zustand (si la necesitamos)
- eslint
- prettier
- docker
- docer compose
- jest
- @ui-kit
- zod
- react-hook-form para formularios y zod para las validaciones


Specs

- Este debe tener una pagina de login y regustro (en las imgen sign in-loging)
- Este debe usar los componentes y tokens de @ui-kit
- Para el loging debe usarse los enpoint de auth-service
- Debe implementar todo el manejo de servicios


# Proyecto X — Enterprise Analytics Dashboard

## Technical Specification Document

**Version:** 1.0.0
**Date:** February 2026
**Status:** Draft

---

## 1. Overview

### 1.1 Purpose

Proyecto X es un dashboard analítico enterprise construido con **Remix + React**. El proyecto es 100% frontend, actuando como **BFF (Backend for Frontend)** que consume dos microservicios externos para la obtención de datos.

### 1.2 Goals

- Proveer una interfaz analítica de alto rendimiento para usuarios enterprise.
- Centralizar el consumo de múltiples fuentes de datos en una capa BFF unificada.
- Garantizar escalabilidad, performance y mantenibilidad a largo plazo.

### 1.3 Non-Goals

- Este proyecto **no** incluye desarrollo de backend/microservicios.
- No se implementa base de datos propia.
- No se desarrollan pipelines de datos ni ETL.

---

## 2. Architecture

### 2.1 High-Level Architecture

```
┌──────────────────┐     ┌───────────────────────────┐     ┌─────────────────────┐
│     Browser      │────▶│     Remix App (BFF)       │────▶│  Microservice A     │
│     (React)      │◀────│                           │◀────│  (External API)     │
│                  │     │  - SSR + Loaders/Actions   │     └─────────────────────┘
│  - Charts        │     │  - Auth / Session / RBAC   │
│  - Tables        │     │  - Cache (Redis)           │     ┌─────────────────────┐
│  - Widgets       │     │  - Data Aggregation        │────▶│  Microservice B     │
│  - UI State      │     │  - Error Boundaries        │◀────│  (External API)     │
└──────────────────┘     └───────────────────────────┘     └─────────────────────┘
      CLIENT                   REMIX SERVER                   EXTERNAL SERVICES
```

### 2.2 Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Rendering strategy | SSR via Remix loaders | Faster initial load, SEO-ready, data fetching paralelo por ruta |
| Data fetching | Server-side only (loaders) | Datos procesados antes de llegar al cliente, reduce bundle size |
| State management | Zustand (client UI only) | Ligero, solo para estado de UI compartido (filtros, sidebar, theme) |
| Caching | Redis server-side | TTL granular por tipo de dato, reduce carga a microservicios |
| Styling | Tailwind CSS | Design system consistente, utility-first, tree-shakeable |
| BFF Pattern | Remix como BFF | Unifica consumo de 2 microservicios, maneja auth, formatea datos |

### 2.3 Data Flow

```
User Request
    │
    ▼
Remix Route (loader)
    │
    ├── requireAuth(request)          → Valida sesión + RBAC
    │
    ├── checkCache(cacheKey)          → Redis lookup
    │   ├── HIT  → return cached data
    │   └── MISS ↓
    │
    ├── fetchServiceA(params)         → Microservice A (parallel)
    ├── fetchServiceB(params)         → Microservice B (parallel)
    │
    ├── aggregateData(responseA, B)   → Merge + transform
    │
    ├── setCache(cacheKey, data, ttl) → Store in Redis
    │
    └── return json(data)             → Serialized to client
         │
         ▼
    React Component (useLoaderData)
         │
         ▼
    Render Charts / Tables / Widgets
```

---

## 3. Tech Stack

### 3.1 Core

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Remix | ^2.x | SSR, routing, loaders, BFF |
| UI Library | React | ^18.x | Component rendering |
| Language | TypeScript | ^5.x | Type safety |
| Styling | Tailwind CSS | ^3.x | Utility-first CSS |
| Build Tool | Vite | ^5.x | Dev server + bundling |

### 3.2 Data Visualization

| Library | Purpose | Why |
|---------|---------|-----|
| Recharts | Charts (line, bar, area, pie) | Declarativo, buen performance con datasets medianos |
| Visx (optional) | Charts complejos / custom | D3 wrapper para React, máximo control |
| TanStack Table | Tablas con sorting, filtering, paginación | Virtualización para datasets grandes |

### 3.3 State & Data

| Library | Purpose | Scope |
|---------|---------|-------|
| Zustand | UI state compartido | Client-side only (filtros, theme, sidebar) |
| Remix loaders | Data fetching principal | Server-side |
| Redis | Cache layer | Server-side (BFF) |

### 3.4 Auth & Security

| Concern | Approach |
|---------|----------|
| Session management | Remix cookie sessions (encrypted) |
| Authentication | JWT validation from external auth provider |
| Authorization (RBAC) | Server-side role check in every loader |
| CSRF | Remix built-in CSRF protection |

### 3.5 Testing

| Type | Tool | Target |
|------|------|--------|
| Unit | Vitest | Utils, services, hooks |
| Component | Testing Library | React components |
| Integration | Vitest + MSW | Loaders with mocked APIs |
| E2E | Playwright | Critical user flows |

### 3.6 Dev Tools

| Tool | Purpose |
|------|---------|
| ESLint | Linting (strict config) |
| Prettier | Code formatting |
| Husky + lint-staged | Pre-commit hooks |
| GitHub Actions | CI/CD pipeline |

---

## 4. Project Structure

```
proyecto-x/
├── app/
│   ├── entry.client.tsx               # Client entry point
│   ├── entry.server.tsx               # Server entry point
│   ├── root.tsx                       # Root layout
│   │
│   ├── routes/                        # Remix file-based routing
│   │   ├── _index.tsx                 # Redirect to dashboard
│   │   ├── login.tsx                  # Auth page
│   │   ├── dashboard.tsx              # Dashboard layout — see Dashboard Spec (separate doc)
│   │   └── ...                        # Rutas nested definidas en Dashboard Spec
│   │
│   ├── services/                      # BFF layer (server-side only)
│   │   └── ...                        # API clients, cache, auth — cada servicio en su .server.ts
│   │
│   ├── components/                    # Custom components (app-specific)
│   │   └── ...                        # Componentes propios del dashboard
│   │                                  # UI primitives vienen de @ui-kit (paquete interno)
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── useFilters.ts
│   │   ├── usePolling.ts
│   │   └── usePermissions.ts
│   │
│   ├── stores/                        # Zustand stores
│   │   ├── filterStore.ts             # Global filter state
│   │   ├── uiStore.ts                 # Sidebar, theme, layout
│   │   └── index.ts
│   │
│   ├── lib/                           # Shared utilities
│   │   ├── api-client.server.ts       # HTTP client for microservices
│   │   ├── constants.ts               # App-wide constants
│   │   ├── formatters.ts              # Number, date, currency formatters
│   │   ├── validators.ts              # Zod schemas for API responses
│   │   └── types.ts                   # Shared TypeScript types
│   │
│   └── styles/
│       └── tailwind.css               # Tailwind entry point
│
├── public/
│   ├── favicon.ico
│   └── assets/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example                       # Environment variables template
├── .eslintrc.cjs
├── .prettierrc
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── remix.config.js
├── package.json
└── README.md
```

---

## 5. Routing Architecture

### 5.1 Route Map

```
/                          → Redirect to /dashboard
/login                     → Authentication page
/dashboard                 → Layout shell (sidebar + topbar)
  /dashboard               → Overview (KPIs, summary widgets)
  /dashboard/analytics     → Detailed analytics (charts, trends)
  /dashboard/reports       → Reports list
  /dashboard/reports/:id   → Individual report detail
```

### 5.2 Nested Route Data Loading

Cada ruta nested tiene su propio `loader` que corre en paralelo. El layout padre (`dashboard.tsx`) carga datos compartidos (user, permissions, navigation), mientras las rutas hijas cargan datos específicos de su sección.

```typescript
// dashboard.tsx (parent layout)
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireAuth(request);
  const navigation = await getNavigation(user.role);
  return json({ user, navigation });
}

// dashboard.analytics.tsx (child)
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireAuth(request);
  const [metricsA, metricsB] = await Promise.all([
    fetchServiceA("analytics", { orgId: user.orgId }),
    fetchServiceB("trends", { orgId: user.orgId }),
  ]);
  return json(aggregateAnalytics(metricsA, metricsB));
}
```

---

## 6. BFF Layer (Services)

### 6.1 API Client

```typescript
// lib/api-client.server.ts
interface APIClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

// Centralized HTTP client with:
// - Automatic retry with exponential backoff
// - Request/response logging
// - Timeout handling
// - Circuit breaker pattern (optional)
// - Response validation with Zod
```

### 6.2 Microservice Clients

| Client | Source | Responsibility |
|--------|--------|----------------|
| `service-a.server.ts` | Microservice A | Primary analytics data |
| `service-b.server.ts` | Microservice B | Secondary/supplementary data |
| `aggregator.server.ts` | Both | Cross-service data merging and transformation |

### 6.3 Cache Strategy

| Data Type | TTL | Invalidation |
|-----------|-----|-------------|
| Real-time metrics | 30 seconds | Time-based |
| Daily reports | 5 minutes | Time-based |
| Historical data | 1 hour | Time-based |
| User preferences | 10 minutes | On user action |
| Static config | 24 hours | On deploy |

```typescript
// services/cache.server.ts
interface CacheOptions {
  ttl: number;       // seconds
  prefix: string;    // namespace
  staleWhileRevalidate?: boolean;
}
```

---

## 7. Component Architecture

### 7.1 Component Hierarchy

```
DashboardShell
├── TopBar
│   ├── GlobalFilters (date range, org selector)
│   ├── SearchBar
│   └── UserMenu
├── Sidebar
│   └── Navigation (RBAC-filtered)
└── Content (Outlet)
    ├── KPICard[]
    ├── ChartWidget[]
    │   ├── LineChart
    │   ├── BarChart
    │   └── AreaChart
    ├── DataTable[]
    └── MetricSummary[]
```

### 7.2 Widget Pattern

Cada widget sigue un patrón consistente:

```typescript
interface WidgetProps<T> {
  data: T;                    // Pre-processed from loader
  title: string;
  loading?: boolean;          // Skeleton state
  error?: string;             // Error boundary fallback
  className?: string;
}
```

### 7.3 Loading States

Todas las rutas implementan:

- **Skeleton UI** mientras el loader resuelve (via `useNavigation`)
- **Error Boundary** por ruta — un widget con error no rompe el dashboard completo
- **Streaming** (opcional) con `defer()` para datos no críticos

---

## 8. State Management

### 8.1 State Distribution

| State Type | Location | Tool |
|-----------|----------|------|
| Server data | Remix loaders | `useLoaderData()` |
| URL state (filtros, paginación) | URL search params | `useSearchParams()` |
| UI state (sidebar, theme) | Zustand store | `useUIStore()` |
| Form state | Remix actions | `useFetcher()` |
| Ephemeral (hover, focus) | Local component | `useState()` |

### 8.2 Rule: No Client-Side Data Fetching

Todo data fetching se hace via loaders de Remix. El cliente **nunca** hace fetch directo a los microservicios. Para actualizaciones dinámicas (filtros), se usan `useFetcher` o navegación con search params que re-ejecutan el loader.

Excepción: Resource Routes (`api.widgets.$type.ts`) para polling de widgets que necesitan actualización periódica sin navegación.

---

## 9. Auth & RBAC

### 9.1 Authentication Flow

```
1. User hits /dashboard
2. Remix loader calls requireAuth(request)
3. requireAuth reads session cookie
4. If no session → redirect to /login
5. If session exists → validate JWT with auth provider
6. If valid → return user object with roles
7. If invalid → destroy session, redirect to /login
```

### 9.2 Authorization Model

```typescript
enum Role {
  VIEWER = "viewer",       // Read-only access
  ANALYST = "analyst",     // Read + export
  MANAGER = "manager",     // Read + export + team data
  ADMIN = "admin",         // Full access + settings
}

// Server-side (loaders)
const user = await requireRole(request, [Role.ANALYST, Role.ADMIN]);

// Client-side (UI only, not security)
const { hasPermission } = usePermissions();
{hasPermission("export") && <ExportButton />}
```

---

## 10. Performance Strategy

### 10.1 Server-Side

| Technique | Implementation |
|-----------|---------------|
| Parallel data fetching | `Promise.all()` in loaders |
| Redis caching | TTL-based per data type |
| Response compression | gzip/brotli at server level |
| Stale-while-revalidate | Serve cached, refresh in background |

### 10.2 Client-Side

| Technique | Implementation |
|-----------|---------------|
| Code splitting | Remix route-based automatic splitting |
| Lazy loading | `React.lazy()` for heavy chart libraries |
| Virtualization | TanStack Table virtual rows for large datasets |
| Skeleton UI | Instant visual feedback during navigation |
| Prefetching | `<Link prefetch="intent">` on dashboard nav |
| Image optimization | Lazy loading + responsive images |

### 10.3 Performance Budgets

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TTI (Time to Interactive) | < 3.5s |
| Bundle size (initial JS) | < 200KB gzipped |

---

## 11. Error Handling

### 11.1 Error Boundary Strategy

```
Root Error Boundary         → Full page error (500, network)
  Dashboard Error Boundary  → Dashboard layout error
    Route Error Boundary    → Section-level error
      Widget Error Boundary → Individual widget error
```

Cada nivel de error boundary permite que el resto de la aplicación siga funcionando. Un chart que falla no tumba la tabla de al lado.

### 11.2 API Error Handling

```typescript
// services/service-a.server.ts
try {
  const response = await apiClient.get("/analytics");
  return ServiceASchema.parse(response); // Zod validation
} catch (error) {
  if (error instanceof ZodError) {
    logger.warn("Schema mismatch from Service A", error);
    return fallbackData; // Graceful degradation
  }
  if (error instanceof TimeoutError) {
    return getCachedOrThrow(cacheKey); // Serve stale cache
  }
  throw error; // Bubble to error boundary
}
```

---

## 12. Environment Configuration

### 12.1 Environment Variables

```bash
# .env.example

# App
NODE_ENV=development
PORT=3000
SESSION_SECRET=your-session-secret

# Microservices
SERVICE_A_BASE_URL=https://api-a.internal.company.com
SERVICE_A_API_KEY=your-api-key-a
SERVICE_A_TIMEOUT=5000

SERVICE_B_BASE_URL=https://api-b.internal.company.com
SERVICE_B_API_KEY=your-api-key-b
SERVICE_B_TIMEOUT=5000

# Cache
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Auth
AUTH_PROVIDER_URL=https://auth.company.com
JWT_PUBLIC_KEY=

# Observability
LOG_LEVEL=info
SENTRY_DSN=
```

---

## 13. CI/CD Pipeline

```
Push to branch
    │
    ├── Lint (ESLint + Prettier check)
    ├── Type check (tsc --noEmit)
    ├── Unit tests (Vitest)
    ├── Integration tests (Vitest + MSW)
    │
    ▼ (on PR merge to main)
    ├── Build (remix build)
    ├── E2E tests (Playwright)
    ├── Bundle size check
    │
    ▼ (on tag/release)
    ├── Deploy to staging
    ├── Smoke tests
    └── Deploy to production
```

---

## 14. Deployment

### 14.1 Recommended Targets

| Environment | Platform | Notes |
|-------------|----------|-------|
| Development | Local (Vite dev server) | Hot reload, MSW for API mocking |
| Staging | Docker / Node.js server | Identical to production |
| Production | Docker / Node.js (or Vercel, Fly.io) | SSR requires Node runtime |

### 14.2 Docker Setup

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 15. Open Decisions

| # | Decision | Options | Status |
|---|----------|---------|--------|
| 1 | Chart library primary | Recharts vs Visx | Pending |
| 2 | Deployment platform | Docker self-hosted vs Vercel vs Fly.io | Pending |
| 3 | Real-time updates | Polling vs SSE vs WebSocket | Pending |
| 4 | Design system | Custom vs Shadcn/ui vs Radix | Pending |
| 5 | Monitoring/Observability | Sentry + Datadog vs alternatives | Pending |
| 6 | API mocking strategy | MSW vs custom mock server | Pending |

---

## Appendix A: Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Files (components) | PascalCase | `KPICard.tsx` |
| Files (utils/services) | kebab-case or camelCase | `api-client.server.ts` |
| Server-only files | `.server.ts` suffix | `auth.server.ts` |
| Routes | dot-notation (Remix v2) | `dashboard.analytics.tsx` |
| Types/Interfaces | PascalCase | `AnalyticsResponse` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Zustand stores | camelCase + Store | `filterStore.ts` |

## Appendix B: Key Dependencies

```json
{
  "dependencies": {
    "@remix-run/node": "^2.x",
    "@remix-run/react": "^2.x",
    "@remix-run/serve": "^2.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "recharts": "^2.x",
    "@tanstack/react-table": "^8.x",
    "zustand": "^4.x",
    "ioredis": "^5.x",
    "zod": "^3.x",
    "tailwindcss": "^3.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vitest": "^1.x",
    "@testing-library/react": "^14.x",
    "playwright": "^1.x",
    "msw": "^2.x",
    "eslint": "^8.x",
    "prettier": "^3.x"
  }
}
```
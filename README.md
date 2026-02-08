# Frontend Platform

Monorepo que contiene el frontend, los servicios backend y la librería de componentes compartida de la plataforma.

## Estructura del proyecto

```
frontend-platform/
├── analytics-demo/          # App frontend (React Router + Tailwind)
├── services/
│   ├── auth-service/        # Servicio de autenticación (Express + MongoDB + Redis)
│   └── tracking-service/    # Servicio de tracking (Express + MongoDB)
├── ui-kit/
│   └── packages/
│       ├── react/           # Componentes React + Storybook
│       ├── styles/          # Design tokens + CSS base
│       └── utils/           # Utilidades compartidas
├── docker-compose.yml              # Levanta todo
├── docker-compose.frontend.yml     # Levanta solo el frontend
└── docker-compose.backend.yml      # Levanta solo el backend
```

## Puertos

| Servicio         | Puerto |
|------------------|--------|
| analytics-demo   | 3000   |
| auth-service     | 3001   |
| tracking-service | 3002   |
| Storybook        | 6006   |
| Redis            | 6379   |
| MongoDB (local)  | 27017  |

## Levantar con Docker

### Todo el stack

```bash
docker compose up --build
```

### Solo el frontend

```bash
docker compose -f docker-compose.frontend.yml up --build
```

### Solo el backend

```bash
docker compose -f docker-compose.backend.yml up --build
```

### Con MongoDB local

Por defecto los servicios se conectan a MongoDB Atlas (configurado en los `.env` de cada servicio). Para usar una instancia local de MongoDB, agregar el profile `local-db`:

```bash
docker compose --profile local-db up --build
```

## Variables de entorno

Cada servicio maneja su propia configuración en su carpeta:

- `services/auth-service/.env`
- `services/tracking-service/.env`

Copiar los `.env.example` de cada servicio para crear los `.env` correspondientes.

El archivo `.env.example` en la raíz contiene variables opcionales para personalizar los puertos de mapeo del host.

## Desarrollo local (sin Docker)

### auth-service

```bash
cd services/auth-service
npm install
npm run start:dev
```

### tracking-service

```bash
cd services/tracking-service
npm install
npm run start:dev
```

### analytics-demo

```bash
cd analytics-demo
npm install
npm run dev
```

### Storybook (ui-kit)

```bash
cd ui-kit/packages/react
npm install
npm run storybook
```

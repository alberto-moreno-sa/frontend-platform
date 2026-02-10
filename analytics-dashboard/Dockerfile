# ── Build stage ────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy shared tsconfig (analytics-dashboard/tsconfig.json extends it)
COPY tsconfig.base.json .

# Copy analytics-dashboard package files
COPY analytics-dashboard/package*.json analytics-dashboard/
WORKDIR /app/analytics-dashboard

# Install dependencies (includes @ahiggs-ui/* from npm registry)
RUN npm ci

# Copy source and build
COPY analytics-dashboard/ .
RUN npm run build

# ── Production stage ──────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/analytics-dashboard/build ./build
COPY --from=builder /app/analytics-dashboard/node_modules ./node_modules
COPY --from=builder /app/analytics-dashboard/package.json ./

EXPOSE 3000
CMD ["npm", "run", "start"]

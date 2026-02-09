# ── Build stage ────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy shared tsconfig (analytics-dashboard/tsconfig.json extends it)
COPY tsconfig.base.json .

# Copy ui-kit packages (needed for file: dependencies)
COPY ui-kit/packages/styles/package.json ui-kit/packages/styles/
COPY ui-kit/packages/styles/src/ ui-kit/packages/styles/src/
COPY ui-kit/packages/styles/dist/ ui-kit/packages/styles/dist/
COPY ui-kit/packages/utils/package.json ui-kit/packages/utils/
COPY ui-kit/packages/utils/dist/ ui-kit/packages/utils/dist/
COPY ui-kit/packages/react/package.json ui-kit/packages/react/
COPY ui-kit/packages/react/src/ ui-kit/packages/react/src/
COPY ui-kit/packages/react/dist/ ui-kit/packages/react/dist/

# Install dependencies
COPY analytics-dashboard/package*.json analytics-dashboard/
WORKDIR /app/analytics-dashboard
RUN npm ci

# Install ui-kit's external deps at ui-kit/node_modules (mirrors local workspace layout).
# Vite resolves these when processing ui-kit dist imports (e.g. class-variance-authority).
RUN cd /app/ui-kit && node -e " \
  const deps = require('./packages/react/package.json').dependencies; \
  const ext = Object.fromEntries(Object.entries(deps).filter(([k]) => !k.startsWith('@ui-kit/'))); \
  require('fs').writeFileSync('package.json', JSON.stringify({ dependencies: ext }));" \
  && npm install --no-package-lock --ignore-scripts \
  && mkdir -p node_modules/@ui-kit \
  && ln -s /app/ui-kit/packages/styles node_modules/@ui-kit/styles \
  && ln -s /app/ui-kit/packages/utils node_modules/@ui-kit/utils \
  && ln -s /app/ui-kit/packages/react node_modules/@ui-kit/react

# Copy source and build
COPY analytics-dashboard/ .
RUN npm run build

# ── Production stage ──────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy ui-kit packages (needed at runtime for CSS)
COPY --from=builder /app/ui-kit/packages/styles/ /app/ui-kit/packages/styles/
COPY --from=builder /app/ui-kit/packages/utils/package.json /app/ui-kit/packages/utils/
COPY --from=builder /app/ui-kit/packages/utils/dist/ /app/ui-kit/packages/utils/dist/
COPY --from=builder /app/ui-kit/packages/react/package.json /app/ui-kit/packages/react/
COPY --from=builder /app/ui-kit/packages/react/dist/ /app/ui-kit/packages/react/dist/

COPY --from=builder /app/analytics-dashboard/build ./build
COPY --from=builder /app/analytics-dashboard/node_modules ./node_modules
COPY --from=builder /app/analytics-dashboard/package.json ./

EXPOSE 3000
CMD ["npm", "run", "start"]

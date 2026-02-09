FROM node:20-alpine AS builder
WORKDIR /app

# Copy root workspace files
COPY package.json .npmrc ./
COPY ui-kit/packages/react/package.json ui-kit/packages/react/
COPY ui-kit/packages/utils/package.json ui-kit/packages/utils/
COPY ui-kit/packages/styles/package.json ui-kit/packages/styles/

# Install dependencies
RUN npm install --workspace=@ui-kit/react --workspace=@ui-kit/utils --workspace=@ui-kit/styles --include-workspace-root

# Copy source files
COPY ui-kit/ ui-kit/
COPY tsconfig.base.json ./

# Build Storybook
RUN npm run build-storybook --workspace=@ui-kit/react

# Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/ui-kit/packages/react/storybook-static /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

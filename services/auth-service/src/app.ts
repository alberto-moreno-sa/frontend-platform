import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { AppConfig } from '@config';
import { AppContainer } from './container';
import { securityHeaders } from '@common/middleware/security-headers.middleware';
import { errorHandler } from '@common/middleware/error-handler.middleware';
import { createAuthRoutes } from '@auth/infrastructure/routes/auth.routes';
import { createUserRoutes } from '@auth/infrastructure/routes/user.routes';
import { createJwksRoutes } from '@auth/infrastructure/routes/jwks.routes';
import { createHealthRoutes } from '@auth/infrastructure/routes/health.routes';
import { swaggerSpec } from './swagger';

export const createApp = (config: AppConfig, container: AppContainer): express.Express => {
  const app = express();

  // Global middleware
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: config.allowedOrigins, credentials: true }));
  app.use(express.json({ limit: '10kb' }));
  app.use(securityHeaders);

  // Swagger UI
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Routes
  app.use(
    '/api/auth',
    createAuthRoutes({
      useCases: container.useCases,
      authMiddleware: container.authMiddleware,
    }),
  );

  app.use(
    '/api/user',
    createUserRoutes({
      useCases: container.useCases,
      authMiddleware: container.authMiddleware,
    }),
  );

  app.use(
    '/.well-known',
    createJwksRoutes({
      useCases: container.useCases,
    }),
  );

  app.use(
    '/health',
    createHealthRoutes({
      redis: container.redis,
    }),
  );

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};

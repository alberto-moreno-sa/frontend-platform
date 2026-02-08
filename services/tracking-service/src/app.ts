import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { AppConfig } from '@config';
import { AppContainer } from './container';
import { securityHeaders } from '@common/middleware/security-headers.middleware';
import { errorHandler } from '@common/middleware/error-handler.middleware';
import { createTrackingRoutes } from '@tracking/infrastructure/routes/tracking.routes';
import { createStatsRoutes } from '@tracking/infrastructure/routes/stats.routes';
import { createExportRoutes } from '@tracking/infrastructure/routes/export.routes';
import { createHealthRoutes } from '@tracking/infrastructure/routes/health.routes';
import { swaggerSpec } from './swagger';

export const createApp = (config: AppConfig, container: AppContainer): express.Express => {
  const app = express();

  // Global middleware
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: config.allowedOrigins, credentials: true }));
  app.use(express.json({ limit: '50kb' }));
  app.use(securityHeaders);

  // Swagger UI
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Routes
  app.use(
    '/api/components',
    createTrackingRoutes({
      trackComponent: container.useCases.trackComponent,
    }),
  );

  app.use(
    '/api/components/stats',
    createStatsRoutes({
      getStats: container.useCases.getStats,
      streamStats: container.useCases.streamStats,
    }),
  );

  app.use(
    '/api/components/export',
    createExportRoutes({
      exportData: container.useCases.exportData,
      authMiddleware: container.authMiddleware,
    }),
  );

  app.use(
    '/api/health',
    createHealthRoutes({
      sseEmitter: container.sseEmitter,
      brokerType: container.brokerType,
    }),
  );

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};

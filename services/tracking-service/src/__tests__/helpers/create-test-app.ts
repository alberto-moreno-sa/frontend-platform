import express from 'express';
import { errorHandler } from '@common/middleware/error-handler.middleware';
import { securityHeaders } from '@common/middleware/security-headers.middleware';
import { createTrackingRoutes } from '@tracking/infrastructure/routes/tracking.routes';
import { createStatsRoutes } from '@tracking/infrastructure/routes/stats.routes';
import { createExportRoutes } from '@tracking/infrastructure/routes/export.routes';
import { createHealthRoutes } from '@tracking/infrastructure/routes/health.routes';
import { Request, Response, NextFunction } from 'express';

export const passAuthMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  req.user = { userId: 'user-1', email: 'test@example.com' };
  next();
};

export const rejectAuthMiddleware = async (_req: Request, _res: Response, next: NextFunction) => {
  const { AppError } = await import('@common/errors/app-error');
  next(new AppError('UNAUTHORIZED', 401, 'Authentication required'));
};

export const createMockUseCases = () => ({
  trackComponent: jest.fn().mockResolvedValue({ success: true, eventId: 'evt-1', timestamp: new Date().toISOString() }),
  getStats: jest.fn().mockResolvedValue({ totalEvents: 100, components: [] }),
  streamStats: jest.fn().mockImplementation(async (res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.write('data: {"connected":true}\n\n');
    res.end();
  }),
  exportData: jest.fn().mockResolvedValue({
    data: [{ componentName: 'Button', action: 'click' }],
    contentType: 'application/json',
    filename: 'export.json',
  }),
});

export const createTestApp = (overrides?: {
  authMiddleware?: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  useCases?: ReturnType<typeof createMockUseCases>;
  sseEmitter?: any;
  brokerType?: string;
}) => {
  const useCases = overrides?.useCases ?? createMockUseCases();
  const authMiddleware = overrides?.authMiddleware ?? passAuthMiddleware;
  const sseEmitter = overrides?.sseEmitter ?? { getClientCount: jest.fn().mockReturnValue(0), addClient: jest.fn(), removeClient: jest.fn(), emit: jest.fn() };
  const brokerType = overrides?.brokerType ?? 'memory';

  const app = express();
  app.use(express.json({ limit: '50kb' }));
  app.use(securityHeaders);

  app.use('/api/components', createTrackingRoutes({ trackComponent: useCases.trackComponent }));
  app.use('/api/components/stats', createStatsRoutes({ getStats: useCases.getStats, streamStats: useCases.streamStats }));
  app.use('/api/components/export', createExportRoutes({ exportData: useCases.exportData, authMiddleware }));
  app.use('/api/health', createHealthRoutes({ sseEmitter, brokerType }));
  app.use(errorHandler);

  return { app, useCases, sseEmitter };
};

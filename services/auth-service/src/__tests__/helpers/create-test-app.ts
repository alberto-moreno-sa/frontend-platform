import express from 'express';
import { errorHandler } from '@common/middleware/error-handler.middleware';
import { securityHeaders } from '@common/middleware/security-headers.middleware';
import { createAuthRoutes } from '@auth/infrastructure/routes/auth.routes';
import { createUserRoutes } from '@auth/infrastructure/routes/user.routes';
import { createJwksRoutes } from '@auth/infrastructure/routes/jwks.routes';
import { createHealthRoutes } from '@auth/infrastructure/routes/health.routes';
import { Request, Response, NextFunction } from 'express';

const defaultUser = {
  userId: 'user-1',
  email: 'test@example.com',
  deviceId: 'device-1',
  jti: 'jti-1',
};

export const passAuthMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  req.user = { ...defaultUser };
  next();
};

export const rejectAuthMiddleware = async (_req: Request, _res: Response, next: NextFunction) => {
  const { AppError } = await import('@common/errors/app-error');
  next(new AppError('TOKEN_INVALID', 401, 'Invalid token'));
};

export const createMockUseCases = () => ({
  registerUser: { execute: jest.fn().mockResolvedValue({ success: true, data: { accessToken: 'at', refreshToken: 'rt' } }) },
  loginUser: { execute: jest.fn().mockResolvedValue({ success: true, data: { accessToken: 'at', refreshToken: 'rt' } }) },
  refreshToken: { execute: jest.fn().mockResolvedValue({ success: true, data: { accessToken: 'at2', refreshToken: 'rt2' } }) },
  logout: { execute: jest.fn().mockResolvedValue({ success: true, data: { message: 'Logged out successfully' } }) },
  verifyToken: { execute: jest.fn().mockResolvedValue({ success: true, data: { valid: true, userId: 'user-1' } }) },
  getJwks: { execute: jest.fn().mockResolvedValue({ keys: [{ kty: 'EC', crv: 'P-256', x: 'x', y: 'y' }] }) },
  getProfile: { execute: jest.fn().mockResolvedValue({ success: true, data: { userId: 'user-1', name: 'Test', email: 'test@example.com' } }) },
  updateProfile: { execute: jest.fn().mockResolvedValue({ success: true, data: { userId: 'user-1', name: 'Updated' } }) },
  deleteAccount: { execute: jest.fn().mockResolvedValue({ success: true, data: { message: 'Account deleted' } }) },
  getSessions: { execute: jest.fn().mockResolvedValue({ success: true, data: { sessions: [] } }) },
});

export const createTestApp = (overrides?: {
  authMiddleware?: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  useCases?: ReturnType<typeof createMockUseCases>;
  redis?: any;
}) => {
  const useCases = overrides?.useCases ?? createMockUseCases();
  const authMiddleware = overrides?.authMiddleware ?? passAuthMiddleware;
  const redis = overrides?.redis ?? { ping: jest.fn().mockResolvedValue('PONG') };

  const app = express();
  app.use(express.json({ limit: '10kb' }));
  app.use(securityHeaders);

  app.use('/api/auth', createAuthRoutes({ useCases, authMiddleware }));
  app.use('/api/user', createUserRoutes({ useCases, authMiddleware }));
  app.use('/.well-known', createJwksRoutes({ useCases }));
  app.use('/health', createHealthRoutes({ redis }));
  app.use(errorHandler);

  return { app, useCases, redis };
};

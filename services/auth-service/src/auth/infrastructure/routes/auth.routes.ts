import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '@common/middleware/validate.middleware';
import { registerSchema } from '../validation/register.schema';
import { loginSchema } from '../validation/login.schema';
import { refreshTokenSchema } from '../validation/refresh-token.schema';

import { createDeviceInfo } from '@auth/domain/value-objects/device-info.vo';
import { AuthenticatedUser } from '@common/types';
import { logger } from '@common/logger';

const log = logger.child({ component: 'AuthRoutes' });

export interface AuthRoutesDeps {
  readonly useCases: {
    readonly registerUser: {
      execute: (email: string, password: string, name: string, device: any) => Promise<any>;
    };
    readonly loginUser: { execute: (email: string, password: string, device: any) => Promise<any> };
    readonly refreshToken: { execute: (refreshToken: string) => Promise<any> };
    readonly logout: { execute: (user: AuthenticatedUser) => Promise<any> };
    readonly verifyToken: { execute: (token: string) => Promise<any> };
  };
  readonly authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export const createAuthRoutes = (deps: AuthRoutesDeps): Router => {
  const router = Router();

  router.post(
    '/register',
    validate(registerSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        log.debug({ email: req.body.email }, 'Register request');
        const ip = (req.headers['x-forwarded-for'] as string) || req.ip || '0.0.0.0';
        const userAgent = req.headers['user-agent'] || '';
        const device = createDeviceInfo('unknown', ip, userAgent);
        const result = await deps.useCases.registerUser.execute(
          req.body.email,
          req.body.password,
          req.body.name,
          device,
        );
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    '/login',
    validate(loginSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        log.debug({ email: req.body.email }, 'Login request');
        const ip = (req.headers['x-forwarded-for'] as string) || req.ip || '0.0.0.0';
        const userAgent = req.headers['user-agent'] || '';
        const device = createDeviceInfo(req.body.deviceId || 'unknown', ip, userAgent);
        const result = await deps.useCases.loginUser.execute(
          req.body.email,
          req.body.password,
          device,
        );
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    '/refresh',
    validate(refreshTokenSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        log.debug('Refresh token request');
        const result = await deps.useCases.refreshToken.execute(req.body.refresh_token);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    '/logout',
    deps.authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        log.debug({ userId: req.user!.userId }, 'Logout request');
        const result = await deps.useCases.logout.execute(req.user!);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  router.post('/verify-token', async (req: Request, res: Response, next: NextFunction) => {
    try {
      log.debug('Verify token request');
      const authHeader = req.headers.authorization;
      const token = authHeader?.replace('Bearer ', '') || '';
      const result = await deps.useCases.verifyToken.execute(token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
};

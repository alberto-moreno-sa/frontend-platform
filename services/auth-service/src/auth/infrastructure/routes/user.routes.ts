import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '@common/middleware/validate.middleware';
import { updateProfileSchema } from '../validation/update-profile.schema';

import { deleteAccountSchema } from '../validation/delete-account.schema';

export interface UserRoutesDeps {
  readonly useCases: {
    readonly getProfile: { execute: (userId: string) => Promise<any> };
    readonly updateProfile: { execute: (userId: string, name: string) => Promise<any> };
    readonly deleteAccount: {
      execute: (userId: string, jti: string, password: string) => Promise<any>;
    };
    readonly getSessions: { execute: (userId: string, currentDeviceId: string) => Promise<any> };
  };
  readonly authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export const createUserRoutes = (deps: UserRoutesDeps): Router => {
  const router = Router();

  // All user routes require authentication
  router.use(deps.authMiddleware);

  router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await deps.useCases.getProfile.execute(req.user!.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.put(
    '/profile',
    validate(updateProfileSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await deps.useCases.updateProfile.execute(req.user!.userId, req.body.name);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  router.delete(
    '/account',
    validate(deleteAccountSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await deps.useCases.deleteAccount.execute(
          req.user!.userId,
          req.user!.jti,
          req.body.password,
        );
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  router.get('/sessions', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await deps.useCases.getSessions.execute(req.user!.userId, req.user!.deviceId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
};

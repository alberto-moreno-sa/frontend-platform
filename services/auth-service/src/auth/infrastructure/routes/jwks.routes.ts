import { Router, Request, Response, NextFunction } from 'express';

export interface JwksRoutesDeps {
  readonly useCases: {
    readonly getJwks: { execute: () => Promise<any> };
  };
}

export const createJwksRoutes = (deps: JwksRoutesDeps): Router => {
  const router = Router();

  router.get('/jwks.json', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await deps.useCases.getJwks.execute();
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
};

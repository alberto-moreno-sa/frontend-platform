import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '@common/middleware/validate.middleware';
import { trackEventSchema } from '../validation/track-event.schema';
import { createTrackComponentUseCase } from '@tracking/application/use-cases/track-component.use-case';

interface TrackingRoutesDeps {
  readonly trackComponent: ReturnType<typeof createTrackComponentUseCase>;
}

export const createTrackingRoutes = (deps: TrackingRoutesDeps): Router => {
  const router = Router();

  router.post(
    '/track',
    validate(trackEventSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await deps.trackComponent(req.body);
        res.status(202).json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
};

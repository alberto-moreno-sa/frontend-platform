import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '@common/middleware/validate.middleware';
import { trackEventSchema } from '../validation/track-event.schema';
import { createTrackComponentUseCase } from '@tracking/application/use-cases/track-component.use-case';
import { logger } from '@common/logger';

const log = logger.child({ component: 'TrackingRoutes' });

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
        log.debug({ component: req.body.componentName, action: req.body.action }, 'Track event received');
        const result = await deps.trackComponent(req.body);
        log.info({ component: req.body.componentName, action: req.body.action, eventId: result.eventId }, 'Event accepted');
        res.status(202).json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
};

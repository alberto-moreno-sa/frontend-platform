import { Router, Request, Response, NextFunction } from 'express';
import { createGetStatsUseCase } from '@tracking/application/use-cases/get-stats.use-case';
import { createStreamStatsUseCase } from '@tracking/application/use-cases/stream-stats.use-case';
import { StatsFilters } from '@tracking/application/ports/tracking-repository.port';
import { validate } from '@common/middleware/validate.middleware';
import { statsQuerySchema } from '@tracking/infrastructure/validation/stats-query.schema';

interface StatsRoutesDeps {
  readonly getStats: ReturnType<typeof createGetStatsUseCase>;
  readonly streamStats: ReturnType<typeof createStreamStatsUseCase>;
}

export const createStatsRoutes = (deps: StatsRoutesDeps): Router => {
  const router = Router();

  // GET /api/components/stats
  router.get(
    '/',
    validate(statsQuerySchema, 'query'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = (req.validatedQuery ?? req.query) as Record<string, string | undefined>;
        const filters: StatsFilters = {
          from: query.from ? new Date(query.from) : undefined,
          to: query.to ? new Date(query.to) : undefined,
          component: query.component,
          page: query.page,
        };
        const stats = await deps.getStats(filters);
        res.json(stats);
      } catch (error) {
        next(error);
      }
    },
  );

  // GET /api/components/stats/stream (SSE)
  router.get(
    '/stream',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await deps.streamStats(res);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
};

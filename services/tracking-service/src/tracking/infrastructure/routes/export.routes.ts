import { Router, Request, Response, NextFunction } from 'express';
import { createExportDataUseCase } from '@tracking/application/use-cases/export-data.use-case';
import { StatsFilters } from '@tracking/application/ports/tracking-repository.port';
import { validate } from '@common/middleware/validate.middleware';
import { exportQuerySchema } from '@tracking/infrastructure/validation/export-query.schema';
import { logger } from '@common/logger';

const log = logger.child({ component: 'ExportRoutes' });

interface ExportRoutesDeps {
  readonly exportData: ReturnType<typeof createExportDataUseCase>;
  readonly authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export const createExportRoutes = (deps: ExportRoutesDeps): Router => {
  const router = Router();

  // GET /api/components/export (JWT auth required)
  router.get(
    '/',
    deps.authMiddleware,
    validate(exportQuerySchema, 'query'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = (req.validatedQuery ?? req.query) as Record<string, string | undefined>;
        const filters: StatsFilters = {
          from: query.from ? new Date(query.from) : undefined,
          to: query.to ? new Date(query.to) : undefined,
          component: query.component,
          page: query.page,
        };
        const format = (query.format as 'csv' | 'json') || 'json';

        log.debug({ filters, format, userId: req.user?.userId }, 'Export request');
        const result = await deps.exportData(filters, format);
        log.info({ format, filename: result.filename, userId: req.user?.userId }, 'Export completed');

        res.setHeader('Content-Type', result.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);

        if (typeof result.data === 'string') {
          res.send(result.data);
        } else {
          res.json(result.data);
        }
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
};

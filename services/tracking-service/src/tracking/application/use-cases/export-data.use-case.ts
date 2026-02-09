import { TrackingRepositoryPort, StatsFilters } from '../ports/tracking-repository.port';
import { TrackingEventEntity } from '@tracking/domain/entities/tracking-event.entity';
import { toCsv } from '@common/mappers/to-csv';
import { AppError } from '@common/errors/app-error';
import { ErrorCodes } from '@common/constants/error-codes';
import { logger } from '@common/logger';

const log = logger.child({ component: 'ExportData' });

interface ExportDataDeps {
  readonly trackingRepo: TrackingRepositoryPort;
}

interface ExportResult {
  readonly data: string | { data: TrackingEventEntity[]; meta: { total: number; filters: StatsFilters; exportedAt: string } };
  readonly contentType: string;
  readonly filename: string;
}

export const createExportDataUseCase = (deps: ExportDataDeps) => {
  return async (filters: StatsFilters, format: 'csv' | 'json'): Promise<ExportResult> => {
    try {
      log.debug({ filters, format }, 'Export started');
      const events = await deps.trackingRepo.findAll(filters);
      const dateStr = new Date().toISOString().split('T')[0];
      log.info({ format, totalEvents: events.length }, 'Export ready');

      if (format === 'csv') {
        return {
          data: toCsv(events),
          contentType: 'text/csv',
          filename: `tracking-export-${dateStr}.csv`,
        };
      }

      return {
        data: {
          data: events,
          meta: {
            total: events.length,
            filters,
            exportedAt: new Date().toISOString(),
          },
        },
        contentType: 'application/json',
        filename: `tracking-export-${dateStr}.json`,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      log.error({ err: error }, 'Failed to export');
      throw AppError.fromErrorCode(ErrorCodes.EXPORT_ERROR);
    }
  };
};

import { TrackingRepositoryPort, StatsFilters } from '../ports/tracking-repository.port';
import { TrackingEventEntity } from '@tracking/domain/entities/tracking-event.entity';
import { toCsv } from '@common/mappers/to-csv';
import { AppError } from '@common/errors/app-error';
import { ErrorCodes } from '@common/constants/error-codes';

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
      const events = await deps.trackingRepo.findAll(filters);
      const dateStr = new Date().toISOString().split('T')[0];

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
      console.error('[ExportData] Failed to export:', error);
      throw AppError.fromErrorCode(ErrorCodes.EXPORT_ERROR);
    }
  };
};

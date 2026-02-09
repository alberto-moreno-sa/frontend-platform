import { TrackingRepositoryPort, AggregatedStats, StatsFilters } from '../ports/tracking-repository.port';
import { AppError } from '@common/errors/app-error';
import { ErrorCodes } from '@common/constants/error-codes';
import { logger } from '@common/logger';

const log = logger.child({ component: 'GetStats' });

interface GetStatsDeps {
  readonly trackingRepo: TrackingRepositoryPort;
}

export const createGetStatsUseCase = (deps: GetStatsDeps) => {
  return async (filters: StatsFilters): Promise<AggregatedStats> => {
    try {
      log.debug({ filters }, 'Computing aggregated stats');
      const result = await deps.trackingRepo.getAggregatedStats(filters);
      log.debug({ totalEvents: result.summary.totalInteractions }, 'Stats computed');
      return result;
    } catch (error) {
      log.error({ err: error }, 'Failed to compute stats');
      throw AppError.fromErrorCode(ErrorCodes.STATS_ERROR);
    }
  };
};

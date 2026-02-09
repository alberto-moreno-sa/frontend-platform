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
      return await deps.trackingRepo.getAggregatedStats(filters);
    } catch (error) {
      log.error({ err: error }, 'Failed to compute stats');
      throw AppError.fromErrorCode(ErrorCodes.STATS_ERROR);
    }
  };
};

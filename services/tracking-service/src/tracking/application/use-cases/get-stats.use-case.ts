import { TrackingRepositoryPort, AggregatedStats, StatsFilters } from '../ports/tracking-repository.port';
import { AppError } from '@common/errors/app-error';
import { ErrorCodes } from '@common/constants/error-codes';

interface GetStatsDeps {
  readonly trackingRepo: TrackingRepositoryPort;
}

export const createGetStatsUseCase = (deps: GetStatsDeps) => {
  return async (filters: StatsFilters): Promise<AggregatedStats> => {
    try {
      return await deps.trackingRepo.getAggregatedStats(filters);
    } catch (error) {
      console.error('[GetStats] Failed to compute stats:', error);
      throw AppError.fromErrorCode(ErrorCodes.STATS_ERROR);
    }
  };
};

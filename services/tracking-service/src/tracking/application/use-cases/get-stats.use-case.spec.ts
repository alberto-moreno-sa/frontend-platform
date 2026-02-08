import { createGetStatsUseCase } from './get-stats.use-case';
import { AppError } from '@common/errors/app-error';

const mockStats = {
  summary: {
    totalInteractions: 100,
    uniqueSessions: 10,
    interactionsLast24h: 50,
    interactionsLastHour: 5,
    avgInteractionsPerSession: 10,
  },
  byComponent: [],
  byAction: {},
  byPage: [],
  byDevice: { mobile: 0, desktop: 0, tablet: 0 },
  topInteractions: [],
  timeline: [],
  generatedAt: new Date().toISOString(),
};

describe('GetStats Use Case', () => {
  it('should return aggregated stats', async () => {
    const trackingRepo = {
      save: jest.fn(),
      getAggregatedStats: jest.fn().mockResolvedValue(mockStats),
      findAll: jest.fn(),
    };

    const useCase = createGetStatsUseCase({ trackingRepo });
    const result = await useCase({});

    expect(result.summary.totalInteractions).toBe(100);
    expect(trackingRepo.getAggregatedStats).toHaveBeenCalledWith({});
  });

  it('should pass filters to repository', async () => {
    const trackingRepo = {
      save: jest.fn(),
      getAggregatedStats: jest.fn().mockResolvedValue(mockStats),
      findAll: jest.fn(),
    };

    const useCase = createGetStatsUseCase({ trackingRepo });
    const filters = { component: 'Button', from: new Date() };
    await useCase(filters);

    expect(trackingRepo.getAggregatedStats).toHaveBeenCalledWith(filters);
  });

  it('should throw STATS_ERROR when repository fails', async () => {
    const trackingRepo = {
      save: jest.fn(),
      getAggregatedStats: jest.fn().mockRejectedValue(new Error('db error')),
      findAll: jest.fn(),
    };

    const useCase = createGetStatsUseCase({ trackingRepo });

    await expect(useCase({})).rejects.toMatchObject({
      errorCode: 'STATS_ERROR',
    });
  });
});

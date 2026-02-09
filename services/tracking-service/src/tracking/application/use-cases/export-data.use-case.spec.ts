import { createExportDataUseCase } from './export-data.use-case';

const mockEvents = [
  {
    id: '1',
    componentName: 'Button',
    variant: 'primary',
    action: 'click',
    timestamp: new Date('2024-01-01'),
    sessionId: 'sess-1',
    pageUrl: '/home',
    pageTitle: null,
    referrer: null,
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0',
    language: 'en',
    metadata: {},
  },
];

describe('ExportData Use Case', () => {
  it('should export as JSON', async () => {
    const trackingRepo = {
      save: jest.fn(),
      getAggregatedStats: jest.fn(),
      findAll: jest.fn().mockResolvedValue(mockEvents),
    };

    const useCase = createExportDataUseCase({ trackingRepo });
    const result = await useCase({}, 'json');

    expect(result.contentType).toBe('application/json');
    expect(result.filename).toMatch(/tracking-export-.*\.json/);
    expect((result.data as any).data).toHaveLength(1);
    expect((result.data as any).meta.total).toBe(1);
  });

  it('should export as CSV', async () => {
    const trackingRepo = {
      save: jest.fn(),
      getAggregatedStats: jest.fn(),
      findAll: jest.fn().mockResolvedValue(mockEvents),
    };

    const useCase = createExportDataUseCase({ trackingRepo });
    const result = await useCase({}, 'csv');

    expect(result.contentType).toBe('text/csv');
    expect(result.filename).toMatch(/tracking-export-.*\.csv/);
    expect(typeof result.data).toBe('string');
    expect(result.data as string).toContain('componentName');
    expect(result.data as string).toContain('Button');
  });

  it('should pass filters to repository', async () => {
    const trackingRepo = {
      save: jest.fn(),
      getAggregatedStats: jest.fn(),
      findAll: jest.fn().mockResolvedValue([]),
    };

    const filters = { component: 'Card', from: new Date() };
    const useCase = createExportDataUseCase({ trackingRepo });
    await useCase(filters, 'json');

    expect(trackingRepo.findAll).toHaveBeenCalledWith(filters);
  });

  it('should throw EXPORT_ERROR when repository fails', async () => {
    const trackingRepo = {
      save: jest.fn(),
      getAggregatedStats: jest.fn(),
      findAll: jest.fn().mockRejectedValue(new Error('db error')),
    };

    const useCase = createExportDataUseCase({ trackingRepo });

    await expect(useCase({}, 'json')).rejects.toMatchObject({
      errorCode: 'EXPORT_ERROR',
    });
  });
});

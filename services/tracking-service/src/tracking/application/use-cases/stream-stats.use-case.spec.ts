import { createStreamStatsUseCase } from './stream-stats.use-case';
import { Response } from 'express';

const mockRes = () => {
  const res = {
    setHeader: jest.fn(),
    flushHeaders: jest.fn(),
    write: jest.fn(),
    on: jest.fn(),
  } as unknown as Response;
  return res;
};

describe('StreamStats Use Case', () => {
  it('should set SSE headers and flush', async () => {
    const trackingRepo = {
      save: jest.fn(),
      getAggregatedStats: jest.fn().mockResolvedValue({ summary: {} }),
      findAll: jest.fn(),
    };
    const sseEmitter = {
      addClient: jest.fn(),
      removeClient: jest.fn(),
      emit: jest.fn(),
      getClientCount: jest.fn(),
    };

    const useCase = createStreamStatsUseCase({ trackingRepo, sseEmitter });
    const res = mockRes();

    await useCase(res);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
    expect(res.setHeader).toHaveBeenCalledWith('Connection', 'keep-alive');
    expect(res.flushHeaders).toHaveBeenCalled();
  });

  it('should send initial stats snapshot', async () => {
    const stats = { summary: { totalInteractions: 42 } };
    const trackingRepo = {
      save: jest.fn(),
      getAggregatedStats: jest.fn().mockResolvedValue(stats),
      findAll: jest.fn(),
    };
    const sseEmitter = {
      addClient: jest.fn(),
      removeClient: jest.fn(),
      emit: jest.fn(),
      getClientCount: jest.fn(),
    };

    const useCase = createStreamStatsUseCase({ trackingRepo, sseEmitter });
    const res = mockRes();

    await useCase(res);

    expect(res.write).toHaveBeenCalledWith(`data: ${JSON.stringify(stats)}\n\n`);
  });

  it('should register client with SSE emitter', async () => {
    const trackingRepo = {
      save: jest.fn(),
      getAggregatedStats: jest.fn().mockResolvedValue({}),
      findAll: jest.fn(),
    };
    const sseEmitter = {
      addClient: jest.fn(),
      removeClient: jest.fn(),
      emit: jest.fn(),
      getClientCount: jest.fn(),
    };

    const useCase = createStreamStatsUseCase({ trackingRepo, sseEmitter });
    const res = mockRes();

    await useCase(res);

    expect(sseEmitter.addClient).toHaveBeenCalledWith(res);
  });

  it('should remove client on close', async () => {
    const trackingRepo = {
      save: jest.fn(),
      getAggregatedStats: jest.fn().mockResolvedValue({}),
      findAll: jest.fn(),
    };
    const sseEmitter = {
      addClient: jest.fn(),
      removeClient: jest.fn(),
      emit: jest.fn(),
      getClientCount: jest.fn(),
    };

    const useCase = createStreamStatsUseCase({ trackingRepo, sseEmitter });
    const res = mockRes();

    await useCase(res);

    // Simulate close event
    const closeHandler = (res.on as jest.Mock).mock.calls.find(
      (call: any[]) => call[0] === 'close',
    )?.[1];
    expect(closeHandler).toBeDefined();
    closeHandler();
    expect(sseEmitter.removeClient).toHaveBeenCalledWith(res);
  });
});

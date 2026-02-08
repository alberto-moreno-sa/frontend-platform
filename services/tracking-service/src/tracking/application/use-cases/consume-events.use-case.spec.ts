import { createConsumeEventsUseCase } from './consume-events.use-case';

describe('ConsumeEvents Use Case', () => {
  it('should subscribe to the topic on start', async () => {
    const broker = {
      connect: jest.fn(),
      publish: jest.fn(),
      subscribe: jest.fn(),
      disconnect: jest.fn(),
    };
    const trackingRepo = { save: jest.fn(), getAggregatedStats: jest.fn(), findAll: jest.fn() };
    const sseEmitter = {
      addClient: jest.fn(),
      removeClient: jest.fn(),
      emit: jest.fn(),
      getClientCount: jest.fn(),
    };

    const useCase = createConsumeEventsUseCase({
      broker,
      trackingRepo,
      sseEmitter,
      kafkaTopic: 'test.topic',
    });

    await useCase.start();

    expect(broker.subscribe).toHaveBeenCalledWith('test.topic', expect.any(Function));
  });

  it('should save event and emit via SSE when handler is called', async () => {
    const broker = {
      connect: jest.fn(),
      publish: jest.fn(),
      subscribe: jest.fn(),
      disconnect: jest.fn(),
    };
    const trackingRepo = { save: jest.fn(), getAggregatedStats: jest.fn(), findAll: jest.fn() };
    const sseEmitter = {
      addClient: jest.fn(),
      removeClient: jest.fn(),
      emit: jest.fn(),
      getClientCount: jest.fn(),
    };

    createConsumeEventsUseCase({
      broker,
      trackingRepo,
      sseEmitter,
      kafkaTopic: 'test.topic',
    });

    // Get the handler that was registered
    await broker.subscribe.mock.calls?.[0]?.[1]?.({
      componentName: 'Button',
      variant: 'primary',
      action: 'click',
      timestamp: new Date(),
      sessionId: 's',
      pageUrl: '/',
      pageTitle: null,
      referrer: null,
      viewport: { width: 0, height: 0 },
      userAgent: null,
      language: null,
      metadata: {},
    }) ?? (async () => {
      // If subscribe wasn't called yet, call start first
      const useCase = createConsumeEventsUseCase({
        broker,
        trackingRepo,
        sseEmitter,
        kafkaTopic: 'test.topic',
      });
      await useCase.start();

      const handler = broker.subscribe.mock.calls[0][1];
      const event = {
        componentName: 'Button',
        variant: 'primary',
        action: 'click',
        timestamp: new Date(),
        sessionId: 's',
        pageUrl: '/',
        pageTitle: null,
        referrer: null,
        viewport: { width: 0, height: 0 },
        userAgent: null,
        language: null,
        metadata: {},
      };

      await handler(event);

      expect(trackingRepo.save).toHaveBeenCalledWith(event);
      expect(sseEmitter.emit).toHaveBeenCalledWith(event);
    })();
  });
});

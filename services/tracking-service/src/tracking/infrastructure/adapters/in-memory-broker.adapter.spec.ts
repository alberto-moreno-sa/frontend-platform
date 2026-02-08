import { createInMemoryBrokerAdapter } from './in-memory-broker.adapter';

describe('InMemoryBroker Adapter', () => {
  it('should connect and disconnect without error', async () => {
    const broker = createInMemoryBrokerAdapter();
    await expect(broker.connect()).resolves.not.toThrow();
    await expect(broker.disconnect()).resolves.not.toThrow();
  });

  it('should publish and subscribe to events', async () => {
    const broker = createInMemoryBrokerAdapter();
    await broker.connect();

    const handler = jest.fn().mockResolvedValue(undefined);
    await broker.subscribe('test-topic', handler);

    const event = {
      componentName: 'Button',
      variant: 'primary',
      action: 'click',
      timestamp: new Date(),
      sessionId: 's1',
      pageUrl: '/',
      pageTitle: null,
      referrer: null,
      viewport: { width: 0, height: 0 },
      userAgent: null,
      language: null,
      metadata: {},
    };

    await broker.publish('test-topic', event as any);

    // Give the EventEmitter a tick to deliver
    await new Promise((r) => setTimeout(r, 10));

    expect(handler).toHaveBeenCalledWith(event);
  });

  it('should not receive events from other topics', async () => {
    const broker = createInMemoryBrokerAdapter();
    await broker.connect();

    const handler = jest.fn().mockResolvedValue(undefined);
    await broker.subscribe('topic-a', handler);

    await broker.publish('topic-b', {} as any);
    await new Promise((r) => setTimeout(r, 10));

    expect(handler).not.toHaveBeenCalled();
  });

  it('should remove all listeners on disconnect', async () => {
    const broker = createInMemoryBrokerAdapter();
    await broker.connect();

    const handler = jest.fn().mockResolvedValue(undefined);
    await broker.subscribe('topic', handler);
    await broker.disconnect();

    await broker.publish('topic', {} as any);
    await new Promise((r) => setTimeout(r, 10));

    expect(handler).not.toHaveBeenCalled();
  });
});

import { createNodeSSEEmitterAdapter } from './node-sse-emitter.adapter';
import { Response } from 'express';

const mockClient = () =>
  ({ write: jest.fn() }) as unknown as Response;

describe('NodeSSEEmitter Adapter', () => {
  it('should start with 0 clients', () => {
    const emitter = createNodeSSEEmitterAdapter();
    expect(emitter.getClientCount()).toBe(0);
  });

  it('should add and remove clients', () => {
    const emitter = createNodeSSEEmitterAdapter();
    const client = mockClient();

    emitter.addClient(client);
    expect(emitter.getClientCount()).toBe(1);

    emitter.removeClient(client);
    expect(emitter.getClientCount()).toBe(0);
  });

  it('should emit to all connected clients', () => {
    const emitter = createNodeSSEEmitterAdapter();
    const c1 = mockClient();
    const c2 = mockClient();

    emitter.addClient(c1);
    emitter.addClient(c2);

    emitter.emit({
      componentName: 'Button',
      variant: 'primary',
      action: 'click',
      pageUrl: '/home',
      timestamp: new Date('2024-01-01'),
      sessionId: 's',
      pageTitle: null,
      referrer: null,
      viewport: { width: 0, height: 0 },
      userAgent: null,
      language: null,
      metadata: {},
    });

    expect(c1.write).toHaveBeenCalledTimes(1);
    expect(c2.write).toHaveBeenCalledTimes(1);
    expect((c1.write as jest.Mock).mock.calls[0][0]).toContain('event: interaction');
  });

  it('should remove client if write throws', () => {
    const emitter = createNodeSSEEmitterAdapter();
    const badClient = {
      write: jest.fn(() => { throw new Error('disconnected'); }),
    } as unknown as Response;

    emitter.addClient(badClient);
    emitter.emit({
      componentName: 'A',
      variant: 'B',
      action: 'click',
      pageUrl: '/',
      timestamp: new Date(),
      sessionId: 's',
      pageTitle: null,
      referrer: null,
      viewport: { width: 0, height: 0 },
      userAgent: null,
      language: null,
      metadata: {},
    });

    expect(emitter.getClientCount()).toBe(0);
  });
});

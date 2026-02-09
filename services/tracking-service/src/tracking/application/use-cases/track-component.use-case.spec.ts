import { createTrackComponentUseCase } from './track-component.use-case';

const mockBroker = () => ({
  connect: jest.fn(),
  publish: jest.fn(),
  subscribe: jest.fn(),
  disconnect: jest.fn(),
});

const validInput = {
  componentName: 'Button',
  variant: 'primary',
  action: 'click' as const,
  timestamp: '2024-01-01T00:00:00.000Z',
  sessionId: 'sess-1',
  pageUrl: '/home',
};

describe('TrackComponent Use Case', () => {
  it('should accept valid tracking event and publish to broker', async () => {
    const broker = mockBroker();
    const useCase = createTrackComponentUseCase({ broker, kafkaTopic: 'test.topic' });

    const result = await useCase(validInput);

    expect(result.status).toBe('accepted');
    expect(result.eventId).toBeDefined();
    expect(result.timestamp).toBeDefined();
    expect(broker.publish).toHaveBeenCalledWith('test.topic', expect.objectContaining({
      componentName: 'Button',
      variant: 'primary',
      action: 'click',
    }));
  });

  it('should throw INVALID_TRACKING_DATA for invalid input', async () => {
    const broker = mockBroker();
    const useCase = createTrackComponentUseCase({ broker, kafkaTopic: 'test' });

    await expect(
      useCase({ ...validInput, componentName: '' }),
    ).rejects.toMatchObject({ errorCode: 'INVALID_TRACKING_DATA' });
  });

  it('should throw INVALID_TRACKING_DATA for invalid action', async () => {
    const broker = mockBroker();
    const useCase = createTrackComponentUseCase({ broker, kafkaTopic: 'test' });

    await expect(
      useCase({ ...validInput, action: 'invalid' }),
    ).rejects.toMatchObject({ errorCode: 'INVALID_TRACKING_DATA' });
  });

  it('should throw BROKER_PUBLISH_ERROR when broker fails', async () => {
    const broker = mockBroker();
    broker.publish.mockRejectedValue(new Error('broker down'));
    const useCase = createTrackComponentUseCase({ broker, kafkaTopic: 'test' });

    await expect(useCase(validInput)).rejects.toMatchObject({
      errorCode: 'BROKER_PUBLISH_ERROR',
    });
  });
});

import { TrackingEventEntity } from '@tracking/domain/entities/tracking-event.entity';
import { EventBrokerPort } from '../ports/event-broker.port';
import { TrackingRepositoryPort } from '../ports/tracking-repository.port';
import { SSEEmitterPort } from '../ports/sse-emitter.port';

interface ConsumeEventsDeps {
  readonly broker: EventBrokerPort;
  readonly trackingRepo: TrackingRepositoryPort;
  readonly sseEmitter: SSEEmitterPort;
  readonly kafkaTopic: string;
}

export const createConsumeEventsUseCase = (deps: ConsumeEventsDeps) => {
  const handleEvent = async (event: TrackingEventEntity): Promise<void> => {
    try {
      await deps.trackingRepo.save(event);
      deps.sseEmitter.emit(event);
    } catch (error) {
      console.error('[ConsumeEvents] Failed to process event:', error);
    }
  };

  return {
    start: async (): Promise<void> => {
      await deps.broker.subscribe(deps.kafkaTopic, handleEvent);
      console.log(`[ConsumeEvents] Subscribed to topic: ${deps.kafkaTopic}`);
    },
  };
};

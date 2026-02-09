import { TrackingEventEntity } from '@tracking/domain/entities/tracking-event.entity';
import { EventBrokerPort } from '../ports/event-broker.port';
import { TrackingRepositoryPort } from '../ports/tracking-repository.port';
import { SSEEmitterPort } from '../ports/sse-emitter.port';
import { logger } from '@common/logger';

const log = logger.child({ component: 'ConsumeEvents' });

interface ConsumeEventsDeps {
  readonly broker: EventBrokerPort;
  readonly trackingRepo: TrackingRepositoryPort;
  readonly sseEmitter: SSEEmitterPort;
  readonly kafkaTopic: string;
}

/**
 * Subscribes to the broker topic and processes each incoming tracking event:
 * persists it to the repository and broadcasts it to all SSE clients.
 * Errors are logged but don't crash the consumer, ensuring resilience.
 */
export const createConsumeEventsUseCase = (deps: ConsumeEventsDeps) => {
  const handleEvent = async (event: TrackingEventEntity): Promise<void> => {
    try {
      log.debug({ componentName: event.componentName, action: event.action }, 'Processing event');
      await deps.trackingRepo.save(event);
      deps.sseEmitter.emit(event);
      log.debug({ componentName: event.componentName }, 'Event persisted and broadcast');
    } catch (error) {
      log.error({ err: error }, 'Failed to process event');
    }
  };

  return {
    start: async (): Promise<void> => {
      await deps.broker.subscribe(deps.kafkaTopic, handleEvent);
      log.info({ topic: deps.kafkaTopic }, 'Subscribed to topic');
    },
  };
};

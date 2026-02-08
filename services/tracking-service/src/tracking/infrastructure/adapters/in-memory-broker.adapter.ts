import { EventEmitter } from 'events';
import { EventBrokerPort } from '@tracking/application/ports/event-broker.port';
import { TrackingEventEntity } from '@tracking/domain/entities/tracking-event.entity';

export const createInMemoryBrokerAdapter = (): EventBrokerPort => {
  const emitter = new EventEmitter();
  emitter.setMaxListeners(100);

  return {
    connect: async (): Promise<void> => {
      console.log('[InMemoryBroker] Connected (EventEmitter)');
    },

    publish: async (topic: string, event: TrackingEventEntity): Promise<void> => {
      emitter.emit(topic, event);
    },

    subscribe: async (
      topic: string,
      handler: (event: TrackingEventEntity) => Promise<void>,
    ): Promise<void> => {
      emitter.on(topic, (event: TrackingEventEntity) => {
        handler(event).catch((err) =>
          console.error('[InMemoryBroker] Handler error:', err),
        );
      });
    },

    disconnect: async (): Promise<void> => {
      emitter.removeAllListeners();
      console.log('[InMemoryBroker] Disconnected');
    },
  };
};

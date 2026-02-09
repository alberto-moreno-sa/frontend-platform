import { EventEmitter } from 'events';
import { EventBrokerPort } from '@tracking/application/ports/event-broker.port';
import { TrackingEventEntity } from '@tracking/domain/entities/tracking-event.entity';
import { logger } from '@common/logger';

const log = logger.child({ component: 'InMemoryBroker' });

export const createInMemoryBrokerAdapter = (): EventBrokerPort => {
  const emitter = new EventEmitter();
  emitter.setMaxListeners(100);

  return {
    connect: async (): Promise<void> => {
      log.info('Connected (EventEmitter)');
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
          log.error({ err }, 'Handler error'),
        );
      });
    },

    disconnect: async (): Promise<void> => {
      emitter.removeAllListeners();
      log.info('Disconnected');
    },
  };
};

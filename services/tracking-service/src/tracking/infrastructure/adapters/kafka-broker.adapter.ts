import { Kafka, Producer, Consumer } from 'kafkajs';
import { EventBrokerPort } from '@tracking/application/ports/event-broker.port';
import { TrackingEventEntity } from '@tracking/domain/entities/tracking-event.entity';

interface KafkaBrokerConfig {
  readonly brokers: string[];
  readonly clientId: string;
  readonly groupId: string;
}

export const createKafkaBrokerAdapter = (config: KafkaBrokerConfig): EventBrokerPort => {
  const kafka = new Kafka({
    clientId: config.clientId,
    brokers: config.brokers,
  });

  let producer: Producer | null = null;
  let consumer: Consumer | null = null;

  return {
    connect: async (): Promise<void> => {
      producer = kafka.producer();
      consumer = kafka.consumer({ groupId: config.groupId });
      await producer.connect();
      await consumer.connect();
      console.log('[KafkaBroker] Connected');
    },

    publish: async (topic: string, event: TrackingEventEntity): Promise<void> => {
      if (!producer) throw new Error('Kafka producer not connected');
      await producer.send({
        topic,
        messages: [{ value: JSON.stringify(event) }],
      });
    },

    subscribe: async (
      topic: string,
      handler: (event: TrackingEventEntity) => Promise<void>,
    ): Promise<void> => {
      if (!consumer) throw new Error('Kafka consumer not connected');
      await consumer.subscribe({ topic, fromBeginning: false });
      await consumer.run({
        eachMessage: async ({ message }) => {
          if (message.value) {
            const event = JSON.parse(message.value.toString()) as TrackingEventEntity;
            await handler(event);
          }
        },
      });
      console.log(`[KafkaBroker] Subscribed to topic: ${topic}`);
    },

    disconnect: async (): Promise<void> => {
      if (producer) await producer.disconnect();
      if (consumer) await consumer.disconnect();
      console.log('[KafkaBroker] Disconnected');
    },
  };
};

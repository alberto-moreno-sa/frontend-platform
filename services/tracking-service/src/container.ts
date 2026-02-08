import mongoose from 'mongoose';
import { AppConfig } from '@config';

// Schemas
import { createTrackingEventModel } from '@tracking/infrastructure/schemas/tracking-event.schema';

// Adapters
import { createInMemoryBrokerAdapter } from '@tracking/infrastructure/adapters/in-memory-broker.adapter';
import { createKafkaBrokerAdapter } from '@tracking/infrastructure/adapters/kafka-broker.adapter';
import { createMongoTrackingRepository } from '@tracking/infrastructure/adapters/mongo-tracking.repository';
import { createNodeSSEEmitterAdapter } from '@tracking/infrastructure/adapters/node-sse-emitter.adapter';

// Use cases
import { createTrackComponentUseCase } from '@tracking/application/use-cases/track-component.use-case';
import { createConsumeEventsUseCase } from '@tracking/application/use-cases/consume-events.use-case';
import { createGetStatsUseCase } from '@tracking/application/use-cases/get-stats.use-case';
import { createExportDataUseCase } from '@tracking/application/use-cases/export-data.use-case';
import { createStreamStatsUseCase } from '@tracking/application/use-cases/stream-stats.use-case';

// Middleware
import { createAuthMiddleware } from '@common/middleware/auth.middleware';

// Ports
import { EventBrokerPort } from '@tracking/application/ports/event-broker.port';

export interface AppContainer {
  readonly authMiddleware: ReturnType<typeof createAuthMiddleware>;
  readonly sseEmitter: ReturnType<typeof createNodeSSEEmitterAdapter>;
  readonly brokerType: string;
  readonly useCases: {
    readonly trackComponent: ReturnType<typeof createTrackComponentUseCase>;
    readonly consumeEvents: ReturnType<typeof createConsumeEventsUseCase>;
    readonly getStats: ReturnType<typeof createGetStatsUseCase>;
    readonly exportData: ReturnType<typeof createExportDataUseCase>;
    readonly streamStats: ReturnType<typeof createStreamStatsUseCase>;
  };
  readonly close: () => Promise<void>;
}

export const createContainer = async (config: AppConfig): Promise<AppContainer> => {
  // Connect MongoDB
  await mongoose.connect(config.mongoUri);
  console.log('[Container] MongoDB connected');

  // Models
  const trackingEventModel = createTrackingEventModel();

  // Adapters
  const broker: EventBrokerPort =
    config.brokerType === 'kafka'
      ? createKafkaBrokerAdapter({
          brokers: config.kafkaBrokers,
          clientId: config.kafkaClientId,
          groupId: config.kafkaGroupId,
        })
      : createInMemoryBrokerAdapter();

  await broker.connect();
  console.log(`[Container] Broker connected (${config.brokerType})`);

  const trackingRepo = createMongoTrackingRepository(trackingEventModel);
  const sseEmitter = createNodeSSEEmitterAdapter();

  // Auth middleware (JWKS-based verification via auth-service)
  const authMiddleware = createAuthMiddleware(config.authServiceUrl);

  // Use cases
  const useCases = {
    trackComponent: createTrackComponentUseCase({
      broker,
      kafkaTopic: config.kafkaTopic,
    }),
    consumeEvents: createConsumeEventsUseCase({
      broker,
      trackingRepo,
      sseEmitter,
      kafkaTopic: config.kafkaTopic,
    }),
    getStats: createGetStatsUseCase({ trackingRepo }),
    exportData: createExportDataUseCase({ trackingRepo }),
    streamStats: createStreamStatsUseCase({ trackingRepo, sseEmitter }),
  };

  // Start consuming events
  await useCases.consumeEvents.start();
  console.log('[Container] Event consumer started');

  const close = async (): Promise<void> => {
    await broker.disconnect();
    await mongoose.disconnect();
    console.log('[Container] Connections closed');
  };

  return { authMiddleware, sseEmitter, brokerType: config.brokerType, useCases, close };
};

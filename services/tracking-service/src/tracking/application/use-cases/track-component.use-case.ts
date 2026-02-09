import { v4 as uuidv4 } from 'uuid';
import { CreateTrackingEventInput, createTrackingEvent } from '@tracking/domain/entities/tracking-event.entity';
import { validateTrackingData } from '@tracking/domain/functions/validate-tracking-data.fn';
import { EventBrokerPort } from '../ports/event-broker.port';
import { AppError } from '@common/errors/app-error';
import { ErrorCodes } from '@common/constants/error-codes';
import { logger } from '@common/logger';

const log = logger.child({ component: 'TrackComponent' });

interface TrackComponentDeps {
  readonly broker: EventBrokerPort;
  readonly kafkaTopic: string;
}

interface TrackComponentResult {
  readonly status: 'accepted';
  readonly eventId: string;
  readonly timestamp: string;
}

/**
 * Validates and publishes a component interaction event to the broker.
 * Uses the Either pattern for validation: Left = invalid → throw,
 * Right = valid → create entity and publish asynchronously.
 */
export const createTrackComponentUseCase = (deps: TrackComponentDeps) => {
  return async (input: CreateTrackingEventInput): Promise<TrackComponentResult> => {
    const validation = validateTrackingData(input);

    if (validation.isLeft) {
      log.debug({ reason: validation.value.message, component: input.componentName }, 'Validation rejected');
      throw AppError.fromErrorCode(ErrorCodes.INVALID_TRACKING_DATA, undefined, validation.value.message);
    }

    const event = createTrackingEvent(input);

    try {
      await deps.broker.publish(deps.kafkaTopic, event);
      log.debug({ componentName: event.componentName, action: event.action }, 'Event published to broker');
    } catch {
      log.error({ componentName: event.componentName }, 'Broker publish failed');
      throw AppError.fromErrorCode(ErrorCodes.BROKER_PUBLISH_ERROR);
    }

    return {
      status: 'accepted',
      eventId: uuidv4().split('-')[0],
      timestamp: new Date().toISOString(),
    };
  };
};

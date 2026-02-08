import { v4 as uuidv4 } from 'uuid';
import { CreateTrackingEventInput, createTrackingEvent } from '@tracking/domain/entities/tracking-event.entity';
import { validateTrackingData } from '@tracking/domain/functions/validate-tracking-data.fn';
import { EventBrokerPort } from '../ports/event-broker.port';
import { AppError } from '@common/errors/app-error';
import { ErrorCodes } from '@common/constants/error-codes';

interface TrackComponentDeps {
  readonly broker: EventBrokerPort;
  readonly kafkaTopic: string;
}

interface TrackComponentResult {
  readonly status: 'accepted';
  readonly eventId: string;
  readonly timestamp: string;
}

export const createTrackComponentUseCase = (deps: TrackComponentDeps) => {
  return async (input: CreateTrackingEventInput): Promise<TrackComponentResult> => {
    const validation = validateTrackingData(input);

    if (validation.isLeft) {
      throw AppError.fromErrorCode(ErrorCodes.INVALID_TRACKING_DATA, undefined, validation.value.message);
    }

    const event = createTrackingEvent(input);

    try {
      await deps.broker.publish(deps.kafkaTopic, event);
    } catch {
      throw AppError.fromErrorCode(ErrorCodes.BROKER_PUBLISH_ERROR);
    }

    return {
      status: 'accepted',
      eventId: uuidv4().split('-')[0],
      timestamp: new Date().toISOString(),
    };
  };
};

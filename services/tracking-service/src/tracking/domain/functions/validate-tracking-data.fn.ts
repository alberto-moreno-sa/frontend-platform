import { Either, Left, Right } from '@common/either';
import { DomainErrors, VALID_ACTIONS } from '../errors/domain-errors';
import { CreateTrackingEventInput } from '../entities/tracking-event.entity';

interface ValidationError {
  readonly code: string;
  readonly message: string;
}

export const validateTrackingData = (
  data: CreateTrackingEventInput,
): Either<ValidationError, CreateTrackingEventInput> => {
  if (!data.componentName || typeof data.componentName !== 'string') {
    return Left(DomainErrors.INVALID_COMPONENT_NAME);
  }

  if (!data.variant || typeof data.variant !== 'string') {
    return Left(DomainErrors.INVALID_VARIANT);
  }

  if (!data.action || !VALID_ACTIONS.includes(data.action as (typeof VALID_ACTIONS)[number])) {
    return Left(DomainErrors.INVALID_ACTION);
  }

  if (!data.timestamp || isNaN(Date.parse(String(data.timestamp)))) {
    return Left(DomainErrors.INVALID_TIMESTAMP);
  }

  if (!data.sessionId || typeof data.sessionId !== 'string') {
    return Left(DomainErrors.INVALID_SESSION_ID);
  }

  if (!data.pageUrl || typeof data.pageUrl !== 'string') {
    return Left(DomainErrors.INVALID_PAGE_URL);
  }

  return Right(data);
};

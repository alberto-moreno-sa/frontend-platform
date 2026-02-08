import { AppError } from './app-error';
import { ErrorCodes } from '../constants/error-codes';

describe('AppError', () => {
  it('should create with all fields', () => {
    const err = new AppError('CODE', 400, 'msg', { key: 'val' });
    expect(err.errorCode).toBe('CODE');
    expect(err.status).toBe(400);
    expect(err.message).toBe('msg');
    expect(err.details).toEqual({ key: 'val' });
    expect(err).toBeInstanceOf(Error);
  });

  it('should create from error definition', () => {
    const err = AppError.fromErrorCode(ErrorCodes.BROKER_PUBLISH_ERROR);
    expect(err.errorCode).toBe('BROKER_PUBLISH_ERROR');
    expect(err.status).toBe(503);
  });

  it('should accept custom message', () => {
    const err = AppError.fromErrorCode(ErrorCodes.INVALID_INPUT, undefined, 'custom');
    expect(err.message).toBe('custom');
  });
});

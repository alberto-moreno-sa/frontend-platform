import { AppError } from './app-error';
import { ErrorCodes } from '../constants/error-codes';

describe('AppError', () => {
  it('should create an error with all fields', () => {
    const err = new AppError('CODE', 400, 'msg', { key: 'val' });

    expect(err.errorCode).toBe('CODE');
    expect(err.status).toBe(400);
    expect(err.message).toBe('msg');
    expect(err.details).toEqual({ key: 'val' });
    expect(err.name).toBe('AppError');
    expect(err).toBeInstanceOf(Error);
  });

  describe('fromErrorCode', () => {
    it('should create from error definition', () => {
      const err = AppError.fromErrorCode(ErrorCodes.USER_NOT_FOUND);

      expect(err.errorCode).toBe('USER_NOT_FOUND');
      expect(err.status).toBe(404);
      expect(err.message).toBe('User not found');
    });

    it('should accept custom message', () => {
      const err = AppError.fromErrorCode(
        ErrorCodes.INVALID_INPUT,
        undefined,
        'Custom message',
      );
      expect(err.message).toBe('Custom message');
    });

    it('should accept details', () => {
      const err = AppError.fromErrorCode(
        ErrorCodes.INVALID_INPUT,
        { field: 'email' },
      );
      expect(err.details).toEqual({ field: 'email' });
    });
  });
});

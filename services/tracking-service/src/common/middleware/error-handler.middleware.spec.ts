import { errorHandler } from './error-handler.middleware';
import { AppError } from '../errors/app-error';
import { Request, Response } from 'express';

const mockRes = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
};

describe('errorHandler middleware', () => {
  it('should handle AppError with timestamp', () => {
    const res = mockRes();
    const error = new AppError('TEST', 422, 'test msg');

    errorHandler(error, {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: { code: 'TEST', message: 'test msg' },
        timestamp: expect.any(String),
      }),
    );
  });

  it('should include details when present', () => {
    const res = mockRes();
    const error = new AppError('CODE', 400, 'msg', { field: 'name' });

    errorHandler(error, {} as Request, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ details: { field: 'name' } }),
      }),
    );
  });

  it('should handle SyntaxError (JSON parse)', () => {
    const res = mockRes();
    const error = Object.assign(new SyntaxError('Unexpected token'), { body: '' });

    errorHandler(error, {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should handle unknown errors as 500', () => {
    const res = mockRes();
    errorHandler(new Error('oops'), {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'INTERNAL_SERVER_ERROR' }),
      }),
    );
  });
});

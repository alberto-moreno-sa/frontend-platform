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

const mockReq = {} as Request;
const mockNext = jest.fn();

describe('errorHandler middleware', () => {
  it('should handle AppError', () => {
    const res = mockRes();
    const error = new AppError('TEST_ERROR', 422, 'test message', { foo: 'bar' });

    errorHandler(error, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'TEST_ERROR',
        message: 'test message',
        details: { foo: 'bar' },
      },
    });
  });

  it('should handle AppError without details', () => {
    const res = mockRes();
    const error = new AppError('CODE', 400, 'msg');

    errorHandler(error, mockReq, res, mockNext);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: { code: 'CODE', message: 'msg' },
    });
  });

  it('should handle SyntaxError with body (JSON parse error)', () => {
    const res = mockRes();
    const error = Object.assign(new SyntaxError('Unexpected token'), {
      body: '',
    });

    errorHandler(error, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should handle unknown errors as 500', () => {
    const res = mockRes();
    const error = new Error('unexpected');

    errorHandler(error, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'INTERNAL_SERVER_ERROR' }),
      }),
    );
  });
});

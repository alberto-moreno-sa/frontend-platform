import { validate } from './validate.middleware';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

const mockReq = (body: unknown) =>
  ({ body } as Request);

const mockRes = {} as Response;

describe('validate middleware', () => {
  it('should pass valid body and call next', async () => {
    const req = mockReq({ email: 'a@b.com', name: 'Jo' });
    const next = jest.fn();

    await validate(schema)(req, mockRes, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body.email).toBe('a@b.com');
  });

  it('should call next with AppError on invalid body', async () => {
    const req = mockReq({ email: 'invalid', name: 'J' });
    const next = jest.fn();

    await validate(schema)(req, mockRes, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0] as AppError;
    expect(error.errorCode).toBe('INVALID_INPUT');
    expect(error.details?.validationErrors).toBeDefined();
  });
});

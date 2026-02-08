import { validate } from './validate.middleware';
import { z } from 'zod';
import { Request, Response } from 'express';
import { AppError } from '../errors/app-error';

const bodySchema = z.object({ name: z.string().min(2) });
const querySchema = z.object({ page: z.string().optional() });

const mockReq = (body: unknown, query: unknown = {}) =>
  ({ body, query } as unknown as Request);

describe('validate middleware', () => {
  it('should validate body by default', async () => {
    const req = mockReq({ name: 'John' });
    const next = jest.fn();

    await validate(bodySchema)(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body.name).toBe('John');
  });

  it('should call next with AppError on invalid body', async () => {
    const req = mockReq({ name: 'J' });
    const next = jest.fn();

    await validate(bodySchema)(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0] as AppError;
    expect(error.errorCode).toBe('INVALID_INPUT');
  });

  it('should validate query when source is query', async () => {
    const req = mockReq({}, { page: '/home' });
    const next = jest.fn();

    await validate(querySchema, 'query')(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect((req as any).validatedQuery).toBeDefined();
  });
});

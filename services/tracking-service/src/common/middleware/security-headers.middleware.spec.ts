import { securityHeaders } from './security-headers.middleware';
import { Request, Response, NextFunction } from 'express';

describe('securityHeaders middleware', () => {
  it('should set security headers and call next', () => {
    const headers: Record<string, string> = {};
    const res = {
      setHeader: jest.fn((k: string, v: string) => { headers[k] = v; }),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    securityHeaders({} as Request, res, next);

    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['X-Frame-Options']).toBe('DENY');
    expect(next).toHaveBeenCalledTimes(1);
  });
});

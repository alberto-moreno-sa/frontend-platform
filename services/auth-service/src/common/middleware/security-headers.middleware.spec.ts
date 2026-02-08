import { securityHeaders } from './security-headers.middleware';
import { Request, Response, NextFunction } from 'express';

describe('securityHeaders middleware', () => {
  it('should set all security headers and call next', () => {
    const headers: Record<string, string> = {};
    const res = {
      setHeader: jest.fn((key: string, val: string) => {
        headers[key] = val;
      }),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    securityHeaders({} as Request, res, next);

    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['X-Frame-Options']).toBe('DENY');
    expect(headers['X-XSS-Protection']).toBe('1; mode=block');
    expect(headers['Strict-Transport-Security']).toContain('max-age=');
    expect(headers['Content-Security-Policy']).toBeDefined();
    expect(headers['Referrer-Policy']).toBeDefined();
    expect(headers['Permissions-Policy']).toBeDefined();
    expect(next).toHaveBeenCalledTimes(1);
  });
});

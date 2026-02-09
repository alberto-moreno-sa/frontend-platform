import { createAuthMiddleware } from './auth.middleware';
import { AppError } from '../errors/app-error';
import { Request, Response } from 'express';

const mockDeps = () => ({
  tokenService: {
    signAccessToken: jest.fn(),
    signRefreshToken: jest.fn(),
    verifyAccessToken: jest.fn().mockResolvedValue({
      jti: 'jti-1',
      user_id: 'user-1',
      email: 'a@b.com',
      deviceId: 'device-1',
    }),
    verifyRefreshToken: jest.fn(),
    getActiveKid: jest.fn(),
  },
  blacklist: {
    add: jest.fn(),
    isBlacklisted: jest.fn().mockResolvedValue(false),
  },
  userRepo: {
    findByEmail: jest.fn(),
    findById: jest.fn().mockResolvedValue({
      id: 'user-1',
      deletedAt: null,
    }),
    create: jest.fn(),
    updateLastLogin: jest.fn(),
    updateProfile: jest.fn(),
    softDelete: jest.fn(),
  },
});

const mockReq = (authHeader?: string) =>
  ({
    headers: { authorization: authHeader },
  }) as unknown as Request;

const mockRes = {} as Response;

describe('auth middleware', () => {
  it('should set req.user and call next on valid token', async () => {
    const deps = mockDeps();
    const middleware = createAuthMiddleware(deps);
    const req = mockReq('Bearer valid-token');
    const next = jest.fn();

    await middleware(req, mockRes, next);

    expect(req.user).toEqual({
      userId: 'user-1',
      email: 'a@b.com',
      deviceId: 'device-1',
      jti: 'jti-1',
    });
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with error when no auth header', async () => {
    const deps = mockDeps();
    const middleware = createAuthMiddleware(deps);
    const next = jest.fn();

    await middleware(mockReq(undefined), mockRes, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });

  it('should call next with error when header is not Bearer', async () => {
    const deps = mockDeps();
    const middleware = createAuthMiddleware(deps);
    const next = jest.fn();

    await middleware(mockReq('Basic abc'), mockRes, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });

  it('should call next with TOKEN_BLACKLISTED when blacklisted', async () => {
    const deps = mockDeps();
    deps.blacklist.isBlacklisted.mockResolvedValue(true);
    const middleware = createAuthMiddleware(deps);
    const next = jest.fn();

    await middleware(mockReq('Bearer token'), mockRes, next);

    const error = next.mock.calls[0][0] as AppError;
    expect(error.errorCode).toBe('TOKEN_BLACKLISTED');
  });

  it('should call next with USER_NOT_FOUND when user missing', async () => {
    const deps = mockDeps();
    deps.userRepo.findById.mockResolvedValue(null);
    const middleware = createAuthMiddleware(deps);
    const next = jest.fn();

    await middleware(mockReq('Bearer token'), mockRes, next);

    const error = next.mock.calls[0][0] as AppError;
    expect(error.errorCode).toBe('USER_NOT_FOUND');
  });

  it('should call next with ACCOUNT_INACTIVE when user deleted', async () => {
    const deps = mockDeps();
    deps.userRepo.findById.mockResolvedValue({ id: 'user-1', deletedAt: new Date() });
    const middleware = createAuthMiddleware(deps);
    const next = jest.fn();

    await middleware(mockReq('Bearer token'), mockRes, next);

    const error = next.mock.calls[0][0] as AppError;
    expect(error.errorCode).toBe('ACCOUNT_INACTIVE');
  });

  it('should handle expired token errors', async () => {
    const deps = mockDeps();
    deps.tokenService.verifyAccessToken.mockRejectedValue(new Error('token expired'));
    const middleware = createAuthMiddleware(deps);
    const next = jest.fn();

    await middleware(mockReq('Bearer expired-token'), mockRes, next);

    const error = next.mock.calls[0][0] as AppError;
    expect(error.errorCode).toBe('TOKEN_EXPIRED');
  });
});

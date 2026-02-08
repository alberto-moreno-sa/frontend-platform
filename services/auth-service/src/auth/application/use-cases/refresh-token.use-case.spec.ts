import { createRefreshTokenUseCase } from './refresh-token.use-case';
import { AppError } from '@common/errors/app-error';

const mockDeps = () => ({
  tokenService: {
    signAccessToken: jest.fn().mockResolvedValue('new-access'),
    signRefreshToken: jest.fn().mockResolvedValue('new-refresh'),
    verifyAccessToken: jest.fn(),
    verifyRefreshToken: jest.fn().mockResolvedValue({
      jti: 'refresh-jti-1',
      user_id: 'user-1',
      deviceId: 'device-1',
      type: 'refresh',
    }),
    getActiveKid: jest.fn(),
  },
  refreshTokenRepo: {
    create: jest.fn(),
    findByJti: jest.fn(),
    findActiveByUserId: jest.fn(),
    revoke: jest.fn(),
    revokeAllByUserId: jest.fn(),
    findByParentJtiChain: jest.fn(),
  },
  sessionService: {
    create: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteAllByUserId: jest.fn(),
    findAllByUserId: jest.fn().mockResolvedValue([
      { sessionId: 'sess-1', data: { refreshTokenJti: 'refresh-jti-1', deviceId: 'device-1' } },
    ]),
  },
  blacklist: {
    add: jest.fn(),
    isBlacklisted: jest.fn(),
  },
  userRepo: {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateLastLogin: jest.fn(),
    updateProfile: jest.fn(),
    softDelete: jest.fn(),
  },
  config: {
    port: 3001,
    nodeEnv: 'test',
    mongoUri: '',
    redisUri: '',
    jwtKid: 'kid',
    keyEncryptionSecret: 'secret',
    accessTokenTtl: 900,
    refreshTokenTtl: 604800,
    issuerUrl: 'https://auth.test',
    audience: 'test-api',
    allowedOrigins: [],
  },
});

const validStoredToken = {
  id: '1',
  jti: 'refresh-jti-1',
  userId: 'user-1',
  deviceId: 'device-1',
  ipAddress: '127.0.0.1',
  userAgent: 'jest',
  issuedAt: new Date(),
  expiresAt: new Date(Date.now() + 3600_000),
  revokedAt: null,
  revokedReason: null,
  rotationCount: 0,
  parentJti: null,
};

describe('RefreshToken Use Case', () => {
  it('should rotate token and return new pair', async () => {
    const deps = mockDeps();
    deps.refreshTokenRepo.findByJti.mockResolvedValue(validStoredToken);
    deps.userRepo.findById.mockResolvedValue({
      id: 'user-1',
      email: 'a@b.com',
      deletedAt: null,
    });

    const useCase = createRefreshTokenUseCase(deps);
    const result = await useCase.execute('old-refresh-jwt');

    expect(result.success).toBe(true);
    expect(result.data.access_token).toBe('new-access');
    expect(result.data.refresh_token).toBe('new-refresh');
    expect(deps.refreshTokenRepo.revoke).toHaveBeenCalledWith('refresh-jti-1', 'rotation');
    expect(deps.refreshTokenRepo.create).toHaveBeenCalledTimes(1);
  });

  it('should throw TOKEN_INVALID when stored token not found', async () => {
    const deps = mockDeps();
    deps.refreshTokenRepo.findByJti.mockResolvedValue(null);

    const useCase = createRefreshTokenUseCase(deps);

    await expect(useCase.execute('jwt')).rejects.toMatchObject({
      errorCode: 'TOKEN_INVALID',
    });
  });

  it('should detect token reuse and revoke all family tokens', async () => {
    const deps = mockDeps();
    deps.refreshTokenRepo.findByJti.mockResolvedValue({
      ...validStoredToken,
      revokedAt: new Date(),
      revokedReason: 'rotation',
    });
    deps.refreshTokenRepo.findByParentJtiChain.mockResolvedValue([
      { jti: 'child-1' },
      { jti: 'child-2' },
    ]);

    const useCase = createRefreshTokenUseCase(deps);

    await expect(useCase.execute('jwt')).rejects.toMatchObject({
      errorCode: 'TOKEN_REUSE_DETECTED',
    });
    expect(deps.sessionService.deleteAllByUserId).toHaveBeenCalledWith('user-1');
  });

  it('should throw TOKEN_REVOKED when token revoked for non-rotation reason', async () => {
    const deps = mockDeps();
    deps.refreshTokenRepo.findByJti.mockResolvedValue({
      ...validStoredToken,
      revokedAt: new Date(),
      revokedReason: 'logout',
    });

    const useCase = createRefreshTokenUseCase(deps);

    await expect(useCase.execute('jwt')).rejects.toMatchObject({
      errorCode: 'TOKEN_REVOKED',
    });
  });

  it('should throw TOKEN_EXPIRED when token is expired', async () => {
    const deps = mockDeps();
    deps.refreshTokenRepo.findByJti.mockResolvedValue({
      ...validStoredToken,
      expiresAt: new Date(Date.now() - 1000),
    });

    const useCase = createRefreshTokenUseCase(deps);

    await expect(useCase.execute('jwt')).rejects.toMatchObject({
      errorCode: 'TOKEN_EXPIRED',
    });
  });

  it('should throw ACCOUNT_INACTIVE when user is deleted', async () => {
    const deps = mockDeps();
    deps.refreshTokenRepo.findByJti.mockResolvedValue(validStoredToken);
    deps.userRepo.findById.mockResolvedValue({ id: 'user-1', deletedAt: new Date() });

    const useCase = createRefreshTokenUseCase(deps);

    await expect(useCase.execute('jwt')).rejects.toMatchObject({
      errorCode: 'ACCOUNT_INACTIVE',
    });
  });
});

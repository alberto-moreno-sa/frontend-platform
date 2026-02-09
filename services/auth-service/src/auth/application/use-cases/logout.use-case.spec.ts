import { createLogoutUseCase } from './logout.use-case';

const mockDeps = () => ({
  refreshTokenRepo: {
    create: jest.fn(),
    findByJti: jest.fn(),
    findActiveByUserId: jest.fn().mockResolvedValue([
      { jti: 'rt-1', deviceId: 'device-1' },
      { jti: 'rt-2', deviceId: 'device-2' },
    ]),
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
      { sessionId: 'sess-1', data: { deviceId: 'device-1' } },
    ]),
  },
  blacklist: {
    add: jest.fn(),
    isBlacklisted: jest.fn(),
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
    logLevel: 'info',
  },
});

const currentUser = {
  userId: 'user-1',
  email: 'test@example.com',
  deviceId: 'device-1',
  jti: 'access-jti-1',
};

describe('Logout Use Case', () => {
  it('should blacklist access token and revoke refresh tokens for device', async () => {
    const deps = mockDeps();
    const useCase = createLogoutUseCase(deps);

    const result = await useCase.execute(currentUser);

    expect(result.success).toBe(true);
    expect(deps.blacklist.add).toHaveBeenCalledWith('access-jti-1', 900);
    expect(deps.refreshTokenRepo.revoke).toHaveBeenCalledWith('rt-1', 'logout');
    expect(deps.refreshTokenRepo.revoke).not.toHaveBeenCalledWith('rt-2', 'logout');
  });

  it('should delete the matching session', async () => {
    const deps = mockDeps();
    const useCase = createLogoutUseCase(deps);

    await useCase.execute(currentUser);

    expect(deps.sessionService.delete).toHaveBeenCalledWith('user-1', 'sess-1');
  });
});

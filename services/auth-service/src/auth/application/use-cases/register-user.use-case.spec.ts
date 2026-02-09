import { createRegisterUserUseCase } from './register-user.use-case';
import { AppError } from '@common/errors/app-error';

const mockDeps = () => ({
  userRepo: {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateLastLogin: jest.fn(),
    updateProfile: jest.fn(),
    softDelete: jest.fn(),
  },
  tokenService: {
    signAccessToken: jest.fn().mockResolvedValue('access-token'),
    signRefreshToken: jest.fn().mockResolvedValue('refresh-token'),
    verifyAccessToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
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
    findAllByUserId: jest.fn(),
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
    allowedOrigins: ['http://localhost:3000'],
    logLevel: 'info',
  },
});

const device = {
  deviceId: 'device-1',
  ipAddress: '127.0.0.1',
  userAgent: 'jest',
};

describe('RegisterUser Use Case', () => {
  it('should register a new user and return tokens', async () => {
    const deps = mockDeps();
    deps.userRepo.findByEmail.mockResolvedValue(null);
    deps.userRepo.create.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test',
      emailVerified: false,
      createdAt: new Date('2024-01-01'),
    });

    const useCase = createRegisterUserUseCase(deps);
    const result = await useCase.execute('test@example.com', 'Password1', 'Test', device);

    expect(result.success).toBe(true);
    expect(result.data.user.email).toBe('test@example.com');
    expect(result.data.access_token).toBe('access-token');
    expect(result.data.refresh_token).toBe('refresh-token');
    expect(result.data.expires_in).toBe(900);
    expect(deps.userRepo.create).toHaveBeenCalledTimes(1);
    expect(deps.refreshTokenRepo.create).toHaveBeenCalledTimes(1);
    expect(deps.sessionService.create).toHaveBeenCalledTimes(1);
  });

  it('should throw EMAIL_ALREADY_EXISTS when email is taken', async () => {
    const deps = mockDeps();
    deps.userRepo.findByEmail.mockResolvedValue({ id: 'existing' });

    const useCase = createRegisterUserUseCase(deps);

    await expect(
      useCase.execute('taken@example.com', 'Password1', 'Test', device),
    ).rejects.toThrow(AppError);

    await expect(
      useCase.execute('taken@example.com', 'Password1', 'Test', device),
    ).rejects.toMatchObject({ errorCode: 'EMAIL_ALREADY_EXISTS' });
  });
});

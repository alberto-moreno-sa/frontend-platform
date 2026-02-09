import { createLoginUserUseCase } from './login-user.use-case';
import * as bcrypt from 'bcryptjs';

const makeUser = (overrides = {}) => ({
  id: 'user-1',
  email: 'test@example.com',
  passwordHash: '',
  name: 'Test',
  emailVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLogin: null,
  deletedAt: null,
  ...overrides,
});

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

const device = { deviceId: 'device-1', ipAddress: '127.0.0.1', userAgent: 'jest' };

describe('LoginUser Use Case', () => {
  it('should login and return tokens on valid credentials', async () => {
    const hash = await bcrypt.hash('Password1', 4);
    const deps = mockDeps();
    deps.userRepo.findByEmail.mockResolvedValue(makeUser({ passwordHash: hash }));

    const useCase = createLoginUserUseCase(deps);
    const result = await useCase.execute('test@example.com', 'Password1', device);

    expect(result.success).toBe(true);
    expect(result.data.access_token).toBe('access-token');
    expect(deps.userRepo.updateLastLogin).toHaveBeenCalledWith('user-1');
    expect(deps.refreshTokenRepo.create).toHaveBeenCalledTimes(1);
    expect(deps.sessionService.create).toHaveBeenCalledTimes(1);
  });

  it('should throw INVALID_CREDENTIALS when user not found', async () => {
    const deps = mockDeps();
    deps.userRepo.findByEmail.mockResolvedValue(null);

    const useCase = createLoginUserUseCase(deps);

    await expect(
      useCase.execute('no@user.com', 'pass', device),
    ).rejects.toMatchObject({ errorCode: 'INVALID_CREDENTIALS' });
  });

  it('should throw ACCOUNT_INACTIVE when user is soft-deleted', async () => {
    const deps = mockDeps();
    deps.userRepo.findByEmail.mockResolvedValue(
      makeUser({ deletedAt: new Date() }),
    );

    const useCase = createLoginUserUseCase(deps);

    await expect(
      useCase.execute('test@example.com', 'Password1', device),
    ).rejects.toMatchObject({ errorCode: 'ACCOUNT_INACTIVE' });
  });

  it('should throw INVALID_CREDENTIALS when password is wrong', async () => {
    const hash = await bcrypt.hash('CorrectPass1', 4);
    const deps = mockDeps();
    deps.userRepo.findByEmail.mockResolvedValue(makeUser({ passwordHash: hash }));

    const useCase = createLoginUserUseCase(deps);

    await expect(
      useCase.execute('test@example.com', 'WrongPass1', device),
    ).rejects.toMatchObject({ errorCode: 'INVALID_CREDENTIALS' });
  });
});

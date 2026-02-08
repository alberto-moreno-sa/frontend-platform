import { createDeleteAccountUseCase } from './delete-account.use-case';
import * as bcrypt from 'bcryptjs';

const mockDeps = () => ({
  userRepo: {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateLastLogin: jest.fn(),
    updateProfile: jest.fn(),
    softDelete: jest.fn(),
  },
  refreshTokenRepo: {
    create: jest.fn(),
    findByJti: jest.fn(),
    findActiveByUserId: jest.fn(),
    revoke: jest.fn(),
    revokeAllByUserId: jest.fn().mockResolvedValue(2),
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
  },
});

describe('DeleteAccount Use Case', () => {
  it('should soft delete account and revoke all tokens', async () => {
    const hash = await bcrypt.hash('Password1', 4);
    const deps = mockDeps();
    deps.userRepo.findById.mockResolvedValue({
      id: 'user-1',
      passwordHash: hash,
    });

    const useCase = createDeleteAccountUseCase(deps);
    const result = await useCase.execute('user-1', 'jti-1', 'Password1');

    expect(result.success).toBe(true);
    expect(deps.userRepo.softDelete).toHaveBeenCalledWith('user-1');
    expect(deps.refreshTokenRepo.revokeAllByUserId).toHaveBeenCalledWith('user-1', 'account_deleted');
    expect(deps.blacklist.add).toHaveBeenCalledWith('jti-1', 900);
    expect(deps.sessionService.deleteAllByUserId).toHaveBeenCalledWith('user-1');
  });

  it('should throw USER_NOT_FOUND when user does not exist', async () => {
    const deps = mockDeps();
    deps.userRepo.findById.mockResolvedValue(null);

    const useCase = createDeleteAccountUseCase(deps);

    await expect(
      useCase.execute('unknown', 'jti', 'pass'),
    ).rejects.toMatchObject({ errorCode: 'USER_NOT_FOUND' });
  });

  it('should throw INVALID_CREDENTIALS when password is wrong', async () => {
    const hash = await bcrypt.hash('Correct1', 4);
    const deps = mockDeps();
    deps.userRepo.findById.mockResolvedValue({
      id: 'user-1',
      passwordHash: hash,
    });

    const useCase = createDeleteAccountUseCase(deps);

    await expect(
      useCase.execute('user-1', 'jti', 'Wrong1'),
    ).rejects.toMatchObject({ errorCode: 'INVALID_CREDENTIALS' });
  });
});

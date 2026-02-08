import { createVerifyTokenUseCase } from './verify-token.use-case';
import { AppError } from '@common/errors/app-error';

const mockDeps = () => ({
  tokenService: {
    signAccessToken: jest.fn(),
    signRefreshToken: jest.fn(),
    verifyAccessToken: jest.fn().mockResolvedValue({
      jti: 'jti-1',
      user_id: 'user-1',
      email: 'a@b.com',
      deviceId: 'device-1',
      exp: Math.floor(Date.now() / 1000) + 900,
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
      email: 'a@b.com',
      deletedAt: null,
    }),
    create: jest.fn(),
    updateLastLogin: jest.fn(),
    updateProfile: jest.fn(),
    softDelete: jest.fn(),
  },
});

describe('VerifyToken Use Case', () => {
  it('should return valid response for a good token', async () => {
    const deps = mockDeps();
    const useCase = createVerifyTokenUseCase(deps);

    const result = await useCase.execute('valid-token');

    expect(result.success).toBe(true);
    expect(result.data.valid).toBe(true);
    expect(result.data.user_id).toBe('user-1');
  });

  it('should throw TOKEN_BLACKLISTED when token is blacklisted', async () => {
    const deps = mockDeps();
    deps.blacklist.isBlacklisted.mockResolvedValue(true);

    const useCase = createVerifyTokenUseCase(deps);

    await expect(useCase.execute('token')).rejects.toMatchObject({
      errorCode: 'TOKEN_BLACKLISTED',
    });
  });

  it('should throw USER_NOT_FOUND when user does not exist', async () => {
    const deps = mockDeps();
    deps.userRepo.findById.mockResolvedValue(null);

    const useCase = createVerifyTokenUseCase(deps);

    await expect(useCase.execute('token')).rejects.toMatchObject({
      errorCode: 'USER_NOT_FOUND',
    });
  });

  it('should throw ACCOUNT_INACTIVE when user is deleted', async () => {
    const deps = mockDeps();
    deps.userRepo.findById.mockResolvedValue({
      id: 'user-1',
      deletedAt: new Date(),
    });

    const useCase = createVerifyTokenUseCase(deps);

    await expect(useCase.execute('token')).rejects.toMatchObject({
      errorCode: 'ACCOUNT_INACTIVE',
    });
  });
});

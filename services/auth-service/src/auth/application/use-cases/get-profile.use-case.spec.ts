import { createGetProfileUseCase } from './get-profile.use-case';

describe('GetProfile Use Case', () => {
  it('should return user profile', async () => {
    const userRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn().mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        name: 'Test',
        emailVerified: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        lastLogin: new Date('2024-01-03'),
      }),
      create: jest.fn(),
      updateLastLogin: jest.fn(),
      updateProfile: jest.fn(),
      softDelete: jest.fn(),
    };

    const useCase = createGetProfileUseCase({ userRepo });
    const result = await useCase.execute('user-1');

    expect(result.success).toBe(true);
    expect(result.data.email).toBe('a@b.com');
    expect(result.data.name).toBe('Test');
    expect(result.data.lastLogin).toBe('2024-01-03T00:00:00.000Z');
  });

  it('should throw USER_NOT_FOUND when user does not exist', async () => {
    const userRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      updateLastLogin: jest.fn(),
      updateProfile: jest.fn(),
      softDelete: jest.fn(),
    };

    const useCase = createGetProfileUseCase({ userRepo });

    await expect(useCase.execute('unknown')).rejects.toMatchObject({
      errorCode: 'USER_NOT_FOUND',
    });
  });

  it('should return null for lastLogin when never logged in', async () => {
    const userRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn().mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        name: 'Test',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null,
      }),
      create: jest.fn(),
      updateLastLogin: jest.fn(),
      updateProfile: jest.fn(),
      softDelete: jest.fn(),
    };

    const useCase = createGetProfileUseCase({ userRepo });
    const result = await useCase.execute('user-1');
    expect(result.data.lastLogin).toBeNull();
  });
});

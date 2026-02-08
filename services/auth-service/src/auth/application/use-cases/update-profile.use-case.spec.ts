import { createUpdateProfileUseCase } from './update-profile.use-case';

describe('UpdateProfile Use Case', () => {
  it('should update and return the profile', async () => {
    const userRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateLastLogin: jest.fn(),
      updateProfile: jest.fn().mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        name: 'New Name',
        updatedAt: new Date('2024-06-01'),
      }),
      softDelete: jest.fn(),
    };

    const useCase = createUpdateProfileUseCase({ userRepo });
    const result = await useCase.execute('user-1', 'New Name');

    expect(result.success).toBe(true);
    expect(result.data.name).toBe('New Name');
    expect(userRepo.updateProfile).toHaveBeenCalledWith('user-1', 'New Name');
  });

  it('should throw USER_NOT_FOUND when user does not exist', async () => {
    const userRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateLastLogin: jest.fn(),
      updateProfile: jest.fn().mockResolvedValue(null),
      softDelete: jest.fn(),
    };

    const useCase = createUpdateProfileUseCase({ userRepo });

    await expect(useCase.execute('unknown', 'Name')).rejects.toMatchObject({
      errorCode: 'USER_NOT_FOUND',
    });
  });
});

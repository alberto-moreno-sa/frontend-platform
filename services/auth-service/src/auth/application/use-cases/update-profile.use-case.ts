import { UserRepositoryPort } from '../ports/user-repository.port';
import { AppError } from '@common/errors/app-error';
import { ErrorCodes } from '@common/constants/error-codes';

interface UpdateProfileDeps {
  readonly userRepo: UserRepositoryPort;
}

export const createUpdateProfileUseCase = (deps: UpdateProfileDeps) => ({
  async execute(userId: string, name: string) {
    const user = await deps.userRepo.updateProfile(userId, name);
    if (!user) {
      throw AppError.fromErrorCode(ErrorCodes.USER_NOT_FOUND);
    }

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  },
});

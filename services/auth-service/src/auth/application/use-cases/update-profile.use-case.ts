import { UserRepositoryPort } from '../ports/user-repository.port';
import { AppError } from '@common/errors/app-error';
import { ErrorCodes } from '@common/constants/error-codes';
import { logger } from '@common/logger';

const log = logger.child({ component: 'UpdateProfile' });

interface UpdateProfileDeps {
  readonly userRepo: UserRepositoryPort;
}

export const createUpdateProfileUseCase = (deps: UpdateProfileDeps) => ({
  async execute(userId: string, name: string) {
    log.debug({ userId }, 'Updating profile');
    const user = await deps.userRepo.updateProfile(userId, name);
    if (!user) {
      throw AppError.fromErrorCode(ErrorCodes.USER_NOT_FOUND);
    }

    log.info({ userId }, 'Profile updated');

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

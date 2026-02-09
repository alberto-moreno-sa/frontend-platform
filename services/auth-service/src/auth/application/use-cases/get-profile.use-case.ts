import { UserRepositoryPort } from '../ports/user-repository.port';
import { AppError } from '@common/errors/app-error';
import { ErrorCodes } from '@common/constants/error-codes';
import { logger } from '@common/logger';

const log = logger.child({ component: 'GetProfile' });

interface GetProfileDeps {
  readonly userRepo: UserRepositoryPort;
}

export const createGetProfileUseCase = (deps: GetProfileDeps) => ({
  async execute(userId: string) {
    log.debug({ userId }, 'Fetching profile');
    const user = await deps.userRepo.findById(userId);
    if (!user) {
      throw AppError.fromErrorCode(ErrorCodes.USER_NOT_FOUND);
    }

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        lastLogin: user.lastLogin?.toISOString() || null,
      },
    };
  },
});

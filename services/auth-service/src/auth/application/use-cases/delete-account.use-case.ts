import { UserRepositoryPort } from '../ports/user-repository.port';
import { RefreshTokenRepositoryPort } from '../ports/refresh-token-repository.port';
import { SessionPort } from '../ports/session.port';
import { BlacklistPort } from '../ports/blacklist.port';
import { verifyPassword } from '@auth/domain/functions/verify-password.fn';
import { AppError } from '@common/errors/app-error';
import { ErrorCodes } from '@common/constants/error-codes';
import { AppConfig } from '@config';
import { logger } from '@common/logger';

const log = logger.child({ component: 'DeleteAccount' });

interface DeleteAccountDeps {
  readonly userRepo: UserRepositoryPort;
  readonly refreshTokenRepo: RefreshTokenRepositoryPort;
  readonly sessionService: SessionPort;
  readonly blacklist: BlacklistPort;
  readonly config: AppConfig;
}

export const createDeleteAccountUseCase = (deps: DeleteAccountDeps) => ({
  async execute(userId: string, jti: string, password: string) {
    const user = await deps.userRepo.findById(userId);
    if (!user) {
      throw AppError.fromErrorCode(ErrorCodes.USER_NOT_FOUND);
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw AppError.fromErrorCode(ErrorCodes.INVALID_CREDENTIALS);
    }

    // Soft delete
    await deps.userRepo.softDelete(userId);

    // Revoke all tokens and sessions
    await deps.refreshTokenRepo.revokeAllByUserId(userId, 'account_deleted');
    await deps.blacklist.add(jti, deps.config.accessTokenTtl);
    await deps.sessionService.deleteAllByUserId(userId);

    log.info({ userId }, 'Account deleted');

    return {
      success: true,
      data: { message: 'Account deleted successfully' },
    };
  },
});

import { TokenServicePort } from '../ports/token-service.port';
import { BlacklistPort } from '../ports/blacklist.port';
import { UserRepositoryPort } from '../ports/user-repository.port';
import { isActiveUser } from '@auth/domain/entities/user.entity';
import { AppError } from '@common/errors/app-error';
import { ErrorCodes } from '@common/constants/error-codes';

interface VerifyTokenDeps {
  readonly tokenService: TokenServicePort;
  readonly blacklist: BlacklistPort;
  readonly userRepo: UserRepositoryPort;
}

export const createVerifyTokenUseCase = (deps: VerifyTokenDeps) => ({
  async execute(token: string) {
    const payload = await deps.tokenService.verifyAccessToken(token);

    const jti = payload.jti as string;
    if (await deps.blacklist.isBlacklisted(jti)) {
      throw AppError.fromErrorCode(ErrorCodes.TOKEN_BLACKLISTED);
    }

    const userId = payload.user_id as string;
    const user = await deps.userRepo.findById(userId);
    if (!user) {
      throw AppError.fromErrorCode(ErrorCodes.USER_NOT_FOUND);
    }
    if (!isActiveUser(user)) {
      throw AppError.fromErrorCode(ErrorCodes.ACCOUNT_INACTIVE);
    }

    return {
      success: true,
      data: {
        valid: true,
        user_id: userId,
        email: payload.email,
        deviceId: payload.deviceId,
        expires_at: new Date((payload.exp as number) * 1000).toISOString(),
      },
    };
  },
});

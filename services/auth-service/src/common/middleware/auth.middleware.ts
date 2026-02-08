import { Request, Response, NextFunction } from 'express';
import { TokenServicePort } from '@auth/application/ports/token-service.port';
import { BlacklistPort } from '@auth/application/ports/blacklist.port';
import { UserRepositoryPort } from '@auth/application/ports/user-repository.port';
import { isActiveUser } from '@auth/domain/entities/user.entity';
import { AppError } from '../errors/app-error';
import { ErrorCodes } from '../constants/error-codes';

export interface AuthMiddlewareDeps {
  readonly tokenService: TokenServicePort;
  readonly blacklist: BlacklistPort;
  readonly userRepo: UserRepositoryPort;
}

/**
 * Multi-step authentication middleware pipeline:
 * 1. Extract Bearer token from Authorization header
 * 2. Verify JWT signature against all valid key pairs
 * 3. Check token blacklist (revoked/logged-out tokens)
 * 4. Validate user exists and is active
 * 5. Populate req.user with decoded claims
 */
export const createAuthMiddleware =
  (deps: AuthMiddlewareDeps) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        throw AppError.fromErrorCode(ErrorCodes.TOKEN_INVALID);
      }

      const token = authHeader.slice(7);
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

      req.user = {
        userId: payload.user_id as string,
        email: payload.email as string,
        deviceId: payload.deviceId as string,
        jti,
      };

      next();
    } catch (error) {
      if (error instanceof AppError) return next(error);
      if ((error as Error).message?.includes('expired')) {
        return next(AppError.fromErrorCode(ErrorCodes.TOKEN_EXPIRED));
      }
      next(AppError.fromErrorCode(ErrorCodes.TOKEN_INVALID));
    }
  };

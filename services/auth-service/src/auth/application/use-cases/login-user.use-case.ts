import { UserRepositoryPort } from '../ports/user-repository.port';
import { TokenServicePort } from '../ports/token-service.port';
import { RefreshTokenRepositoryPort } from '../ports/refresh-token-repository.port';
import { SessionPort } from '../ports/session.port';
import { verifyPassword } from '@auth/domain/functions/verify-password.fn';
import {
  createAccessTokenPayload,
  createRefreshTokenPayload,
} from '@auth/domain/functions/create-token.fn';
import { createRefreshToken } from '@auth/domain/entities/refresh-token.entity';
import { isActiveUser } from '@auth/domain/entities/user.entity';
import { DeviceInfo } from '@auth/domain/value-objects/device-info.vo';
import { AppError } from '@common/errors/app-error';
import { ErrorCodes } from '@common/constants/error-codes';
import { AppConfig } from '@config';
import { logger } from '@common/logger';
import { v4 as uuidv4 } from 'uuid';

const log = logger.child({ component: 'LoginUser' });

interface LoginUserDeps {
  readonly userRepo: UserRepositoryPort;
  readonly tokenService: TokenServicePort;
  readonly refreshTokenRepo: RefreshTokenRepositoryPort;
  readonly sessionService: SessionPort;
  readonly config: AppConfig;
}

/**
 * Authenticates a user by email/password and creates a new session.
 * Validates credentials → checks account is active → updates lastLogin →
 * signs access/refresh token pair → persists refresh token → creates session.
 */
export const createLoginUserUseCase = (deps: LoginUserDeps) => ({
  async execute(email: string, password: string, device: DeviceInfo) {
    log.debug({ email }, 'Login attempt');

    const user = await deps.userRepo.findByEmail(email);
    if (!user) {
      throw AppError.fromErrorCode(ErrorCodes.INVALID_CREDENTIALS);
    }

    if (!isActiveUser(user)) {
      throw AppError.fromErrorCode(ErrorCodes.ACCOUNT_INACTIVE);
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw AppError.fromErrorCode(ErrorCodes.INVALID_CREDENTIALS);
    }

    await deps.userRepo.updateLastLogin(user.id);

    const accessPayload = createAccessTokenPayload(
      user.id,
      user.email,
      device.deviceId,
      deps.config.issuerUrl,
      deps.config.audience,
    );
    const refreshPayload = createRefreshTokenPayload(
      user.id,
      device.deviceId,
      deps.config.issuerUrl,
    );

    const [accessToken, refreshToken] = await Promise.all([
      deps.tokenService.signAccessToken(accessPayload),
      deps.tokenService.signRefreshToken(refreshPayload),
    ]);

    const refreshTokenData = createRefreshToken({
      jti: refreshPayload.jti,
      userId: user.id,
      deviceId: device.deviceId,
      ipAddress: device.ipAddress,
      userAgent: device.userAgent,
      expiresInSeconds: deps.config.refreshTokenTtl,
      parentJti: null,
      rotationCount: 0,
    });
    await deps.refreshTokenRepo.create(refreshTokenData);

    const sessionId = `sess-${uuidv4()}`;
    await deps.sessionService.create(user.id, sessionId, {
      userId: user.id,
      deviceId: device.deviceId,
      ipAddress: device.ipAddress,
      userAgent: device.userAgent,
      createdAt: String(Math.floor(Date.now() / 1000)),
      lastActivity: String(Math.floor(Date.now() / 1000)),
      refreshTokenJti: refreshPayload.jti,
      rotationCount: '0',
    });

    log.info({ userId: user.id }, 'Login successful');

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          lastLogin: new Date().toISOString(),
        },
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: deps.config.accessTokenTtl,
      },
    };
  },
});

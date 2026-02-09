import { TokenServicePort } from '../ports/token-service.port';
import { RefreshTokenRepositoryPort } from '../ports/refresh-token-repository.port';
import { SessionPort } from '../ports/session.port';
import { BlacklistPort } from '../ports/blacklist.port';
import { UserRepositoryPort } from '../ports/user-repository.port';
import {
  createAccessTokenPayload,
  createRefreshTokenPayload,
} from '@auth/domain/functions/create-token.fn';
import { createRefreshToken, wasRotated } from '@auth/domain/entities/refresh-token.entity';
import { isActiveUser } from '@auth/domain/entities/user.entity';
import { AppError } from '@common/errors/app-error';
import { ErrorCodes } from '@common/constants/error-codes';
import { AppConfig } from '@config';
import { logger } from '@common/logger';

const log = logger.child({ component: 'RefreshToken' });

interface RefreshTokenDeps {
  readonly tokenService: TokenServicePort;
  readonly refreshTokenRepo: RefreshTokenRepositoryPort;
  readonly sessionService: SessionPort;
  readonly blacklist: BlacklistPort;
  readonly userRepo: UserRepositoryPort;
  readonly config: AppConfig;
}

/**
 * Handles refresh token rotation with token-family theft detection.
 *
 * Flow: verify JWT → check reuse (if already rotated, revoke entire family) →
 * validate expiry and user status → rotate (revoke old + issue new pair) →
 * update session reference.
 *
 * The parentJti chain links each rotated token to its predecessor, enabling
 * full-family revocation when a stolen token is replayed.
 */
export const createRefreshTokenUseCase = (deps: RefreshTokenDeps) => ({
  async execute(refreshTokenJwt: string) {
    const payload = await deps.tokenService.verifyRefreshToken(refreshTokenJwt);
    const jti = payload.jti as string;
    const userId = payload.user_id as string;
    const deviceId = payload.deviceId as string;

    const storedToken = await deps.refreshTokenRepo.findByJti(jti);
    if (!storedToken) {
      throw AppError.fromErrorCode(ErrorCodes.TOKEN_INVALID);
    }

    // Token family detection - check if already rotated (reuse attack)
    if (wasRotated(storedToken)) {
      log.warn({ userId, jti }, 'Token reuse detected — revoking entire token family');
      // Revoke entire token family
      const rootJti = storedToken.parentJti || storedToken.jti;
      const familyTokens = await deps.refreshTokenRepo.findByParentJtiChain(rootJti);
      for (const token of familyTokens) {
        await deps.refreshTokenRepo.revoke(token.jti, 'token_theft_detected');
      }
      await deps.refreshTokenRepo.revoke(rootJti, 'token_theft_detected');
      await deps.sessionService.deleteAllByUserId(userId);
      throw AppError.fromErrorCode(ErrorCodes.TOKEN_REUSE_DETECTED);
    }

    if (storedToken.revokedAt !== null) {
      throw AppError.fromErrorCode(ErrorCodes.TOKEN_REVOKED);
    }

    if (storedToken.expiresAt < new Date()) {
      throw AppError.fromErrorCode(ErrorCodes.TOKEN_EXPIRED);
    }

    const user = await deps.userRepo.findById(userId);
    if (!user || !isActiveUser(user)) {
      throw AppError.fromErrorCode(ErrorCodes.ACCOUNT_INACTIVE);
    }

    // Rotate: revoke old, create new
    await deps.refreshTokenRepo.revoke(jti, 'rotation');

    const newAccessPayload = createAccessTokenPayload(
      userId,
      user.email,
      deviceId,
      deps.config.issuerUrl,
      deps.config.audience,
    );
    const newRefreshPayload = createRefreshTokenPayload(userId, deviceId, deps.config.issuerUrl);

    const [newAccessToken, newRefreshToken] = await Promise.all([
      deps.tokenService.signAccessToken(newAccessPayload),
      deps.tokenService.signRefreshToken(newRefreshPayload),
    ]);

    const newRefreshTokenData = createRefreshToken({
      jti: newRefreshPayload.jti,
      userId,
      deviceId,
      ipAddress: storedToken.ipAddress,
      userAgent: storedToken.userAgent,
      expiresInSeconds: deps.config.refreshTokenTtl,
      parentJti: jti,
      rotationCount: storedToken.rotationCount + 1,
    });
    await deps.refreshTokenRepo.create(newRefreshTokenData);

    // Update session with new token reference
    const sessions = await deps.sessionService.findAllByUserId(userId);
    const matchingSession = sessions.find((s) => s.data.refreshTokenJti === jti);
    if (matchingSession) {
      await deps.sessionService.update(userId, matchingSession.sessionId, {
        refreshTokenJti: newRefreshPayload.jti,
        lastActivity: String(Math.floor(Date.now() / 1000)),
        rotationCount: String(storedToken.rotationCount + 1),
      });
    }

    log.info({ userId }, 'Token refreshed');

    return {
      success: true,
      data: {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: deps.config.accessTokenTtl,
      },
    };
  },
});

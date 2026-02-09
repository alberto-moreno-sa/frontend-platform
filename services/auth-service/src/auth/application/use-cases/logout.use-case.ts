import { RefreshTokenRepositoryPort } from '../ports/refresh-token-repository.port';
import { SessionPort } from '../ports/session.port';
import { BlacklistPort } from '../ports/blacklist.port';
import { AuthenticatedUser } from '@common/types';
import { AppConfig } from '@config';
import { logger } from '@common/logger';

const log = logger.child({ component: 'Logout' });

interface LogoutDeps {
  readonly refreshTokenRepo: RefreshTokenRepositoryPort;
  readonly sessionService: SessionPort;
  readonly blacklist: BlacklistPort;
  readonly config: AppConfig;
}

export const createLogoutUseCase = (deps: LogoutDeps) => ({
  async execute(currentUser: AuthenticatedUser) {
    const storedTokens = await deps.refreshTokenRepo.findActiveByUserId(currentUser.userId);

    // Blacklist the current access token
    await deps.blacklist.add(currentUser.jti, deps.config.accessTokenTtl);

    // Find and revoke the refresh token
    for (const token of storedTokens) {
      // Revoke matching device tokens
      if (token.deviceId === currentUser.deviceId) {
        await deps.refreshTokenRepo.revoke(token.jti, 'logout');
      }
    }

    // Delete the session
    const sessions = await deps.sessionService.findAllByUserId(currentUser.userId);
    const matchingSession = sessions.find((s) => s.data.deviceId === currentUser.deviceId);
    if (matchingSession) {
      await deps.sessionService.delete(currentUser.userId, matchingSession.sessionId);
    }

    log.info({ userId: currentUser.userId }, 'User logged out');

    return {
      success: true,
      data: { message: 'Logged out successfully' },
    };
  },
});

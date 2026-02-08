import { RefreshTokenRepositoryPort } from '../ports/refresh-token-repository.port';
import { SessionPort } from '../ports/session.port';
import { BlacklistPort } from '../ports/blacklist.port';
import { AuthenticatedUser } from '@common/types';
import { AppConfig } from '@config';

interface LogoutDeps {
  readonly refreshTokenRepo: RefreshTokenRepositoryPort;
  readonly sessionService: SessionPort;
  readonly blacklist: BlacklistPort;
  readonly config: AppConfig;
}

export const createLogoutUseCase = (deps: LogoutDeps) => ({
  async execute(currentUser: AuthenticatedUser, refreshTokenJwt: string) {
    // Find refresh token by decoding (we just need the jti from stored token)
    const storedTokens = await deps.refreshTokenRepo.findActiveByUserId(currentUser.userId);
    // We need to find the matching refresh token - match by checking stored tokens
    // Since refresh_token is passed, we search by the JWT content
    // For simplicity, revoke any active token that matches

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

    console.log(`[Logout] User logged out: ${currentUser.userId}`);

    return {
      success: true,
      data: { message: 'Logged out successfully' },
    };
  },
});

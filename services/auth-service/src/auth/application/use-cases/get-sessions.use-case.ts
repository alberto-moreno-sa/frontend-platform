import { RefreshTokenRepositoryPort } from '../ports/refresh-token-repository.port';
import { SessionPort } from '../ports/session.port';

interface GetSessionsDeps {
  readonly refreshTokenRepo: RefreshTokenRepositoryPort;
  readonly sessionService: SessionPort;
}

export const createGetSessionsUseCase = (deps: GetSessionsDeps) => ({
  async execute(userId: string, currentDeviceId: string) {
    const activeTokens = await deps.refreshTokenRepo.findActiveByUserId(userId);
    const redisSessions = await deps.sessionService.findAllByUserId(userId);

    const sessions = activeTokens.map((token) => {
      const redisSession = redisSessions.find((s) => s.data.refreshTokenJti === token.jti);

      return {
        sessionId: redisSession?.sessionId || token.id,
        deviceId: token.deviceId,
        ipAddress: token.ipAddress,
        userAgent: token.userAgent,
        createdAt: token.issuedAt.toISOString(),
        lastActivity: redisSession?.data.lastActivity
          ? new Date(parseInt(redisSession.data.lastActivity) * 1000).toISOString()
          : token.issuedAt.toISOString(),
        current: token.deviceId === currentDeviceId,
      };
    });

    return {
      success: true,
      data: { sessions },
    };
  },
});

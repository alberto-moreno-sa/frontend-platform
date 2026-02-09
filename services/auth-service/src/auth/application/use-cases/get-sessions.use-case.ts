import { RefreshTokenRepositoryPort } from '../ports/refresh-token-repository.port';
import { SessionPort } from '../ports/session.port';
import { logger } from '@common/logger';

const log = logger.child({ component: 'GetSessions' });

interface GetSessionsDeps {
  readonly refreshTokenRepo: RefreshTokenRepositoryPort;
  readonly sessionService: SessionPort;
}

export const createGetSessionsUseCase = (deps: GetSessionsDeps) => ({
  async execute(userId: string, currentDeviceId: string) {
    log.debug({ userId }, 'Fetching sessions');
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

    log.debug({ userId, count: sessions.length }, 'Sessions fetched');

    return {
      success: true,
      data: { sessions },
    };
  },
});

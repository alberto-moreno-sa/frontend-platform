import Redis from 'ioredis';
import { BlacklistPort } from '@auth/application/ports/blacklist.port';
import { logger } from '@common/logger';

const log = logger.child({ component: 'Blacklist' });

export const createRedisBlacklistAdapter = (redis: Redis): BlacklistPort => ({
  async add(jti, ttlSeconds) {
    if (ttlSeconds > 0) {
      log.debug({ jti, ttlSeconds }, 'Blacklisting token');
      await redis.setex(`blacklist:${jti}`, ttlSeconds, 'revoked');
    }
  },

  async isBlacklisted(jti) {
    const result = await redis.exists(`blacklist:${jti}`);
    return result === 1;
  },
});

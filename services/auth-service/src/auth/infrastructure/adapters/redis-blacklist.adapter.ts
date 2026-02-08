import Redis from 'ioredis';
import { BlacklistPort } from '@auth/application/ports/blacklist.port';

export const createRedisBlacklistAdapter = (redis: Redis): BlacklistPort => ({
  async add(jti, ttlSeconds) {
    if (ttlSeconds > 0) {
      await redis.setex(`blacklist:${jti}`, ttlSeconds, 'revoked');
    }
  },

  async isBlacklisted(jti) {
    const result = await redis.exists(`blacklist:${jti}`);
    return result === 1;
  },
});

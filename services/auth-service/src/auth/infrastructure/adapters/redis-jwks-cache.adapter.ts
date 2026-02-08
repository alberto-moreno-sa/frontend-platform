import Redis from 'ioredis';
import { JwksCachePort } from '@auth/application/ports/jwks-cache.port';

const JWKS_KEY = 'jwks:public_keys';

export const createRedisJwksCacheAdapter = (redis: Redis): JwksCachePort => ({
  async get() {
    return redis.get(JWKS_KEY);
  },

  async set(jwksJson, ttlSeconds) {
    await redis.setex(JWKS_KEY, ttlSeconds, jwksJson);
  },

  async invalidate() {
    await redis.del(JWKS_KEY);
  },
});

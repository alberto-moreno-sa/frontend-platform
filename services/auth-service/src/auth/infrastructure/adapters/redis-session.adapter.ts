import Redis from 'ioredis';
import { SessionPort, SessionData } from '@auth/application/ports/session.port';

const SESSION_TTL = 604800; // 7 days

export const createRedisSessionAdapter = (redis: Redis): SessionPort => {
  const key = (userId: string, sessionId: string): string => `sessions:${userId}:${sessionId}`;

  return {
    async create(userId, sessionId, data) {
      const k = key(userId, sessionId);
      await redis.hset(k, data as unknown as Record<string, string>);
      await redis.expire(k, SESSION_TTL);
    },

    async get(userId, sessionId) {
      const data = await redis.hgetall(key(userId, sessionId));
      if (!data || Object.keys(data).length === 0) return null;
      return data as unknown as SessionData;
    },

    async update(userId, sessionId, fields) {
      const k = key(userId, sessionId);
      await redis.hset(k, fields as unknown as Record<string, string>);
    },

    async delete(userId, sessionId) {
      await redis.del(key(userId, sessionId));
    },

    async deleteAllByUserId(userId) {
      const pattern = `sessions:${userId}:*`;
      const keys = await redis.keys(pattern);
      if (keys.length === 0) return 0;
      return redis.del(...keys);
    },

    async findAllByUserId(userId) {
      const pattern = `sessions:${userId}:*`;
      const keys = await redis.keys(pattern);
      const sessions: Array<{ sessionId: string; data: SessionData }> = [];

      for (const k of keys) {
        const data = await redis.hgetall(k);
        if (data && Object.keys(data).length > 0) {
          const sessionId = k.split(':').pop()!;
          sessions.push({ sessionId, data: data as unknown as SessionData });
        }
      }

      return sessions;
    },
  };
};

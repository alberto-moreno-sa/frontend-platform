import request from 'supertest';
import mongoose from 'mongoose';
import { createTestApp } from '../../../__tests__/helpers/create-test-app';

describe('Health Routes (Integration)', () => {
  describe('GET /health', () => {
    it('should return healthy status when all services are up', async () => {
      const mockRedis = { ping: jest.fn().mockResolvedValue('PONG') };
      const mockDb = { admin: () => ({ ping: jest.fn().mockResolvedValue({ ok: 1 }) }) };
      jest.spyOn(mongoose, 'connection', 'get').mockReturnValue({ db: mockDb } as any);

      const { app } = createTestApp({ redis: mockRedis });

      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body).toHaveProperty('checks');
    });

    it('should return 503 when MongoDB is down', async () => {
      const mockRedis = { ping: jest.fn().mockResolvedValue('PONG') };
      const mockDb = { admin: () => ({ ping: jest.fn().mockRejectedValue(new Error('down')) }) };
      jest.spyOn(mongoose, 'connection', 'get').mockReturnValue({ db: mockDb } as any);

      const { app } = createTestApp({ redis: mockRedis });

      const res = await request(app).get('/health');

      expect(res.status).toBe(503);
      expect(res.body.status).toBe('unhealthy');
    });
  });
});

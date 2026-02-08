import request from 'supertest';
import mongoose from 'mongoose';
import { createTestApp } from '../../../__tests__/helpers/create-test-app';

describe('Health Routes (Integration)', () => {
  const originalDescriptor = Object.getOwnPropertyDescriptor(
    mongoose.connection,
    'readyState',
  );

  afterEach(() => {
    if (originalDescriptor) {
      Object.defineProperty(mongoose.connection, 'readyState', originalDescriptor);
    }
  });

  describe('GET /api/health', () => {
    it('should return health status with broker and SSE info', async () => {
      Object.defineProperty(mongoose.connection, 'readyState', { value: 1, configurable: true });
      const sseEmitter = { getClientCount: jest.fn().mockReturnValue(3), addClient: jest.fn(), removeClient: jest.fn(), emit: jest.fn() };

      const { app } = createTestApp({ sseEmitter, brokerType: 'memory' });

      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.service).toBe('tracking');
      expect(res.body.broker.type).toBe('memory');
      expect(res.body.sseClients).toBe(3);
      expect(res.body).toHaveProperty('timestamp');
    });

    it('should return 503 when MongoDB is disconnected', async () => {
      Object.defineProperty(mongoose.connection, 'readyState', { value: 0, configurable: true });

      const { app } = createTestApp();

      const res = await request(app).get('/api/health');

      expect(res.status).toBe(503);
      expect(res.body.status).toBe('unhealthy');
    });
  });
});

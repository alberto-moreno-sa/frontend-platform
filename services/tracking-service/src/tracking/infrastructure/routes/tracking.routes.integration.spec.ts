import request from 'supertest';
import { createTestApp } from '../../../__tests__/helpers/create-test-app';

const validEvent = {
  componentName: 'Button',
  variant: 'primary',
  action: 'click',
  timestamp: new Date().toISOString(),
  sessionId: 'session-1',
  pageUrl: '/home',
};

describe('Tracking Routes (Integration)', () => {
  describe('POST /api/components/track', () => {
    it('should accept a valid tracking event with 202', async () => {
      const { app, useCases } = createTestApp();

      const res = await request(app)
        .post('/api/components/track')
        .send(validEvent);

      expect(res.status).toBe(202);
      expect(res.body).toHaveProperty('eventId');
      expect(useCases.trackComponent).toHaveBeenCalled();
    });

    it('should return 400 for missing required fields', async () => {
      const { app } = createTestApp();

      const res = await request(app)
        .post('/api/components/track')
        .send({ componentName: 'Button' });

      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid action type', async () => {
      const { app } = createTestApp();

      const res = await request(app)
        .post('/api/components/track')
        .send({ ...validEvent, action: 'invalid-action' });

      expect(res.status).toBe(400);
    });
  });
});

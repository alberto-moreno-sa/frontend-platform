import request from 'supertest';
import { createTestApp } from '../../../__tests__/helpers/create-test-app';

describe('Stats Routes (Integration)', () => {
  describe('GET /api/components/stats', () => {
    it('should return stats with 200', async () => {
      const { app, useCases } = createTestApp();

      const res = await request(app).get('/api/components/stats');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalEvents');
      expect(useCases.getStats).toHaveBeenCalled();
    });

    it('should pass query filters to use-case', async () => {
      const { app, useCases } = createTestApp();
      const from = '2025-01-01T00:00:00Z';

      const res = await request(app)
        .get(`/api/components/stats?from=${from}&component=Button`);

      expect(res.status).toBe(200);
      const callArgs = useCases.getStats.mock.calls[0][0];
      expect(callArgs.component).toBe('Button');
      expect(callArgs.from).toBeInstanceOf(Date);
    });

    it('should return 400 for invalid datetime format', async () => {
      const { app } = createTestApp();

      const res = await request(app)
        .get('/api/components/stats?from=not-a-date');

      expect(res.status).toBe(400);
    });
  });
});

import request from 'supertest';
import { createTestApp, createMockUseCases, rejectAuthMiddleware } from '../../../__tests__/helpers/create-test-app';

describe('Export Routes (Integration)', () => {
  describe('GET /api/components/export', () => {
    it('should export JSON data for authenticated user', async () => {
      const { app, useCases } = createTestApp();

      const res = await request(app)
        .get('/api/components/export')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/application\/json/);
      expect(res.headers['content-disposition']).toMatch(/attachment/);
      expect(useCases.exportData).toHaveBeenCalled();
    });

    it('should export CSV data when format=csv', async () => {
      const useCases = createMockUseCases();
      useCases.exportData.mockResolvedValue({
        data: 'componentName,action\nButton,click',
        contentType: 'text/csv',
        filename: 'export.csv',
      });

      const { app } = createTestApp({ useCases });

      const res = await request(app)
        .get('/api/components/export?format=csv')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/text\/csv/);
      expect(res.text).toContain('componentName');
    });

    it('should return 401 without authentication', async () => {
      const { app } = createTestApp({ authMiddleware: rejectAuthMiddleware });

      const res = await request(app).get('/api/components/export');

      expect(res.status).toBe(401);
    });

    it('should return 400 for invalid format', async () => {
      const { app } = createTestApp();

      const res = await request(app)
        .get('/api/components/export?format=xml')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(400);
    });
  });
});

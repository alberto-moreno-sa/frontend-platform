import request from 'supertest';
import { createTestApp, createMockUseCases, rejectAuthMiddleware } from '../../../__tests__/helpers/create-test-app';

describe('User Routes (Integration)', () => {
  describe('GET /api/user/profile', () => {
    it('should return profile for authenticated user', async () => {
      const { app, useCases } = createTestApp();

      const res = await request(app)
        .get('/api/user/profile')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('userId');
      expect(useCases.getProfile.execute).toHaveBeenCalledWith('user-1');
    });

    it('should return 401 without auth', async () => {
      const { app } = createTestApp({ authMiddleware: rejectAuthMiddleware });

      const res = await request(app).get('/api/user/profile');

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/user/profile', () => {
    it('should update profile with valid name', async () => {
      const { app, useCases } = createTestApp();

      const res = await request(app)
        .put('/api/user/profile')
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'Updated Name' });

      expect(res.status).toBe(200);
      expect(useCases.updateProfile.execute).toHaveBeenCalledWith('user-1', 'Updated Name');
    });

    it('should return 400 for name too short', async () => {
      const { app } = createTestApp();

      const res = await request(app)
        .put('/api/user/profile')
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'A' });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/user/account', () => {
    it('should delete account with password confirmation', async () => {
      const { app, useCases } = createTestApp();

      const res = await request(app)
        .delete('/api/user/account')
        .set('Authorization', 'Bearer valid-token')
        .send({ password: 'MyPassword1' });

      expect(res.status).toBe(200);
      expect(useCases.deleteAccount.execute).toHaveBeenCalledWith('user-1', 'jti-1', 'MyPassword1');
    });

    it('should return 400 when password is missing', async () => {
      const { app } = createTestApp();

      const res = await request(app)
        .delete('/api/user/account')
        .set('Authorization', 'Bearer valid-token')
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/user/sessions', () => {
    it('should return sessions for authenticated user', async () => {
      const { app, useCases } = createTestApp();

      const res = await request(app)
        .get('/api/user/sessions')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(useCases.getSessions.execute).toHaveBeenCalledWith('user-1', 'device-1');
    });
  });
});

import request from 'supertest';
import { createTestApp, rejectAuthMiddleware } from '../../../__tests__/helpers/create-test-app';

describe('Auth Routes (Integration)', () => {
  describe('POST /api/auth/register', () => {
    it('should register a user and return 201', async () => {
      const { app, useCases } = createTestApp();
      useCases.registerUser.execute.mockResolvedValue({
        success: true,
        data: { accessToken: 'at', refreshToken: 'rt' },
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'new@example.com', password: 'Pass123x', name: 'John' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(useCases.registerUser.execute).toHaveBeenCalled();
    });

    it('should return 400 for invalid email', async () => {
      const { app } = createTestApp();

      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'bad-email', password: 'Pass123x', name: 'John' });

      expect(res.status).toBe(400);
    });

    it('should return 400 for weak password', async () => {
      const { app } = createTestApp();

      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'ok@email.com', password: '123', name: 'John' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login and return tokens', async () => {
      const { app, useCases } = createTestApp();

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'Pass123x' });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(useCases.loginUser.execute).toHaveBeenCalled();
    });

    it('should return 400 when password is missing', async () => {
      const { app } = createTestApp();

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh tokens', async () => {
      const { app, useCases } = createTestApp();

      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refresh_token: 'valid-rt' });

      expect(res.status).toBe(200);
      expect(useCases.refreshToken.execute).toHaveBeenCalledWith('valid-rt');
    });

    it('should return 400 when refresh_token is missing', async () => {
      const { app } = createTestApp();

      const res = await request(app)
        .post('/api/auth/refresh')
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout authenticated user', async () => {
      const { app, useCases } = createTestApp();

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(useCases.logout.execute).toHaveBeenCalled();
    });

    it('should return 401 without auth token', async () => {
      const { app } = createTestApp({ authMiddleware: rejectAuthMiddleware });

      const res = await request(app).post('/api/auth/logout');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/verify-token', () => {
    it('should verify token from Authorization header', async () => {
      const { app, useCases } = createTestApp();

      const res = await request(app)
        .post('/api/auth/verify-token')
        .set('Authorization', 'Bearer some-token');

      expect(res.status).toBe(200);
      expect(useCases.verifyToken.execute).toHaveBeenCalledWith('some-token');
    });
  });
});

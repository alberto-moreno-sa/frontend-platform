import request from 'supertest';
import { createTestApp } from '../../../__tests__/helpers/create-test-app';

describe('JWKS Routes (Integration)', () => {
  describe('GET /.well-known/jwks.json', () => {
    it('should return JWKS public keys', async () => {
      const { app, useCases } = createTestApp();

      const res = await request(app).get('/.well-known/jwks.json');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('keys');
      expect(Array.isArray(res.body.keys)).toBe(true);
      expect(useCases.getJwks.execute).toHaveBeenCalled();
    });
  });
});

import {
  createRefreshToken,
  wasRotated,
  RefreshTokenEntity,
} from './refresh-token.entity';

describe('RefreshToken Entity', () => {
  describe('createRefreshToken', () => {
    it('should create a token with correct fields', () => {
      const token = createRefreshToken({
        jti: 'jti-1',
        userId: 'user-1',
        deviceId: 'device-1',
        ipAddress: '127.0.0.1',
        userAgent: 'jest',
        expiresInSeconds: 3600,
        parentJti: null,
        rotationCount: 0,
      });

      expect(token.jti).toBe('jti-1');
      expect(token.userId).toBe('user-1');
      expect(token.revokedAt).toBeNull();
      expect(token.revokedReason).toBeNull();
      expect(token.rotationCount).toBe(0);
      expect(token.parentJti).toBeNull();
      expect(token.issuedAt).toBeInstanceOf(Date);
      expect(token.expiresAt).toBeInstanceOf(Date);
    });

    it('should set expiresAt relative to now', () => {
      const before = Date.now();
      const token = createRefreshToken({
        jti: 'jti-1',
        userId: 'u',
        deviceId: 'd',
        ipAddress: '0.0.0.0',
        userAgent: '',
        expiresInSeconds: 60,
        parentJti: null,
        rotationCount: 0,
      });
      const after = Date.now();

      const expectedMin = before + 60 * 1000;
      const expectedMax = after + 60 * 1000;
      expect(token.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedMin);
      expect(token.expiresAt.getTime()).toBeLessThanOrEqual(expectedMax);
    });

    it('should preserve parentJti and rotationCount', () => {
      const token = createRefreshToken({
        jti: 'jti-2',
        userId: 'u',
        deviceId: 'd',
        ipAddress: '0.0.0.0',
        userAgent: '',
        expiresInSeconds: 60,
        parentJti: 'jti-1',
        rotationCount: 3,
      });

      expect(token.parentJti).toBe('jti-1');
      expect(token.rotationCount).toBe(3);
    });
  });

  const makeToken = (overrides: Partial<RefreshTokenEntity> = {}): RefreshTokenEntity => ({
    id: '1',
    jti: 'jti-1',
    userId: 'user-1',
    deviceId: 'device-1',
    ipAddress: '127.0.0.1',
    userAgent: 'jest',
    issuedAt: new Date(),
    expiresAt: new Date(Date.now() + 3600 * 1000),
    revokedAt: null,
    revokedReason: null,
    rotationCount: 0,
    parentJti: null,
    ...overrides,
  });

  describe('wasRotated', () => {
    it('should return true when revoked with rotation reason', () => {
      expect(
        wasRotated(makeToken({ revokedAt: new Date(), revokedReason: 'rotation' })),
      ).toBe(true);
    });

    it('should return false when revoked for another reason', () => {
      expect(
        wasRotated(makeToken({ revokedAt: new Date(), revokedReason: 'logout' })),
      ).toBe(false);
    });

    it('should return false when not revoked', () => {
      expect(wasRotated(makeToken())).toBe(false);
    });
  });
});

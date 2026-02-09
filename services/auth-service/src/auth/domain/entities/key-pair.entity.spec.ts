import { createKeyPair } from './key-pair.entity';

describe('KeyPair Entity', () => {
  describe('createKeyPair', () => {
    it('should create a key pair with active status', () => {
      const kp = createKeyPair({
        kid: 'kid-1',
        publicKey: { kty: 'EC', crv: 'P-256', x: 'x', y: 'y' },
        privateKeyEncrypted: 'encrypted',
      });

      expect(kp.kid).toBe('kid-1');
      expect(kp.algorithm).toBe('ES256');
      expect(kp.status).toBe('active');
      expect(kp.rotatedAt).toBeNull();
      expect(kp.createdAt).toBeInstanceOf(Date);
      expect(kp.publicKey).toEqual({ kty: 'EC', crv: 'P-256', x: 'x', y: 'y' });
    });
  });

});

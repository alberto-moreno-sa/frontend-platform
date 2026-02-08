import { hashPassword } from './hash-password.fn';
import { verifyPassword } from './verify-password.fn';

describe('hashPassword', () => {
  it('should return a bcrypt hash', async () => {
    const hash = await hashPassword('MyPassword123');
    expect(hash).toMatch(/^\$2[aby]\$/);
    expect(hash.length).toBeGreaterThan(50);
  });

  it('should produce different hashes for the same password', async () => {
    const h1 = await hashPassword('Same');
    const h2 = await hashPassword('Same');
    expect(h1).not.toBe(h2);
  });

  it('should be verifiable with verifyPassword', async () => {
    const hash = await hashPassword('Test123');
    const result = await verifyPassword('Test123', hash);
    expect(result).toBe(true);
  });
});

import { verifyPassword } from './verify-password.fn';
import { hashPassword } from './hash-password.fn';

describe('verifyPassword', () => {
  it('should return true for matching password', async () => {
    const hash = await hashPassword('Correct123');
    expect(await verifyPassword('Correct123', hash)).toBe(true);
  });

  it('should return false for wrong password', async () => {
    const hash = await hashPassword('Correct123');
    expect(await verifyPassword('Wrong456', hash)).toBe(false);
  });
});

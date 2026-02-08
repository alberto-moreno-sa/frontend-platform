import { loginSchema } from './login.schema';

describe('loginSchema', () => {
  it('should accept valid input', async () => {
    const result = await loginSchema.parseAsync({
      email: 'a@b.com',
      password: 'pass',
    });
    expect(result.email).toBe('a@b.com');
  });

  it('should accept optional deviceId', async () => {
    const result = await loginSchema.parseAsync({
      email: 'a@b.com',
      password: 'pass',
      deviceId: 'dev-1',
    });
    expect(result.deviceId).toBe('dev-1');
  });

  it('should reject invalid email', async () => {
    await expect(
      loginSchema.parseAsync({ email: 'bad', password: 'pass' }),
    ).rejects.toThrow();
  });

  it('should reject empty password', async () => {
    await expect(
      loginSchema.parseAsync({ email: 'a@b.com', password: '' }),
    ).rejects.toThrow();
  });
});

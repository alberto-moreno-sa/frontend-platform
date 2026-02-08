import { registerSchema } from './register.schema';

describe('registerSchema', () => {
  it('should accept valid input', async () => {
    const result = await registerSchema.parseAsync({
      email: 'User@Example.COM',
      password: 'Password1',
      name: 'John Doe',
    });

    expect(result.email).toBe('user@example.com');
    expect(result.name).toBe('John Doe');
  });

  it('should reject invalid email', async () => {
    await expect(
      registerSchema.parseAsync({ email: 'invalid', password: 'Password1', name: 'Jo' }),
    ).rejects.toThrow();
  });

  it('should reject short password', async () => {
    await expect(
      registerSchema.parseAsync({ email: 'a@b.com', password: 'Abc1', name: 'Jo' }),
    ).rejects.toThrow();
  });

  it('should reject password without uppercase', async () => {
    await expect(
      registerSchema.parseAsync({ email: 'a@b.com', password: 'password1', name: 'Jo' }),
    ).rejects.toThrow();
  });

  it('should reject password without number', async () => {
    await expect(
      registerSchema.parseAsync({ email: 'a@b.com', password: 'Passworddd', name: 'Jo' }),
    ).rejects.toThrow();
  });

  it('should reject short name', async () => {
    await expect(
      registerSchema.parseAsync({ email: 'a@b.com', password: 'Password1', name: 'J' }),
    ).rejects.toThrow();
  });

  it('should reject name over 100 characters', async () => {
    await expect(
      registerSchema.parseAsync({
        email: 'a@b.com',
        password: 'Password1',
        name: 'A'.repeat(101),
      }),
    ).rejects.toThrow();
  });
});

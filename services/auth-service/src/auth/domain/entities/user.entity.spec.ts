import { createUser, isActiveUser, UserEntity } from './user.entity';

describe('User Entity', () => {
  describe('createUser', () => {
    it('should create a user with normalized email', () => {
      const user = createUser({
        email: '  Test@Example.COM  ',
        passwordHash: 'hashed',
        name: 'John',
      });

      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('John');
      expect(user.passwordHash).toBe('hashed');
    });

    it('should set default values', () => {
      const user = createUser({
        email: 'a@b.com',
        passwordHash: 'h',
        name: 'A',
      });

      expect(user.emailVerified).toBe(false);
      expect(user.lastLogin).toBeNull();
      expect(user.deletedAt).toBeNull();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('isActiveUser', () => {
    const base: UserEntity = {
      id: '1',
      email: 'a@b.com',
      passwordHash: 'h',
      name: 'A',
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
      deletedAt: null,
    };

    it('should return true when deletedAt is null', () => {
      expect(isActiveUser(base)).toBe(true);
    });

    it('should return false when deletedAt is set', () => {
      expect(isActiveUser({ ...base, deletedAt: new Date() })).toBe(false);
    });
  });
});

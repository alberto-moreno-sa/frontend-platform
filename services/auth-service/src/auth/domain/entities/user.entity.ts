export interface UserEntity {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly name: string;
  readonly emailVerified: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly lastLogin: Date | null;
  readonly deletedAt: Date | null;
}

export interface CreateUserInput {
  readonly email: string;
  readonly passwordHash: string;
  readonly name: string;
}

export const createUser = (input: CreateUserInput): Omit<UserEntity, 'id'> => ({
  email: input.email.toLowerCase().trim(),
  passwordHash: input.passwordHash,
  name: input.name,
  emailVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLogin: null,
  deletedAt: null,
});

export const isActiveUser = (user: UserEntity): boolean => user.deletedAt === null;

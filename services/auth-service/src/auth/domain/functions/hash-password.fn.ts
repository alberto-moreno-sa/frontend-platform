import * as bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export const hashPassword = async (plainText: string): Promise<string> =>
  bcrypt.hash(plainText, SALT_ROUNDS);

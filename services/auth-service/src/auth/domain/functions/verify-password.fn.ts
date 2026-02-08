import * as bcrypt from 'bcryptjs';

export const verifyPassword = async (plainText: string, hash: string): Promise<boolean> =>
  bcrypt.compare(plainText, hash);

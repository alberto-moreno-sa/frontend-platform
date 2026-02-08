import { UserEntity, CreateUserInput } from '@auth/domain/entities/user.entity';

export interface UserRepositoryPort {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  create(input: CreateUserInput): Promise<UserEntity>;
  updateLastLogin(id: string): Promise<void>;
  updateProfile(id: string, name: string): Promise<UserEntity | null>;
  softDelete(id: string): Promise<void>;
}

import { KeyPairEntity } from '@auth/domain/entities/key-pair.entity';

export interface KeyPairRepositoryPort {
  findActive(): Promise<KeyPairEntity | null>;
  findByKid(kid: string): Promise<KeyPairEntity | null>;
  findAllNonExpired(): Promise<KeyPairEntity[]>;
  create(input: Omit<KeyPairEntity, 'id'>): Promise<KeyPairEntity>;
  rotateKey(kid: string): Promise<void>;
}

import { RefreshTokenEntity, RevokedReason } from '@auth/domain/entities/refresh-token.entity';

export interface RefreshTokenRepositoryPort {
  create(input: Omit<RefreshTokenEntity, 'id'>): Promise<RefreshTokenEntity>;
  findByJti(jti: string): Promise<RefreshTokenEntity | null>;
  findActiveByUserId(userId: string): Promise<RefreshTokenEntity[]>;
  revoke(jti: string, reason: RevokedReason): Promise<void>;
  revokeAllByUserId(userId: string, reason: RevokedReason): Promise<number>;
  findByParentJtiChain(rootJti: string): Promise<RefreshTokenEntity[]>;
}

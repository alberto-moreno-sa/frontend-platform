export type RevokedReason =
  | 'logout'
  | 'rotation'
  | 'logout_all'
  | 'password_change'
  | 'token_theft_detected'
  | 'account_deleted';

export interface RefreshTokenEntity {
  readonly id: string;
  readonly jti: string;
  readonly userId: string;
  readonly deviceId: string;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly issuedAt: Date;
  readonly expiresAt: Date;
  readonly revokedAt: Date | null;
  readonly revokedReason: RevokedReason | null;
  readonly rotationCount: number;
  readonly parentJti: string | null;
}

export interface CreateRefreshTokenInput {
  readonly jti: string;
  readonly userId: string;
  readonly deviceId: string;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly expiresInSeconds: number;
  readonly parentJti: string | null;
  readonly rotationCount: number;
}

export const createRefreshToken = (
  input: CreateRefreshTokenInput,
): Omit<RefreshTokenEntity, 'id'> => {
  const now = new Date();
  return {
    jti: input.jti,
    userId: input.userId,
    deviceId: input.deviceId,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
    issuedAt: now,
    expiresAt: new Date(now.getTime() + input.expiresInSeconds * 1000),
    revokedAt: null,
    revokedReason: null,
    rotationCount: input.rotationCount,
    parentJti: input.parentJti,
  };
};

export const wasRotated = (token: RefreshTokenEntity): boolean =>
  token.revokedAt !== null && token.revokedReason === 'rotation';

import { v4 as uuidv4 } from 'uuid';

export interface AccessTokenPayload {
  readonly jti: string;
  readonly user_id: string;
  readonly email: string;
  readonly deviceId: string;
  readonly iss: string;
  readonly aud: string;
}

export interface RefreshTokenPayload {
  readonly jti: string;
  readonly user_id: string;
  readonly deviceId: string;
  readonly type: 'refresh';
  readonly iss: string;
}

export const createAccessTokenPayload = (
  userId: string,
  email: string,
  deviceId: string,
  issuer: string,
  audience: string,
): AccessTokenPayload => ({
  jti: `access-${uuidv4()}`,
  user_id: userId,
  email,
  deviceId,
  iss: issuer,
  aud: audience,
});

export const createRefreshTokenPayload = (
  userId: string,
  deviceId: string,
  issuer: string,
): RefreshTokenPayload => ({
  jti: `refresh-${uuidv4()}`,
  user_id: userId,
  deviceId,
  type: 'refresh',
  iss: issuer,
});

import { AccessTokenPayload, RefreshTokenPayload } from '@auth/domain/functions/create-token.fn';

export interface TokenServicePort {
  signAccessToken(payload: AccessTokenPayload): Promise<string>;
  signRefreshToken(payload: RefreshTokenPayload): Promise<string>;
  verifyAccessToken(token: string): Promise<Record<string, unknown>>;
  verifyRefreshToken(token: string): Promise<Record<string, unknown>>;
  getActiveKid(): Promise<string>;
}

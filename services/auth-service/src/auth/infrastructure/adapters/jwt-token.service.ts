import { TokenServicePort } from '@auth/application/ports/token-service.port';
import { KeyPairRepositoryPort } from '@auth/application/ports/key-pair-repository.port';
import { JwksCachePort } from '@auth/application/ports/jwks-cache.port';
import { AppConfig } from '@config';
import { AppError } from '@common/errors/app-error';
import { ErrorCodes } from '@common/constants/error-codes';
import {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  generateES256KeyPair,
} from '@auth/domain/functions/crypto-keys.fn';
import { createKeyPair } from '@auth/domain/entities/key-pair.entity';
import { AccessTokenPayload, RefreshTokenPayload } from '@auth/domain/functions/create-token.fn';
import { logger } from '@common/logger';

const log = logger.child({ component: 'JwtTokenService' });

/**
 * JWT token service backed by ES256 key pairs stored in the repository.
 * Supports key rotation: verification tries all non-expired keys so tokens
 * signed with a previous key remain valid until they expire naturally.
 */
export const createJwtTokenService = (
  keyPairRepo: KeyPairRepositoryPort,
  config: AppConfig,
  jwksCache?: JwksCachePort,
): TokenServicePort & { initialize: () => Promise<void> } => {
  /** Generates an initial ES256 key pair if none exists (idempotent on startup). */
  const initialize = async (): Promise<void> => {
    const activeKey = await keyPairRepo.findActive();
    if (!activeKey) {
      log.info('No active key pair found, generating initial ES256 key pair');
      const generated = await generateES256KeyPair(config.jwtKid, config.keyEncryptionSecret);
      const keyPairData = createKeyPair({
        kid: generated.kid,
        publicKey: generated.publicKey,
        privateKeyEncrypted: generated.privateKeyEncrypted,
      });
      await keyPairRepo.create(keyPairData);
      await jwksCache?.invalidate();
      log.debug({ kid: config.jwtKid }, 'Initial key pair created, JWKS cache invalidated');
    }
  };

  /**
   * Attempts token verification against every non-expired key pair.
   * Enables seamless key rotation: new keys can be introduced without
   * immediately invalidating tokens signed by the previous key.
   */
  const verifyWithAllKeys = async (token: string): Promise<Record<string, unknown>> => {
    const keys = await keyPairRepo.findAllNonExpired();
    for (const key of keys) {
      try {
        return await verifyToken(token, key.publicKey);
      } catch {
        continue;
      }
    }
    throw AppError.fromErrorCode(ErrorCodes.TOKEN_INVALID);
  };

  return {
    initialize,

    async signAccessToken(payload: AccessTokenPayload): Promise<string> {
      const keyPair = await keyPairRepo.findActive();
      if (!keyPair) throw AppError.fromErrorCode(ErrorCodes.KEY_OPERATION_ERROR);
      return signAccessToken(
        payload,
        keyPair.privateKeyEncrypted,
        config.keyEncryptionSecret,
        keyPair.kid,
        config.accessTokenTtl,
      );
    },

    async signRefreshToken(payload: RefreshTokenPayload): Promise<string> {
      const keyPair = await keyPairRepo.findActive();
      if (!keyPair) throw AppError.fromErrorCode(ErrorCodes.KEY_OPERATION_ERROR);
      return signRefreshToken(
        payload,
        keyPair.privateKeyEncrypted,
        config.keyEncryptionSecret,
        keyPair.kid,
        config.refreshTokenTtl,
      );
    },

    async verifyAccessToken(token: string): Promise<Record<string, unknown>> {
      return verifyWithAllKeys(token);
    },

    async verifyRefreshToken(token: string): Promise<Record<string, unknown>> {
      const payload = await verifyWithAllKeys(token);
      if (payload.type !== 'refresh') throw AppError.fromErrorCode(ErrorCodes.TOKEN_INVALID);
      return payload;
    },

    async getActiveKid(): Promise<string> {
      const keyPair = await keyPairRepo.findActive();
      if (!keyPair) throw AppError.fromErrorCode(ErrorCodes.KEY_OPERATION_ERROR);
      return keyPair.kid;
    },
  };
};

import { Model } from 'mongoose';
import { RefreshTokenRepositoryPort } from '@auth/application/ports/refresh-token-repository.port';
import { RefreshTokenEntity, RevokedReason } from '@auth/domain/entities/refresh-token.entity';
import { RefreshTokenDocument } from '../schemas/refresh-token.schema';
import { logger } from '@common/logger';

const log = logger.child({ component: 'RefreshTokenRepo' });

export const createMongoRefreshTokenRepository = (
  refreshTokenModel: Model<RefreshTokenDocument>,
): RefreshTokenRepositoryPort => {
  const toDomain = (doc: RefreshTokenDocument): RefreshTokenEntity => ({
    id: String(doc._id),
    jti: doc.jti,
    userId: doc.userId.toString(),
    deviceId: doc.deviceId,
    ipAddress: doc.ipAddress,
    userAgent: doc.userAgent,
    issuedAt: doc.issuedAt,
    expiresAt: doc.expiresAt,
    revokedAt: doc.revokedAt,
    revokedReason: doc.revokedReason as RevokedReason | null,
    rotationCount: doc.rotationCount,
    parentJti: doc.parentJti,
  });

  return {
    async create(input: Omit<RefreshTokenEntity, 'id'>) {
      log.debug({ jti: input.jti, userId: input.userId }, 'Creating refresh token');
      const doc = await refreshTokenModel.create(input);
      return toDomain(doc);
    },

    async findByJti(jti) {
      const doc = await refreshTokenModel.findOne({ jti }).exec();
      return doc ? toDomain(doc) : null;
    },

    async findActiveByUserId(userId) {
      const docs = await refreshTokenModel
        .find({ userId, revokedAt: null, expiresAt: { $gt: new Date() } })
        .exec();
      log.debug({ userId, count: docs.length }, 'Active tokens found');
      return docs.map((doc) => toDomain(doc));
    },

    async revoke(jti, reason) {
      log.debug({ jti, reason }, 'Revoking token');
      await refreshTokenModel
        .updateOne({ jti }, { $set: { revokedAt: new Date(), revokedReason: reason } })
        .exec();
    },

    async revokeAllByUserId(userId, reason) {
      const result = await refreshTokenModel
        .updateMany(
          { userId, revokedAt: null },
          { $set: { revokedAt: new Date(), revokedReason: reason } },
        )
        .exec();
      log.debug({ userId, reason, count: result.modifiedCount }, 'Tokens revoked');
      return result.modifiedCount;
    },

    async findByParentJtiChain(rootJti) {
      log.debug({ rootJti }, 'Traversing token family chain');
      const allTokens: RefreshTokenEntity[] = [];
      const visited = new Set<string>();
      let currentJti: string | null = rootJti;

      while (currentJti && !visited.has(currentJti)) {
        visited.add(currentJti);
        const children = await refreshTokenModel.find({ parentJti: currentJti }).exec();
        for (const child of children) {
          allTokens.push(toDomain(child));
        }
        currentJti = children.length > 0 ? children[children.length - 1].jti : null;
      }

      log.debug({ rootJti, familySize: allTokens.length }, 'Token family traversed');
      return allTokens;
    },
  };
};

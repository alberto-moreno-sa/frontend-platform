import { Model } from 'mongoose';
import { KeyPairRepositoryPort } from '@auth/application/ports/key-pair-repository.port';
import { KeyPairEntity } from '@auth/domain/entities/key-pair.entity';
import { KeyPairDocument } from '../schemas/key-pair.schema';

export const createMongoKeyPairRepository = (
  keyPairModel: Model<KeyPairDocument>,
): KeyPairRepositoryPort => {
  const toDomain = (doc: KeyPairDocument): KeyPairEntity => ({
    id: String(doc._id),
    kid: doc.kid,
    algorithm: 'ES256',
    publicKey: {
      kty: 'EC' as const,
      crv: 'P-256' as const,
      x: doc.publicKey.x,
      y: doc.publicKey.y,
    },
    privateKeyEncrypted: doc.privateKeyEncrypted,
    status: doc.status as 'active' | 'rotated',
    createdAt: doc.createdAt,
    rotatedAt: doc.rotatedAt,
  });

  return {
    async findActive() {
      const doc = await keyPairModel.findOne({ status: 'active' }).exec();
      return doc ? toDomain(doc) : null;
    },

    async findByKid(kid) {
      const doc = await keyPairModel.findOne({ kid }).exec();
      return doc ? toDomain(doc) : null;
    },

    async findAllNonExpired() {
      const docs = await keyPairModel
        .find({ $or: [{ status: 'active' }, { status: 'rotated' }] })
        .exec();
      return docs.map((doc) => toDomain(doc));
    },

    async create(input: Omit<KeyPairEntity, 'id'>) {
      const doc = await keyPairModel.create(input);
      return toDomain(doc);
    },

    async rotateKey(kid) {
      await keyPairModel
        .updateOne({ kid }, { $set: { status: 'rotated', rotatedAt: new Date() } })
        .exec();
    },
  };
};

import { Model } from 'mongoose';
import { UserRepositoryPort } from '@auth/application/ports/user-repository.port';
import { UserEntity, CreateUserInput, createUser } from '@auth/domain/entities/user.entity';
import { UserDocument } from '../schemas/user.schema';
import { logger } from '@common/logger';

const log = logger.child({ component: 'UserRepo' });

export const createMongoUserRepository = (userModel: Model<UserDocument>): UserRepositoryPort => {
  const toDomain = (doc: UserDocument): UserEntity => ({
    id: String(doc._id),
    email: doc.email,
    passwordHash: doc.passwordHash,
    name: doc.name,
    emailVerified: doc.emailVerified,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    lastLogin: doc.lastLogin,
    deletedAt: doc.deletedAt,
  });

  return {
    async findByEmail(email) {
      log.debug({ email }, 'Finding user by email');
      const doc = await userModel.findOne({ email: email.toLowerCase(), deletedAt: null }).exec();
      return doc ? toDomain(doc) : null;
    },

    async findById(id) {
      const doc = await userModel.findOne({ _id: id, deletedAt: null }).exec();
      return doc ? toDomain(doc) : null;
    },

    async create(input: CreateUserInput) {
      log.debug({ email: input.email }, 'Creating user');
      const userData = createUser(input);
      const doc = await userModel.create(userData);
      return toDomain(doc);
    },

    async updateLastLogin(id) {
      log.debug({ userId: id }, 'Updating lastLogin');
      await userModel.updateOne({ _id: id }, { $set: { lastLogin: new Date() } }).exec();
    },

    async updateProfile(id, name) {
      log.debug({ userId: id }, 'Updating profile');
      const doc = await userModel.findByIdAndUpdate(id, { $set: { name } }, { new: true }).exec();
      return doc ? toDomain(doc) : null;
    },

    async softDelete(id) {
      log.debug({ userId: id }, 'Soft deleting user');
      await userModel.updateOne({ _id: id }, { $set: { deletedAt: new Date() } }).exec();
    },
  };
};

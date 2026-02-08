import { Model } from 'mongoose';
import { UserRepositoryPort } from '@auth/application/ports/user-repository.port';
import { UserEntity, CreateUserInput, createUser } from '@auth/domain/entities/user.entity';
import { UserDocument } from '../schemas/user.schema';

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
      const doc = await userModel.findOne({ email: email.toLowerCase(), deletedAt: null }).exec();
      return doc ? toDomain(doc) : null;
    },

    async findById(id) {
      const doc = await userModel.findOne({ _id: id, deletedAt: null }).exec();
      return doc ? toDomain(doc) : null;
    },

    async create(input: CreateUserInput) {
      const userData = createUser(input);
      const doc = await userModel.create(userData);
      return toDomain(doc);
    },

    async updateLastLogin(id) {
      await userModel.updateOne({ _id: id }, { $set: { lastLogin: new Date() } }).exec();
    },

    async updateProfile(id, name) {
      const doc = await userModel.findByIdAndUpdate(id, { $set: { name } }, { new: true }).exec();
      return doc ? toDomain(doc) : null;
    },

    async softDelete(id) {
      await userModel.updateOne({ _id: id }, { $set: { deletedAt: new Date() } }).exec();
    },
  };
};

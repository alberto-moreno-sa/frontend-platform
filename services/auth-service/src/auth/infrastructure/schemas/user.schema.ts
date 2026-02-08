import { Schema, model, Document, Model } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  name: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
  deletedAt: Date | null;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 255,
    },
    passwordHash: { type: String, required: true, minlength: 60 },
    name: { type: String, required: true, minlength: 2, maxlength: 100 },
    emailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, collection: 'users' },
);

userSchema.index({ createdAt: 1 });
userSchema.index({ lastLogin: 1 });

export const createUserModel = (): Model<UserDocument> => model<UserDocument>('User', userSchema);

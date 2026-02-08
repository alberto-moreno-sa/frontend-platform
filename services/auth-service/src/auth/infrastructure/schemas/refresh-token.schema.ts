import { Schema, model, Document, Model, Types } from 'mongoose';

export interface RefreshTokenDocument extends Document {
  jti: string;
  userId: Types.ObjectId;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  issuedAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  revokedReason: string | null;
  rotationCount: number;
  parentJti: string | null;
}

const refreshTokenSchema = new Schema<RefreshTokenDocument>(
  {
    jti: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    deviceId: { type: String, required: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    issuedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
    revokedReason: {
      type: String,
      default: null,
      enum: [
        'logout',
        'rotation',
        'logout_all',
        'password_change',
        'token_theft_detected',
        'account_deleted',
        null,
      ],
    },
    rotationCount: { type: Number, required: true, default: 0, min: 0 },
    parentJti: { type: String, default: null },
  },
  { collection: 'refresh_tokens' },
);

refreshTokenSchema.index({ userId: 1, revokedAt: 1 });
refreshTokenSchema.index({ userId: 1, _id: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
refreshTokenSchema.index({ parentJti: 1 });

export const createRefreshTokenModel = (): Model<RefreshTokenDocument> =>
  model<RefreshTokenDocument>('RefreshToken', refreshTokenSchema);

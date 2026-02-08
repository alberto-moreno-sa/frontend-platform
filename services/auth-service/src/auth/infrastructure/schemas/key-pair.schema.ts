import { Schema, model, Document, Model } from 'mongoose';

export interface KeyPairDocument extends Document {
  kid: string;
  algorithm: string;
  publicKey: {
    kty: string;
    crv: string;
    x: string;
    y: string;
  };
  privateKeyEncrypted: string;
  status: string;
  createdAt: Date;
  rotatedAt: Date | null;
}

const keyPairSchema = new Schema<KeyPairDocument>(
  {
    kid: { type: String, required: true, unique: true },
    algorithm: { type: String, required: true, enum: ['ES256'], default: 'ES256' },
    publicKey: {
      type: new Schema(
        {
          kty: { type: String, required: true },
          crv: { type: String, required: true },
          x: { type: String, required: true },
          y: { type: String, required: true },
        },
        { _id: false },
      ),
      required: true,
    },
    privateKeyEncrypted: { type: String, required: true },
    status: { type: String, required: true, enum: ['active', 'rotated'], default: 'active' },
    createdAt: { type: Date, required: true },
    rotatedAt: { type: Date, default: null },
  },
  { collection: 'key_pairs' },
);

keyPairSchema.index({ status: 1 });

export const createKeyPairModel = (): Model<KeyPairDocument> =>
  model<KeyPairDocument>('KeyPair', keyPairSchema);

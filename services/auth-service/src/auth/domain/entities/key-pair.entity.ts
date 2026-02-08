export interface JwkPublicKey {
  readonly kty: 'EC';
  readonly crv: 'P-256';
  readonly x: string;
  readonly y: string;
}

export type KeyPairStatus = 'active' | 'rotated';

export interface KeyPairEntity {
  readonly id: string;
  readonly kid: string;
  readonly algorithm: 'ES256';
  readonly publicKey: JwkPublicKey;
  readonly privateKeyEncrypted: string;
  readonly status: KeyPairStatus;
  readonly createdAt: Date;
  readonly rotatedAt: Date | null;
}

export interface CreateKeyPairInput {
  readonly kid: string;
  readonly publicKey: JwkPublicKey;
  readonly privateKeyEncrypted: string;
}

export const createKeyPair = (input: CreateKeyPairInput): Omit<KeyPairEntity, 'id'> => ({
  kid: input.kid,
  algorithm: 'ES256',
  publicKey: input.publicKey,
  privateKeyEncrypted: input.privateKeyEncrypted,
  status: 'active',
  createdAt: new Date(),
  rotatedAt: null,
});

export const isActiveKey = (keyPair: KeyPairEntity): boolean => keyPair.status === 'active';

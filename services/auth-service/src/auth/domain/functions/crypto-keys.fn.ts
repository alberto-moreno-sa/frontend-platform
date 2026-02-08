import * as crypto from 'crypto';
import { exportJWK, generateKeyPair, importJWK, SignJWT, jwtVerify, type KeyLike } from 'jose';
import { JwkPublicKey } from '../entities/key-pair.entity';
import { AccessTokenPayload, RefreshTokenPayload } from './create-token.fn';

const ALGORITHM = 'ES256';
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

export interface GeneratedKeyPair {
  readonly kid: string;
  readonly publicKey: JwkPublicKey;
  readonly privateKeyEncrypted: string;
}

export const generateES256KeyPair = async (
  kid: string,
  encryptionSecret: string,
): Promise<GeneratedKeyPair> => {
  const { publicKey, privateKey } = await generateKeyPair(ALGORITHM);
  const publicJwk = await exportJWK(publicKey);
  const privateJwk = await exportJWK(privateKey);

  const privateKeyEncrypted = encryptPrivateKey(JSON.stringify(privateJwk), encryptionSecret);

  return {
    kid,
    publicKey: {
      kty: 'EC',
      crv: 'P-256',
      x: publicJwk.x!,
      y: publicJwk.y!,
    },
    privateKeyEncrypted,
  };
};

export const encryptPrivateKey = (plainText: string, secret: string): string => {
  const key = crypto.createHash('sha256').update(secret).digest();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);

  let encrypted = cipher.update(plainText, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const tag = cipher.getAuthTag();

  return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted}`;
};

export const decryptPrivateKey = (encryptedText: string, secret: string): string => {
  const [ivBase64, tagBase64, encrypted] = encryptedText.split(':');
  const key = crypto.createHash('sha256').update(secret).digest();
  const iv = Buffer.from(ivBase64, 'base64');
  const tag = Buffer.from(tagBase64, 'base64');

  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

export const signAccessToken = async (
  payload: AccessTokenPayload,
  privateKeyEncrypted: string,
  encryptionSecret: string,
  kid: string,
  ttlSeconds: number,
): Promise<string> => {
  const privateKey = await getPrivateKey(privateKeyEncrypted, encryptionSecret);

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALGORITHM, typ: 'JWT', kid })
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(privateKey);
};

export const signRefreshToken = async (
  payload: RefreshTokenPayload,
  privateKeyEncrypted: string,
  encryptionSecret: string,
  kid: string,
  ttlSeconds: number,
): Promise<string> => {
  const privateKey = await getPrivateKey(privateKeyEncrypted, encryptionSecret);

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALGORITHM, typ: 'JWT', kid })
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(privateKey);
};

export const verifyToken = async (
  token: string,
  publicKeyJwk: JwkPublicKey,
): Promise<Record<string, unknown>> => {
  const publicKey = await importJWK({ ...publicKeyJwk, kty: 'EC', crv: 'P-256' }, ALGORITHM);

  const { payload } = await jwtVerify(token, publicKey as KeyLike, {
    algorithms: [ALGORITHM],
  });

  return payload as Record<string, unknown>;
};

const getPrivateKey = async (
  privateKeyEncrypted: string,
  encryptionSecret: string,
): Promise<KeyLike> => {
  const privateKeyJson = decryptPrivateKey(privateKeyEncrypted, encryptionSecret);
  const privateKeyJwk = JSON.parse(privateKeyJson);
  return importJWK(privateKeyJwk, ALGORITHM) as Promise<KeyLike>;
};

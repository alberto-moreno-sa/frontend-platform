import dotenv from 'dotenv';
dotenv.config();

export interface AppConfig {
  readonly port: number;
  readonly nodeEnv: string;
  readonly mongoUri: string;
  readonly redisUri: string;
  readonly jwtKid: string;
  readonly keyEncryptionSecret: string;
  readonly accessTokenTtl: number;
  readonly refreshTokenTtl: number;
  readonly issuerUrl: string;
  readonly audience: string;
  readonly allowedOrigins: string[];
  readonly logLevel: string;
}

export const loadConfig = (): AppConfig => ({
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_db',
  redisUri: process.env.REDIS_URI || 'redis://localhost:6379',
  jwtKid: process.env.JWT_KID || '2024-02-v1',
  keyEncryptionSecret: process.env.KEY_ENCRYPTION_SECRET || 'dev-encryption-secret-change-me',
  accessTokenTtl: parseInt(process.env.ACCESS_TOKEN_TTL || '900', 10),
  refreshTokenTtl: parseInt(process.env.REFRESH_TOKEN_TTL || '604800', 10),
  issuerUrl: process.env.ISSUER_URL || 'https://auth.yourapp.com',
  audience: process.env.AUDIENCE || 'yourapp-api',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  logLevel: process.env.LOG_LEVEL || 'debug',
});

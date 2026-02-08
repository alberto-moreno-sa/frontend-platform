import mongoose from 'mongoose';
import Redis from 'ioredis';
import { AppConfig } from '@config';

// Schemas
import { createUserModel } from '@auth/infrastructure/schemas/user.schema';
import { createRefreshTokenModel } from '@auth/infrastructure/schemas/refresh-token.schema';
import { createKeyPairModel } from '@auth/infrastructure/schemas/key-pair.schema';

// Adapters
import { createMongoUserRepository } from '@auth/infrastructure/adapters/mongo-user.repository';
import { createMongoRefreshTokenRepository } from '@auth/infrastructure/adapters/mongo-refresh-token.repository';
import { createMongoKeyPairRepository } from '@auth/infrastructure/adapters/mongo-key-pair.repository';
import { createJwtTokenService } from '@auth/infrastructure/adapters/jwt-token.service';
import { createRedisSessionAdapter } from '@auth/infrastructure/adapters/redis-session.adapter';
import { createRedisBlacklistAdapter } from '@auth/infrastructure/adapters/redis-blacklist.adapter';
import { createRedisJwksCacheAdapter } from '@auth/infrastructure/adapters/redis-jwks-cache.adapter';

// Use cases
import { createRegisterUserUseCase } from '@auth/application/use-cases/register-user.use-case';
import { createLoginUserUseCase } from '@auth/application/use-cases/login-user.use-case';
import { createRefreshTokenUseCase } from '@auth/application/use-cases/refresh-token.use-case';
import { createLogoutUseCase } from '@auth/application/use-cases/logout.use-case';

import { createVerifyTokenUseCase } from '@auth/application/use-cases/verify-token.use-case';
import { createGetJwksUseCase } from '@auth/application/use-cases/get-jwks.use-case';
import { createGetProfileUseCase } from '@auth/application/use-cases/get-profile.use-case';
import { createUpdateProfileUseCase } from '@auth/application/use-cases/update-profile.use-case';

import { createDeleteAccountUseCase } from '@auth/application/use-cases/delete-account.use-case';
import { createGetSessionsUseCase } from '@auth/application/use-cases/get-sessions.use-case';

// Middleware
import { createAuthMiddleware } from '@common/middleware/auth.middleware';

export interface AppContainer {
  readonly redis: Redis;
  readonly authMiddleware: ReturnType<typeof createAuthMiddleware>;
  readonly useCases: {
    readonly registerUser: ReturnType<typeof createRegisterUserUseCase>;
    readonly loginUser: ReturnType<typeof createLoginUserUseCase>;
    readonly refreshToken: ReturnType<typeof createRefreshTokenUseCase>;
    readonly logout: ReturnType<typeof createLogoutUseCase>;
    readonly verifyToken: ReturnType<typeof createVerifyTokenUseCase>;
    readonly getJwks: ReturnType<typeof createGetJwksUseCase>;
    readonly getProfile: ReturnType<typeof createGetProfileUseCase>;
    readonly updateProfile: ReturnType<typeof createUpdateProfileUseCase>;
    readonly deleteAccount: ReturnType<typeof createDeleteAccountUseCase>;
    readonly getSessions: ReturnType<typeof createGetSessionsUseCase>;
  };
  readonly close: () => Promise<void>;
}

export const createContainer = async (config: AppConfig): Promise<AppContainer> => {
  // Connect MongoDB
  await mongoose.connect(config.mongoUri);
  console.log('[Container] MongoDB connected');

  // Connect Redis
  const redis = new Redis(config.redisUri);
  await redis.ping();
  console.log('[Container] Redis connected');

  // Models
  const userModel = createUserModel();
  const refreshTokenModel = createRefreshTokenModel();
  const keyPairModel = createKeyPairModel();

  // Adapters
  const userRepo = createMongoUserRepository(userModel);
  const refreshTokenRepo = createMongoRefreshTokenRepository(refreshTokenModel);
  const keyPairRepo = createMongoKeyPairRepository(keyPairModel);
  const tokenService = createJwtTokenService(keyPairRepo, config);
  const sessionService = createRedisSessionAdapter(redis);
  const blacklist = createRedisBlacklistAdapter(redis);
  const jwksCache = createRedisJwksCacheAdapter(redis);

  // Initialize token service (generate key pair if needed)
  await tokenService.initialize();
  console.log('[Container] Token service initialized');

  // Auth middleware
  const authMiddleware = createAuthMiddleware({ tokenService, blacklist, userRepo });

  // Use cases
  const useCases = {
    registerUser: createRegisterUserUseCase({
      userRepo,
      tokenService,
      refreshTokenRepo,
      sessionService,
      config,
    }),
    loginUser: createLoginUserUseCase({
      userRepo,
      tokenService,
      refreshTokenRepo,
      sessionService,
      config,
    }),
    refreshToken: createRefreshTokenUseCase({
      tokenService,
      refreshTokenRepo,
      sessionService,
      blacklist,
      userRepo,
      config,
    }),
    logout: createLogoutUseCase({ refreshTokenRepo, sessionService, blacklist, config }),
    verifyToken: createVerifyTokenUseCase({ tokenService, blacklist, userRepo }),
    getJwks: createGetJwksUseCase({ keyPairRepo, jwksCache }),
    getProfile: createGetProfileUseCase({ userRepo }),
    updateProfile: createUpdateProfileUseCase({ userRepo }),
    deleteAccount: createDeleteAccountUseCase({
      userRepo,
      refreshTokenRepo,
      sessionService,
      blacklist,
      config,
    }),
    getSessions: createGetSessionsUseCase({ refreshTokenRepo, sessionService }),
  };

  const close = async (): Promise<void> => {
    await mongoose.disconnect();
    redis.disconnect();
    console.log('[Container] Connections closed');
  };

  return { redis, authMiddleware, useCases, close };
};

import { UserRepositoryPort } from '../ports/user-repository.port';
import { TokenServicePort } from '../ports/token-service.port';
import { RefreshTokenRepositoryPort } from '../ports/refresh-token-repository.port';
import { SessionPort } from '../ports/session.port';
import { hashPassword } from '@auth/domain/functions/hash-password.fn';
import {
  createAccessTokenPayload,
  createRefreshTokenPayload,
} from '@auth/domain/functions/create-token.fn';
import { createRefreshToken } from '@auth/domain/entities/refresh-token.entity';
import { DeviceInfo } from '@auth/domain/value-objects/device-info.vo';
import { AppError } from '@common/errors/app-error';
import { ErrorCodes } from '@common/constants/error-codes';
import { AppConfig } from '@config';
import { v4 as uuidv4 } from 'uuid';

interface RegisterUserDeps {
  readonly userRepo: UserRepositoryPort;
  readonly tokenService: TokenServicePort;
  readonly refreshTokenRepo: RefreshTokenRepositoryPort;
  readonly sessionService: SessionPort;
  readonly config: AppConfig;
}

export const createRegisterUserUseCase = (deps: RegisterUserDeps) => ({
  async execute(email: string, password: string, name: string, device: DeviceInfo) {
    console.log(`[RegisterUser] Registering user: ${email}`);

    const existing = await deps.userRepo.findByEmail(email);
    if (existing) {
      throw AppError.fromErrorCode(ErrorCodes.EMAIL_ALREADY_EXISTS);
    }

    const passwordHash = await hashPassword(password);
    const user = await deps.userRepo.create({ email, passwordHash, name });

    const accessPayload = createAccessTokenPayload(
      user.id,
      user.email,
      device.deviceId,
      deps.config.issuerUrl,
      deps.config.audience,
    );
    const refreshPayload = createRefreshTokenPayload(
      user.id,
      device.deviceId,
      deps.config.issuerUrl,
    );

    const [accessToken, refreshToken] = await Promise.all([
      deps.tokenService.signAccessToken(accessPayload),
      deps.tokenService.signRefreshToken(refreshPayload),
    ]);

    const refreshTokenData = createRefreshToken({
      jti: refreshPayload.jti,
      userId: user.id,
      deviceId: device.deviceId,
      ipAddress: device.ipAddress,
      userAgent: device.userAgent,
      expiresInSeconds: deps.config.refreshTokenTtl,
      parentJti: null,
      rotationCount: 0,
    });
    await deps.refreshTokenRepo.create(refreshTokenData);

    const sessionId = `sess-${uuidv4()}`;
    await deps.sessionService.create(user.id, sessionId, {
      userId: user.id,
      deviceId: device.deviceId,
      ipAddress: device.ipAddress,
      userAgent: device.userAgent,
      createdAt: String(Math.floor(Date.now() / 1000)),
      lastActivity: String(Math.floor(Date.now() / 1000)),
      refreshTokenJti: refreshPayload.jti,
      rotationCount: '0',
    });

    console.log(`[RegisterUser] User registered: ${user.id}`);

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt.toISOString(),
        },
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: deps.config.accessTokenTtl,
      },
    };
  },
});

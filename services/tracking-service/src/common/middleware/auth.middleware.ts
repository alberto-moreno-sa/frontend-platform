import { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { AppError } from '../errors/app-error';
import { ErrorCodes } from '../constants/error-codes';
import { logger } from '../logger';

const log = logger.child({ component: 'Auth' });

/**
 * Cross-service authentication middleware that verifies JWTs using the
 * auth-service's remote JWKS endpoint. The JWKS is fetched and cached
 * automatically by jose, ensuring key rotation is handled transparently.
 */
export const createAuthMiddleware = (authServiceUrl: string) => {
  const jwksUrl = new URL('/.well-known/jwks.json', authServiceUrl);
  const JWKS = createRemoteJWKSet(jwksUrl);

  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      log.warn({ path: req.path }, 'Missing or malformed Authorization header');
      next(AppError.fromErrorCode(ErrorCodes.UNAUTHORIZED));
      return;
    }

    try {
      const token = authHeader.split(' ')[1];
      const { payload } = await jwtVerify(token, JWKS, {
        algorithms: ['ES256'],
      });

      req.user = {
        userId: payload.sub as string,
        email: payload.email as string,
      };

      log.debug({ userId: payload.sub }, 'JWT verified');
      next();
    } catch (error) {
      if (error instanceof Error && error.message.includes('expired')) {
        log.warn({ path: req.path }, 'Token expired');
        next(AppError.fromErrorCode(ErrorCodes.TOKEN_EXPIRED));
      } else {
        log.warn({ path: req.path, err: error }, 'Invalid token');
        next(AppError.fromErrorCode(ErrorCodes.TOKEN_INVALID));
      }
    }
  };
};

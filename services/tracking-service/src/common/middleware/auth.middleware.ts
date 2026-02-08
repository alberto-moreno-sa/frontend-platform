import { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { AppError } from '../errors/app-error';
import { ErrorCodes } from '../constants/error-codes';

export const createAuthMiddleware = (authServiceUrl: string) => {
  const jwksUrl = new URL('/.well-known/jwks.json', authServiceUrl);
  const JWKS = createRemoteJWKSet(jwksUrl);

  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
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

      next();
    } catch (error) {
      if (error instanceof Error && error.message.includes('expired')) {
        next(AppError.fromErrorCode(ErrorCodes.TOKEN_EXPIRED));
      } else {
        next(AppError.fromErrorCode(ErrorCodes.TOKEN_INVALID));
      }
    }
  };
};

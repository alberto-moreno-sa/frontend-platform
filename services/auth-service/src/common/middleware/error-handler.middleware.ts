import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { ErrorCodes } from '../constants/error-codes';

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.INVALID_INPUT.code,
        message: (error as Error).message,
      },
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.status).json({
      success: false,
      error: {
        code: error.errorCode,
        message: error.message,
        ...(error.details && { details: error.details }),
      },
    });
    return;
  }

  console.error(
    '[ErrorHandler] Unhandled exception:',
    error instanceof Error ? error.stack : String(error),
  );

  res.status(500).json({
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_SERVER_ERROR.code,
      message: ErrorCodes.INTERNAL_SERVER_ERROR.message,
    },
  });
};

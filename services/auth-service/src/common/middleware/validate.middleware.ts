import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../errors/app-error';
import { ErrorCodes } from '../constants/error-codes';
import { logger } from '../logger';

const log = logger.child({ component: 'Validation' });

export const validate =
  (schema: ZodSchema) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        log.debug({ errors: messages, path: req.path }, 'Validation failed');
        next(
          AppError.fromErrorCode(
            ErrorCodes.INVALID_INPUT,
            { validationErrors: messages },
            messages.join(', '),
          ),
        );
      } else {
        next(error);
      }
    }
  };

export class AppError extends Error {
  constructor(
    public readonly errorCode: string,
    public readonly status: number,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
  }

  static fromErrorCode(
    errorDef: { code: string; status: number; message: string },
    details?: Record<string, unknown>,
    customMessage?: string,
  ): AppError {
    return new AppError(errorDef.code, errorDef.status, customMessage || errorDef.message, details);
  }
}

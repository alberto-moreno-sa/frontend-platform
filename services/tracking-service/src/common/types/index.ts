export interface AuthUser {
  readonly userId: string;
  readonly email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
      validatedQuery?: Record<string, unknown>;
    }
  }
}

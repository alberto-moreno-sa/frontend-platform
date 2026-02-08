export interface AuthenticatedUser {
  readonly userId: string;
  readonly email: string;
  readonly deviceId: string;
  readonly jti: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

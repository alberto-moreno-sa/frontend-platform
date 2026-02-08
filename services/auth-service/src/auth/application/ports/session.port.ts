export interface SessionData {
  readonly userId: string;
  readonly deviceId: string;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly createdAt: string;
  readonly lastActivity: string;
  readonly refreshTokenJti: string;
  readonly rotationCount: string;
}

export interface SessionPort {
  create(userId: string, sessionId: string, data: SessionData): Promise<void>;
  get(userId: string, sessionId: string): Promise<SessionData | null>;
  update(userId: string, sessionId: string, fields: Partial<SessionData>): Promise<void>;
  delete(userId: string, sessionId: string): Promise<void>;
  deleteAllByUserId(userId: string): Promise<number>;
  findAllByUserId(userId: string): Promise<Array<{ sessionId: string; data: SessionData }>>;
}

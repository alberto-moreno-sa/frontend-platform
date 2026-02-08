export interface BlacklistPort {
  add(jti: string, ttlSeconds: number): Promise<void>;
  isBlacklisted(jti: string): Promise<boolean>;
}

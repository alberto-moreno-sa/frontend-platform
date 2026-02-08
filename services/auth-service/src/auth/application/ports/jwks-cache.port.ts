export interface JwksCachePort {
  get(): Promise<string | null>;
  set(jwksJson: string, ttlSeconds: number): Promise<void>;
  invalidate(): Promise<void>;
}

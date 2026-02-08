import { KeyPairRepositoryPort } from '../ports/key-pair-repository.port';
import { JwksCachePort } from '../ports/jwks-cache.port';

const JWKS_CACHE_TTL = 86400; // 24 hours

interface GetJwksDeps {
  readonly keyPairRepo: KeyPairRepositoryPort;
  readonly jwksCache: JwksCachePort;
}

export const createGetJwksUseCase = (deps: GetJwksDeps) => ({
  async execute() {
    const cached = await deps.jwksCache.get();
    if (cached) {
      return JSON.parse(cached);
    }

    const keyPairs = await deps.keyPairRepo.findAllNonExpired();
    const jwks = {
      keys: keyPairs.map((kp) => ({
        kty: kp.publicKey.kty,
        kid: kp.kid,
        use: 'sig',
        alg: 'ES256',
        crv: kp.publicKey.crv,
        x: kp.publicKey.x,
        y: kp.publicKey.y,
      })),
    };

    await deps.jwksCache.set(JSON.stringify(jwks), JWKS_CACHE_TTL);
    return jwks;
  },
});

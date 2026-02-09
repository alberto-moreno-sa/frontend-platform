import { KeyPairRepositoryPort } from '../ports/key-pair-repository.port';
import { JwksCachePort } from '../ports/jwks-cache.port';
import { logger } from '@common/logger';

const log = logger.child({ component: 'GetJWKS' });

const JWKS_CACHE_TTL = 86400; // 24 hours

interface GetJwksDeps {
  readonly keyPairRepo: KeyPairRepositoryPort;
  readonly jwksCache: JwksCachePort;
}

export const createGetJwksUseCase = (deps: GetJwksDeps) => ({
  async execute() {
    const cached = await deps.jwksCache.get();
    if (cached) {
      log.debug('JWKS served from cache');
      return JSON.parse(cached);
    }

    log.debug('JWKS cache miss, fetching from DB');
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
    log.debug({ keys: keyPairs.length }, 'JWKS cached');
    return jwks;
  },
});

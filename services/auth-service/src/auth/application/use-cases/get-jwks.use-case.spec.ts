import { createGetJwksUseCase } from './get-jwks.use-case';

const mockDeps = () => ({
  keyPairRepo: {
    findActive: jest.fn(),
    findByKid: jest.fn(),
    findAllNonExpired: jest.fn().mockResolvedValue([
      {
        kid: 'kid-1',
        publicKey: { kty: 'EC', crv: 'P-256', x: 'x1', y: 'y1' },
      },
    ]),
    create: jest.fn(),
    rotateKey: jest.fn(),
  },
  jwksCache: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn(),
    invalidate: jest.fn(),
  },
});

describe('GetJwks Use Case', () => {
  it('should return JWKS from database when cache is empty', async () => {
    const deps = mockDeps();
    const useCase = createGetJwksUseCase(deps);

    const result = await useCase.execute();

    expect(result.keys).toHaveLength(1);
    expect(result.keys[0].kid).toBe('kid-1');
    expect(result.keys[0].alg).toBe('ES256');
    expect(result.keys[0].use).toBe('sig');
    expect(deps.jwksCache.set).toHaveBeenCalledTimes(1);
  });

  it('should return JWKS from cache when available', async () => {
    const deps = mockDeps();
    const cached = { keys: [{ kid: 'cached-kid' }] };
    deps.jwksCache.get.mockResolvedValue(JSON.stringify(cached));

    const useCase = createGetJwksUseCase(deps);
    const result = await useCase.execute();

    expect(result.keys[0].kid).toBe('cached-kid');
    expect(deps.keyPairRepo.findAllNonExpired).not.toHaveBeenCalled();
  });
});

import { createAccessTokenPayload, createRefreshTokenPayload } from './create-token.fn';

describe('createAccessTokenPayload', () => {
  it('should create payload with all fields', () => {
    const payload = createAccessTokenPayload('u1', 'a@b.com', 'd1', 'https://iss', 'aud');

    expect(payload.user_id).toBe('u1');
    expect(payload.email).toBe('a@b.com');
    expect(payload.deviceId).toBe('d1');
    expect(payload.iss).toBe('https://iss');
    expect(payload.aud).toBe('aud');
    expect(payload.jti).toMatch(/^access-/);
  });

  it('should generate unique jti each time', () => {
    const p1 = createAccessTokenPayload('u', 'e', 'd', 'i', 'a');
    const p2 = createAccessTokenPayload('u', 'e', 'd', 'i', 'a');
    expect(p1.jti).not.toBe(p2.jti);
  });
});

describe('createRefreshTokenPayload', () => {
  it('should create payload with refresh type', () => {
    const payload = createRefreshTokenPayload('u1', 'd1', 'https://iss');

    expect(payload.user_id).toBe('u1');
    expect(payload.deviceId).toBe('d1');
    expect(payload.iss).toBe('https://iss');
    expect(payload.type).toBe('refresh');
    expect(payload.jti).toMatch(/^refresh-/);
  });
});

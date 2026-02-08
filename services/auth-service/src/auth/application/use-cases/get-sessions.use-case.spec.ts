import { createGetSessionsUseCase } from './get-sessions.use-case';

describe('GetSessions Use Case', () => {
  it('should return sessions marking current device', async () => {
    const deps = {
      refreshTokenRepo: {
        create: jest.fn(),
        findByJti: jest.fn(),
        findActiveByUserId: jest.fn().mockResolvedValue([
          {
            id: 'rt-1',
            jti: 'jti-1',
            deviceId: 'device-1',
            ipAddress: '1.2.3.4',
            userAgent: 'Chrome',
            issuedAt: new Date('2024-01-01'),
          },
          {
            id: 'rt-2',
            jti: 'jti-2',
            deviceId: 'device-2',
            ipAddress: '5.6.7.8',
            userAgent: 'Firefox',
            issuedAt: new Date('2024-01-02'),
          },
        ]),
        revoke: jest.fn(),
        revokeAllByUserId: jest.fn(),
        findByParentJtiChain: jest.fn(),
      },
      sessionService: {
        create: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteAllByUserId: jest.fn(),
        findAllByUserId: jest.fn().mockResolvedValue([
          {
            sessionId: 'sess-1',
            data: { refreshTokenJti: 'jti-1', lastActivity: String(Math.floor(Date.now() / 1000)) },
          },
        ]),
      },
    };

    const useCase = createGetSessionsUseCase(deps);
    const result = await useCase.execute('user-1', 'device-1');

    expect(result.success).toBe(true);
    expect(result.data.sessions).toHaveLength(2);
    expect(result.data.sessions[0].current).toBe(true);
    expect(result.data.sessions[1].current).toBe(false);
  });

  it('should return empty sessions when none active', async () => {
    const deps = {
      refreshTokenRepo: {
        create: jest.fn(),
        findByJti: jest.fn(),
        findActiveByUserId: jest.fn().mockResolvedValue([]),
        revoke: jest.fn(),
        revokeAllByUserId: jest.fn(),
        findByParentJtiChain: jest.fn(),
      },
      sessionService: {
        create: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteAllByUserId: jest.fn(),
        findAllByUserId: jest.fn().mockResolvedValue([]),
      },
    };

    const useCase = createGetSessionsUseCase(deps);
    const result = await useCase.execute('user-1', 'device-1');

    expect(result.data.sessions).toHaveLength(0);
  });
});

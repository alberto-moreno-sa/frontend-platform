import { trackEventSchema } from './track-event.schema';

describe('trackEventSchema', () => {
  const valid = {
    componentName: 'Button',
    variant: 'primary',
    action: 'click',
    timestamp: '2024-01-01T00:00:00.000Z',
    sessionId: 'sess-1',
    pageUrl: '/home',
  };

  it('should accept valid input', async () => {
    const result = await trackEventSchema.parseAsync(valid);
    expect(result.componentName).toBe('Button');
    expect(result.viewport).toEqual({ width: 0, height: 0 });
    expect(result.metadata).toEqual({});
  });

  it('should reject empty componentName', async () => {
    await expect(
      trackEventSchema.parseAsync({ ...valid, componentName: '' }),
    ).rejects.toThrow();
  });

  it('should reject invalid action', async () => {
    await expect(
      trackEventSchema.parseAsync({ ...valid, action: 'drag' }),
    ).rejects.toThrow();
  });

  it('should accept all valid actions', async () => {
    const actions = ['click', 'hover', 'focus', 'blur', 'submit', 'view', 'scroll', 'change'];
    for (const action of actions) {
      await expect(
        trackEventSchema.parseAsync({ ...valid, action }),
      ).resolves.toBeDefined();
    }
  });

  it('should reject invalid timestamp', async () => {
    await expect(
      trackEventSchema.parseAsync({ ...valid, timestamp: 'not-a-date' }),
    ).rejects.toThrow();
  });

  it('should default optional fields', async () => {
    const result = await trackEventSchema.parseAsync(valid);
    expect(result.pageTitle).toBeNull();
    expect(result.referrer).toBeNull();
    expect(result.userAgent).toBeNull();
    expect(result.language).toBeNull();
  });
});

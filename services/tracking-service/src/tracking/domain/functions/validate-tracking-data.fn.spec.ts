import { validateTrackingData } from './validate-tracking-data.fn';

const validInput = {
  componentName: 'Button',
  variant: 'primary',
  action: 'click' as const,
  timestamp: '2024-01-01T00:00:00.000Z',
  sessionId: 'sess-1',
  pageUrl: '/home',
};

describe('validateTrackingData', () => {
  it('should return Right for valid data', () => {
    const result = validateTrackingData(validInput);
    expect(result.isRight).toBe(true);
  });

  it('should return Left for missing componentName', () => {
    const result = validateTrackingData({ ...validInput, componentName: '' });
    expect(result.isLeft).toBe(true);
    expect(result.value).toMatchObject({ code: 'INVALID_TRACKING_DATA' });
  });

  it('should return Left for missing variant', () => {
    const result = validateTrackingData({ ...validInput, variant: '' });
    expect(result.isLeft).toBe(true);
  });

  it('should return Left for invalid action', () => {
    const result = validateTrackingData({ ...validInput, action: 'invalid' });
    expect(result.isLeft).toBe(true);
  });

  it('should accept all valid actions', () => {
    const actions = ['click', 'hover', 'focus', 'blur', 'submit', 'view', 'scroll', 'change'];
    for (const action of actions) {
      const result = validateTrackingData({ ...validInput, action });
      expect(result.isRight).toBe(true);
    }
  });

  it('should return Left for invalid timestamp', () => {
    const result = validateTrackingData({ ...validInput, timestamp: 'not-a-date' });
    expect(result.isLeft).toBe(true);
  });

  it('should return Left for missing sessionId', () => {
    const result = validateTrackingData({ ...validInput, sessionId: '' });
    expect(result.isLeft).toBe(true);
  });

  it('should return Left for missing pageUrl', () => {
    const result = validateTrackingData({ ...validInput, pageUrl: '' });
    expect(result.isLeft).toBe(true);
  });
});

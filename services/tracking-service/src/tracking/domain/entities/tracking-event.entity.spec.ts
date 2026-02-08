import { createTrackingEvent } from './tracking-event.entity';

describe('TrackingEvent Entity', () => {
  describe('createTrackingEvent', () => {
    it('should create event with all fields', () => {
      const event = createTrackingEvent({
        componentName: 'Button',
        variant: 'primary',
        action: 'click',
        timestamp: '2024-01-01T00:00:00.000Z',
        sessionId: 'sess-1',
        pageUrl: '/home',
        pageTitle: 'Home',
        referrer: '/login',
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0',
        language: 'en',
        metadata: { key: 'value' },
      });

      expect(event.componentName).toBe('Button');
      expect(event.variant).toBe('primary');
      expect(event.action).toBe('click');
      expect(event.timestamp).toBeInstanceOf(Date);
      expect(event.sessionId).toBe('sess-1');
      expect(event.pageUrl).toBe('/home');
      expect(event.pageTitle).toBe('Home');
      expect(event.referrer).toBe('/login');
      expect(event.viewport).toEqual({ width: 1920, height: 1080 });
      expect(event.userAgent).toBe('Mozilla/5.0');
      expect(event.language).toBe('en');
      expect(event.metadata).toEqual({ key: 'value' });
    });

    it('should default optional fields to null or defaults', () => {
      const event = createTrackingEvent({
        componentName: 'Input',
        variant: 'default',
        action: 'focus',
        timestamp: new Date(),
        sessionId: 'sess-2',
        pageUrl: '/form',
      });

      expect(event.pageTitle).toBeNull();
      expect(event.referrer).toBeNull();
      expect(event.viewport).toEqual({ width: 0, height: 0 });
      expect(event.userAgent).toBeNull();
      expect(event.language).toBeNull();
      expect(event.metadata).toEqual({});
    });

    it('should accept Date object for timestamp', () => {
      const date = new Date('2024-06-15T12:00:00Z');
      const event = createTrackingEvent({
        componentName: 'Card',
        variant: 'outlined',
        action: 'view',
        timestamp: date,
        sessionId: 's',
        pageUrl: '/p',
      });

      expect(event.timestamp).toEqual(date);
    });

    it('should be frozen (immutable)', () => {
      const event = createTrackingEvent({
        componentName: 'A',
        variant: 'B',
        action: 'click',
        timestamp: new Date(),
        sessionId: 's',
        pageUrl: '/',
      });

      expect(Object.isFrozen(event)).toBe(true);
      expect(Object.isFrozen(event.viewport)).toBe(true);
      expect(Object.isFrozen(event.metadata)).toBe(true);
    });
  });
});

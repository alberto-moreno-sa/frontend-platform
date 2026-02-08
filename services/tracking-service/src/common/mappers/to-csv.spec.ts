import { toCsv } from './to-csv';
import { TrackingEventEntity } from '@tracking/domain/entities/tracking-event.entity';

const makeEvent = (overrides: Partial<TrackingEventEntity> = {}): TrackingEventEntity => ({
  componentName: 'Button',
  variant: 'primary',
  action: 'click',
  timestamp: new Date('2024-01-01T12:00:00Z'),
  sessionId: 'sess-1',
  pageUrl: '/home',
  pageTitle: 'Home Page',
  referrer: '/login',
  viewport: { width: 1920, height: 1080 },
  userAgent: 'Mozilla/5.0',
  language: 'en',
  metadata: {},
  ...overrides,
});

describe('toCsv', () => {
  it('should return CSV header when no events', () => {
    const csv = toCsv([]);
    expect(csv).toContain('componentName,variant,action');
    expect(csv.split('\n')).toHaveLength(1);
  });

  it('should include data rows', () => {
    const csv = toCsv([makeEvent()]);
    const lines = csv.split('\n');

    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain('Button');
    expect(lines[1]).toContain('primary');
    expect(lines[1]).toContain('click');
    expect(lines[1]).toContain('/home');
  });

  it('should handle null fields', () => {
    const csv = toCsv([makeEvent({ pageTitle: null, referrer: null, userAgent: null, language: null })]);
    const lines = csv.split('\n');
    expect(lines).toHaveLength(2);
  });

  it('should escape commas in values', () => {
    const csv = toCsv([makeEvent({ pageTitle: 'Hello, World' })]);
    expect(csv).toContain('"Hello, World"');
  });

  it('should escape quotes in values', () => {
    const csv = toCsv([makeEvent({ pageTitle: 'Say "Hello"' })]);
    expect(csv).toContain('"Say ""Hello"""');
  });

  it('should handle multiple events', () => {
    const csv = toCsv([makeEvent(), makeEvent({ componentName: 'Input' })]);
    const lines = csv.split('\n');
    expect(lines).toHaveLength(3);
  });
});

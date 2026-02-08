import { TrackingEventEntity } from '@tracking/domain/entities/tracking-event.entity';

const CSV_HEADER =
  'componentName,variant,action,timestamp,sessionId,pageUrl,pageTitle,referrer,viewportWidth,viewportHeight,userAgent,language';

const escapeCsv = (value: string | null | undefined): string => {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const toCsv = (events: TrackingEventEntity[]): string => {
  const rows = events.map((e) =>
    [
      escapeCsv(e.componentName),
      escapeCsv(e.variant),
      escapeCsv(e.action),
      e.timestamp instanceof Date ? e.timestamp.toISOString() : String(e.timestamp),
      escapeCsv(e.sessionId),
      escapeCsv(e.pageUrl),
      escapeCsv(e.pageTitle),
      escapeCsv(e.referrer),
      e.viewport?.width ?? 0,
      e.viewport?.height ?? 0,
      escapeCsv(e.userAgent),
      escapeCsv(e.language),
    ].join(','),
  );
  return [CSV_HEADER, ...rows].join('\n');
};

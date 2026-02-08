import { Viewport } from '../value-objects/viewport.vo';

export interface TrackingEventEntity {
  readonly id?: string;
  readonly componentName: string;
  readonly variant: string;
  readonly action: string;
  readonly timestamp: Date;
  readonly sessionId: string;
  readonly pageUrl: string;
  readonly pageTitle: string | null;
  readonly referrer: string | null;
  readonly viewport: Viewport;
  readonly userAgent: string | null;
  readonly language: string | null;
  readonly metadata: Record<string, unknown>;
}

export interface CreateTrackingEventInput {
  readonly componentName: string;
  readonly variant: string;
  readonly action: string;
  readonly timestamp: string | Date;
  readonly sessionId: string;
  readonly pageUrl: string;
  readonly pageTitle?: string | null;
  readonly referrer?: string | null;
  readonly viewport?: { width?: number; height?: number };
  readonly userAgent?: string | null;
  readonly language?: string | null;
  readonly metadata?: Record<string, unknown>;
}

export const createTrackingEvent = (input: CreateTrackingEventInput): TrackingEventEntity =>
  Object.freeze({
    componentName: input.componentName,
    variant: input.variant,
    action: input.action,
    timestamp: input.timestamp instanceof Date ? input.timestamp : new Date(input.timestamp),
    sessionId: input.sessionId,
    pageUrl: input.pageUrl,
    pageTitle: input.pageTitle ?? null,
    referrer: input.referrer ?? null,
    viewport: Object.freeze({
      width: input.viewport?.width ?? 0,
      height: input.viewport?.height ?? 0,
    }),
    userAgent: input.userAgent ?? null,
    language: input.language ?? null,
    metadata: Object.freeze({ ...(input.metadata ?? {}) }),
  });

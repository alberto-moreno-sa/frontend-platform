// ── Aggregated Stats (mirrors tracking-service response) ────

export interface StatsSummary {
  totalInteractions: number;
  uniqueSessions: number;
  interactionsLast24h: number;
  interactionsLastHour: number;
  avgInteractionsPerSession: number;
}

export interface ComponentStats {
  componentName: string;
  total: number;
  variants: { variant: string; count: number }[];
}

export interface ActionStats {
  [action: string]: number;
}

export interface PageStats {
  pageUrl: string;
  total: number;
}

export interface DeviceStats {
  mobile: number;
  desktop: number;
  tablet: number;
}

export interface TimelineEntry {
  hour: string;
  count: number;
}

export interface TopInteraction {
  componentName: string;
  variant: string;
  action: string;
  pageUrl: string;
  count: number;
}

export interface AggregatedStats {
  summary: StatsSummary;
  byComponent: ComponentStats[];
  byAction: ActionStats;
  byPage: PageStats[];
  byDevice: DeviceStats;
  topInteractions: TopInteraction[];
  timeline: TimelineEntry[];
  generatedAt: string;
}

// ── SSE live interaction event ──────────────────────────────

export interface LiveInteractionEvent {
  componentName: string;
  variant: string;
  action: string;
  pageUrl: string;
  timestamp: string;
}

// ── Track event payload (POST /api/components/track) ────────

export interface TrackEventPayload {
  componentName: string;
  variant: string;
  action: "click" | "hover" | "focus" | "blur" | "submit" | "view" | "scroll" | "change";
  timestamp: string;
  sessionId: string;
  pageUrl: string;
  pageTitle?: string | null;
  referrer?: string | null;
  viewport?: { width: number; height: number };
  userAgent?: string | null;
  language?: string | null;
  metadata?: Record<string, unknown>;
}

// ── Empty stats fallback ────────────────────────────────────

export const EMPTY_STATS: AggregatedStats = {
  summary: {
    totalInteractions: 0,
    uniqueSessions: 0,
    interactionsLast24h: 0,
    interactionsLastHour: 0,
    avgInteractionsPerSession: 0,
  },
  byComponent: [],
  byAction: {},
  byPage: [],
  byDevice: { mobile: 0, desktop: 0, tablet: 0 },
  topInteractions: [],
  timeline: [],
  generatedAt: new Date().toISOString(),
};

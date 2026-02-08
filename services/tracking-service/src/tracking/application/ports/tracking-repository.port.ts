import { TrackingEventEntity } from '@tracking/domain/entities/tracking-event.entity';

export interface StatsFilters {
  readonly from?: Date;
  readonly to?: Date;
  readonly component?: string;
  readonly page?: string;
}

export interface StatsSummary {
  readonly totalInteractions: number;
  readonly uniqueSessions: number;
  readonly interactionsLast24h: number;
  readonly interactionsLastHour: number;
  readonly avgInteractionsPerSession: number;
}

export interface ComponentStats {
  readonly componentName: string;
  readonly total: number;
  readonly variants: ReadonlyArray<{ variant: string; count: number }>;
}

export interface ActionStats {
  readonly [action: string]: number;
}

export interface PageStats {
  readonly pageUrl: string;
  readonly total: number;
}

export interface DeviceStats {
  readonly mobile: number;
  readonly desktop: number;
  readonly tablet: number;
}

export interface TimelineEntry {
  readonly hour: string;
  readonly count: number;
}

export interface TopInteraction {
  readonly componentName: string;
  readonly variant: string;
  readonly action: string;
  readonly pageUrl: string;
  readonly count: number;
}

export interface AggregatedStats {
  readonly summary: StatsSummary;
  readonly byComponent: ReadonlyArray<ComponentStats>;
  readonly byAction: ActionStats;
  readonly byPage: ReadonlyArray<PageStats>;
  readonly byDevice: DeviceStats;
  readonly topInteractions: ReadonlyArray<TopInteraction>;
  readonly timeline: ReadonlyArray<TimelineEntry>;
  readonly generatedAt: string;
}

export interface TrackingRepositoryPort {
  save(event: Omit<TrackingEventEntity, 'id'>): Promise<TrackingEventEntity>;
  getAggregatedStats(filters: StatsFilters): Promise<AggregatedStats>;
  findAll(filters: StatsFilters): Promise<TrackingEventEntity[]>;
}

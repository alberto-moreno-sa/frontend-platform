import { Model } from 'mongoose';
import { TrackingEventDocument } from '../schemas/tracking-event.schema';
import { TrackingRepositoryPort, AggregatedStats, StatsFilters } from '@tracking/application/ports/tracking-repository.port';
import { TrackingEventEntity } from '@tracking/domain/entities/tracking-event.entity';
import {
  buildMatchStage,
  aggregateSummary,
  aggregateByComponent,
  aggregateByAction,
  aggregateByPage,
  aggregateByDevice,
  aggregateTopInteractions,
  aggregateTimeline,
} from '../aggregations/stats-pipelines';

const toDomain = (doc: TrackingEventDocument): TrackingEventEntity => ({
  id: String(doc._id),
  componentName: doc.componentName,
  variant: doc.variant,
  action: doc.action,
  timestamp: doc.timestamp,
  sessionId: doc.sessionId,
  pageUrl: doc.pageUrl,
  pageTitle: doc.pageTitle,
  referrer: doc.referrer,
  viewport: {
    width: doc.viewport?.width ?? 0,
    height: doc.viewport?.height ?? 0,
  },
  userAgent: doc.userAgent,
  language: doc.language,
  metadata: doc.metadata ?? {},
});

export const createMongoTrackingRepository = (
  model: Model<TrackingEventDocument>,
): TrackingRepositoryPort => ({
  save: async (event: Omit<TrackingEventEntity, 'id'>): Promise<TrackingEventEntity> => {
    const doc = await model.create(event);
    return toDomain(doc);
  },

  getAggregatedStats: async (filters: StatsFilters): Promise<AggregatedStats> => {
    const match = buildMatchStage(filters);

    const [summary, byComponent, byAction, byPage, byDevice, topInteractions, timeline] =
      await Promise.all([
        aggregateSummary(model, match),
        aggregateByComponent(model, match),
        aggregateByAction(model, match),
        aggregateByPage(model, match),
        aggregateByDevice(model, match),
        aggregateTopInteractions(model, match),
        aggregateTimeline(model, match),
      ]);

    return {
      summary,
      byComponent,
      byAction,
      byPage,
      byDevice,
      topInteractions,
      timeline,
      generatedAt: new Date().toISOString(),
    };
  },

  findAll: async (filters: StatsFilters): Promise<TrackingEventEntity[]> => {
    const match = buildMatchStage(filters);
    const docs = await model.find(match).sort({ timestamp: -1 }).lean<TrackingEventDocument[]>();
    return docs.map(toDomain);
  },
});

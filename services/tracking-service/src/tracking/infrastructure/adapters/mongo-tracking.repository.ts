import { Model } from 'mongoose';
import { TrackingEventDocument } from '../schemas/tracking-event.schema';
import { TrackingRepositoryPort, AggregatedStats, StatsFilters } from '@tracking/application/ports/tracking-repository.port';
import { TrackingEventEntity } from '@tracking/domain/entities/tracking-event.entity';
import { logger } from '@common/logger';

const log = logger.child({ component: 'MongoRepository' });
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
    log.debug({ componentName: event.componentName, action: event.action }, 'Saving event');
    const doc = await model.create(event);
    return toDomain(doc);
  },

  getAggregatedStats: async (filters: StatsFilters): Promise<AggregatedStats> => {
    log.debug({ filters }, 'Running aggregation pipeline');
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
    log.debug({ filters }, 'Finding all events');
    const match = buildMatchStage(filters);
    const docs = await model.find(match).sort({ timestamp: -1 }).lean<TrackingEventDocument[]>();
    log.debug({ count: docs.length }, 'Events found');
    return docs.map(toDomain);
  },
});

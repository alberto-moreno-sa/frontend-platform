import { Model } from 'mongoose';
import { TrackingEventDocument } from '../schemas/tracking-event.schema';
import {
  StatsSummary,
  ComponentStats,
  ActionStats,
  PageStats,
  DeviceStats,
  TimelineEntry,
  TopInteraction,
} from '@tracking/application/ports/tracking-repository.port';

type TrackingModel = Model<TrackingEventDocument>;

const buildMatchStage = (filters: {
  from?: Date;
  to?: Date;
  component?: string;
  page?: string;
}): Record<string, unknown> => {
  const match: Record<string, unknown> = {};

  if (filters.from || filters.to) {
    const timestampFilter: Record<string, Date> = {};
    if (filters.from) timestampFilter.$gte = filters.from;
    if (filters.to) timestampFilter.$lte = filters.to;
    match.timestamp = timestampFilter;
  }

  if (filters.component) {
    match.componentName = filters.component;
  }

  if (filters.page) {
    match.pageUrl = filters.page;
  }

  return match;
};

export const aggregateSummary = async (
  model: TrackingModel,
  match: Record<string, unknown>,
): Promise<StatsSummary> => {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

  const [total, uniqueSessions, recent24h, recentHour] = await Promise.all([
    model.countDocuments(match),
    model.distinct('sessionId', match).then((s) => s.length),
    model.countDocuments({ ...match, timestamp: { ...((match.timestamp as object) || {}), $gte: last24h } }),
    model.countDocuments({ ...match, timestamp: { ...((match.timestamp as object) || {}), $gte: lastHour } }),
  ]);

  return {
    totalInteractions: total,
    uniqueSessions,
    interactionsLast24h: recent24h,
    interactionsLastHour: recentHour,
    avgInteractionsPerSession:
      uniqueSessions > 0 ? Math.round((total / uniqueSessions) * 10) / 10 : 0,
  };
};

export const aggregateByComponent = async (
  model: TrackingModel,
  match: Record<string, unknown>,
): Promise<ComponentStats[]> => {
  const result = await model.aggregate([
    { $match: match },
    {
      $group: {
        _id: { componentName: '$componentName', variant: '$variant' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.componentName',
        total: { $sum: '$count' },
        variants: {
          $push: { variant: '$_id.variant', count: '$count' },
        },
      },
    },
    { $sort: { total: -1 } },
  ]);

  return result.map((r) => ({
    componentName: r._id,
    total: r.total,
    variants: r.variants,
  }));
};

export const aggregateByAction = async (
  model: TrackingModel,
  match: Record<string, unknown>,
): Promise<ActionStats> => {
  const result = await model.aggregate([
    { $match: match },
    { $group: { _id: '$action', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const stats: Record<string, number> = {};
  for (const r of result) {
    stats[r._id] = r.count;
  }
  return stats;
};

export const aggregateByPage = async (
  model: TrackingModel,
  match: Record<string, unknown>,
): Promise<PageStats[]> => {
  const result = await model.aggregate([
    { $match: match },
    { $group: { _id: '$pageUrl', total: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: 20 },
  ]);

  return result.map((r) => ({
    pageUrl: r._id,
    total: r.total,
  }));
};

export const aggregateByDevice = async (
  model: TrackingModel,
  match: Record<string, unknown>,
): Promise<DeviceStats> => {
  const result = await model.aggregate([
    { $match: match },
    {
      $project: {
        deviceType: {
          $switch: {
            branches: [
              {
                case: {
                  $regexMatch: { input: { $ifNull: ['$userAgent', ''] }, regex: /mobile|android|iphone|ipod/i },
                },
                then: 'mobile',
              },
              {
                case: {
                  $regexMatch: { input: { $ifNull: ['$userAgent', ''] }, regex: /ipad|tablet/i },
                },
                then: 'tablet',
              },
            ],
            default: 'desktop',
          },
        },
      },
    },
    { $group: { _id: '$deviceType', count: { $sum: 1 } } },
  ]);

  const counts: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };
  for (const r of result) {
    if (r._id === 'mobile' || r._id === 'desktop' || r._id === 'tablet') {
      counts[r._id] = r.count;
    }
  }
  return { mobile: counts.mobile, desktop: counts.desktop, tablet: counts.tablet };
};

export const aggregateTopInteractions = async (
  model: TrackingModel,
  match: Record<string, unknown>,
): Promise<TopInteraction[]> => {
  const result = await model.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          componentName: '$componentName',
          variant: '$variant',
          action: '$action',
          pageUrl: '$pageUrl',
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  return result.map((r) => ({
    componentName: r._id.componentName,
    variant: r._id.variant,
    action: r._id.action,
    pageUrl: r._id.pageUrl,
    count: r.count,
  }));
};

export const aggregateTimeline = async (
  model: TrackingModel,
  match: Record<string, unknown>,
): Promise<TimelineEntry[]> => {
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const result = await model.aggregate([
    { $match: { ...match, timestamp: { ...((match.timestamp as object) || {}), $gte: last24h } } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%dT%H:00:00Z', date: '$timestamp' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, hour: '$_id', count: 1 } },
  ]);

  return result;
};

export { buildMatchStage };

import mongoose, { Schema, Model, Document } from 'mongoose';

export interface TrackingEventDocument extends Document {
  componentName: string;
  variant: string;
  action: string;
  timestamp: Date;
  sessionId: string;
  pageUrl: string;
  pageTitle: string | null;
  referrer: string | null;
  viewport: { width: number; height: number };
  userAgent: string | null;
  language: string | null;
  metadata: Record<string, unknown>;
}

const trackingEventSchema = new Schema(
  {
    componentName: { type: String, required: true, index: true },
    variant: { type: String, required: true, index: true },
    action: { type: String, required: true, index: true },
    timestamp: { type: Date, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    pageUrl: { type: String, required: true },
    pageTitle: { type: String, default: null },
    referrer: { type: String, default: null },
    viewport: {
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    userAgent: { type: String, default: null },
    language: { type: String, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

// Compound indexes for frequent aggregation queries
trackingEventSchema.index({ componentName: 1, variant: 1, action: 1 });
trackingEventSchema.index({ timestamp: -1, componentName: 1 });
trackingEventSchema.index({ sessionId: 1, timestamp: 1 });
trackingEventSchema.index({ pageUrl: 1, componentName: 1 });

export const createTrackingEventModel = (): Model<TrackingEventDocument> =>
  mongoose.model<TrackingEventDocument>('TrackingEvent', trackingEventSchema);

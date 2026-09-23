import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  id: string;
  userId?: string;
  eventName: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    eventName: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const AnalyticsEvent = mongoose.models.AnalyticsEvent || mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);

import mongoose from 'mongoose';

export interface INotification extends mongoose.Document {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'match' | 'synergy_alert' | 'chat' | 'system' | 'profile_verified';
  avatarUrl?: string;
  relatedId?: string;
  read: boolean;
  score?: number;
  createdAt: Date;
}

const NotificationSchema = new mongoose.Schema<INotification>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['match', 'synergy_alert', 'chat', 'system', 'profile_verified'],
      default: 'synergy_alert',
    },
    avatarUrl: { type: String },
    relatedId: { type: String },
    read: { type: Boolean, default: false },
    score: { type: Number },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, read: 1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

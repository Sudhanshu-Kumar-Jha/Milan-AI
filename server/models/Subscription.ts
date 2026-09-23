import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  id: string;
  userId: string;
  planTier: 'free' | 'gold' | 'vip';
  status: 'active' | 'cancelled' | 'expired';
  transactionId?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    planTier: { type: String, enum: ['free', 'gold', 'vip'], default: 'free' },
    status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
    transactionId: { type: String },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 86400 * 1000) },
  },
  { timestamps: true }
);

export const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

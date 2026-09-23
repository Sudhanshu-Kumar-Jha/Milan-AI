import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  safetyFlagged: boolean;
  safetyWarning?: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    id: { type: String, required: true, unique: true, index: true },
    matchId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    safetyFlagged: { type: Boolean, default: false },
    safetyWarning: { type: String },
  },
  { timestamps: true }
);

export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

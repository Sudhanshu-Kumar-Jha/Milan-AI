import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  id: string;
  userId1: string;
  userId2: string;
  candidateId: string;
  compatibilityScore: number;
  scoreBreakdown: {
    valuesScore: number;
    goalsScore: number;
    lifestyleScore: number;
    interestsScore: number;
    explanation: string;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'superlike';
  candidateData?: any;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId1: { type: String, required: true, index: true },
    userId2: { type: String, index: true },
    candidateId: { type: String, required: true },
    compatibilityScore: { type: Number, required: true },
    scoreBreakdown: {
      valuesScore: { type: Number, default: 80 },
      goalsScore: { type: Number, default: 80 },
      lifestyleScore: { type: Number, default: 80 },
      interestsScore: { type: Number, default: 80 },
      explanation: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'superlike'],
      default: 'pending',
    },
    candidateData: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Match = mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);

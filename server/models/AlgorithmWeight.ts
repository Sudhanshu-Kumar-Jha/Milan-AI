import mongoose, { Schema, Document } from 'mongoose';

export interface IAlgorithmWeight extends Document {
  valuesWeight: number;
  goalsWeight: number;
  lifestyleWeight: number;
  interestsWeight: number;
  updatedAt: Date;
}

const AlgorithmWeightSchema = new Schema<IAlgorithmWeight>(
  {
    valuesWeight: { type: Number, default: 0.40 },
    goalsWeight: { type: Number, default: 0.30 },
    lifestyleWeight: { type: Number, default: 0.20 },
    interestsWeight: { type: Number, default: 0.10 },
  },
  { timestamps: true }
);

export const AlgorithmWeight = mongoose.models.AlgorithmWeight || mongoose.model<IAlgorithmWeight>('AlgorithmWeight', AlgorithmWeightSchema);

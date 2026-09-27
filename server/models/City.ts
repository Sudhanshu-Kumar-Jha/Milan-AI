import mongoose, { Schema, Document } from 'mongoose';

export interface ICity extends Document {
  name: string;
  state?: string;
  isActive: boolean;
  order: number;
}

const CitySchema = new Schema<ICity>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    state: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const City = mongoose.models.City || mongoose.model<ICity>('City', CitySchema);

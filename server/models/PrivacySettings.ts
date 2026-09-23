import mongoose, { Schema, Document } from 'mongoose';

export interface IPrivacySettings extends Document {
  userId: string;
  hideExactLocation: boolean;
  maskEmail: boolean;
  blurPhotosUntilMatch: boolean;
  blockContactSync: boolean;
  updatedAt: Date;
}

const PrivacySettingsSchema = new Schema<IPrivacySettings>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    hideExactLocation: { type: Boolean, default: true },
    maskEmail: { type: Boolean, default: true },
    blurPhotosUntilMatch: { type: Boolean, default: false },
    blockContactSync: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const PrivacySettings = mongoose.models.PrivacySettings || mongoose.model<IPrivacySettings>('PrivacySettings', PrivacySettingsSchema);

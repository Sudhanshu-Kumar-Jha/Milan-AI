import mongoose, { Schema, Document } from 'mongoose';

export interface IPrivacySettings extends Document {
  userId: string;
  isProfileVisible: boolean;
  incognitoMode: boolean;
  hideExactLocation: boolean;
  maskEmail: boolean;
  blurPhotosUntilMatch: boolean;
  blockContactSync: boolean;
  updatedAt: Date;
}

const PrivacySettingsSchema = new Schema<IPrivacySettings>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    isProfileVisible: { type: Boolean, default: true },
    incognitoMode: { type: Boolean, default: false },
    hideExactLocation: { type: Boolean, default: true },
    maskEmail: { type: Boolean, default: true },
    blurPhotosUntilMatch: { type: Boolean, default: false },
    blockContactSync: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const PrivacySettings = mongoose.models.PrivacySettings || mongoose.model<IPrivacySettings>('PrivacySettings', PrivacySettingsSchema);

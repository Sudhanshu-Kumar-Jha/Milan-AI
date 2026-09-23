import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  id: string;
  email: string;
  emailMasked: string;
  displayName: string;
  age: number;
  gender: string;
  city: string;
  distanceBucket?: string;
  bio?: string;
  avatarUrl?: string;
  photos: string[];
  coreValues: {
    familyValues: number;
    careerAmbition: number;
    financialOutlook: number;
    spontaneity: number;
    emotionalExpressiveness: number;
  };
  relationshipGoals: string;
  lifestyle: {
    dietary: string;
    smoking: string;
    drinking: string;
    fitness: string;
    pets: string;
  };
  interests: string[];
  verificationStatus: 'verified' | 'pending' | 'unverified';
  isPremium: boolean;
  premiumTier: 'free' | 'gold' | 'vip';
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, default: 'aarav.sharma@milanai.com' },
    emailMasked: { type: String, required: true, default: 'aa***@milanai.com' },
    displayName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    city: { type: String, required: true },
    distanceBucket: { type: String, default: '< 10 km' },
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    photos: { type: [String], default: [] },
    coreValues: {
      familyValues: { type: Number, default: 5 },
      careerAmbition: { type: Number, default: 5 },
      financialOutlook: { type: Number, default: 5 },
      spontaneity: { type: Number, default: 5 },
      emotionalExpressiveness: { type: Number, default: 5 },
    },
    relationshipGoals: { type: String, default: 'Marriage / Long-term' },
    lifestyle: {
      dietary: { type: String, default: 'Vegetarian' },
      smoking: { type: String, default: 'Never' },
      drinking: { type: String, default: 'Socially' },
      fitness: { type: String, default: 'Active' },
      pets: { type: String, default: 'Dog lover' },
    },
    interests: { type: [String], default: [] },
    verificationStatus: { type: String, enum: ['verified', 'pending', 'unverified'], default: 'pending' },
    isPremium: { type: Boolean, default: false },
    premiumTier: { type: String, enum: ['free', 'gold', 'vip'], default: 'free' },
  },
  { timestamps: true }
);

export const Profile = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  id: string;
  email: string;
  emailMasked: string;
  phone?: string;
  phoneMasked?: string;
  displayName: string;
  age: number;
  dob?: string;
  gender: string;
  city: string;
  occupation?: string;
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
  lookingFor?: string[];
  languages?: string[];
  ageRangePreference?: { min: number; max: number };
  locationPreference?: string;
  communicationStyle?: string;
  weekendAvailability?: string;
  approximateBudget?: string;
  travelStyle?: string;
  lifestyle: {
    dietary: string;
    smoking: string;
    drinking: string;
    fitness: string;
    pets: string;
  };
  interests: string[];
  verificationStatus: 'verified' | 'pending' | 'unverified';
  isLiveCameraVerified?: boolean;
  cameraFilterUsed?: string;
  isPremium: boolean;
  premiumTier: 'free' | 'gold' | 'vip';
  lastActive?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, default: 'aarav.sharma@milanai.com' },
    emailMasked: { type: String, required: true, default: 'aa***@milanai.com' },
    phone: { type: String },
    phoneMasked: { type: String },
    displayName: { type: String, required: true },
    age: { type: Number, required: true },
    dob: { type: String },
    gender: { type: String, required: true },
    city: { type: String, required: true },
    occupation: { type: String, default: 'Professional' },
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
    relationshipGoals: { type: String, default: 'Marriage & Long-term' },
    lookingFor: { type: [String], default: ['Dating', 'Serious relationship / life partner'] },
    languages: { type: [String], default: ['Hindi', 'English'] },
    ageRangePreference: {
      min: { type: Number, default: 21 },
      max: { type: Number, default: 32 },
    },
    locationPreference: { type: String, default: 'Delhi NCR' },
    communicationStyle: { type: String, default: 'Texting & Calls' },
    weekendAvailability: { type: String, default: 'Saturday & Sunday' },
    approximateBudget: { type: String, default: '₹6,000–₹10,000' },
    travelStyle: { type: String, default: 'Relaxed & Sightseeing' },
    lifestyle: {
      dietary: { type: String, default: 'Vegetarian' },
      smoking: { type: String, default: 'Never' },
      drinking: { type: String, default: 'Socially' },
      fitness: { type: String, default: 'Active' },
      pets: { type: String, default: 'Dog lover' },
    },
    interests: { type: [String], default: [] },
    verificationStatus: { type: String, enum: ['verified', 'pending', 'unverified'], default: 'pending' },
    isLiveCameraVerified: { type: Boolean, default: true },
    cameraFilterUsed: { type: String, default: 'ai_beautify' },
    isPremium: { type: Boolean, default: false },
    premiumTier: { type: String, enum: ['free', 'gold', 'vip'], default: 'free' },
    lastActive: { type: Date },
  },
  { timestamps: true }
);

ProfileSchema.index({ gender: 1, city: 1 });
ProfileSchema.index({ email: 1 });
ProfileSchema.index({ lastActive: -1 });

export const Profile = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/milanai';

export const connectDB = async (): Promise<boolean> => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`🚀 [MongoDB] Connected successfully to: ${MONGODB_URI}`);
    return true;
  } catch (error: any) {
    console.warn(`⚠️ [MongoDB] Connection error (${error.message}). Running with mock/memory fallback.`);
    return false;
  }
};

export const isDbConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

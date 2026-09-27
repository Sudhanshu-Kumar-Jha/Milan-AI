import crypto from 'node:crypto';
if (typeof (globalThis as any).crypto === 'undefined') {
  (globalThis as any).crypto = crypto;
}

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/milanai';

export const connectDB = async (): Promise<boolean> => {
  try {
    mongoose.set('strictQuery', false);
    const maskedUri = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
    console.log(`📡 [MongoDB] Attempting connection to: ${maskedUri}`);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log(`🚀 [MongoDB] Connected successfully to: ${maskedUri}`);
    return true;
  } catch (error: any) {
    console.error(`❌ [MongoDB] Connection failed: ${error.message}`);
    return false;
  }
};

export const isDbConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

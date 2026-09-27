import crypto from 'node:crypto';
if (typeof (globalThis as any).crypto === 'undefined') {
  (globalThis as any).crypto = crypto;
}

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isDbConnected } from './config/db';
import { seedDatabase } from './seed';
import { authRouter } from './routes/authRoutes';
import { profileRouter } from './routes/profileRoutes';
import { matchRouter } from './routes/matchRoutes';
import { chatRouter } from './routes/chatRoutes';
import { subscriptionRouter } from './routes/subscriptionRoutes';
import { adminRouter } from './routes/adminRoutes';
import { configRouter } from './routes/configRoutes';
import { notificationRouter } from './routes/notificationRoutes';
import { postRouter } from './routes/postRoutes';
import { Profile } from './models/Profile';
import { apiRateLimiter } from './middleware/rateLimiter';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = '0.0.0.0';

// High-performance gzip/deflate compression
app.use(compression());

// Middlewares
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Global load protection rate limiter for API requests
app.use('/api', apiRateLimiter);

// Prevent caching on API endpoints so client always receives 100% live presence and messages
app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Serve local static assets (avatars & images hosted strictly on our server)
app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Root welcome endpoint for Railway health monitoring & REST API status
app.get('/', (_req, res) => {
  res.json({
    name: 'Milan AI Production REST API',
    status: 'online',
    health: '/api/health',
    version: '1.0.0',
    database: isDbConnected() ? 'connected' : 'connecting',
    timestamp: new Date().toISOString(),
  });
});

// Health & System Status Endpoint for Railway & monitoring
app.get('/api/health', (_req, res) => {
  const dbStatus = isDbConnected();
  res.json({
    status: 'ok',
    database: 'MongoDB',
    connected: dbStatus,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Mount REST API Routes
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/matches', matchRouter);
app.use('/api/chat', chatRouter);
app.use('/api/subscriptions', subscriptionRouter);
app.use('/api/admin', adminRouter);
app.use('/api/config', configRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/posts', postRouter);

// Start Server & Connect MongoDB (Non-blocking so HTTP proxy binds in <10ms)
app.listen(PORT, HOST, () => {
  console.log(`\n==============================================`);
  console.log(`🚀 Milan AI Backend Server Listening on port ${PORT} (${HOST})`);
  console.log(`📡 Health Check Ready: /api/health`);
  console.log(`==============================================\n`);

  connectDB().then(async (connected) => {
    if (connected) {
      try {
        const profileCount = await Profile.countDocuments();
        if (profileCount === 0) {
          console.log('🔄 Initializing MongoDB seed data...');
          await seedDatabase();
        }
      } catch (err: any) {
        console.error(`⚠️ Seed check failed: ${err.message}`);
      }
    }
  }).catch((err) => {
    console.error(`❌ Background DB connection failed: ${err.message}`);
  });
});

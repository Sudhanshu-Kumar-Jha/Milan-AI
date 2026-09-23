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
import { Profile } from './models/Profile';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health & System Status Endpoint
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

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/matches', matchRouter);
app.use('/api/chat', chatRouter);
app.use('/api/subscriptions', subscriptionRouter);
app.use('/api/admin', adminRouter);

// Start Server & Connect MongoDB
async function startServer() {
  const connected = await connectDB();
  if (connected) {
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      console.log('🔄 Initializing MongoDB seed data...');
      await seedDatabase();
    }
  }

  app.listen(PORT, () => {
    console.log(`\n==============================================`);
    console.log(`🚀 MilanAI MongoDB Backend Running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`==============================================\n`);
  });
}

startServer();

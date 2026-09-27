import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // 1. Core Server & Database
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/milanai',
  jwtSecret: process.env.JWT_SECRET || 'milan_dev_secret_key_2026_mindful_matrimony',

  // 2. AI Powered Matchmaking & Safety (Gemini / OpenAI / Default Deterministic Engine)
  ai: {
    provider: process.env.AI_PROVIDER || 'default', // 'gemini' | 'openai' | 'default'
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    isConfigured: Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY),
  },

  // 4. Payment Gateway (Razorpay / Stripe / Default Instant Sandbox)
  payment: {
    provider: process.env.PAYMENT_PROVIDER || 'default', // 'razorpay' | 'stripe' | 'default'
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    defaultMode: 'instant_sandbox_approval',
    isConfigured: Boolean(process.env.RAZORPAY_KEY_ID || process.env.STRIPE_SECRET_KEY),
  },

  // 5. Email & OTP Service (MailHog / Local SMTP / Custom SMTP)
  email: {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '1025', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || '"Milan AI Support" <noreply@milanai.com>',
    mailhogWebUrl: process.env.MAILHOG_WEB_URL || 'http://localhost:8025',
    defaultTestOtp: process.env.DEFAULT_TEST_OTP || '123456',
  },

  // 6. Client
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
};

export const envConfig = config;


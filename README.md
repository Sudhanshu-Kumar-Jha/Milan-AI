# 💖 Milan AI — Open Source Matchmaking & Matrimony Backend Engine

> An AI-powered, 5-dimensional compatibility matchmaking and privacy-first matrimony server built with Node.js, Express, MongoDB, and MailHog.

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Mongoose-emerald.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Key Features

1. **5-Dimensional AI Compatibility Engine**:
   - Calculates relationship synergy based on Family Values, Career Ambition, Financial Prudence, Spontaneity, and Emotional Expressiveness.
   - Dynamic weight tuning via `/api/admin/algorithm/weights`.
2. **Privacy Shield & PII Interception**:
   - Automatic regex and agent interception for phone numbers and private email sharing prior to mutual verification.
   - Real-time logging to admin moderation queue.
3. **Email & Local SMTP Service (MailHog)**:
   - Complete local SMTP testing integration with MailHog (SMTP on port `1025`, Web UI on port `8025`).
   - Styled dark-theme HTML OTP verification emails.
4. **Instant Sandbox Payments**:
   - Modular payment gateway architecture supporting Razorpay, Stripe, and instant development sandbox approvals.
5. **Multi-Metro Seed Dataset**:
   - Ready-to-use seed script with 11 rich Indian candidate profiles across Bengaluru, Mumbai, Delhi NCR, Pune, Chennai, Hyderabad, and Kolkata.

---

## 📁 Repository Structure

```
├── server/
│   ├── config/             # DB, Email, AI, SMS, Payment & Env Configurations
│   │   ├── ai.ts           # AI Engine & Safety Filter
│   │   ├── db.ts           # MongoDB Connection Manager
│   │   ├── email.ts        # Nodemailer & MailHog SMTP Transporter
│   │   ├── env.ts          # Central Environment Validator
│   │   ├── payment.ts      # Subscription & Checkout Handler
│   │   └── sms.ts          # SMS & OTP Service
│   ├── models/             # Mongoose Schemas & TypeScript Models
│   │   ├── AlgorithmWeight.ts
│   │   ├── AnalyticsEvent.ts
│   │   ├── Match.ts
│   │   ├── Message.ts
│   │   ├── PrivacySettings.ts
│   │   ├── Profile.ts
│   │   └── Subscription.ts
│   ├── routes/             # RESTful API Endpoints
│   │   ├── adminRoutes.ts
│   │   ├── authRoutes.ts
│   │   ├── chatRoutes.ts
│   │   ├── matchRoutes.ts
│   │   ├── profileRoutes.ts
│   │   └── subscriptionRoutes.ts
│   ├── seed.ts             # Database Seeder (11 Profiles, Matches, Chats)
│   ├── index.ts            # Main Express Server Entrypoint
│   └── AGENTS.md           # Backend Agent & Architecture Spec
├── docs/                   # Full API & Agent Specifications
│   ├── API_SPECIFICATION.md
│   ├── AI_AGENT_SPECIFICATION.md
│   └── CREDENTIALS_AND_ENV_GUIDE.md
├── .env.example            # Environment Configuration Template
└── package.json            # Server Dependencies & Scripts
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or v20+)
- [MongoDB](https://www.mongodb.com/) running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI

### 2. Installation
```bash
git clone https://github.com/Sudhanshu-Kumar-Jha/Milan-AI.git
cd Milan-AI
npm install
```

### 3. Configure Environment
Copy the `.env.example` file:
```bash
cp .env.example .env
```

### 4. Run MailHog (Local SMTP & Email Inbox)
```bash
npm run mailhog
```
- **SMTP Port**: `1025`
- **MailHog Web UI**: [http://localhost:8025](http://localhost:8025)

### 5. Seed the Database
```bash
npm run seed
```

### 6. Start the Server
```bash
npm run server
```
- **Server URL**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📡 API Reference Overview

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `GET /api/health` | GET | Health & MongoDB connectivity status |
| `POST /api/auth/otp/send` | POST | Dispatches 6-digit OTP email to MailHog |
| `POST /api/auth/otp/verify` | POST | Verifies OTP code and authenticates profile |
| `GET /api/profile/me` | GET | Current authenticated user profile |
| `PATCH /api/profile/me` | PATCH | Updates profile information |
| `PUT /api/profile/vectors` | PUT | Updates 5-dimensional compatibility vectors |
| `GET /api/matches/feed` | GET | Feed of candidate profiles with AI synergy score |
| `POST /api/matches/action` | POST | Submits Like / Pass / SuperLike action |
| `GET /api/chat/conversations` | GET | Retrieves mutual matches & chat channels |
| `POST /api/chat/messages` | POST | Dispatches message with PII privacy scan |
| `GET /api/subscriptions/tiers` | GET | Lists membership subscription tiers |
| `POST /api/subscriptions/checkout` | POST | Processes membership upgrade |
| `GET /api/admin/algorithm/weights` | GET | Retrieves AI vector weights |
| `PUT /api/admin/algorithm/weights` | PUT | Tunes AI vector weights |
| `GET /api/admin/moderation/queue` | GET | Retrieves safety flagged messages |

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

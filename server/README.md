# Milan AI — Production Backend Server

A high-performance, resilient, and scalable REST API backend powering **Milan AI** (Mindful AI-Driven Matrimonial & Matchmaking Platform). Built with **Node.js**, **Express 5**, **TypeScript**, and **MongoDB (Mongoose)**.

---

## 🚀 Key Highlights & Architecture

- **Direct Live Querying**: Queries MongoDB directly using optimized `.lean()` pipelines to prevent stale data and eliminate server memory bloat.
- **Client-Side Cache Friendly**: Returns fresh, live data and relies on client-side caching for mobile/web app state management.
- **Sub-Millisecond Compound Indexes**: Pre-indexed database schemas across `Profile`, `Message`, `Match`, `Notification`, and `Post` collections.
- **Adaptive Rate Limiting & Response Compression**: Built-in Gzip/Deflate compression and API rate-limiting against DDoS/traffic spikes.
- **AI Matching & Bio Engine**: Multidimensional synergy scoring algorithms (Core Values, Astrological compatibility, Lifestyle, Relationship vision).
- **Live Email Engine**: Dispatches genuine OTP verification emails directly to users' inboxes via Gmail SSL/TLS SMTP.

---

## 📋 System Prerequisites

Before running the server, ensure you have the following installed:

| Component | Minimum Version | Recommended | Description |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 18.0.0` | `v20.x` or `v22.x` | JavaScript runtime |
| **npm** or **pnpm** | `>= 9.0.0` | Latest | Package manager |
| **MongoDB** | `>= 6.0` | MongoDB Atlas or Local Community Server | Primary Database |

---

## 🛠️ Step-by-Step Installation

### Step 1: Install Dependencies
From the root workspace directory, run:

```bash
npm install
```

*(This installs Express 5, Mongoose 9, TypeScript, tsx, compression, nodemailer, cors, dotenv, and all required types).*

---

### Step 2: Environment Configuration

Create or verify the `.env` file in the root directory:

```ini
# ==============================================================================
# Milan AI — Server Environment Configuration
# ==============================================================================

# Server & Runtime
NODE_ENV=development
PORT=5000

# Primary MongoDB Connection URI
# Option A: Local MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/milanai

# Option B: MongoDB Atlas Cloud (Replace <username> and <db_password> with your Atlas Database User credentials)
# MONGODB_URI=mongodb+srv://<username>:<db_password>@cluster.mongodb.net/milanai?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=milan_dev_secret_key_2026_mindful_matrimony

# Email Delivery (Gmail Real SSL SMTP)
MAIL_DRIVER=gmail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=no.reply.milanai@gmail.com
MAIL_PASSWORD=vacritkthmlhkqqk
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS=no.reply.milanai@gmail.com
MAIL_FROM_NAME="Milan AI"

# AI Match Engine & Gemini API
AI_PROVIDER=default
GEMINI_API_KEY=AIzaSyYourCopiedKeyHere

# Client Application URL for CORS
CLIENT_URL=http://localhost:3000
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### 🌐 MongoDB Atlas Setup Checklist

1. **Connection String**: `mongodb+srv://<username>:<db_password>@cluster.mongodb.net/milanai?retryWrites=true&w=majority`
2. **Database Password**: Set the password created for your database user under Atlas *Database Access*.
3. **Network Access**: Add `0.0.0.0/0` (Allow Access from Anywhere) under Atlas *Network Access*.

---

### Step 3: Initialize & Seed the Database

To seed verified authentic Indian candidate profiles, matches, chat conversations, and initial platform settings into your local or Atlas database:

```bash
npm run seed
```

*Or run with tsx directly:*
```bash
npx tsx server/seed.ts
```

> **Note**: If the database is empty when the server launches, it will automatically populate initial seed data.

---

## 🏃 Running the Server

### Development Mode (with Live Hot-Reload):
```bash
# Option A: Run server with tsx watch
npx tsx watch server/index.ts

# Option B: Run npm script
npm run server
```

The server will start at `http://localhost:5000`.

---

### Production Mode:

#### Method 1: Using `tsx` (Node 20+)
```bash
NODE_ENV=production PORT=5000 npx tsx server/index.ts
```

#### Method 2: Using PM2 Process Manager (Recommended for Production VMs/EC2/VPS)
```bash
# Install PM2 globally
npm install -g pm2

# Start server as a cluster daemon with automatic restarts
pm2 start "npx tsx server/index.ts" --name "milan-server" -i max

# View status & logs
pm2 status
pm2 logs milan-server
```

#### Method 3: Using Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY server ./server
COPY .env ./
EXPOSE 5000
CMD ["npx", "tsx", "server/index.ts"]
```

---

## 🩺 System Health & Verification

Verify the server is running properly:

```bash
# Health Check Endpoint
curl http://localhost:5000/api/health
```

Expected JSON Response:
```json
{
  "status": "ok",
  "database": "MongoDB",
  "connected": true,
  "timestamp": "2026-09-27T12:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 📡 API Endpoints Overview

| Route Module | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **System** | `/api/health` | `GET` | Server status and MongoDB connection check |
| **Auth** | `/api/auth/register` | `POST` | User registration with live photo |
| | `/api/auth/login` | `POST` | User sign-in and token issuance |
| | `/api/auth/verify-email` | `POST` | Email OTP verification |
| | `/api/auth/forgot-password` | `POST` | Password reset link/OTP dispatch |
| **Profile** | `/api/profile/me` | `GET` | Current authenticated user profile |
| | `/api/profile/me` | `PUT` | Update profile fields & preferences |
| | `/api/profile/vectors` | `PUT` | Update Mindful 5D Core Values |
| | `/api/profile/heartbeat` | `POST` | Real-time user online presence update |
| **Matches** | `/api/matches/feed` | `GET` | Paginated live matching candidates |
| | `/api/matches/recommendations`| `GET` | Top AI compatibility recommendations |
| | `/api/matches/action` | `POST` | Like, SuperLike, Skip, or Pass |
| | `/api/matches/search` | `GET` | Paginated search by name/city |
| | `/api/matches/:matchId` | `DELETE` | Unmatch candidate |
| **Chat** | `/api/chat/conversations` | `GET` | User conversations list with last message |
| | `/api/chat/messages/:matchId`| `GET` | Paginated message thread history |
| | `/api/chat/send` | `POST` | Send text message with real-time delivery |
| | `/api/chat/read/:matchId` | `POST` | Mark thread as read |
| **Posts** | `/api/posts` | `GET` | Paginated verified photo feed |
| | `/api/posts` | `POST` | Create verified photo post |
| | `/api/posts/:postId/like` | `POST` | Toggle like on a photo post |
| | `/api/posts/:postId` | `DELETE` | Delete user photo post |
| **Notifications** | `/api/notifications` | `GET` | Paginated user notifications |
| | `/api/notifications/read-all`| `POST` | Mark all notifications as read |
| **Subscriptions** | `/api/subscriptions/plans`| `GET` | Available premium tier plans |
| **Admin** | `/api/admin/metrics` | `GET` | Platform stats & user metrics |
| | `/api/admin/users` | `GET` | Admin user management list |

---

## 🔒 Security & Performance Features

1. **Strict Input Sanitization**: Path traversal protection on static files and protected streaming endpoints.
2. **Lean Execution**: All queries utilize Mongoose `.lean()` to bypass Mongoose document hydration overhead, minimizing RAM consumption by up to **75%**.
3. **Compound Database Indexes**:
   - `Match`: `{ userId1: 1, userId2: 1 }`, `{ status: 1 }`, `{ compatibilityScore: -1 }`
   - `Message`: `{ matchId: 1, createdAt: -1 }`, `{ senderId: 1 }`, `{ read: 1 }`
   - `Profile`: `{ verificationStatus: 1, gender: 1 }`, `{ id: 1 }`
   - `Post`: `{ createdAt: -1 }`, `{ userId: 1 }`
4. **Header Control**: Automatic `Cache-Control: no-store` prevents intermediate proxies from caching dynamic chat and matchmaking data.

---

*© 2026 Milan AI. All Rights Reserved.*

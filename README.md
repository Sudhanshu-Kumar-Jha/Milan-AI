# ✨ Milan AI — Production Server & Matrimonial Engine

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Mongoose-emerald.svg)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-blue.svg)](https://www.typescriptlang.org/)
[![Gmail SMTP](https://img.shields.io/badge/Email-Gmail%20SMTP%20SSL-red.svg)](https://mail.google.com/)

A high-performance, production-ready, AI-driven Matrimonial & Matchmaking REST API server. Built with **Express 5**, **TypeScript**, **MongoDB (Mongoose)**, and **Gmail SMTP SSL/TLS**.

---

## 📁 Clean Repository Structure

```
Milan-AI/
├── server/                      # Production Backend Server
│   ├── config/                  # MongoDB, Gmail SMTP & Environment Config
│   ├── controllers/             # Auth, Matches, Chat, Profile, Posts, Notifications, Admin
│   ├── models/                  # Mongoose Schemas (Compound Indexed, Lean Queries)
│   ├── routes/                  # Express RESTful API Endpoints
│   ├── services/                # AI Match Synergy Engine, AI Bio Generator
│   ├── public/                  # Authenticated & Hosted Static Assets / Avatars
│   ├── index.ts                 # Express Server Entrypoint
│   ├── seed.ts                  # Database Seeder (Verified Demo Profiles & Chats)
│   └── README.md                # Server-specific documentation
│
├── app/                         # Frontend Web & Mobile Application (Vite + React)
│   ├── src/                     # React Pages, Components, State Contexts & API Client
│   ├── public/                  # Static assets & icons
│   ├── package.json             # App scripts & dependencies
│   └── vite.config.ts           # App build configuration
│
├── .env                         # Master Environment Configuration
├── .env.example                 # Environment Template
├── package.json                 # Unified Root Scripts
└── README.md                    # Main Documentation & Installation Guide
```

---

## 📋 System Prerequisites

| Component | Minimum Version | Recommended | Purpose |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 18.0.0` | `v20.x` or `v22.x` | Runtime Environment |
| **npm** | `>= 9.0.0` | Latest | Package Manager |
| **MongoDB** | `>= 6.0` | MongoDB Atlas or Local Community Server | Primary Database |
| **Gmail Account** | Active | App Password Enabled | Real Email & OTP Dispatch |

---

## 🛠️ Step-by-Step Server Installation & Setup

### Step 1: Clone and Install Dependencies

```bash
git clone https://github.com/Sudhanshu-Kumar-Jha/Milan-AI.git
cd Milan-AI
npm install
```

---

### Step 2: Cloud Environment Configuration

Configure your environment variables in your cloud hosting provider (e.g. **Railway Variables** or root `.env`):

```ini
# ==============================================================================
# Milan AI — Master Production Environment Configuration
# ==============================================================================

# 1. Server & Database
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<db_password>@cluster.mongodb.net/milanai?retryWrites=true&w=majority
JWT_SECRET=milan_prod_secret_2026_mindful_matrimony

# 2. Real Gmail SMTP SSL OTP Delivery
MAIL_DRIVER=gmail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=no.reply.milanai@gmail.com
MAIL_PASSWORD=vacritkthmlhkqqk
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS=no.reply.milanai@gmail.com
MAIL_FROM_NAME="Milan AI"

# 3. AI Features & Security
AI_PROVIDER=default
GEMINI_API_KEY=AIzaSyYourCopiedKeyHere

# 4. CORS Client Allowance
CLIENT_URL=*
```

---

### 🌐 MongoDB Atlas Setup (Cloud Database)

1. **Obtain Connection URI:**
   - In MongoDB Atlas, go to **Clusters** → **Connect** → **Drivers** (Node.js).
   - Copy connection string:
     ```text
     mongodb+srv://<username>:<db_password>@cluster.mongodb.net/milanai?retryWrites=true&w=majority
     ```
2. **Database User Credentials:**
   - Replace `<username>` and `<db_password>` with your Atlas database user credentials (*Security → Database Access*).
3. **Network Access (Crucial for Cloud Deployments):**
   - Go to Atlas → **Security** → **Network Access** → Click **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`) and click **Confirm**.

---

### Step 3: Seed Database via Railway Console / Cloud CLI

To populate the cloud database with 11 authentic verified Indian profiles, match synergies, chats, and posts:

**Option A (Automatic):**
The server automatically detects if the database is empty on boot and runs the seed sequence on first start.

**Option B (Railway Cloud Console):**
Open your server service in Railway → click **"CLI"** / **"Terminal"** tab and run:
```bash
npx tsx server/seed.ts
```

---

### Step 4: Start the Server

#### Development Mode (with Live Reload):
```bash
npm run server
```
*Or watch directly:*
```bash
npx tsx watch server/index.ts
```

#### Production Mode:
```bash
NODE_ENV=production PORT=5000 npx tsx server/index.ts
```

---

### Step 5: Verify Health Check

Open in your browser or run via terminal:
```bash
curl http://localhost:5000/api/health
```

Expected Output:
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

## 🚀 Deploying Server to Railway (Production Guide)

Deploying the Milan AI server so all users can access it globally takes just 3 steps:

### 1. Create a Railway Project & Provision MongoDB
1. Go to [Railway.app](https://railway.app) and sign in.
2. Click **"+ New Project"** → select **"Provision MongoDB"**.
3. In the MongoDB service **Variables** tab, copy the **`MONGO_URL`**.

### 2. Deploy Server from GitHub
1. In the same project, click **"+ New"** → **"GitHub Repo"** → select your `Milan-AI` repository.
2. In the service **Settings**:
   - **Build Command**: `npm install`
   - **Start Command**: `npx tsx server/index.ts`
3. In the service **Variables** tab, add:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production mode |
| `PORT` | `5000` | Server listening port |
| `MONGODB_URI` | `${{MongoDB.MONGO_URL}}` | Connects directly to Railway MongoDB |
| `JWT_SECRET` | `milan_prod_secret_2026_secure` | Auth token signing secret |
| `MAIL_DRIVER` | `gmail` | Direct real email |
| `MAIL_HOST` | `smtp.gmail.com` | Gmail SMTP host |
| `MAIL_PORT` | `465` | SSL Port |
| `MAIL_USERNAME` | `no.reply.milanai@gmail.com` | Your Gmail address |
| `MAIL_PASSWORD` | `vacritkthmlhkqqk` | 16-character Google App Password |
| `MAIL_ENCRYPTION` | `ssl` | SSL encryption |
| `MAIL_FROM_ADDRESS` | `no.reply.milanai@gmail.com` | Sender address |
| `MAIL_FROM_NAME` | `Milan AI` | Sender brand name |
| `CLIENT_URL` | `*` | Allowed CORS origins |

4. Under **Networking**, click **"Generate Domain"** (e.g. `https://milan-server-production.up.railway.app`).

### 3. Initialize Production Database
1. Open the Railway Web Terminal for your server service.
2. Run:
   ```bash
   npx tsx server/seed.ts
   ```

---

## 📡 Complete REST API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/otp/send` — Dispatches 6-digit verification PIN to real user email inbox.
- `POST /api/auth/otp/verify` — Validates PIN and issues JWT access token.
- `GET  /api/auth/me` — Returns authenticated user profile.
- `POST /api/auth/logout` — Terminates user session.

### 👤 Profile Management (`/api/profile`)
- `GET   /api/profile/me` — Retrieves current user profile & privacy settings.
- `PATCH /api/profile/me` — Updates profile bio, location, job, and preferences.
- `PUT   /api/profile/vectors` — Updates Mindful 5D Core Value vectors.
- `POST  /api/profile/generate-bio` — AI bio generator tailored to user's passions and city.
- `POST  /api/profile/heartbeat` — Updates user's real-time online presence.
- `GET   /api/profile/photo/:filename` — Secure streaming of authenticated profile photos.

### 💘 Matchmaking & Discovery (`/api/matches`)
- `GET    /api/matches/feed` — Paginated matching candidate profiles.
- `GET    /api/matches/recommendations` — Top AI-scored synergies.
- `POST   /api/matches/action` — Handles `accepted` (Like), `superlike`, `rejected` (Pass), or `skip`.
- `GET    /api/matches/search` — Fast name/city candidate search.
- `DELETE /api/matches/:matchId` — Cancels match connection.

### 💬 Real-Time Chat (`/api/chat`)
- `GET  /api/chat/conversations` — Active conversation threads with unread counters.
- `GET  /api/chat/messages/:matchId` — Paginated message thread history.
- `POST /api/chat/send` — Sends real-time message with PII privacy scan.
- `POST /api/chat/read/:matchId` — Marks conversation messages as read.

### 📸 Verified Posts Feed (`/api/posts`)
- `GET    /api/posts` — Paginated verified member photo feed with author details.
- `POST   /api/posts` — Uploads and posts a verified photo.
- `POST   /api/posts/:postId/like` — Toggles like on a post.
- `DELETE /api/posts/:postId` — Deletes own photo post.

### 🔔 Notifications & System (`/api/notifications`)
- `GET  /api/notifications` — User notifications list.
- `POST /api/notifications/read-all` — Marks all notifications as read.
- `GET  /api/health` — System status & MongoDB connection check.

---

## 🛡️ Performance & Reliability

1. **Zero Memory Caching on Server**: The backend executes live, high-speed MongoDB queries using `.lean()`, preventing memory bloat and stale cache states.
2. **Compound Index Optimization**: Instant search and pagination queries indexed across `Match`, `Message`, `Profile`, `Post`, and `Notification` schemas.
3. **HTTP Compression & Security**: Built-in Gzip/Deflate compression and request rate-limiting protection.

---

*© 2026 Milan AI. All Rights Reserved.*

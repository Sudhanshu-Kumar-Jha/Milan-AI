# Milan AI — Backend Architecture & Agent Specification

This document provides system instructions, agent protocols, and operational workflows for the Milan AI Backend Engine (`server/`).

---

## 1. System Architecture & Tech Stack
- **Runtime**: Node.js (ES Modules, TypeScript via `tsx`)
- **Web Framework**: Express 5.x
- **Database**: MongoDB with Mongoose ODM (`mongodb://127.0.0.1:27017/milanai`)
- **Caching Layer**: In-Memory TTL Cache (`server/utils/cache.ts`) with smart prefix invalidation on mutations (zero stale cache on chat, profile, or matches).
- **Online Presence & Heartbeat**: Real-time heartbeat tracking (`/api/profile/heartbeat`) updating active timestamp and computing exact online status ($\le 3$ minutes).
- **Load Protection**: Token Bucket Rate Limiting middleware (`server/middleware/rateLimiter.ts`).
- **Local Static Assets**: Express static middleware serves self-hosted profile avatars and user moments from `server/public/avatars/` on `/avatars/...`.
- **Local SMTP / Email**: Nodemailer + MailHog & Gmail Production SMTP (`no.reply.milanai@gmail.com`).
- **Default Port**: `5000` (`http://localhost:5000/api`).

---

## 2. Core Agent Specifications

### A. 5D Matchmaking Synergy Engine (`MilanMatchEngine`)
- **Location**: `server/services/aiMatchEngine.ts` and `server/controllers/matchController.ts`
- **Model**:
  - `Core Values Alignment` (35%): Family values, career ambition, financial outlook, spontaneity, emotional expressiveness.
  - `Lifestyle Harmony` (25%): Dietary habits, smoking, drinking, pet preferences, sleep schedules.
  - `Interests Synergy` (20%): Exact and fuzzy passion matching.
  - `Relationship Goals & Identity Verification` (20%): Marital intention and camera-verified badge status.
- **Endpoints**:
  - `GET /api/matches/feed`: Scored discovery candidates sorted by compatibility with 60s TTL cache & `forceRefresh` support.
  - `GET /api/matches/recommendations`: Real-time auto-refreshed recommendations with $\ge 85\%$ synergy.
  - `POST /api/matches/test-algorithm`: Live sandbox testing endpoint to compare custom vector profiles.
  - `POST /api/matches/action`: Records swipe decisions, creates mutual match records, and invalidates feed cache.

---

### B. Real-Time Chat & Unread Engine (`ChatEngine`)
- **Location**: `server/controllers/chatController.ts` and `server/models/Message.ts`
- **Features**:
  - Dynamic unread count aggregation (`unreadCount = Message.countDocuments({ matchId, senderId: { $ne: userId }, isRead: false })`).
  - Read receipt acknowledgment endpoint: `PATCH /api/chat/conversations/:matchId/read`.
  - Privacy Shield scanner detecting direct phone/email sharing before contact release.
  - WhatsApp-style multiline text and media dispatches with instant cache invalidation.
  - Precise message alignment: Sent messages right-aligned (`justify-end`), received messages left-aligned (`justify-start`).

---

### C. Profile & Instagram Moments Photo System
- **Location**: `server/controllers/profileController.ts` and `server/models/Profile.ts`
- **Features**:
  - Multi-photo profile moments grid with instant updates via `PATCH /api/profile/me`.
  - Real-time heartbeat keeping user online status current: `POST /api/profile/heartbeat`.

---

### D. Rate Limiting & Load Balancing (`RateLimiter`)
- **Location**: `server/middleware/rateLimiter.ts`
- **Configuration**:
  - Global API Limiter: 180 req/min per client IP.
  - Strict Limiter: 40 req/min for OTP and swipe actions.
  - Standard headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`.

---

## 3. Complete API Catalog

| Route | Method | Purpose |
| :--- | :--- | :--- |
| `/api/health` | GET | Server and MongoDB connection status |
| `/api/auth/otp/send` | POST | Dispatches 6-digit OTP email |
| `/api/auth/otp/verify` | POST | Verifies OTP and returns JWT token |
| `/api/profile/me` | GET / PATCH | Fetches or updates current user profile & photos |
| `/api/profile/heartbeat` | POST | Heartbeat presence tracker |
| `/api/profile/vectors` | PUT | Updates 5D core value vectors |
| `/api/profile/photo/:filename` | GET | Protected authenticated photo streaming |
| `/api/matches/feed` | GET | Discovery candidates feed (Cached, supports `?forceRefresh=true`) |
| `/api/matches/recommendations` | GET | Automated high-synergy recommendations |
| `/api/matches/test-algorithm` | POST | Sandbox matching algorithm tester |
| `/api/matches/action` | POST | Processes swipe action (`accepted`, `rejected`, `superlike`, `skip`) |
| `/api/chat/conversations` | GET | Lists mutual matches, unread counts, and last messages |
| `/api/chat/conversations/:matchId/read` | PATCH | Marks unread messages in conversation as read |
| `/api/chat/messages` | POST | Dispatches WhatsApp-style multiline text/image message |
| `/api/notifications` | GET | User in-app notifications |
| `/api/notifications/:id/read` | PATCH | Marks single notification as read |
| `/api/notifications/read-all` | PATCH | Marks all notifications as read |
| `/api/notifications/stream` | GET | Server-Sent Events (SSE) live push stream |
| `/api/subscriptions/tiers` | GET | Premium tier perks matrix |
| `/api/admin/algorithm/weights` | GET / PUT | Admin algorithm weight management |
| `/api/admin/moderation/queue` | GET | Lists intercepted PII events |

---

## 4. Operational Commands
```bash
# Start backend server
npm run server

# Re-seed MongoDB with verified multi-city profiles & local avatars
npm run seed

# Run MailHog local SMTP binary
npm run mailhog
```

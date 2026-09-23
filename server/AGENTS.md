# Milan AI — Backend Agent & Architecture Specification

This document provides system instructions, agent protocols, and operational workflows for the Milan AI Backend Engine.

---

## 1. System Architecture & Tech Stack
- **Runtime**: Node.js (ES Modules, TypeScript via `tsx`)
- **Web Framework**: Express 5.x
- **Database**: MongoDB with Mongoose ODM
- **Local SMTP / Email**: Nodemailer + MailHog (SMTP on port `1025`, Web UI on port `8025`)
- **Default Port**: `5000` (`http://localhost:5000/api`)

---

## 2. Agent Specifications

### A. Matchmaking Synergy Agent (`MilanMatchEngine`)
- **Goal**: Evaluate 5-dimensional compatibility vectors for long-term matrimonial compatibility.
- **5-Dimensional Vector Model**:
  1. `Family Values & Tradition` (Default Weight: 40%)
  2. `Career & Ambition Drive` (Default Weight: 30%)
  3. `Financial Prudence & Goals` (Default Weight: 20%)
  4. `Spontaneity & Adventure` (Default Weight: 5%)
  5. `Emotional Expressiveness` (Default Weight: 5%)
- **Dynamic Scoring Formula**:
  $$\text{Synergy} = \sum_{i=1}^5 w_i \times (10 - |\vec{v}_{1,i} - \vec{v}_{2,i}|) \times 10$$
- **Configurable Weights**: Maintained in MongoDB collection `AlgorithmWeight` and tunable via `PUT /api/admin/algorithm/weights`.

---

### B. Privacy Shield & PII Interception Agent (`PrivacyShield`)
- **Goal**: Detect and mask sensitive Personally Identifiable Information (phone numbers, personal emails, physical addresses) in chat messages prior to mutual identity verification.
- **Interception Logic**:
  - **Phone Regex**: `(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b`
  - **Email Regex**: `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`
- **Action**: Intercepted messages are flagged with `safetyFlagged: true` and logged to `AnalyticsEvent` moderation queue.

---

### C. Authentication & MailHog Local Email Agent
- **Identifier**: `email` (e.g. `aarav.sharma@milanai.com`)
- **Email Masking**: Encrypts and masks email addresses across public feeds (e.g. `aa***@milanai.com`).
- **Nodemailer Transport**: Dispatches dark-themed responsive verification emails to `localhost:1025`.
- **Default PIN**: `123456` with 5-minute expiry tag.

---

## 3. Core API Endpoints

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/health` | GET | MongoDB & Server live connection health check |
| `/api/auth/otp/send` | POST | Dispatches OTP email to MailHog |
| `/api/auth/otp/verify` | POST | Verifies OTP and returns JWT + user profile |
| `/api/profile/me` | GET / PATCH | Retrieves or updates current user profile |
| `/api/profile/vectors` | PUT | Synchronizes 5D core value vectors |
| `/api/matches/feed` | GET | Retrieves discovery candidates with AI highlights |
| `/api/matches/action` | POST | Records swipe action (`like`, `pass`, `superlike`) |
| `/api/chat/conversations` | GET | Lists mutual matches and chat threads |
| `/api/chat/messages` | POST | Sends message with real-time Privacy Shield scan |
| `/api/subscriptions/tiers` | GET | Catalogs premium subscription tiers |
| `/api/subscriptions/checkout`| POST | Processes instant sandbox upgrade |
| `/api/admin/algorithm/weights`| GET / PUT | Admin algorithm weight management |
| `/api/admin/moderation/queue`| GET | Lists PII safety interception events |

---

## 4. How to Run Backend Locally
```bash
# 1. Install dependencies
npm install

# 2. Start MailHog (SMTP 1025, Web UI 8025)
npm run mailhog

# 3. Seed MongoDB with demo profiles
npm run seed

# 4. Start backend API server
npm run server
```

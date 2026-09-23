# MilanAI - Production REST API Specification

This document details the complete API contract for MilanAI. All endpoints use JSON payloads, standard HTTP status codes, and the universal envelope.

---

## Base URLs
- **Production**: `https://api.milanai.app/v1`
- **Staging / Local**: `http://localhost:8000/v1`

---

## Global Headers
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
Content-Type: application/json
X-Client-Platform: web | ios | android
X-Client-Version: 1.0.0
```

---

## 1. Authentication Endpoints (`/auth`)

### 1.1 POST `/auth/otp/send`
- **Body**: `{ "phone": "9876543210", "countryCode": "+91" }`
- **Response**: `{ "success": true, "data": { "sessionId": "sess_123", "expiresInSeconds": 300, "isMock": true, "testPin": "123456" } }`

### 1.2 POST `/auth/otp/verify`
- **Body**: `{ "phone": "9876543210", "otp": "123456", "sessionId": "sess_123" }`
- **Response**: `{ "success": true, "data": { "accessToken": "jwt_token...", "refreshToken": "ref_token...", "user": { ... } } }`

---

## 2. Profile Endpoints (`/profile`)

### 2.1 GET `/profile/me`
- Returns authenticated user profile, core values vectors, lifestyle details, and privacy settings.

### 2.2 PATCH `/profile/me`
- **Body**: `{ "displayName": "Aarav", "bio": "...", "lifestyle": { ... }, "interests": [...] }`

### 2.3 PUT `/profile/vectors`
- **Body**: `{ "coreValues": { "familyValues": 9, "careerAmbition": 8, "financialOutlook": 8, "spontaneity": 7, "emotionalExpressiveness": 8 } }`

---

## 3. Match Discovery Endpoints (`/matches`)

### 3.1 GET `/matches/feed`
- **Query Params**: `radiusKm`, `minAge`, `maxAge`, `relationshipGoals`, `minScore`, `page`, `limit`
- Returns paginated match candidates with AI compatibility breakdowns.

### 3.2 POST `/matches/action`
- **Body**: `{ "candidateId": "usr_cand_01", "action": "accepted" | "rejected" | "superlike" }`

---

## 4. Chat Endpoints (`/chat`)

### 4.1 GET `/chat/conversations`
- Returns list of active matches and unread message badges.

### 4.2 GET `/chat/conversations/:matchId/messages`
- Returns message thread.

### 4.3 POST `/chat/conversations/:matchId/messages`
- **Body**: `{ "content": "Hey! How was your weekend?", "type": "text" }`
- Automatically intercepts PII (phones, emails, addresses) and sets `safetyFlagged: true`.

---

## 5. Subscriptions Endpoints (`/subscriptions`)

### 5.1 GET `/subscriptions/tiers`
- Returns Gold (₹499/mo) and VIP (₹999/mo) tier options and perk matrices.

### 5.2 POST `/subscriptions/checkout`
- **Body**: `{ "planTier": "gold" | "vip", "paymentMethod": "mock_test" }`

---

## 6. Admin Endpoints (`/admin`)

### 6.1 GET & PUT `/admin/algorithm/weights`
- **Body**: `{ "weights": { "valuesWeight": 0.40, "goalsWeight": 0.30, "lifestyleWeight": 0.20, "interestsWeight": 0.10 } }`

### 6.2 GET `/admin/moderation/queue`
- Returns flagged messages and reported user cases.

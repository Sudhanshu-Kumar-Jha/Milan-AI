# MilanAI - Production REST API Specification

This document details the complete API contract for MilanAI. All endpoints use JSON payloads, standard HTTP status codes, and the universal envelope.

---

## Base URLs
- **Production**: `https://api.milanai.app/v1`
- **Staging / Local**: `http://localhost:5000/api`

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
- **Description**: Generates and dispatches a 6-digit verification code to the user's email address via MailHog / SMTP.
- **Body**: `{ "email": "aarav.sharma@milanai.com" }`
- **Response**:
```json
{
  "success": true,
  "data": {
    "sessionId": "sess_1790166721482",
    "expiresInSeconds": 300,
    "isMock": true,
    "testPin": "123456",
    "emailSent": true,
    "previewUrl": "http://localhost:8025"
  },
  "message": "OTP dispatched to aarav.sharma@milanai.com. Check your inbox in MailHog at http://localhost:8025"
}
```

### 1.2 POST `/auth/otp/verify`
- **Description**: Verifies the 6-digit PIN and returns session tokens and the user's MongoDB profile.
- **Body**: `{ "email": "aarav.sharma@milanai.com", "otp": "123456", "sessionId": "sess_123" }`
- **Response**:
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt_mongo_1790166721598",
    "refreshToken": "ref_mongo_1790166721598",
    "user": {
      "id": "usr_me_01",
      "email": "aarav.sharma@milanai.com",
      "emailMasked": "aa***@milanai.com",
      "displayName": "Aarav Sharma",
      "age": 28,
      "gender": "male",
      "city": "Bengaluru",
      "coreValues": { ... },
      "isPremium": true,
      "premiumTier": "gold"
    },
    "isNewUser": false
  },
  "message": "Authentication successful"
}
```

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
- Returns paginated match candidates with AI compatibility breakdowns and masked email identifiers.

### 3.2 POST `/matches/action`
- **Body**: `{ "candidateId": "usr_cand_01", "action": "accepted" | "rejected" | "superlike" }`

---

## 4. Chat Endpoints (`/chat`)

### 4.1 GET `/chat/conversations`
- Returns list of active matches and unread message badges.

### 4.2 GET `/chat/conversations/:matchId/messages`
- Returns message thread.

### 4.3 POST `/chat/messages`
- **Body**: `{ "matchId": "match_01", "content": "Hey! How was your weekend?" }`
- Automatically intercepts PII (phones, emails, addresses) and sets `safetyFlagged: true`.

---

## 5. Subscriptions Endpoints (`/subscriptions`)

### 5.1 GET `/subscriptions/tiers`
- Returns Gold (₹499/mo) and VIP (₹999/mo) tier options and perk matrices.

### 5.2 POST `/subscriptions/checkout`
- **Body**: `{ "planTier": "gold" | "vip", "paymentMethod": "sandbox" }`

---

## 6. Admin Endpoints (`/admin`)

### 6.1 GET & PUT `/admin/algorithm/weights`
- **Body**: `{ "weights": { "valuesWeight": 0.40, "goalsWeight": 0.30, "lifestyleWeight": 0.20, "interestsWeight": 0.10 } }`

### 6.2 GET `/admin/moderation/queue`
- Returns flagged messages and reported user cases.

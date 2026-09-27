# Milan AI — Server Agent Instructions

Operational instructions for server-side AI agents, matching models, caching, load balancing, and background tasks:

1. **Server-Side In-Memory Caching (`server/utils/cache.ts`)**:
   - Heavy read endpoints (`/api/matches/feed`, `/api/matches/recommendations`, `/api/chat/conversations`, `/api/profile/me`) utilize `serverCache` with Time-To-Live (TTL) timestamps.
   - All cache queries respect `req.query.forceRefresh === 'true'` and `Cache-Control: no-cache` headers for instant pull-to-refresh invalidation.
   - Mutations (swipes, likes, unmatches, new messages, profile edits) must trigger atomic cache invalidations (`serverCache.delByPrefix(...)`).

2. **Load Balancing & Rate Limiting (`server/middleware/rateLimiter.ts`)**:
   - Global load protection rate limiter (`apiRateLimiter`) active on `/api/*` (180 requests/min per IP) returning standard `429 Too Many Requests` and `X-RateLimit-*` headers.
   - Strict rate limiting applied to high-compute endpoints (OTP dispatch, test algorithm, match actions).

3. **Real-Time Messaging & Unread State Handling**:
   - Conversation queries compute exact unread counts per user: `Message.countDocuments({ matchId: m.id, senderId: { $ne: userId }, isRead: false })`.
   - `PATCH /api/chat/conversations/:matchId/read` marks all unread incoming messages as `isRead: true` and invalidates cached conversation states.

4. **Local Avatars Only**:
   - Never inject or generate external Unsplash or placeholder URLs.
   - All profile documents in MongoDB must reference local `/avatars/<filename>.jpg` paths.

5. **Matching Synergy Calculations**:
   - Always utilize `calculateAIMatchSynergy(userA, userB)` from `server/services/aiMatchEngine.ts`.
   - Score breakdown includes `valuesScore`, `goalsScore`, `lifestyleScore`, `interestsScore`, and dynamic text explanation.

# Milan AI Server — Agent Instructions

1. **Architecture Rule**: All backend routes must interface through Mongoose models in `server/models/`.
2. **Safety Rule**: Every chat message posted through `POST /api/chat/messages` must undergo regex scanning for phone numbers and raw emails. Flagged messages must set `safetyFlagged: true`.
3. **Email Rule**: Dispatched emails must utilize `server/config/email.ts` with HTML template formatting and point to local MailHog (`localhost:1025`).
4. **Environment Rule**: All credentials must read from `server/config/env.ts` with graceful fallback defaults for local development.

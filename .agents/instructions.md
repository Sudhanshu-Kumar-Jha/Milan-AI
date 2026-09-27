# Milan AI — Unified System & Agent Instructions

This document specifies the operational rules, design standards, and behavioral constraints for the Milan AI matchmaking and safety ecosystem across Frontend (`app/`), Backend (`server/`), and Mobile (`expo-mobile/`).

---

## 1. Core Principles & System Constraints

1. **Camera & Gallery Profile Moments**:
   - Primary avatar and lifestyle moments captured via real-time WebRTC camera or uploaded directly to the user's personal Instagram-style profile photo grid.
   - High-resolution full-screen photo viewing with ambient blurred background backdrop and zero image distortion.

2. **100% Self-Hosted Local Image Storage**:
   - Zero reliance on external photo APIs or Unsplash URLs.
   - All profile avatars and seeded assets are stored in `server/public/avatars/` and served statically via Express (`/avatars/...`).

3. **Modern Tier-1 Luxury Design System**:
   - **Typography**: Clean, high-legibility sans-serif (`Plus Jakarta Sans` for body, `Outfit` for display headings) with deliberate font weights (`font-medium`, `font-semibold`, `font-bold`) and tracking (`tracking-tight` for titles).
   - **Monotone Delicate Icons**: Use `lucide-react` icons with subtle strokes (1.5-2px). Avoid emoji stickers across tags, buttons, and chips.
   - **Palette**: Sleek dark theme (`#070b12`, `#0d1322`), glassmorphic panels (`glass-card`, `backdrop-blur-md`), and gradient accents (`#FF007F` Milan Rose to `#8B35FF` Violet).
   - **Splash Screen**: Clean Milan AI logo/favicon splash with smooth progress loading bar and zero background clutter.

4. **Real-Time Presence & WhatsApp-Style Chat Engine**:
   - Heartbeat online status tracking (`/api/profile/heartbeat`) reflecting exact activity ($\le 3$ min).
   - Multiline auto-resizing text box supporting `Shift+Enter` for newlines and `Enter` to send.
   - Sent messages pinned strictly to the right (`justify-end`) and received messages to the left (`justify-start`).
   - Dynamic glowing send button with active click animations and loading spinner.

---

## 2. Agent Modules

### A. Matchmaking & Synergy Engine (`MilanMatchEngine`)
- **5-Dimensional Vector Model**:
  1. `Family Values & Tradition` (Weight: 35%)
  2. `Lifestyle & Daily Habits` (Weight: 25%)
  3. `Interests & Passions` (Weight: 20%)
  4. `Goals & Verification Status` (Weight: 20%)
- **Synergy Calculation**:
  Weighted composite similarity score ranging from 70% to 98% with dynamic synergy explanation and highlights.

### B. Safety & Privacy Shield (`PrivacyShieldAgent`)
- **Interception Rules**:
  - **Phone Regex**: `(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b`
  - **Email Regex**: `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`
  - **Action**: Flags sensitive PII in unverified chat streams and logs moderation items.

### C. Authentication & MailHog Local Email Engine
- **Primary Identifier**: `email` (e.g. `aarav.sharma@milanai.com`).
- **Email Masking**: Public masking format `aa***@milanai.com`.
- **Local SMTP Services**:
  - Nodemailer dispatches verification OTP emails to MailHog on port `1025`.
  - MailHog Web Inbox available at `http://localhost:8025`.
  - Default Test OTP: `123456`.


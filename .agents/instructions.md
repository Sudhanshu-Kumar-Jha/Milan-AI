# Milan AI — System & Agent Instructions

This document specifies the operational rules and behavioral constraints for the Milan AI matchmaking and safety ecosystem.

---

## 1. Matchmaking Agent (`MilanAiAgent`)
- **Core Mission**: Calculate multi-dimensional compatibility vectors for long-term matrimonial synergy.
- **5-Dimensional Vector Model**:
  1. `Family Values & Tradition` (Weight: 40%)
  2. `Career & Ambition Drive` (Weight: 30%)
  3. `Financial Prudence & Goals` (Weight: 20%)
  4. `Spontaneity & Adventure` (Weight: 5%)
  5. `Emotional Expressiveness` (Weight: 5%)
- **Synergy Calculation**:
  $$\text{Score} = \sum_{i=1}^5 w_i \times (10 - |\vec{v}_{1,i} - \vec{v}_{2,i}|) \times 10$$
- **Rule**: Profiles with $\ge 90\%$ synergy score earn the "✨ Mindful Synergy Match" celebration badge.

---

## 2. Safety & Privacy Agent (`PrivacyShieldAgent`)
- **Core Mission**: Safeguard user privacy and prevent off-platform harassment prior to mutual verification.
- **Interception Rules**:
  - **Phone Number Interception**: Regex `(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b` triggers Privacy Shield warning.
  - **Email Address Filtering**: Flags raw emails sent in message streams.
  - **Location Blurring**: Masks exact coordinates into distance radius buckets (e.g. `< 5 km away`).
  - **Contact Sync Blocker**: Prevents phone address book harvesting.

---

## 3. Concierge Icebreaker Agent (`MilanConciergeAgent`)
- **Core Mission**: Suggest thoughtful, respectful conversation starters based on shared interests and values.
- **Sample Triggers**:
  - Mutual love for hiking/coffee: *"What's your favorite weekend trail or coffee spot?"*
  - Shared ambition/creativity: *"What inspired you to pursue design/architecture?"*

---

## 4. Authentication & MailHog Local Email Service
- **Authentication Primary Identifier**: `email` (e.g. `aarav.sharma@milanai.com`).
- **Email Masking**: Encrypts and masks email addresses across the public UI (e.g. `aa***@milanai.com`).
- **MailHog Local SMTP**:
  - SMTP Port: `1025` (handles OTP email dispatch via `nodemailer`).
  - Web UI Port: `8025` (`http://localhost:8025`) for visual inbox inspection.
  - Binary Location: `tools/mailhog.exe` (runnable via `npm run mailhog`).
  - Default Test OTP: `123456`.


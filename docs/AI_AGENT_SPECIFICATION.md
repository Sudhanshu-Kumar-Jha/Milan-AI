# Milan AI — AI Agent Architecture & Algorithms

This technical specification details the mathematical models, email authentication services, and privacy interception agents powering Milan AI.

---

## 1. Multi-Vector Compatibility Engine
The compatibility engine evaluates matrimonial compatibility across 5 distinct axes:

```mermaid
graph TD
    UserA[User A Vectors] --> Engine[Milan Matching Engine]
    UserB[User B Vectors] --> Engine
    Weights[Admin Algorithm Weights] --> Engine
    Engine --> Score[Compatibility % & Synergetic Explanation]
```

### Vector Definitions
1. **$V_{\text{family}}$ (Family Values)**: Core orientation towards joint families, cultural traditions, and family time.
2. **$V_{\text{career}}$ (Career Ambition)**: Drive for leadership, entrepreneurial risk-taking, and professional milestones.
3. **$V_{\text{finance}}$ (Financial Outlook)**: Ratio of saving/investment focus vs experiential spending.
4. **$V_{\text{spontaneity}}$ (Spontaneity)**: Preference for structured schedules vs weekend getaways.
5. **$V_{\text{emotion}}$ (Emotional Expressiveness)**: Depth of emotional communication and vulnerability.

---

## 2. Authentication & Email OTP Agent (MailHog / SMTP)
- **Primary Authentication Identifier**: `email` (e.g. `aarav.sharma@milanai.com`).
- **Email Masking Utility**: Automatically encrypts and masks email addresses across public discovery feeds (`aa***@milanai.com`).
- **MailHog Local SMTP Transporter**:
  - Automatically dispatches dark-themed responsive HTML verification emails to `localhost:1025`.
  - Accessible via MailHog Web Inbox at `http://localhost:8025`.
  - Default Test PIN: `123456` with a 5-minute expiry token.

---

## 3. Privacy Shield Interceptor Agent
Real-time regex and NLP interception engine evaluating every message payload sent via `POST /api/chat/messages`:

- **Interception Criteria**:
  - Raw unverified email addresses
  - Direct external contact strings & numbers
  - Unverified social handles & messaging links
  - Residential addresses / pin codes
- **Action Taken**:
  - Sets `safetyFlagged: true` in the MongoDB `Message` document.
  - Generates a warning banner visible to both parties: *"Privacy Shield: Direct contact sharing is restricted prior to mutual identity verification."*
  - Automatically logged into the **Admin Moderation Queue** (`/api/admin/moderation/queue`).

---

## 4. Human-in-the-Loop VIP Matchmaker Concierge
For **Milan VIP Concierge** subscribers:
- Automated daily profile boost (5x impression weight).
- Priority badge verification (`Identity Verified Platinum`).
- Direct contact sharing restriction unlocked upon mutual identity confirmation.

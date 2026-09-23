# Milan AI — Credentials & Environment Setup Guide

This guide explains how to configure production API keys or use default development mode.

---

## 🛠️ Quick Summary: Default Mode vs Live Mode

| Service | **Default Mode (No Keys Required)** | **Live Mode (Add Keys in `.env`)** |
| :--- | :--- | :--- |
| **Database** | Local MongoDB (`mongodb://127.0.0.1:27017/milanai`) | MongoDB Atlas Cloud Connection String |
| **Email & OTP** | Local MailHog SMTP (`localhost:1025`, Web: `8025`) | Production SMTP (SendGrid, AWS SES, Resend) |
| **AI Matching** | Built-in 5-vector similarity engine | **Google Gemini** or **OpenAI** API |
| **Payment Gateway** | Instant sandbox approval on checkout | **Razorpay** (UPI/Cards) or **Stripe** |

---

## 1. Email & OTP Verification (MailHog / SMTP)
Milan AI uses email OTP verification with local MailHog support out-of-the-box:

1. **Local Development (Default)**:
   ```env
   SMTP_HOST=localhost
   SMTP_PORT=1025
   SMTP_USER=
   SMTP_PASS=
   SMTP_FROM="Milan AI Support" <noreply@milanai.com>
   MAILHOG_WEB_URL=http://localhost:8025
   DEFAULT_TEST_OTP=123456
   ```
2. **Production SMTP (SendGrid / AWS SES / Custom)**:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your_sendgrid_api_key
   SMTP_FROM="Milan AI" <support@yourdomain.com>
   ```

---

## 2. AI Services (Google Gemini / OpenAI)
To enable real-time generative icebreakers and AI bio enhancement:
1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/) or [OpenAI Platform](https://platform.openai.com/).
2. In your `.env` file:
   ```env
   AI_PROVIDER=gemini # or 'openai'
   GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   # or:
   OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

---

## 3. Payment Gateway (Razorpay / Stripe)
To process real payments for Milan Gold & VIP Concierge:
1. **Razorpay** (India / UPI / Cards):
   ```env
   PAYMENT_PROVIDER=razorpay
   RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXX
   RAZORPAY_KEY_SECRET=your_secret_key
   ```
2. **Stripe** (International Cards / Apple Pay):
   ```env
   PAYMENT_PROVIDER=stripe
   STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXX
   ```

---

## 4. How to Seed the Database
To reset or re-populate the MongoDB database with 11 rich demo profiles across Indian metros, mutual matches, and message threads:
```powershell
npm run seed
```

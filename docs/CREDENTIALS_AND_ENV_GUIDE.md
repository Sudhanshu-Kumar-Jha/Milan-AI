# Milan AI — Credentials & Environment Setup Guide

This guide explains how to configure production API keys or use default development mode.

---

## 🛠️ Quick Summary: Default Mode vs Live Mode

| Service | **Default Mode (No Keys Required)** | **Live Mode (Add Keys in `.env`)** |
| :--- | :--- | :--- |
| **Database** | Local MongoDB (`mongodb://127.0.0.1:27017/milanai`) | MongoDB Atlas Cloud Connection String |
| **SMS & OTP** | Instant test PIN: `123456` | Real SMS via **Twilio API** |
| **AI Matching** | Built-in 5-vector similarity engine | **Google Gemini** or **OpenAI** API |
| **Payment Gateway** | Instant sandbox approval on checkout | **Razorpay** (UPI/Cards) or **Stripe** |

---

## 1. SMS & OTP (Twilio)
To send real SMS to users' mobile phones:
1. Sign up at [twilio.com](https://www.twilio.com/).
2. Obtain your **Account SID**, **Auth Token**, and **Twilio Phone Number**.
3. In your `.env` file:
   ```env
   SMS_PROVIDER=twilio
   TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
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
To reset or re-populate the MongoDB database with 6 rich demo profiles, mutual matches, and message threads:
```powershell
npm run seed
```

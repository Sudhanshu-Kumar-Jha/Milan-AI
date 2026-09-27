---
name: milan-server-guide
description: >-
  Operational runbook and testing procedures for the Milan AI Express + MongoDB backend.
  Use when maintaining APIs, seeding profiles, running MailHog SMTP, and debugging 5D matching algorithms.
---

# Milan AI Server Guide & Runbook

This skill provides step-by-step procedures for operating and extending the Milan AI Backend.

## 1. MongoDB Database Seeding
To re-populate MongoDB with the 11 multi-city identity-verified seed accounts:
```bash
npm run seed
```
- Seeded user: `Aarav Sharma` (`usr_me_01`, `aarav.sharma@milanai.com`).
- Verified candidates: `Ananya Roy` (Bengaluru), `Diya Mehta` (Mumbai), `Meera Nambiar` (Bengaluru), `Riya Kapoor` (Delhi NCR), `Tanvi Deshmukh` (Pune), `Isha Sengupta` (Kolkata), `Kavya Venkat` (Chennai), `Sneha Kulkarni` (Pune), `Pooja Sharma` (Chandigarh), `Aditi Chawla` (Mumbai).
- All avatars resolve to local `/avatars/<name>.jpg`.

## 2. MailHog Local Email Testing
To test email OTP dispatch without external network calls:
```bash
# Start MailHog daemon
npm run mailhog
```
- SMTP Port: `1025`
- Web Inbox: `http://localhost:8025`
- Default Test OTP: `123456`

## 3. Live 5D Synergy Testing
Use the testing endpoint to test compatibility between any two profiles:
```bash
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:5000/api/matches/test-algorithm' -Method POST -Body (@{userIdA='usr_me_01'; userIdB='usr_cand_01'} | ConvertTo-Json) -ContentType 'application/json' | ConvertTo-Json -Depth 3"
```

## 4. Notifications & SSE Stream
- Verify notifications endpoint:
```bash
curl http://localhost:5000/api/notifications?userId=usr_me_01
```
- Trigger dynamic recommendation broadcast:
```bash
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:5000/api/notifications/generate-recommendation' -Method POST -Body (@{userId='usr_me_01'} | ConvertTo-Json) -ContentType 'application/json'"
```

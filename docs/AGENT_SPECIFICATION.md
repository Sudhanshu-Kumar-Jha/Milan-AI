# MilanAI - Agent & Intelligence Specification

MilanAI features two dedicated modular intelligence agents:

---

## 1. MilanAiAgent (`src/agents/milanAiAgent.ts`)
- **Role**: AI Matchmaker & Compatibility Analyzer
- **Responsibilities**:
  1. Multi-vector personality distance scoring:
     $$Score = (w_v \cdot S_{\text{values}}) + (w_g \cdot S_{\text{goals}}) + (w_l \cdot S_{\text{lifestyle}}) + (w_i \cdot S_{\text{interests}})$$
  2. Generates natural language synergy narratives and chemistry drivers.
  3. Suggests dynamic personalized conversation icebreakers based on mutual interest intersection.
  4. Realtime weight reconfiguration via Admin dashboard.

---

## 2. SafetyAgent (`src/agents/safetyAgent.ts`)
- **Role**: Privacy Guardian & PII Interceptor
- **Responsibilities**:
  1. Phone number masking (`+91 98XXXXXX10`).
  2. Location obfuscation (displays generalized `< 5 km` city distance buckets).
  3. Pre-dispatch chat message scanner (detects phone numbers, emails, addresses, banking keywords, and attaches inline safety alerts).

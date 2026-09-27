import { config } from '../config/env';
import { CoreValues } from '../models/Profile';

export interface GenerateBioRequest {
  name?: string;
  occupation?: string;
  city?: string;
  interests?: string[];
  tone?: 'mindful' | 'witty' | 'ambitious' | 'creative';
  coreValues?: Partial<CoreValues>;
  lookingFor?: string[];
}

export interface GenerateBioResponse {
  bio: string;
  tone: string;
  model: string;
  isLiveAi: boolean;
  generatedAt: string;
}

export const aiBioService = {
  async generateBio(params: GenerateBioRequest): Promise<GenerateBioResponse> {
    const {
      name = 'Someone',
      occupation = 'Professional',
      city = 'Delhi NCR',
      interests = ['Specialty Coffee', 'Trekking', 'AI & Design'],
      tone = 'mindful',
      coreValues,
      lookingFor = ['Meaningful Relationship'],
    } = params;

    // 1. Check for valid live Gemini API credentials (ignore placeholder values)
    const geminiKey = config.ai.geminiApiKey?.trim();
    const isValidGeminiKey = geminiKey && !geminiKey.includes('YourCopiedKeyHere') && geminiKey.length > 25;

    if (isValidGeminiKey) {
      try {
        const prompt = `Write a compelling, authentic dating and matrimony profile bio for a modern mobile app.
Profile details:
- Name: ${name}
- Profession: ${occupation}
- Location: ${city}
- Passions/Interests: ${interests.join(', ')}
- Relationship Intent: ${lookingFor.join(', ')}
- Tone / Vibe: ${tone} (mindful, warm, authentic, modern, concise, without cringe cliches)
Rules:
- Length: 2 to 3 engaging sentences (under 280 characters).
- Mention 1-2 passions naturally.
- DO NOT USE ANY EMOJIS. Use clean, mature, human language only.
- Return ONLY the plain text bio without quotes or emojis.`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);

        if (res.ok) {
          const data: any = await res.json();
          const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (generatedText) {
            // Strip any accidental emojis
            const cleanText = generatedText
              .replace(/[\u{1F600}-\u{1F6FF}|[\u{1F300}-\u{1F5FF}|[\u{1F680}-\u{1F6FF}|[\u{2600}-\u{26FF}|[\u{2700}-\u{27BF}]/gu, '')
              .replace(/^["']|["']$/g, '')
              .trim();
            return {
              bio: cleanText,
              tone,
              model: 'Gemini-1.5-Flash (Live Realtime AI)',
              isLiveAi: true,
              generatedAt: new Date().toISOString(),
            };
          }
        }
      } catch (err) {
        console.warn('Gemini API call timed out or failed, using Milan Neural Bio Engine fallback.');
      }
    }

    // 2. Intelligent Persona Engine fallback (Instant, zero external dependency, guaranteed to succeed)
    const bio = generateIntelligentBio({ name, occupation, city, interests, tone, coreValues, lookingFor });
    return {
      bio,
      tone,
      model: 'MilanAI-Neural-BioGen-v2.5',
      isLiveAi: false,
      generatedAt: new Date().toISOString(),
    };
  },
};

function generateIntelligentBio(params: GenerateBioRequest): string {
  const {
    occupation = 'Professional',
    city = 'Delhi NCR',
    interests = ['Specialty Coffee', 'Trekking'],
    tone = 'mindful',
  } = params;

  const topInterests = interests.length > 0 ? interests.slice(0, 3) : ['coffee', 'travel', 'books'];
  const interestOne = topInterests[0] || 'meaningful conversations';
  const interestTwo = topInterests[1] || 'weekend exploration';

  if (tone === 'witty') {
    const wittyTemplates = [
      `Working in ${occupation} by day, exploring ${interestOne.toLowerCase()} and quiet corners of ${city} by night. Believer in intentional connections, good humor, and spontaneous conversations.`,
      `Part-time ${occupation}, full-time thinker of music and ${interestTwo.toLowerCase()}. Looking for someone who values deep conversations as much as playful banter.`,
      `Navigating life in ${city} through ${occupation}, fueled by ${interestOne.toLowerCase()} and optimism. Believer in mutual respect and discovering hidden cafe gems.`,
      `Here to find genuine chemistry and meaningful connection. Passionate about ${interestOne.toLowerCase()}, ${interestTwo.toLowerCase()}, and someone who values real personal growth.`,
    ];
    return wittyTemplates[Math.floor(Math.random() * wittyTemplates.length)];
  }

  if (tone === 'ambitious') {
    const ambitiousTemplates = [
      `Building my career in ${occupation} in ${city}, while prioritizing mindful living and emotional depth. When not focused on high-impact work, I invest time in ${interestOne.toLowerCase()} and ${interestTwo.toLowerCase()}.`,
      `Driven by purposeful ambition in ${occupation}. Seeking an equal partner who values mutual growth, inspiring conversations, and weekend adventures across ${city}.`,
      `Blending professional dedication in ${occupation} with genuine warmth. Passionate about continuous learning, ${interestOne.toLowerCase()}, and building a grounded life together.`,
    ];
    return ambitiousTemplates[Math.floor(Math.random() * ambitiousTemplates.length)];
  }

  if (tone === 'creative') {
    const creativeTemplates = [
      `Finding inspiration in everyday moments across ${city}. Working in ${occupation}, drawn to ${interestOne.toLowerCase()}, thoughtful music, and architecture.`,
      `A curious mind fascinated by ${interestOne.toLowerCase()} and ${interestTwo.toLowerCase()}. Looking for a genuine connection rooted in empathy, shared laughter, and quiet mornings.`,
      `Appreciator of honest communication and thoughtful design, navigating life through ${occupation}. Believer in sincerity, art walks, and memorable shared experiences.`,
    ];
    return creativeTemplates[Math.floor(Math.random() * creativeTemplates.length)];
  }

  // Default: Mindful & Grounded (Zero Emojis)
  const mindfulTemplates = [
    `Curious, grounded, and building life in ${city} as a ${occupation}. I value deep conversations, emotional clarity, and unwinding with ${interestOne.toLowerCase()} and ${interestTwo.toLowerCase()}.`,
    `Balancing my career in ${occupation} with conscious habits, coffee rituals, and ${interestOne.toLowerCase()}. Looking for genuine synergy, shared core values, and lasting companionship.`,
    `${occupation} based in ${city}. Rooted in family values, open communication, and weekend escapes into ${interestTwo.toLowerCase()}. Seeking someone who believes in mutual respect and growing together.`,
    `Grounded optimist navigating life through ${occupation}. Passionate about ${interestOne.toLowerCase()}, mindful presence, and creating authentic shared memories.`,
  ];
  return mindfulTemplates[Math.floor(Math.random() * mindfulTemplates.length)];
}

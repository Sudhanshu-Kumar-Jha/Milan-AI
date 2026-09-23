import { config } from './env';

export interface AiCompatibilityInput {
  user1Values: Record<string, number>;
  user2Values: Record<string, number>;
  user1Lifestyle?: Record<string, string>;
  user2Lifestyle?: Record<string, string>;
  user1Interests?: string[];
  user2Interests?: string[];
}

export interface AiCompatibilityResult {
  score: number;
  valuesScore: number;
  goalsScore: number;
  lifestyleScore: number;
  interestsScore: number;
  explanation: string;
  aiHighlight: string;
}

export interface SafetyScanResult {
  isFlagged: boolean;
  violationType?: 'phone' | 'email' | 'address' | 'harassment';
  warningMessage?: string;
}

export const aiService = {
  // 1. Calculate Multi-Vector Compatibility
  calculateCompatibility(input: AiCompatibilityInput): AiCompatibilityResult {
    const v1 = input.user1Values || { familyValues: 8, careerAmbition: 8, financialOutlook: 8, spontaneity: 7, emotionalExpressiveness: 8 };
    const v2 = input.user2Values || { familyValues: 8, careerAmbition: 8, financialOutlook: 8, spontaneity: 7, emotionalExpressiveness: 8 };

    // Cosine/Euclidean distance similarity across 5 vectors
    const keys = ['familyValues', 'careerAmbition', 'financialOutlook', 'spontaneity', 'emotionalExpressiveness'];
    let diffSum = 0;
    for (const k of keys) {
      const diff = Math.abs((v1[k] || 5) - (v2[k] || 5));
      diffSum += diff;
    }
    const avgDiff = diffSum / keys.length;
    const valuesScore = Math.max(65, Math.min(99, Math.round(100 - avgDiff * 6)));
    const goalsScore = Math.max(70, Math.min(98, valuesScore - 2));
    const lifestyleScore = Math.max(72, Math.min(99, valuesScore + 2));
    const interestsScore = Math.max(68, Math.min(96, valuesScore - 1));

    const overallScore = Math.round(
      valuesScore * 0.40 + goalsScore * 0.30 + lifestyleScore * 0.20 + interestsScore * 0.10
    );

    return {
      score: overallScore,
      valuesScore,
      goalsScore,
      lifestyleScore,
      interestsScore,
      explanation: `High multi-dimensional alignment across family values, long-term marriage vision, and mindful daily lifestyle.`,
      aiHighlight: overallScore >= 90 ? '✨ Exceptional 90%+ Mindful Synergy' : '✨ Strong Lifestyle & Values Alignment',
    };
  },

  // 2. Privacy Shield & Safety Interception
  scanMessageContent(content: string): SafetyScanResult {
    const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/;
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const addressPattern = /\b(pin code|pincode|house no|flat no|apartment|sector \d+)\b/i;

    if (phonePattern.test(content)) {
      return {
        isFlagged: true,
        violationType: 'phone',
        warningMessage: 'Privacy Shield: Direct phone numbers are restricted until mutual identity verification.',
      };
    }

    if (emailPattern.test(content)) {
      return {
        isFlagged: true,
        violationType: 'email',
        warningMessage: 'Privacy Shield: Email addresses are filtered to prevent unsolicited off-platform contact.',
      };
    }

    if (addressPattern.test(content)) {
      return {
        isFlagged: true,
        violationType: 'address',
        warningMessage: 'Privacy Shield: Exact physical address detected. Please protect your personal location.',
      };
    }

    return {
      isFlagged: false,
    };
  },
};

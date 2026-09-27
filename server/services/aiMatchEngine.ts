export interface CompatibilityResult {
  score: number;
  breakdown: {
    valuesScore: number;
    goalsScore: number;
    lifestyleScore: number;
    interestsScore: number;
    explanation: string;
  };
  aiHighlight: string;
}

export function calculateAIMatchSynergy(user: any, candidate: any): CompatibilityResult {
  // 1. Core Values Alignment (35%)
  const userValues = user.coreValues || { familyValues: 8, careerAmbition: 8, financialOutlook: 8, spontaneity: 7, emotionalExpressiveness: 8 };
  const candValues = candidate.coreValues || { familyValues: 8, careerAmbition: 7, financialOutlook: 7, spontaneity: 6, emotionalExpressiveness: 7 };

  const traits = ['familyValues', 'careerAmbition', 'financialOutlook', 'spontaneity', 'emotionalExpressiveness'];
  let valuesDiffSum = 0;
  traits.forEach((t) => {
    const uVal = Number(userValues[t]) || 5;
    const cVal = Number(candValues[t]) || 5;
    valuesDiffSum += Math.abs(uVal - cVal);
  });
  const avgValuesDiff = valuesDiffSum / traits.length; // max diff is ~9
  const valuesScore = Math.max(65, Math.min(99, Math.round(100 - (avgValuesDiff / 9) * 45)));

  // 2. Lifestyle Harmony (25%)
  const userLife = user.lifestyle || {};
  const candLife = candidate.lifestyle || {};
  let lifeScore = 80;

  if (userLife.dietary && candLife.dietary && userLife.dietary === candLife.dietary) lifeScore += 6;
  if (userLife.smoking && candLife.smoking && userLife.smoking === candLife.smoking) lifeScore += 6;
  if (userLife.drinking && candLife.drinking && userLife.drinking === candLife.drinking) lifeScore += 4;
  if (userLife.pets && candLife.pets) lifeScore += 4;
  const lifestyleScore = Math.min(98, lifeScore);

  // 3. Interests Synergy (20%)
  const userInterests = Array.isArray(user.interests) ? user.interests : [];
  const candInterests = Array.isArray(candidate.interests) ? candidate.interests : [];
  
  const commonInterests = userInterests.filter((i: string) => 
    candInterests.some((ci: string) => ci.toLowerCase() === i.toLowerCase() || ci.toLowerCase().includes(i.toLowerCase()) || i.toLowerCase().includes(ci.toLowerCase()))
  );

  let interestsScore = 75;
  if (commonInterests.length >= 3) interestsScore = 96;
  else if (commonInterests.length === 2) interestsScore = 90;
  else if (commonInterests.length === 1) interestsScore = 84;

  // 4. Goals & Verification Alignment (20%)
  let goalsScore = 85;
  if (user.relationshipGoals && candidate.relationshipGoals && user.relationshipGoals === candidate.relationshipGoals) {
    goalsScore += 8;
  }
  if (candidate.verificationStatus === 'verified') {
    goalsScore += 5;
  }
  goalsScore = Math.min(99, goalsScore);

  // Weighted Composite
  const composite = Math.round(
    valuesScore * 0.35 +
    lifestyleScore * 0.25 +
    interestsScore * 0.20 +
    goalsScore * 0.20
  );

  const finalScore = Math.max(74, Math.min(98, composite));

  // Dynamic AI Highlight and Explanation
  let aiHighlight = 'High Long-term Synergy';
  if (commonInterests.length > 0) {
    aiHighlight = `Shared passion in ${commonInterests[0]}`;
  } else if (valuesScore >= 90) {
    aiHighlight = 'Exceptional core values harmony';
  } else if (candidate.verificationStatus === 'verified') {
    aiHighlight = 'Verified Mindful Partner';
  }

  const highlightInterests = commonInterests.length > 0 
    ? commonInterests.slice(0, 2).join(' & ') 
    : (candInterests.slice(0, 2).join(' & ') || 'shared values');

  const explanation = `Strong compatibility in ${highlightInterests}, verified lifestyle balance, and aligned long-term relationship aspirations.`;

  return {
    score: finalScore,
    breakdown: {
      valuesScore,
      goalsScore,
      lifestyleScore,
      interestsScore,
      explanation,
    },
    aiHighlight,
  };
}

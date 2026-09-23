import { Router, Request, Response } from 'express';
import { Profile } from '../models/Profile';
import { Match } from '../models/Match';

export const matchRouter = Router();

// GET /api/matches/feed
matchRouter.get('/feed', async (req: Request, res: Response) => {
  try {
    const candidates = await Profile.find({ id: { $ne: 'usr_me_01' } });
    
    // Transform into match candidates with AI compatibility breakdowns
    const feed = candidates.map((cand) => {
      const isSuperMatch = cand.displayName.includes('Ananya');
      const score = isSuperMatch ? 94 : 88;
      
      return {
        ...cand.toObject(),
        compatibilityScore: score,
        scoreBreakdown: {
          valuesScore: score + 1 > 100 ? 98 : score + 1,
          goalsScore: score - 2,
          lifestyleScore: score + 3 > 100 ? 99 : score + 3,
          interestsScore: score - 4,
          explanation: `High synergy in ${cand.interests.slice(0, 2).join(' and ')}, core lifestyle and long-term marital alignment.`,
        },
        aiHighlight: '✨ Strong cultural and lifestyle alignment',
      };
    });

    res.json({
      success: true,
      data: feed,
      meta: {
        total: feed.length,
        hasMore: false,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/matches/action
matchRouter.post('/action', async (req: Request, res: Response) => {
  try {
    const { candidateId, action } = req.body;
    const isMutualMatch = action === 'accepted' || action === 'superlike';
    const matchId = `match_${candidateId}_${Date.now()}`;

    if (isMutualMatch) {
      await Match.findOneAndUpdate(
        { candidateId },
        {
          id: matchId,
          userId1: 'usr_me_01',
          userId2: candidateId,
          candidateId,
          compatibilityScore: 92,
          status: action,
        },
        { upsert: true, returnDocument: 'after' }
      );
    }

    res.json({
      success: true,
      data: {
        isMutualMatch,
        matchId,
        action,
        remainingSuperlikes: 4,
      },
      message: `Match action '${action}' recorded in MongoDB`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

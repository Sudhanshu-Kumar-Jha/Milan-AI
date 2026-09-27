import { Request, Response } from 'express';
import { Profile } from '../models/Profile';
import { Match } from '../models/Match';
import { calculateAIMatchSynergy } from '../services/aiMatchEngine';

export const matchController = {
  // GET /api/matches/feed - Fully paginated live query from MongoDB
  async getFeed(req: Request, res: Response) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));

      const currentUser = (await Profile.findOne({ id: 'usr_me_01' }).lean()) || {
        id: 'usr_me_01',
        gender: 'male',
        coreValues: { familyValues: 9, careerAmbition: 8, financialOutlook: 8, spontaneity: 7, emotionalExpressiveness: 8 },
        lifestyle: { dietary: 'Vegetarian', smoking: 'Never', drinking: 'Socially', fitness: 'Active (3-4x week)', pets: 'Loves Dogs' },
        interests: ['Trekking', 'UI/UX Design', 'Indie Music', 'Podcasts', 'Specialty Coffee'],
        relationshipGoals: 'Marriage / Long-term',
      };

      // Enforce opposite gender match recommendation by default
      let targetGenderQuery: any = { id: { $ne: currentUser.id } };
      if (currentUser.gender === 'female') {
        targetGenderQuery.gender = 'male';
      } else if (currentUser.gender === 'male') {
        targetGenderQuery.gender = 'female';
      }

      let candidates = await Profile.find(targetGenderQuery).lean();
      if (candidates.length === 0) {
        candidates = await Profile.find({ id: { $ne: currentUser.id } }).lean();
      }
      
      // Transform into match candidates with real AI compatibility breakdowns
      const feed = candidates.map((cand: any) => {
        const synergy = calculateAIMatchSynergy(currentUser, cand);
        return {
          ...cand,
          compatibilityScore: synergy.score,
          scoreBreakdown: synergy.breakdown,
          aiHighlight: synergy.aiHighlight,
        };
      });

      // Sort descending by compatibility score
      feed.sort((a: any, b: any) => b.compatibilityScore - a.compatibilityScore);

      const total = feed.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedFeed = feed.slice(startIndex, startIndex + limit);

      res.json({
        success: true,
        data: paginatedFeed,
        meta: {
          page,
          limit,
          total,
          totalPages,
          hasMore: startIndex + limit < total,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/matches/recommendations - Auto-refreshed fresh recommendations (Paginated)
  async getRecommendations(req: Request, res: Response) {
    try {
      const userId = (req.query.userId as string) || 'usr_me_01';
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));

      const currentUser = (await Profile.findOne({ id: userId }).lean()) || {
        id: 'usr_me_01',
        gender: 'male',
        coreValues: { familyValues: 9, careerAmbition: 8, financialOutlook: 8, spontaneity: 7, emotionalExpressiveness: 8 },
        lifestyle: { dietary: 'Vegetarian', smoking: 'Never', drinking: 'Socially', fitness: 'Active', pets: 'Loves Dogs' },
        interests: ['Trekking', 'UI/UX Design', 'Indie Music', 'Specialty Coffee'],
        relationshipGoals: 'Marriage / Long-term',
      };

      let targetGenderQuery: any = { id: { $ne: currentUser.id } };
      if (currentUser.gender === 'female') {
        targetGenderQuery.gender = 'male';
      } else if (currentUser.gender === 'male') {
        targetGenderQuery.gender = 'female';
      }

      let candidates = await Profile.find(targetGenderQuery).lean();
      if (candidates.length === 0) {
        candidates = await Profile.find({ id: { $ne: currentUser.id } }).lean();
      }

      const scored = candidates.map((cand: any) => {
        const synergy = calculateAIMatchSynergy(currentUser, cand);
        return {
          ...cand,
          compatibilityScore: synergy.score,
          scoreBreakdown: synergy.breakdown,
          aiHighlight: synergy.aiHighlight,
        };
      });

      // Filter high synergy >= 85%
      const topPicks = scored
        .filter((c: any) => c.compatibilityScore >= 85)
        .sort((a: any, b: any) => b.compatibilityScore - a.compatibilityScore);

      const total = topPicks.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedPicks = topPicks.slice(startIndex, startIndex + limit);

      res.json({
        success: true,
        data: paginatedPicks,
        meta: {
          page,
          limit,
          total,
          totalPages,
          hasMore: startIndex + limit < total,
        },
        refreshedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // POST /api/matches/action
  async submitAction(req: Request, res: Response) {
    try {
      const { candidateId, action } = req.body;
      const isMutualMatch = action === 'accepted' || action === 'superlike';
      const matchId = `match_${candidateId}_${Date.now()}`;

      if (isMutualMatch) {
        const currentUser = (await Profile.findOne({ id: 'usr_me_01' })) || {};
        const candidate = await Profile.findOne({ id: candidateId });
        const score = candidate ? calculateAIMatchSynergy(currentUser, candidate).score : 92;

        await Match.findOneAndUpdate(
          { candidateId },
          {
            id: matchId,
            userId1: 'usr_me_01',
            userId2: candidateId,
            candidateId,
            compatibilityScore: score,
            status: action,
          },
          { upsert: true, returnDocument: 'after' }
        );
      }

      let actionMessage = 'Action saved successfully';
      if (action === 'accepted') {
        actionMessage = isMutualMatch ? "It's a Match! Connected with candidate ❤️" : 'Liked profile ❤️';
      } else if (action === 'superlike') {
        actionMessage = 'SuperLiked profile with priority synergy alert! ⭐';
      } else if (action === 'rejected') {
        actionMessage = 'Profile passed and neural vectors calibrated';
      } else if (action === 'skip') {
        actionMessage = 'Profile deferred and saved for later ⏭️';
      }

      res.json({
        success: true,
        data: {
          isMutualMatch,
          matchId,
          action,
          remainingSuperlikes: 4,
        },
        message: actionMessage,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // POST /api/matches/test-algorithm - Live sandbox testing endpoint for matching algorithm
  async testAlgorithm(req: Request, res: Response) {
    try {
      const { userA, userB, userIdA, userIdB } = req.body;

      let profileA = userA;
      let profileB = userB;

      if (!profileA && userIdA) {
        profileA = await Profile.findOne({ id: userIdA });
      }
      if (!profileB && userIdB) {
        profileB = await Profile.findOne({ id: userIdB });
      }

      // Default mock fallback profiles if none supplied
      if (!profileA) {
        profileA = {
          displayName: 'User A (Sample)',
          coreValues: { familyValues: 9, careerAmbition: 8, financialOutlook: 8, spontaneity: 7, emotionalExpressiveness: 8 },
          lifestyle: { dietary: 'Vegetarian', smoking: 'Never', drinking: 'Socially', fitness: 'Active', pets: 'Loves Dogs' },
          interests: ['Trekking', 'UI/UX Design', 'Specialty Coffee', 'Indie Music'],
          relationshipGoals: 'Marriage / Long-term',
          verificationStatus: 'verified',
        };
      }

      if (!profileB) {
        profileB = {
          displayName: 'User B (Sample)',
          coreValues: { familyValues: 9, careerAmbition: 9, financialOutlook: 8, spontaneity: 6, emotionalExpressiveness: 9 },
          lifestyle: { dietary: 'Vegetarian', smoking: 'Never', drinking: 'Socially', fitness: 'Active', pets: 'Loves Dogs' },
          interests: ['Architecture', 'Trekking', 'Specialty Coffee', 'Classical Music'],
          relationshipGoals: 'Marriage / Long-term',
          verificationStatus: 'verified',
        };
      }

      const result = calculateAIMatchSynergy(profileA, profileB);

      res.json({
        success: true,
        data: {
          profileA: {
            displayName: profileA.displayName || 'Profile A',
            coreValues: profileA.coreValues,
            lifestyle: profileA.lifestyle,
            interests: profileA.interests,
            relationshipGoals: profileA.relationshipGoals,
          },
          profileB: {
            displayName: profileB.displayName || 'Profile B',
            coreValues: profileB.coreValues,
            lifestyle: profileB.lifestyle,
            interests: profileB.interests,
            relationshipGoals: profileB.relationshipGoals,
          },
          compatibilityScore: result.score,
          breakdown: result.breakdown,
          aiHighlight: result.aiHighlight,
        },
        message: `Compatibility calculated: ${result.score}% Synergy`,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // DELETE /api/matches/:matchId - Unmatch / Cancel match
  async unmatch(req: Request, res: Response) {
    try {
      const { matchId } = req.params;
      await Match.findOneAndDelete({
        $or: [{ id: matchId }, { candidateId: matchId }],
      });

      res.json({
        success: true,
        message: 'Match successfully cancelled and profile unlinked.',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/matches/search?q=... - Search ALL users by name or email (fully paginated with lean query)
  async searchUsers(req: Request, res: Response) {
    try {
      const q = (req.query.q as string || '').trim();
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));

      if (!q || q.length < 2) {
        return res.json({
          success: true,
          data: [],
          meta: { page: 1, limit, total: 0, totalPages: 0, hasMore: false },
          message: 'Please enter at least 2 characters to search.',
          timestamp: new Date().toISOString(),
        });
      }

      const regex = new RegExp(q, 'i');
      const filter = {
        id: { $ne: 'usr_me_01' },
        $or: [
          { displayName: { $regex: regex } },
          { email: { $regex: regex } },
        ],
      };

      const [total, users] = await Promise.all([
        Profile.countDocuments(filter),
        Profile.find(filter)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
      ]);

      const currentUser = (await Profile.findOne({ id: 'usr_me_01' }).lean()) || {
        id: 'usr_me_01',
        gender: 'male',
        coreValues: { familyValues: 5, careerAmbition: 5, financialOutlook: 5, spontaneity: 5, emotionalExpressiveness: 5 },
        lifestyle: { dietary: 'Vegetarian', smoking: 'Never', drinking: 'Socially', fitness: 'Active', pets: 'Dog lover' },
        interests: [],
        relationshipGoals: 'Marriage / Long-term',
      };

      const results = users.map((u: any) => {
        const synergy = calculateAIMatchSynergy(currentUser, u);
        return {
          ...u,
          compatibilityScore: synergy.score,
          aiHighlight: synergy.aiHighlight,
        };
      });

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: results,
        meta: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page * limit < total,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

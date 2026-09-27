import { Request, Response } from 'express';
import { AlgorithmWeight } from '../models/AlgorithmWeight';
import { Message } from '../models/Message';

export const adminController = {
  // GET /api/admin/algorithm/weights
  async getAlgorithmWeights(_req: Request, res: Response) {
    try {
      let weights = await AlgorithmWeight.findOne();
      if (!weights) {
        weights = await AlgorithmWeight.create({
          valuesWeight: 0.40,
          goalsWeight: 0.30,
          lifestyleWeight: 0.20,
          interestsWeight: 0.10,
        });
      }

      res.json({
        success: true,
        data: weights,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // PUT /api/admin/algorithm/weights
  async updateAlgorithmWeights(req: Request, res: Response) {
    try {
      const { weights } = req.body;
      const updated = await AlgorithmWeight.findOneAndUpdate(
        {},
        { $set: weights },
        { returnDocument: 'after', upsert: true }
      );

      res.json({
        success: true,
        data: updated,
        message: 'Algorithm weights synchronized in MongoDB',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/admin/moderation/queue - Paginated safety moderation list
  async getModerationQueue(req: Request, res: Response) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));

      const [total, flagged] = await Promise.all([
        Message.countDocuments({ safetyFlagged: true }),
        Message.find({ safetyFlagged: true })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
      ]);

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: flagged,
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

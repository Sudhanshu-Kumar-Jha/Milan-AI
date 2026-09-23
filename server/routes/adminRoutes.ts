import { Router, Request, Response } from 'express';
import { AlgorithmWeight } from '../models/AlgorithmWeight';
import { Message } from '../models/Message';

export const adminRouter = Router();

// GET /api/admin/algorithm/weights
adminRouter.get('/algorithm/weights', async (_req: Request, res: Response) => {
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
});

// PUT /api/admin/algorithm/weights
adminRouter.put('/algorithm/weights', async (req: Request, res: Response) => {
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
});

// GET /api/admin/moderation/queue
adminRouter.get('/moderation/queue', async (_req: Request, res: Response) => {
  try {
    const flagged = await Message.find({ safetyFlagged: true }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: flagged,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

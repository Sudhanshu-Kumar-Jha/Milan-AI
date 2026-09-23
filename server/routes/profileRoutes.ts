import { Router, Request, Response } from 'express';
import { Profile } from '../models/Profile';
import { PrivacySettings } from '../models/PrivacySettings';

export const profileRouter = Router();

// GET /api/profile/me
profileRouter.get('/me', async (req: Request, res: Response) => {
  try {
    let profile = await Profile.findOne({ id: 'usr_me_01' });
    let privacy = await PrivacySettings.findOne({ userId: 'usr_me_01' });
    
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.json({
      success: true,
      data: profile,
      privacy: privacy || {},
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/profile/me
profileRouter.patch('/me', async (req: Request, res: Response) => {
  try {
    const updateData = req.body;
    const updated = await Profile.findOneAndUpdate(
      { id: 'usr_me_01' },
      { $set: updateData },
      { returnDocument: 'after', upsert: true }
    );

    res.json({
      success: true,
      data: updated,
      message: 'Profile updated in MongoDB successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/profile/vectors
profileRouter.put('/vectors', async (req: Request, res: Response) => {
  try {
    const { coreValues } = req.body;
    const updated = await Profile.findOneAndUpdate(
      { id: 'usr_me_01' },
      { $set: { coreValues } },
      { returnDocument: 'after' }
    );

    res.json({
      success: true,
      data: updated?.coreValues,
      message: 'Core values vectors synchronized to MongoDB',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

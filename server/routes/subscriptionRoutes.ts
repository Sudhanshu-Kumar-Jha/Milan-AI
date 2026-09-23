import { Router, Request, Response } from 'express';
import { Subscription } from '../models/Subscription';
import { Profile } from '../models/Profile';

export const subscriptionRouter = Router();

// GET /api/subscriptions/tiers
subscriptionRouter.get('/tiers', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: 'gold',
        name: 'Milan Gold',
        price: '₹499/mo',
        perks: ['Unlimited Profile Swipes', '5 SuperLikes / Day', 'See Who Liked You', 'Adaptive AI Breakdown'],
      },
      {
        id: 'vip',
        name: 'Milan VIP Concierge',
        price: '₹999/mo',
        perks: ['All Gold Features', 'Priority Agent Matchmaker', 'Identity Verified Badge', 'Direct Contact Unlock on Mutual Match'],
      },
    ],
    timestamp: new Date().toISOString(),
  });
});

// POST /api/subscriptions/checkout
subscriptionRouter.post('/checkout', async (req: Request, res: Response) => {
  try {
    const { planTier = 'gold' } = req.body;
    const txnId = `txn_${Date.now()}`;

    const sub = await Subscription.create({
      id: `sub_${Date.now()}`,
      userId: 'usr_me_01',
      planTier,
      status: 'active',
      transactionId: txnId,
      expiresAt: new Date(Date.now() + 30 * 86400 * 1000),
    });

    await Profile.findOneAndUpdate(
      { id: 'usr_me_01' },
      { isPremium: true, premiumTier: planTier }
    );

    res.json({
      success: true,
      data: {
        success: true,
        transactionId: txnId,
        tier: planTier,
        expiresAt: sub.expiresAt,
      },
      message: `Successfully upgraded to ${planTier.toUpperCase()} membership!`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

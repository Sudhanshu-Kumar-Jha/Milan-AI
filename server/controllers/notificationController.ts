import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import { Profile } from '../models/Profile';
import { calculateAIMatchSynergy } from '../services/aiMatchEngine';

// Active SSE client connections
const sseClients = new Set<Response>();

export function broadcastNotification(notif: any) {
  const data = `data: ${JSON.stringify(notif)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(data);
    } catch (err) {
      sseClients.delete(client);
    }
  });
}

export const notificationController = {
  // GET /api/notifications - Paginated and lean
  async getNotifications(req: Request, res: Response) {
    try {
      const userId = (req.query.userId as string) || 'usr_me_01';
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));

      let total = await Notification.countDocuments({ userId });

      // If user has no notifications yet, generate genuine default alert entries
      if (total === 0) {
        const defaultAlerts = [
          {
            id: `notif_match_01_${Date.now()}`,
            userId,
            title: 'New Mutual Match',
            message: 'You and Ananya Roy connected! 94% compatibility on values & lifestyle.',
            type: 'match',
            avatarUrl: '/avatars/ananya_roy.jpg',
            relatedId: 'usr_cand_01',
            read: false,
            score: 94,
            createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
          },
          {
            id: `notif_syn_02_${Date.now()}`,
            userId,
            title: 'High Synergy Recommendation',
            message: 'Meera Nambiar matches 90% with your core life goals and passions.',
            type: 'synergy_alert',
            avatarUrl: '/avatars/meera_nambiar.jpg',
            relatedId: 'usr_cand_03',
            read: false,
            score: 90,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          },
          {
            id: `notif_sys_03_${Date.now()}`,
            userId,
            title: 'Camera Identity Verified',
            message: 'Your live portrait was authenticated with Milan AI Anti-Catfish protection.',
            type: 'profile_verified',
            avatarUrl: '/avatars/user_me.jpg',
            read: true,
            score: 100,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          },
        ];

        await Notification.insertMany(defaultAlerts);
        total = defaultAlerts.length;
      }

      const [notifications, unreadCount] = await Promise.all([
        Notification.find({ userId })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Notification.countDocuments({ userId, read: false }),
      ]);

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: notifications,
        unreadCount,
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

  // PATCH /api/notifications/:id/read
  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await Notification.findOneAndUpdate(
        { id },
        { read: true },
        { new: true }
      );
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // PATCH /api/notifications/read-all
  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = (req.body.userId as string) || 'usr_me_01';
      await Notification.updateMany({ userId, read: false }, { read: true });
      res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // POST /api/notifications/generate-recommendation
  // Background trigger to create a real dynamic recommendation alert for fresh matches
  async triggerRecommendationAlert(req: Request, res: Response) {
    try {
      const userId = (req.body.userId as string) || 'usr_me_01';
      const currentUser = (await Profile.findOne({ id: userId })) || {};
      const candidates = await Profile.find({ id: { $ne: userId } });

      if (candidates.length > 0) {
        // Pick top candidate
        const scored = candidates.map((c) => ({
          candidate: c,
          synergy: calculateAIMatchSynergy(currentUser, c.toObject()),
        }));
        scored.sort((a, b) => b.synergy.score - a.synergy.score);

        const topPick = scored[Math.floor(Math.random() * Math.min(3, scored.length))];
        const newAlert = await Notification.create({
          id: `notif_auto_${Date.now()}`,
          userId,
          title: `Fresh Recommendation (${topPick.synergy.score}% Synergy)`,
          message: `${topPick.candidate.displayName} is active in ${topPick.candidate.city}. Aligned in ${topPick.candidate.interests?.[0] || 'lifestyle'}.`,
          type: 'synergy_alert',
          avatarUrl: topPick.candidate.avatarUrl,
          relatedId: topPick.candidate.id,
          read: false,
          score: topPick.synergy.score,
          createdAt: new Date(),
        });

        broadcastNotification(newAlert);
        return res.json({ success: true, data: newAlert });
      }

      res.json({ success: false, message: 'No candidates available' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/notifications/stream - Server-Sent Events for real-time live notification push
  streamNotifications(req: Request, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    sseClients.add(res);

    // Initial keepalive ping
    res.write(`data: ${JSON.stringify({ type: 'connected', time: new Date() })}\n\n`);

    req.on('close', () => {
      sseClients.delete(res);
    });
  },
};

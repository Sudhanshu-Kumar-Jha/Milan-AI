import { Request, Response } from 'express';
import { Message } from '../models/Message';
import { Match } from '../models/Match';
import { Profile } from '../models/Profile';

// Privacy filter / Safety interceptor
function scanContent(text: string) {
  const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/;
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const isFlagged = phonePattern.test(text) || emailPattern.test(text);

  return {
    isFlagged,
    warning: isFlagged ? 'Privacy Shield: Direct contact sharing is restricted prior to verification.' : undefined,
  };
}

export const chatController = {
  // GET /api/chat/conversations - High-performance batch-loaded & paginated active conversations
  async getConversations(req: Request, res: Response) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 30));

      const myId = (req as any).user?.id || 'usr_me_01';
      const matches = await Match.find({ status: { $in: ['accepted', 'superlike'] } }).lean();

      // Filter out self-matches
      const validMatches = matches.filter((m: any) => m.candidateId !== 'usr_me_01' && m.candidateId !== myId);

      // Extract unique partner candidate IDs for single batch lookup
      const partnerIds = validMatches.map((m: any) => m.candidateId);
      const matchIds = validMatches.map((m: any) => m.id);

      // Parallel batch fetches for profiles, last messages, and unread counts
      const [profiles, lastMessages, unreadCounts] = await Promise.all([
        Profile.find({ id: { $in: partnerIds } }).lean(),
        Message.aggregate([
          { $match: { matchId: { $in: matchIds } } },
          { $sort: { createdAt: -1 } },
          {
            $group: {
              _id: '$matchId',
              lastMsg: { $first: '$$ROOT' },
            },
          },
        ]),
        Message.aggregate([
          { $match: { matchId: { $in: matchIds }, senderId: { $ne: myId }, isRead: false } },
          { $group: { _id: '$matchId', count: { $sum: 1 } } },
        ]),
      ]);

      const profileMap = new Map(profiles.map((p: any) => [p.id, p]));
      const lastMsgMap = new Map(lastMessages.map((item: any) => [item._id, item.lastMsg]));
      const unreadMap = new Map(unreadCounts.map((item: any) => [item._id, item.count]));

      const conversations = [];

      for (const m of validMatches) {
        const partner = profileMap.get(m.candidateId);
        const lastMsg = lastMsgMap.get(m.id);
        const unreadCount = unreadMap.get(m.id) || 0;

        // Compute genuine online presence from real lastActive timestamp only
        const partnerLastActive = partner?.lastActive;
        let isOnline = false;
        let lastActiveText = 'Offline';

        if (partnerLastActive) {
          const diffMs = Date.now() - new Date(partnerLastActive).getTime();
          const diffMins = Math.floor(diffMs / 60000);
          if (diffMins <= 4) {
            isOnline = true;
            lastActiveText = 'Online now';
          } else if (diffMins < 60) {
            isOnline = false;
            lastActiveText = `Active ${diffMins}m ago`;
          } else {
            const diffHours = Math.floor(diffMins / 60);
            if (diffHours < 24) {
              isOnline = false;
              lastActiveText = `Active ${diffHours}h ago`;
            } else {
              isOnline = false;
              lastActiveText = 'Active yesterday';
            }
          }
        }

        const candidateData = partner
          ? {
              ...partner,
              isOnline,
              lastActive: lastActiveText,
            }
          : {
              id: m.candidateId,
              displayName: 'Match Partner',
              avatarUrl: '/avatars/ananya_roy.jpg',
              city: 'Bengaluru',
              age: 27,
              verificationStatus: 'verified',
              isOnline,
              lastActive: lastActiveText,
            };

        conversations.push({
          id: m.id,
          candidate: candidateData,
          lastMessage: lastMsg ? {
            content: lastMsg.content || (lastMsg.imageUrl ? '📷 Photo' : ''),
            imageUrl: lastMsg.imageUrl,
            type: lastMsg.type || (lastMsg.imageUrl ? 'image' : 'text'),
            timestamp: lastMsg.timestamp,
            senderId: lastMsg.senderId,
            isRead: lastMsg.isRead,
            safetyFlagged: lastMsg.safetyFlagged,
          } : undefined,
          unreadCount,
          compatibilityScore: m.compatibilityScore || 90,
        });
      }

      // Sort matches descending by compatibility score
      conversations.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      const total = conversations.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedConversations = conversations.slice(startIndex, startIndex + limit);

      res.json({
        success: true,
        data: paginatedConversations,
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

  // GET /api/chat/conversations/:matchId/messages - Paginated message stream
  async getMessages(req: Request, res: Response) {
    try {
      const { matchId } = req.params;
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(200, Math.max(1, parseInt(req.query.limit as string) || 100));

      const [total, messages] = await Promise.all([
        Message.countDocuments({ matchId }),
        Message.find({ matchId })
          .sort({ createdAt: 1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
      ]);

      const totalPages = Math.ceil(total / limit);
      
      res.json({
        success: true,
        data: messages,
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

  // PATCH /api/chat/conversations/:matchId/read - Mark all unread messages as read
  async markAsRead(req: Request, res: Response) {
    try {
      const { matchId } = req.params;
      
      const updateResult = await Message.updateMany(
        { matchId, senderId: { $ne: 'usr_me_01' }, isRead: false },
        { $set: { isRead: true } }
      );

      res.json({
        success: true,
        modifiedCount: updateResult.modifiedCount,
        message: 'Messages marked as read',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // POST /api/chat/messages
  async sendMessage(req: Request, res: Response) {
    try {
      const { matchId, content = '', imageUrl, type = imageUrl ? 'image' : 'text' } = req.body;
      if (!matchId) {
        return res.status(400).json({ success: false, message: 'Match ID is required.' });
      }

      const match = await Match.findOne({ id: matchId });
      if (match && (match.candidateId === 'usr_me_01' || match.candidateId === (req as any).user?.id)) {
        return res.status(400).json({ success: false, message: 'You cannot send messages to yourself.' });
      }

      const scan = content ? scanContent(content) : { isFlagged: false, warning: undefined };

      const message = await Message.create({
        id: `msg_${Date.now()}`,
        matchId,
        senderId: 'usr_me_01',
        content,
        imageUrl,
        type,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
        safetyFlagged: scan.isFlagged,
        safetyWarning: scan.warning,
      });

      res.json({
        success: true,
        data: message,
        message: scan.isFlagged ? 'Message recorded with Privacy Shield warning' : 'Message dispatched',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

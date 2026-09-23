import { Router, Request, Response } from 'express';
import { Message } from '../models/Message';
import { Match } from '../models/Match';
import { Profile } from '../models/Profile';

export const chatRouter = Router();

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

// GET /api/chat/conversations
chatRouter.get('/conversations', async (req: Request, res: Response) => {
  try {
    const matches = await Match.find({ status: { $in: ['accepted', 'superlike'] } });
    const conversations = [];

    for (const m of matches) {
      const partner = await Profile.findOne({ id: m.candidateId });
      const lastMsg = await Message.findOne({ matchId: m.id }).sort({ createdAt: -1 });

      conversations.push({
        id: m.id,
        candidate: partner || {
          id: m.candidateId,
          displayName: 'Match Partner',
          avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
          city: 'Bengaluru',
          age: 27,
          verificationStatus: 'verified',
        },
        lastMessage: lastMsg ? {
          content: lastMsg.content,
          timestamp: lastMsg.timestamp,
          senderId: lastMsg.senderId,
          isRead: lastMsg.isRead,
          safetyFlagged: lastMsg.safetyFlagged,
        } : undefined,
        unreadCount: 0,
        compatibilityScore: m.compatibilityScore || 90,
      });
    }

    res.json({
      success: true,
      data: conversations,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/chat/conversations/:matchId/messages
chatRouter.get('/conversations/:matchId/messages', async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const messages = await Message.find({ matchId }).sort({ createdAt: 1 });
    
    res.json({
      success: true,
      data: messages,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/chat/messages
chatRouter.post('/messages', async (req: Request, res: Response) => {
  try {
    const { matchId, content } = req.body;
    const scan = scanContent(content);

    const message = await Message.create({
      id: `msg_${Date.now()}`,
      matchId,
      senderId: 'usr_me_01',
      content,
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
});

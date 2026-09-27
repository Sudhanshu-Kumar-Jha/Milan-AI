import { Router } from 'express';
import { chatController } from '../controllers/chatController';
import { apiRateLimiter } from '../middleware/rateLimiter';

export const chatRouter = Router();

// Routes
chatRouter.get('/conversations', chatController.getConversations);
chatRouter.get('/conversations/:matchId/messages', chatController.getMessages);
chatRouter.patch('/conversations/:matchId/read', chatController.markAsRead);
chatRouter.post('/conversations/:matchId/read', chatController.markAsRead);
chatRouter.post('/messages', apiRateLimiter, chatController.sendMessage);

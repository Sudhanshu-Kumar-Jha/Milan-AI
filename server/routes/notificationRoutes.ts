import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';

export const notificationRouter = Router();

notificationRouter.get('/', notificationController.getNotifications);
notificationRouter.patch('/:id/read', notificationController.markAsRead);
notificationRouter.patch('/read-all', notificationController.markAllAsRead);
notificationRouter.post('/generate-recommendation', notificationController.triggerRecommendationAlert);
notificationRouter.get('/stream', notificationController.streamNotifications);

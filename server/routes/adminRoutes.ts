import { Router } from 'express';
import { adminController } from '../controllers/adminController';

export const adminRouter = Router();

// Routes
adminRouter.get('/algorithm/weights', adminController.getAlgorithmWeights);
adminRouter.put('/algorithm/weights', adminController.updateAlgorithmWeights);
adminRouter.get('/moderation/queue', adminController.getModerationQueue);

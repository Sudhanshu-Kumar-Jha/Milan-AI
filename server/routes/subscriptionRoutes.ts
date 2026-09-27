import { Router } from 'express';
import { subscriptionController } from '../controllers/subscriptionController';

export const subscriptionRouter = Router();

// Routes
subscriptionRouter.get('/tiers', subscriptionController.getTiers);
subscriptionRouter.post('/checkout', subscriptionController.checkout);

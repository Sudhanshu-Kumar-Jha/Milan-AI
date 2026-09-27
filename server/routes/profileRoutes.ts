import { Router } from 'express';
import { profileController } from '../controllers/profileController';

export const profileRouter = Router();

// Routes
profileRouter.get('/me', profileController.getMyProfile);
profileRouter.patch('/me', profileController.updateMyProfile);
profileRouter.patch('/privacy', profileController.updatePrivacySettings);
profileRouter.put('/vectors', profileController.updateCoreValues);
profileRouter.post('/generate-bio', profileController.generateBio);
profileRouter.post('/heartbeat', profileController.heartbeat);
profileRouter.get('/photo/:filename', profileController.getProtectedPhoto);

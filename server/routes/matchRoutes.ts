import { Router } from 'express';
import { matchController } from '../controllers/matchController';

export const matchRouter = Router();

// Routes
matchRouter.get('/search', matchController.searchUsers);
matchRouter.get('/feed', matchController.getFeed);
matchRouter.get('/recommendations', matchController.getRecommendations);
matchRouter.post('/action', matchController.submitAction);
matchRouter.post('/test-algorithm', matchController.testAlgorithm);
matchRouter.delete('/:matchId', matchController.unmatch);

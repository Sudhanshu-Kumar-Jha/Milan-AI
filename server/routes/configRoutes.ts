import { Router } from 'express';
import { configController } from '../controllers/configController';

export const configRouter = Router();

// Routes
configRouter.get('/cities', configController.getCities);
configRouter.post('/cities', configController.addOrUpdateCity);
configRouter.delete('/cities/:name', configController.deleteCity);

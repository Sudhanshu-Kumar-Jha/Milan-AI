import { Router } from 'express';
import { authController, maskEmail } from '../controllers/authController';

export const authRouter = Router();

export { maskEmail };

// Routes
authRouter.post('/otp/send', authController.sendOtp);
authRouter.post('/otp/verify', authController.verifyOtp);

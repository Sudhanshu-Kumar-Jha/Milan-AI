import { Router, Request, Response } from 'express';
import { Profile } from '../models/Profile';
import { sendOtpEmail } from '../config/email';

export const authRouter = Router();

export function maskEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const name = parts[0];
  const domain = parts[1];
  const visible = name.slice(0, Math.min(2, name.length));
  return `${visible}***@${domain}`;
}

// POST /api/auth/otp/send
authRouter.post('/otp/send', async (req: Request, res: Response) => {
  const { email = 'aarav.sharma@milanai.com' } = req.body;
  const sessionId = `sess_${Date.now()}`;
  const otp = '123456';

  // Send real email to MailHog (port 1025) / SMTP
  const emailResult = await sendOtpEmail(email, otp);

  res.json({
    success: true,
    data: {
      sessionId,
      expiresInSeconds: 300,
      isMock: true,
      testPin: otp,
      emailSent: emailResult.success,
      previewUrl: 'http://localhost:8025',
    },
    message: `OTP dispatched to ${email}. Check your inbox in MailHog at http://localhost:8025 (Test PIN: ${otp})`,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/auth/otp/verify
authRouter.post('/otp/verify', async (req: Request, res: Response) => {
  const { email = 'aarav.sharma@milanai.com', otp = '123456' } = req.body;

  try {
    let user = await Profile.findOne({ id: 'usr_me_01' });
    if (!user) {
      user = await Profile.create({
        id: 'usr_me_01',
        email,
        emailMasked: maskEmail(email),
        displayName: 'Aarav Sharma',
        age: 28,
        gender: 'male',
        city: 'Bengaluru',
        bio: 'Product Designer who loves outdoor trekking and coffee.',
        photos: [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        ],
        coreValues: {
          familyValues: 9,
          careerAmbition: 8,
          financialOutlook: 8,
          spontaneity: 7,
          emotionalExpressiveness: 8,
        },
        relationshipGoals: 'Marriage / Long-term',
        lifestyle: {
          dietary: 'Vegetarian',
          smoking: 'Never',
          drinking: 'Socially',
          fitness: 'Active',
          pets: 'Loves Dogs',
        },
        interests: ['Trekking', 'UI/UX Design', 'Coffee'],
        verificationStatus: 'verified',
        isPremium: false,
        premiumTier: 'free',
      });
    } else {
      // If user exists, update email if provided
      if (email && user.email !== email) {
        user.email = email;
        user.emailMasked = maskEmail(email);
        await user.save();
      }
    }

    res.json({
      success: true,
      data: {
        accessToken: `jwt_mongo_${Date.now()}`,
        refreshToken: `ref_mongo_${Date.now()}`,
        user,
        isNewUser: false,
      },
      message: 'Authentication successful (MongoDB Verified)',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Authentication error',
    });
  }
});

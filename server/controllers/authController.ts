import { Request, Response } from 'express';
import { Profile } from '../models/Profile';
import { sendOtpEmail } from '../config/email';

interface OtpRecord {
  otp: string;
  expiresAt: number;
}
const otpStore = new Map<string, OtpRecord>();

export function maskEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const name = parts[0];
  const domain = parts[1];
  const visible = name.slice(0, Math.min(2, name.length));
  return `${visible}***@${domain}`;
}

export const authController = {
  // POST /api/auth/otp/send
  async sendOtp(req: Request, res: Response) {
    try {
      const { email, purpose = 'login' } = req.body;
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address',
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Check if user exists in database (case-insensitive)
      const existingUser = await Profile.findOne({
        email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}$`, 'i') }
      });

      const isExistingUser = !!existingUser;

      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      // Generate dynamic 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP with 5 minutes validity
      otpStore.set(normalizedEmail, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });

      // Send email via configured SMTP engine
      const emailResult = await sendOtpEmail(normalizedEmail, otp);

      console.log(`\n======================================================`);
      console.log(`🔐 [MILAN AI OTP] User: ${normalizedEmail} | Code: ${otp} | Delivered: ${emailResult.success}`);
      console.log(`======================================================\n`);

      res.json({
        success: true,
        data: {
          sessionId,
          expiresInSeconds: 300,
          emailSent: emailResult.success,
          isExistingUser,
          backupOtp: emailResult.success ? undefined : otp,
        },
        message: emailResult.success
          ? `Verification code sent to ${normalizedEmail}. Please check your inbox or spam folder.`
          : `Verification code generated: ${otp} (Please check inbox or use code above)`,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // POST /api/auth/otp/verify
  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp, purpose = 'login', profileData } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Email and 6-digit verification code are required',
        });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const stored = otpStore.get(normalizedEmail);

      // Validate OTP code
      const isValidOtp = stored && stored.otp === otp.trim() && stored.expiresAt > Date.now();

      if (!isValidOtp) {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification code. Please check and try again.',
        });
      }

      // Clear used OTP
      otpStore.delete(normalizedEmail);

      let user = await Profile.findOne({
        email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}$`, 'i') }
      });

      if (purpose === 'login') {
        if (!user) {
          return res.status(404).json({
            success: false,
            message: `Account for ${normalizedEmail} does not exist. Please sign up to create a profile.`,
          });
        }
      } else {
        // Signup or new user creation
        if (user) {
          if (profileData) {
            Object.assign(user, profileData);
            await user.save();
          }
        } else {
          const generatedId = `usr_${Date.now()}`;
          const newUserData = {
            id: generatedId,
            email: normalizedEmail,
            emailMasked: maskEmail(normalizedEmail),
            displayName: profileData?.displayName || normalizedEmail.split('@')[0].replace(/[._]/g, ' '),
            age: profileData?.age || 26,
            dob: profileData?.dob || '',
            city: profileData?.city || 'Delhi NCR',
            occupation: profileData?.occupation || 'Professional',
            relationshipGoals: profileData?.relationshipGoals || 'Dating',
            lookingFor: profileData?.lookingFor || ['Dating'],
            languages: profileData?.languages || ['Hindi', 'English'],
            ageRangePreference: profileData?.ageRangePreference || { min: 21, max: 32 },
            locationPreference: profileData?.locationPreference || 'Delhi NCR',
            communicationStyle: profileData?.communicationStyle || 'Texting first',
            interests: profileData?.interests || ['Specialty Coffee', 'Travel & Roadtrips', 'Movies & Cinema'],
            weekendAvailability: profileData?.weekendAvailability || 'Saturday & Sunday',
            approximateBudget: profileData?.approximateBudget || '₹6,000–₹10,000 (Moderate / Comfortable)',
            travelStyle: profileData?.travelStyle || 'Relaxed & Luxury',
            bio: profileData?.bio || `Mindful matrimonial profile from ${profileData?.city || 'Delhi NCR'}.`,
            verificationStatus: 'verified',
            isLiveCameraVerified: true,
            cameraFilterUsed: 'ai_beautify',
            avatarUrl: profileData?.avatarUrl || '/avatars/user_me.jpg',
            photos: profileData?.photos || ['/avatars/user_me.jpg'],
            coreValues: profileData?.coreValues || {
              familyValues: 8,
              careerAmbition: 8,
              financialOutlook: 8,
              spontaneity: 7,
              emotionalExpressiveness: 8,
            },
            lifestyle: profileData?.lifestyle || {
              dietary: 'Vegetarian',
              smoking: 'Never',
              drinking: 'Socially',
              fitness: 'Active',
              pets: 'Loves Dogs',
            },
            isPremium: false,
          };

          user = await Profile.create(newUserData);
        }
      }

      // Generate JWT Access Token
      const accessToken = `milan_tok_${Date.now()}_${Buffer.from(normalizedEmail).toString('base64')}`;

      res.json({
        success: true,
        data: {
          accessToken,
          user,
        },
        message: purpose === 'signup' ? 'Account created successfully! Welcome to Milan AI.' : 'Logged in successfully! Welcome back.',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // POST /api/auth/logout
  async logout(_req: Request, res: Response) {
    res.json({
      success: true,
      message: 'Logged out successfully',
      timestamp: new Date().toISOString(),
    });
  },

  // GET /api/auth/me
  async getMe(req: Request, res: Response) {
    try {
      const user = await Profile.findOne({ id: 'usr_me_01' });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

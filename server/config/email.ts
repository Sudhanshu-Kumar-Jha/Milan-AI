import nodemailer from 'nodemailer';
import { envConfig } from './env';

export interface SendOtpEmailResult {
  success: boolean;
  messageId?: string;
  previewUrl?: string;
  error?: string;
}

// MailHog / SMTP Transporter
export const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '1025', 10),
  secure: false, // MailHog does not require SSL/TLS
  ignoreTLS: true,
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS || '',
      }
    : undefined,
});

/**
 * Dispatch verification OTP code to user's email address
 */
export async function sendOtpEmail(email: string, otp: string): Promise<SendOtpEmailResult> {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"Milan AI Support" <noreply@milanai.com>',
    to: email,
    subject: `🔐 ${otp} is your Milan AI Verification Code`,
    text: `Welcome to Milan AI!\n\nYour one-time verification code is: ${otp}\nThis code is valid for 5 minutes.\n\nIf you did not request this, please ignore this email.\n\nWarm regards,\nThe Milan AI Team`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
          .card { max-width: 500px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5); }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #ec4899, #f43f5e, #f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .title { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 12px; margin-bottom: 8px; }
          .subtitle { font-size: 14px; color: #94a3b8; line-height: 1.5; }
          .otp-box { background: #0f172a; border: 2px dashed #ec4899; border-radius: 12px; padding: 18px; text-align: center; margin: 28px 0; }
          .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #f43f5e; font-family: monospace; }
          .footer { font-size: 12px; color: #64748b; text-align: center; margin-top: 24px; border-top: 1px solid #334155; padding-top: 16px; }
          .badge { display: inline-block; padding: 4px 10px; background: rgba(236, 72, 153, 0.15); color: #f43f5e; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="badge">Milan AI Security</span>
            <div class="logo">✨ Milan AI</div>
            <div class="title">Verify Your Email Address</div>
            <div class="subtitle">Use the verification PIN below to securely complete your login or registration on Milan AI.</div>
          </div>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div style="font-size: 12px; color: #94a3b8; margin-top: 6px;">⏱️ Expires in 5 minutes</div>
          </div>
          
          <div class="subtitle" style="font-size: 13px;">
            🔒 For security purposes, never share this code with anyone. Milan AI team members will never ask for your verification code.
          </div>
          
          <div class="footer">
            Delivered locally via MailHog for testing • Milan AI Matrimony & Dating Engine<br/>
            Web UI: <a href="http://localhost:8025" style="color: #ec4899;">http://localhost:8025</a>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log(`📧 [MailHog / SMTP] Dispatched OTP email to ${email} (MessageId: ${info.messageId})`);
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: 'http://localhost:8025',
    };
  } catch (error: any) {
    console.warn(`⚠️ [MailHog / SMTP] Failed to send email to ${email}: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
}

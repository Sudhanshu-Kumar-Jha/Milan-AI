import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

export interface SendOtpEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  driver?: string;
}

export function createEmailTransporter(port = 465, secure = true) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

  const user = process.env.MAIL_USERNAME || process.env.SMTP_USER || 'no.reply.milanai@gmail.com';
  const pass = process.env.MAIL_PASSWORD || process.env.SMTP_PASS || 'vacritkthmlhkqqk';
  const cleanPass = pass ? pass.replace(/\s+/g, '') : '';

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port,
    secure,
    auth: {
      user,
      pass: cleanPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    // Force IPv4 only - eliminates ENETUNREACH 2607:... IPv6 routing failures on cloud hosts
    family: 4,
    connectionTimeout: 4000,
    greetingTimeout: 3500,
    socketTimeout: 4500,
  } as any);
}

/**
 * Dispatch verification OTP code with strict IPv4 forcing and timeout protection
 */
export async function sendOtpEmail(email: string, otp: string): Promise<SendOtpEmailResult> {
  dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

  const fromAddress = process.env.MAIL_FROM_ADDRESS || 'no.reply.milanai@gmail.com';
  const fromName = process.env.MAIL_FROM_NAME || 'Milan AI';
  const from = `"${fromName}" <${fromAddress}>`;

  const mailOptions = {
    from,
    to: email,
    subject: `🔐 ${otp} is your Milan AI Verification Code`,
    text: `Welcome to Milan AI!\n\nYour one-time verification code is: ${otp}\nThis code is valid for 5 minutes.\n\nIf you did not request this, please ignore this email.\n\nWarm regards,\nThe Milan AI Team`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070b12; color: #f8fafc; margin: 0; padding: 24px; }
          .card { max-width: 520px; margin: 0 auto; background: #0f172a; border-radius: 20px; border: 1px solid #334155; padding: 36px 32px; box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.7); }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 26px; font-weight: 900; background: linear-gradient(135deg, #fb7185, #f43f5e, #f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .title { font-size: 20px; font-weight: 800; color: #ffffff; margin-top: 14px; margin-bottom: 8px; }
          .subtitle { font-size: 14px; color: #94a3b8; line-height: 1.6; }
          .otp-box { background: #070b12; border: 2px dashed #f43f5e; border-radius: 16px; padding: 22px; text-align: center; margin: 28px 0; }
          .otp-code { font-size: 40px; font-weight: 900; letter-spacing: 10px; color: #fb7185; font-family: monospace; }
          .footer { font-size: 12px; color: #64748b; text-align: center; margin-top: 28px; border-top: 1px solid #1e293b; padding-top: 20px; }
          .badge { display: inline-block; padding: 4px 12px; background: rgba(244, 63, 94, 0.15); color: #fb7185; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="badge">Milan AI Security</span>
            <div class="logo">✨ Milan AI</div>
            <div class="title">Email Verification Code</div>
            <div class="subtitle">Use the verification PIN below to securely complete your registration or login on Milan AI.</div>
          </div>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div style="font-size: 13px; color: #94a3b8; margin-top: 8px;">⏱️ Valid for 5 minutes</div>
          </div>
          
          <div class="subtitle" style="font-size: 13px; background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 12px; border: 1px solid #1e293b;">
            🔒 <strong>Security Tip:</strong> Never share this code with anyone. Milan AI team members will never ask for your verification code.
          </div>
          
          <div class="footer">
            Delivered via Milan AI Mail Engine<br/>
            Mindful Matrimony & AI Compatibility Platform
          </div>
        </div>
      </body>
      </html>
    `,
  };

  // 1. Try Port 465 (SSL)
  try {
    const transporter465 = createEmailTransporter(465, true);
    const info = await Promise.race([
      transporter465.sendMail(mailOptions),
      new Promise((_, reject) => setTimeout(() => reject(new Error('SMTP Port 465 timeout')), 3500)),
    ]);
    console.log(`📧 [Mail Engine] Real email successfully sent to ${email} via Port 465 (MessageId: ${(info as any)?.messageId})`);
    return {
      success: true,
      messageId: (info as any)?.messageId,
      driver: 'gmail-465',
    };
  } catch (err465: any) {
    console.warn(`⚠️ [Mail Engine] Port 465 attempt failed (${err465.message}), trying Port 587 STARTTLS...`);
  }

  // 2. Fallback to Port 587 (STARTTLS)
  try {
    const transporter587 = createEmailTransporter(587, false);
    const info = await Promise.race([
      transporter587.sendMail(mailOptions),
      new Promise((_, reject) => setTimeout(() => reject(new Error('SMTP Port 587 timeout')), 3500)),
    ]);
    console.log(`📧 [Mail Engine] Real email successfully sent to ${email} via Port 587 (MessageId: ${(info as any)?.messageId})`);
    return {
      success: true,
      messageId: (info as any)?.messageId,
      driver: 'gmail-587',
    };
  } catch (err587: any) {
    console.warn(`⚠️ [Mail Engine] Direct SMTP dispatch unreachable on cloud container (${err587.message}).`);
    return {
      success: false,
      error: err587.message,
    };
  }
}

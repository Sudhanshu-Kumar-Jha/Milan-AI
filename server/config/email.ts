import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'node:dns';

// Ensure IPv4 resolution first in Node DNS lookup to prevent cloud container ENETUNREACH
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

export interface SendOtpEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  driver?: string;
}

export function createEmailTransporter(portOverride?: number, secureOverride?: boolean) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

  const host = process.env.MAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com';
  const defaultPort = parseInt(process.env.MAIL_PORT || process.env.SMTP_PORT || '465', 10);
  const port = portOverride !== undefined ? portOverride : defaultPort;
  const user = process.env.MAIL_USERNAME || process.env.SMTP_USER || 'no.reply.milanai@gmail.com';
  const pass = process.env.MAIL_PASSWORD || process.env.SMTP_PASS || 'vacritkthmlhkqqk';
  const cleanPass = pass ? pass.replace(/\s+/g, '') : '';
  const isSecure = secureOverride !== undefined ? secureOverride : (port === 465);

  return nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    family: 4, // Explicitly force IPv4 socket connection
    auth: {
      user,
      pass: cleanPass,
    },
    tls: {
      rejectUnauthorized: false,
      ciphers: 'SSLv3',
    },
    connectionTimeout: 10000, // 10s connection timeout
    greetingTimeout: 8000,
    socketTimeout: 15000,
  });
}

/**
 * Dispatch verification OTP code to user's real email address via Gmail SMTP with automatic port fallback
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

  // Primary Attempt: Port 465 (SSL) with forced IPv4
  try {
    const primaryTransporter = createEmailTransporter(465, true);
    const info = await primaryTransporter.sendMail(mailOptions);
    console.log(`📧 [Mail Engine] Real email successfully sent via Port 465 to ${email} (MessageId: ${info.messageId})`);
    return {
      success: true,
      messageId: info.messageId,
      driver: 'gmail-465',
    };
  } catch (primaryError: any) {
    console.warn(`⚠️ [Mail Engine] Port 465 attempt to ${email} encountered: ${primaryError.message}. Trying Port 587 STARTTLS...`);

    // Secondary Attempt: Port 587 (STARTTLS) with forced IPv4
    try {
      const fallbackTransporter = createEmailTransporter(587, false);
      const info = await fallbackTransporter.sendMail(mailOptions);
      console.log(`📧 [Mail Engine] Real email successfully sent via Port 587 STARTTLS to ${email} (MessageId: ${info.messageId})`);
      return {
        success: true,
        messageId: info.messageId,
        driver: 'gmail-587',
      };
    } catch (fallbackError: any) {
      console.error(`❌ [Mail Engine] Both SMTP attempts to ${email} failed: ${fallbackError.message}`);
      return {
        success: false,
        error: `Email delivery failed: ${fallbackError.message}`,
      };
    }
  }
}

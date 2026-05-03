import pool from '../db/pool.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const otpStore = new Map();
const OTP_EXPIRY_MS = 10 * 60 * 1000;

function generateOtp() {
  return String(crypto.randomInt(100000, 999999));
}

function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

async function sendOtpEmail(to, otp) {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[DEV] Password reset OTP for ${to}: ${otp}`);
    return;
  }

  await transporter.sendMail({
    from: `"Next-Step" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset your Next-Step password',
    html: `
      <div style="margin:0;background:#ecfeff;padding:32px 16px;font-family:Arial,sans-serif;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(8,145,178,.12);border:1px solid #cffafe;">
          <div style="background:linear-gradient(135deg,#0d9488,#14b8a6);padding:28px 32px;text-align:center;color:#fff;">
            <div style="font-size:28px;font-weight:700;letter-spacing:.2px;">Next-Step</div>
            <div style="font-size:14px;opacity:.9;margin-top:6px;">Asset Management System</div>
          </div>
          <div style="padding:32px;">
            <h1 style="margin:0 0 10px;color:#0f172a;font-size:24px;">Password reset code</h1>
            <p style="margin:0 0 22px;color:#475569;font-size:15px;line-height:1.6;">
              Use this code to reset your password. It expires in <strong>10 minutes</strong>.
            </p>
            <div style="text-align:center;margin:28px 0;">
              <div style="display:inline-block;padding:18px 28px;border-radius:16px;border:2px dashed #14b8a6;background:#f0fdfa;color:#0f766e;font-size:34px;font-weight:700;letter-spacing:8px;min-width:220px;">
                ${otp}
              </div>
            </div>
            <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">
              If you didn’t request this, you can ignore this email.
            </p>
          </div>
        </div>
      </div>
    `,
  });
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const key = email.toLowerCase().trim();
    const result = await pool.query('SELECT id, email FROM users WHERE email = $1', [key]);
    if (result.rows.length === 0) {
      return res.json({ message: 'If this email exists, a code has been sent.' });
    }

    const otp = generateOtp();
    otpStore.set(key, { otp, expiresAt: Date.now() + OTP_EXPIRY_MS });
    await sendOtpEmail(key, otp);

    res.json({ message: 'Code sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to send reset code.' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and code are required' });

    const key = email.toLowerCase().trim();
    const stored = otpStore.get(key);

    if (!stored) return res.status(400).json({ error: 'Request a new code.' });
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(key);
      return res.status(400).json({ error: 'Code expired. Request a new one.' });
    }
    if (stored.otp !== String(otp).trim()) {
      return res.status(400).json({ error: 'Incorrect code.' });
    }

    otpStore.set(key, { ...stored, verified: true });
    res.json({ message: 'Code verified.' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify code.' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, code and new password are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const key = email.toLowerCase().trim();
    const stored = otpStore.get(key);

    if (!stored || !stored.verified) {
      return res.status(400).json({ error: 'Verify the code first.' });
    }
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(key);
      return res.status(400).json({ error: 'Session expired. Start again.' });
    }
    if (stored.otp !== String(otp).trim()) {
      return res.status(400).json({ error: 'Invalid reset session.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await pool.query('UPDATE users SET password = $1 WHERE email = $2 RETURNING id', [hashedPassword, key]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    otpStore.delete(key);
    res.json({ message: 'Password updated.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
};

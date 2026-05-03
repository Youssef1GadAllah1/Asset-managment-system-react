import pool from '../db/pool.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// In-memory OTP store: email → { otp, expiresAt }
// OTPs expire after 10 minutes
const otpStore = new Map();

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

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
    // Dev fallback: just log the OTP
    console.log(`[DEV] Password reset OTP for ${to}: ${otp}`);
    return;
  }

  await transporter.sendMail({
    from: `"Next-Step" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Password Reset Code – Next-Step',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;background:#f9fafb;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="color:#0d9488;font-size:24px;margin:0;">Next-Step</h1>
          <p style="color:#6b7280;margin:4px 0 0;">Asset Management System</p>
        </div>
        <div style="background:#fff;border-radius:8px;padding:24px;border:1px solid #e5e7eb;">
          <h2 style="color:#111827;margin:0 0 8px;">Password Reset Code</h2>
          <p style="color:#6b7280;margin:0 0 24px;line-height:1.6;">
            Use the code below to reset your password. This code expires in <strong>10 minutes</strong>.
          </p>
          <div style="text-align:center;margin:24px 0;">
            <span style="display:inline-block;padding:16px 32px;background:#f0fdfa;border:2px dashed #0d9488;border-radius:12px;font-size:36px;font-weight:bold;letter-spacing:8px;color:#0f766e;">
              ${otp}
            </span>
          </div>
          <p style="color:#9ca3af;font-size:13px;margin:16px 0 0;">
            If you didn't request a password reset, please ignore this email.
            Your password will not be changed.
          </p>
        </div>
        <p style="text-align:center;color:#d1d5db;font-size:12px;margin-top:24px;">
          © ${new Date().getFullYear()} Next-Step · EVA Cosmetics Group
        </p>
      </div>
    `,
  });
}

// POST /api/auth/forgot-password
// Body: { email }
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Check user exists
    const result = await pool.query('SELECT id, email FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      // Return success even if user not found to prevent email enumeration
      return res.json({ message: 'If this email exists, a reset code has been sent.' });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;

    // Store OTP (overwrite any existing one)
    otpStore.set(email.toLowerCase().trim(), { otp, expiresAt });

    await sendOtpEmail(email.toLowerCase().trim(), otp);

    res.json({ message: 'Reset code sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to send reset code. Please try again.' });
  }
};

// POST /api/auth/verify-otp
// Body: { email, otp }
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and code are required' });

    const key = email.toLowerCase().trim();
    const stored = otpStore.get(key);

    if (!stored) return res.status(400).json({ error: 'No reset code found. Please request a new one.' });
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(key);
      return res.status(400).json({ error: 'Reset code has expired. Please request a new one.' });
    }
    if (stored.otp !== String(otp).trim()) {
      return res.status(400).json({ error: 'Incorrect code. Please try again.' });
    }

    // Mark as verified (keep for reset step)
    otpStore.set(key, { ...stored, verified: true });

    res.json({ message: 'Code verified successfully.' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify code.' });
  }
};

// POST /api/auth/reset-password
// Body: { email, otp, newPassword }
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
      return res.status(400).json({ error: 'Please verify your reset code first.' });
    }
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(key);
      return res.status(400).json({ error: 'Session expired. Please start over.' });
    }
    if (stored.otp !== String(otp).trim()) {
      return res.status(400).json({ error: 'Invalid reset session.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING id',
      [hashedPassword, key]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    otpStore.delete(key);

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
};

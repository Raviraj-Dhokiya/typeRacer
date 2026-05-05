// backend/routes/authRoutes.js
// All authentication-related routes: register, verify-otp, login

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validate as validateEmail } from 'deep-email-validator';
import User from '../models/User.js';
import { sendOtpEmail } from '../utils/emailHelper.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_typeracer';

// ── Helper: generate a 6-digit OTP ──────────────────────────────────
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ── Helper: build user payload for JWT response ──────────────────────
const buildUserPayload = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  createdAt: user.createdAt,
  badges: user.badges || [],
  level: user.level || 1,
  xp: user.xp || 0,
});

// ── POST /api/auth/register ──────────────────────────────────────────
// Registers a new user or re-sends OTP to an unverified user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate email format, typos, and disposable emails
    // (MX and SMTP validation disabled because local ISP/Firewall blocks DNS MX queries)
    const emailValidation = await validateEmail({
      email,
      validateRegex: true,
      validateMx: false,
      validateTypo: true,
      validateDisposable: true,
      validateSMTP: false,
    });

    if (!emailValidation.valid) {
      console.log(`❌ Rejecting fake/invalid email: ${email} (Reason: ${emailValidation.reason})`);
      return res.status(400).json({ 
        error: "This email address is invalid, misspelled, or a disposable email. Please enter a real email." 
      });
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60_000); // 10 min

    let user = await User.findOne({ email });

    if (user) {
      // Email already registered
      if (user.isVerified) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }
      // Unverified — refresh OTP and update details
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.username = username;
      user.otp = otp;
      user.otpExpires = otpExpires;
      user.avatar = username.charAt(0).toUpperCase();
      await user.save();
    } else {
      // Check username uniqueness
      const usernameCheck = await User.findOne({ username });
      if (usernameCheck) {
        return res.status(400).json({ error: 'Username already taken' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        username,
        email,
        password: hashedPassword,
        avatar: username.charAt(0).toUpperCase(),
        isVerified: false,
        otp,
        otpExpires,
      });
      await user.save();
    }

    // Respond immediately — email is sent in background
    res.json({
      message: 'OTP sent to your email. Please verify to continue.',
      requireOtp: true,
      email: user.email,
    });

    // Fire-and-forget
    sendOtpEmail(email, otp);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── POST /api/auth/verify-otp ────────────────────────────────────────
// Verifies OTP for a newly registered user
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Email doesn't exist. Please register first." });
    if (user.isVerified) return res.status(400).json({ error: 'User already verified' });
    if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    if (user.otpExpires < new Date()) return res.status(400).json({ error: 'OTP expired. Please request a new one.' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: buildUserPayload(user) });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── POST /api/auth/resend-otp ────────────────────────────────────────
// Resends OTP to an existing but unverified email
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email doesn't exist. Please register first." });
    }
    if (user.isVerified) {
      return res.status(400).json({ error: 'This account is already verified. Please log in.' });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60_000);
    await user.save();

    res.json({ message: 'A new OTP has been sent to your email.', email });
    sendOtpEmail(email, otp);
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── POST /api/auth/login ─────────────────────────────────────────────
// Logs in a verified user; re-sends OTP if account is unverified
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // ✅ FIX: If email doesn't exist, return a clear message
    if (!user) {
      return res.status(404).json({ error: "Email doesn't exist. Please register first." });
    }

    // Account exists but not yet verified — re-send OTP
    if (!user.isVerified) {
      const otp = generateOtp();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60_000);
      await user.save();

      res.status(400).json({
        error: 'Please verify your email first. A new OTP has been sent.',
        requireOtp: true,
        email: user.email,
      });
      sendOtpEmail(email, otp);
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: buildUserPayload(user) });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as Brevo from '@getbrevo/brevo';

// Models
import User from './models/User.js';
import Result from './models/Result.js';

// Utils
import { evaluateBadges, calculateXP, calculateLevel } from './badgeEngine.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/typeracer';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_typeracer';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Brevo email helper
const sendOtpEmail = async (email, otp) => {
  if (!process.env.BREVO_API_KEY) {
    console.log(`⚠️ BREVO_API_KEY not set. OTP for ${email}: ${otp}`);
    return;
  }
  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY;
    await apiInstance.sendTransacEmail({
      sender: { name: 'TypeRacer', email: process.env.EMAIL_USER || 'ravirajdhokiya9@gmail.com' },
      to: [{ email }],
      subject: 'Your TypeRacer Verification OTP',
      textContent: `Your verification OTP is: ${otp}. It will expire in 10 minutes.`
    });
    console.log(`✅ OTP sent to ${email}`);
  } catch (e) {
    console.error('❌ Email failed:', e.message, '| OTP is:', otp);
  }
};

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// --- ROUTES ---

// 1. Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 mins

    let user = await User.findOne({ email });
    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }
      // Update existing unverified user
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.username = username;
      user.otp = otp;
      user.otpExpires = otpExpires;
      user.avatar = username.charAt(0).toUpperCase();
      await user.save();
    } else {
      let usernameCheck = await User.findOne({ username });
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
        otpExpires
      });
      await user.save();
    }
    
    // Respond immediately — don't wait for email
    res.json({ message: 'OTP sent to your email. Please verify to continue.', requireOtp: true, email: user.email });

    // Send email in background (fire-and-forget)
    sendOtpEmail(email, otp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 1.5 Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (user.isVerified) return res.status(400).json({ error: 'User already verified' });
    
    if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    if (user.otpExpires < new Date()) return res.status(400).json({ error: 'OTP expired' });
    
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar, createdAt: user.createdAt, badges: user.badges || [], level: user.level || 1, xp: user.xp || 0 }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    if (!user.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60000);
      await user.save();

      // Respond immediately — don't wait for email
      res.status(400).json({ error: 'Please verify your email first. A new OTP has been sent.', requireOtp: true, email: user.email });

      // Send email in background (fire-and-forget)
      sendOtpEmail(email, otp);
      return;
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar, createdAt: user.createdAt, badges: user.badges || [], level: user.level || 1, xp: user.xp || 0 }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
 
// 3. Save Result
app.post('/api/results', authMiddleware, async (req, res) => {
  try {
    const { wpm, accuracy, timeTaken, mode } = req.body;
    const result = new Result({
      userId: req.user.id,
      wpm,
      accuracy,
      timeTaken,
      mode
    });
    await result.save();

    // Fetch all user results for badge evaluation
    const allResults = await Result.find({ userId: req.user.id });
    const user = await User.findById(req.user.id);
    
    // Evaluate badges
    const newBadges = evaluateBadges(user, result, allResults);
    
    // Update XP and Level
    const earnedXp = calculateXP(result);
    user.xp = (user.xp || 0) + earnedXp;
    user.level = calculateLevel(user.xp);
    
    if (newBadges.length > 0) {
      if (!user.badges) user.badges = [];
      user.badges.push(...newBadges);
    }
    
    await user.save();

    res.json({ 
      result, 
      newBadges, 
      userUpdate: { xp: user.xp, level: user.level, badges: user.badges } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 4. Get User Results
app.get('/api/results', authMiddleware, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id }).sort({ date: -1 }).limit(50);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 5. Get Global Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find({})
      .select('username avatar level xp createdAt badges')
      .sort({ xp: -1 })
      .limit(50);
    res.json(topUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

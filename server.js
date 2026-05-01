import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Models
import User from './src/server/models/User.js';
import Result from './src/server/models/Result.js';

// Utils
import { evaluateBadges, calculateXP, calculateLevel } from './src/server/badgeEngine.js';

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
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ error: 'User already exists with this email or username' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = new User({
      username,
      email,
      password: hashedPassword,
      avatar: username.charAt(0).toUpperCase()
    });
    
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

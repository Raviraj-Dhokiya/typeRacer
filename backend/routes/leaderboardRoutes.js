// backend/routes/leaderboardRoutes.js
// Route for fetching the global leaderboard

import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// ── GET /api/leaderboard — Top 50 users sorted by XP ─────────────────
router.get('/', async (req, res) => {
  try {
    const topUsers = await User.find({ isVerified: true })
      .select('username avatar level xp createdAt badges')
      .sort({ xp: -1 })
      .limit(50);

    res.json(topUsers);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

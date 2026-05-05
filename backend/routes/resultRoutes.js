// backend/routes/resultRoutes.js
// Routes for saving and fetching typing test results

import express from 'express';
import Result from '../models/Result.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { evaluateBadges, calculateXP, calculateLevel } from '../badgeEngine.js';

const router = express.Router();

// ── POST /api/results — Save a typing result ─────────────────────────
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { wpm, accuracy, timeTaken, mode } = req.body;

    const result = new Result({
      userId: req.user.id,
      wpm,
      accuracy,
      timeTaken,
      mode,
    });
    await result.save();

    // Fetch all results for badge evaluation
    const allResults = await Result.find({ userId: req.user.id });
    const user = await User.findById(req.user.id);

    // Evaluate new badges
    const newBadges = evaluateBadges(user, result, allResults);

    // Update XP and level
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
      userUpdate: { xp: user.xp, level: user.level, badges: user.badges },
    });
  } catch (error) {
    console.error('Save result error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET /api/results — Fetch current user's results ──────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(50);
    res.json(results);
  } catch (error) {
    console.error('Fetch results error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

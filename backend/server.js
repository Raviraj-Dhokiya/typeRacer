// backend/server.js
// Main Express server — bootstraps middleware and mounts route modules

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Route modules
import authRoutes from './routes/authRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/typeracer';

// ── Global middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Database connection ──────────────────────────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ── Mount route modules ──────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// ── Health check ─────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── Start server ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

# TypeRacer — Advanced Typing Speed Test ⌨️🚀

An advanced, feature-rich Typing Speed Test application built with the **MERN stack** (MongoDB, Express, React, Node.js). It goes beyond traditional typing tests by incorporating gamification, detailed analytics, secure email verification, and a global leaderboard to make typing practice engaging and competitive.

> 🌐 **Live Demo:** Frontend on [Vercel](https://vercel.com) · Backend API on [Render](https://render.com)

---

## ✨ Features & Implemented Functions

### 1. 🔐 Secure Authentication & User Management
- **User Registration & Login:** Passwords hashed with `bcryptjs`; sessions managed via JWT (7-day expiry).
- **Email OTP Verification:** A 6-digit OTP is generated on signup and sent via **Brevo** (Sendinblue) transactional email API. Unverified users cannot log in. Validates for disposable and misspelled emails.
- **Fire-and-Forget Email:** The server responds immediately to the client and dispatches the OTP email in the background — eliminating signup latency.
- **State Management:** Fully powered by **Redux Toolkit** (auth and results slices), cleanly wrapped in an `AuthContext` provider for seamless legacy component integration.

### 2. ⚡ Core Typing Engine
- **Real-time Calculations:** Live updates for WPM (Words Per Minute), Accuracy, Time Left, and Error count.
- **Multiple Modes:** Choose from 3 practice modes:
  - **Paragraph** — High-quality, meaningful long-form paragraphs.
  - **Code** — Programming syntax and symbols.
  - **Quotes** — Full sentences with punctuation.
- **Flexible Timers:** 15s, 30s, 60s, or 120s sessions.
- **Live Feedback:** Character-by-character visual feedback — correct (green), incorrect (red), with a blinking caret.
- **Auto-Save Results:** Test results are automatically saved to the database on completion (no manual save button needed).
- **Confetti Celebration:** `canvas-confetti` fires on test completion for a satisfying reward effect.

### 3. 🎮 Gamification: Badges, XP & Leveling
- **Robust Badge Engine:** Backend `badgeEngine.js` automatically evaluates and awards **30+ unique badges** based on milestones — e.g., hitting 100 WPM, achieving 100% accuracy, playing at midnight, or maintaining streaks.
- **Tiered Difficulty:** Badges are categorized as Easy, Medium, Hard, and Legendary.
- **XP System:** Users earn XP based on test performance (WPM, accuracy, time).
- **Dynamic Rank Titles:** 100+ levels with custom titles (Newbie → Rookie → Bronze Typist → Master Typist → God Tier).

### 4. 📊 Detailed User Profile & Analytics
- **Performance Charts:** `recharts` powers a WPM/Accuracy Line Chart and a Mode Breakdown Pie Chart.
- **Activity Heatmap:** A GitHub-style **30-day contribution graph** that visualizes daily typing activity intensity.
- **Test History:** A comprehensive table of all past test results (WPM, accuracy, mode, date).
- **Badge Showcase:** A dedicated tab to browse earned and locked badges, grouped by difficulty tier with filter controls.

### 5. 🌍 Global Leaderboard
- **Competitive Rankings:** Fetches top 50 users from the database.
- **XP-based Sorting:** Users are ranked globally by total XP and Level.

### 6. 🔔 In-App Notifications
- **React Hot Toast:** Non-intrusive toast notifications for login success, errors, badge unlocks, and OTP status.

---

## 📂 Project Structure

```text
typeRacer/
├── backend/
│   ├── middleware/              # Authentication middlewares
│   ├── models/
│   │   ├── Result.js            # Mongoose schema for test results
│   │   └── User.js              # Mongoose schema for users (auth, badges, xp, otp)
│   ├── routes/                  # Express routes (auth, results, leaderboard)
│   ├── utils/                   # Email helpers (Nodemailer, Brevo integration)
│   ├── badgeEngine.js           # Core logic for evaluating XP, levels & unlocking badges
│   └── server.js                # Express server setup and MongoDB connection
├── frontend/
│   ├── assets/                  # Static assets
│   ├── components/              # Reusable UI components (StatCard, TextDisplay, UserMenu, etc.)
│   ├── store/                   # Redux Toolkit (authSlice.js, resultsSlice.js, index.js)
│   ├── utils/                   # API utilities, badge definitions, text/paragraph generators
│   ├── App.jsx                  # Main routing, state management & typing engine
│   ├── App.css                  # Custom styling, dark theme & animations
│   ├── AuthContext.jsx          # React Context wrapping the Redux store
│   ├── AuthModal.jsx            # Modal UI for Login, Signup & OTP input
│   ├── LeaderboardPage.jsx      # Global Leaderboard view
│   ├── ProfilePage.jsx          # User dashboard (Stats, Heatmap, History, Badges)
│   ├── index.css                # Base CSS imports
│   └── main.jsx                 # React root render
├── .env                         # Secrets (see Environment Variables section)
├── .gitignore                   # Excludes .env, node_modules, dist
├── package.json                 # Monorepo dependencies & concurrent dev scripts
├── vite.config.js               # Vite config with /api proxy to backend
└── eslint.config.js             # ESLint configuration
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, Redux Toolkit |
| **Charts & UI** | Recharts, React Hot Toast, canvas-confetti |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB Atlas (via Mongoose) |
| **Auth & Security** | JWT (`jsonwebtoken`), bcryptjs, deep-email-validator |
| **Email** | Nodemailer & Brevo (Sendinblue) REST API |
| **Dev Tooling** | concurrently, ESLint |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file at the project root:
```env
# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/typeracer

# JWT signing secret
JWT_SECRET=your_strong_jwt_secret

# Backend port (default: 5000)
PORT=5000

# Brevo transactional email
BREVO_API_KEY=your_brevo_api_key
EMAIL_USER=your_sender_email@example.com

# Frontend API URL (leave empty for local dev, set for production)
# VITE_API_URL=https://your-render-backend.onrender.com
```

> **Note:** `EMAIL_USER` & `EMAIL_PASS` (Gmail) are kept for compatibility but **Brevo** (`BREVO_API_KEY`) is the active email provider.

### 3. Start Development Servers
```bash
npm run dev
```
This runs the **Express backend** and **Vite frontend** concurrently via `concurrently`.

| Service | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:5000` |

> Vite proxies all `/api` requests to `localhost:5000` automatically in development.

---

## ☁️ Deployment

### Frontend → Vercel
1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set **Root Directory** to `/` (monorepo root).
4. Add environment variable: `VITE_API_URL=https://your-render-backend.onrender.com`
5. Deploy.

### Backend → Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Set **Build Command:** `npm install`
3. Set **Start Command:** `node backend/server.js`
4. Add all environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`, `BREVO_API_KEY`, `EMAIL_USER`).
5. Deploy.

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Register user, trigger OTP email |
| `POST` | `/api/auth/verify-otp` | ❌ | Verify OTP and receive JWT |
| `POST` | `/api/auth/login` | ❌ | Login (verified users only) |
| `POST` | `/api/results` | ✅ JWT | Save test result, evaluate badges & XP |
| `GET` | `/api/results` | ✅ JWT | Fetch authenticated user's result history |
| `GET` | `/api/leaderboard` | ❌ | Fetch top 50 users by XP |

---

## 📄 License

MIT — feel free to fork, star ⭐, and build on top of it!

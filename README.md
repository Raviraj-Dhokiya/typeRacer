# TypeRacer - Advanced Typing Speed Test ⌨️🚀

An advanced, feature-rich Typing Speed Test application built with the MERN stack (MongoDB, Express, React, Node.js). It goes beyond traditional typing tests by incorporating gamification, detailed analytics, user authentication, and a global leaderboard to make typing practice engaging and competitive.

---

## ✨ Features & Implemented Functions

### 1. 🔐 Secure Authentication & User Management
* **User Registration & Login:** Secure password hashing using `bcryptjs` and session management via JWT.
* **Email OTP Verification:** Users must verify their email with a 6-digit OTP (powered by `nodemailer`) to activate their account.
* **Context API State:** `AuthContext` manages user sessions globally across the frontend.

### 2. ⚡ Core Typing Engine
* **Real-time Calculations:** Live updates for WPM (Words Per Minute), Accuracy, Time Left, and Error counts.
* **Multiple Modes:** Practice in 3 different modes:
  * **Common Words:** Standard typing practice.
  * **Code:** Practice programming syntax and symbols.
  * **Quotes:** Type full sentences with punctuation.
* **Flexible Timers:** Select between 15s, 30s, 60s, or 120s sessions.
* **Live Feedback:** Character-by-character visual feedback (correct, incorrect, caret blinking).

### 3. 🎮 Gamification: Badges, XP & Leveling
* **Robust Badge Engine:** A backend logic (`badgeEngine.js`) that automatically awards users with badges based on milestones (e.g., hitting 100 WPM, 100% accuracy, maintaining streaks, or playing at midnight).
* **XP System:** Users earn XP based on test performance.
* **Dynamic Ranks:** 100+ Levels with custom titles (e.g., Newbie, Rookie, Bronze Typist, Master Typist, God Tier).

### 4. 📊 Detailed User Profile & Analytics
* **Performance Charts:** Integrated `recharts` to display a beautiful Line Chart for WPM/Accuracy history and a Pie Chart for Mode Breakdown.
* **Activity Heatmap:** A GitHub-style 12-month contribution graph that highlights daily typing activity intensity.
* **Test History:** A comprehensive table showing all past test results.
* **Badge Showcase:** A dedicated tab to view earned and locked badges, sorted by difficulty tiers (Easy, Medium, Hard, Legendary).

### 5. 🌍 Global Leaderboard
* **Competitive Rankings:** A dedicated Leaderboard page fetching top users from the database.
* **Skill-based Sorting:** Users are ranked globally based on their total XP and Level.

---

## 📂 Project Structure

```text
typeRacer/
├── backend/
│   ├── models/
│   │   ├── Result.js            # Mongoose schema for test results
│   │   └── User.js              # Mongoose schema for users (auth, badges, xp)
│   ├── badgeEngine.js           # Core logic for evaluating XP, levels, and unlocking badges
│   └── server.js                # Express Server setup & API Routes (/auth, /results, /leaderboard)
├── frontend/
│   ├── assets/                  # Static assets
│   ├── components/
│   │   ├── ResultsPanel.jsx     # Post-test summary screen
│   │   ├── StatCard.jsx         # UI component for individual stats (WPM, Acc, etc.)
│   │   ├── TextDisplay.jsx      # Rendering logic for typing text and caret
│   │   └── UserMenu.jsx         # Profile/Logout dropdown in the header
│   ├── utils/
│   │   ├── badgesList.js        # Data definition for all 30+ badges and Level Titles
│   │   └── textUtils.js         # Word generation and WPM/Accuracy formulas
│   ├── App.jsx                  # Main routing, state management, and primary View
│   ├── App.css                  # Custom styling and animations
│   ├── AuthContext.jsx          # React Context for authentication
│   ├── AuthModal.jsx            # Modal UI for Login, Signup, and OTP input
│   ├── LeaderboardPage.jsx      # Global Leaderboard View
│   ├── ProfilePage.jsx          # Advanced dashboard (Stats, Heatmap, History, Badges)
│   ├── index.css                # Tailwind CSS imports
│   └── main.jsx                 # React root render
├── .env                         # Secrets (Mongo URI, JWT Secret, Email Config)
├── package.json                 # Project dependencies & Concurrent Dev Script
└── vite.config.js               # Vite frontend configuration
```

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS, Recharts
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (via Mongoose)
* **Auth & Security:** JSON Web Tokens (JWT), bcryptjs, Nodemailer

## 🚀 Running Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Ensure your `.env` file at the root contains:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/typeracer
   JWT_SECRET=your_jwt_secret
   PORT=5000
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

3. **Start Development Servers (Frontend + Backend concurrently):**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` and the backend API on `http://localhost:5000`.

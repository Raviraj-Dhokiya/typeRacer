import { BADGES_DATA } from '../frontend/utils/badgesList.js';

export function evaluateBadges(user, newResult, allResults) {
  const earned = new Set(user.badges || []);
  const newBadges = [];

  const addBadge = (badgeId) => {
    if (!earned.has(badgeId)) {
      earned.add(badgeId);
      newBadges.push(badgeId);
    }
  };

  const { wpm, accuracy, timeTaken, mode, date } = newResult;
  const totalTests = allResults.length;
  const currentHour = new Date(date).getHours();
  const totalSeconds = allResults.reduce((acc, r) => acc + r.timeTaken, 0);

  // ----- EASY -----
  if (totalTests >= 1) addBadge('first_blood');
  if (totalTests >= 5) addBadge('warmup');
  if (accuracy >= 95) addBadge('steady_hands');
  if (wpm < 20 && totalTests > 0) addBadge('snail_pace');
  if (timeTaken === 15) addBadge('quick_burst');
  if (timeTaken === 60) addBadge('just_a_minute');
  if (currentHour >= 0 && currentHour < 5) addBadge('night_owl');
  if (currentHour >= 5 && currentHour < 8) addBadge('early_riser');
  if (accuracy < 80) addBadge('typo_prone');
  if (wpm >= 40) addBadge('novice_racer');

  // ----- MEDIUM -----
  if (wpm >= 60) addBadge('speed_limit_60');
  if (wpm >= 80) addBadge('speed_demon');
  if (accuracy === 100) addBadge('perfectionist');
  if (mode === 'code' && wpm >= 50) addBadge('code_hacker');
  if (mode === 'quotes' && wpm >= 60) addBadge('quote_scholar');
  if (timeTaken === 120) addBadge('marathon_runner');
  
  let consecutiveHighAcc = 0;
  for (const r of allResults) {
    if (r.accuracy >= 98) consecutiveHighAcc++;
    else consecutiveHighAcc = 0;
    if (consecutiveHighAcc >= 3) addBadge('consistent');
  }

  if (totalSeconds >= 1800) addBadge('dedicated'); // 30 mins
  if (totalTests >= 100) addBadge('century_club');
  if (timeTaken === 60 && accuracy === 100) addBadge('flawless_60s');

  // ----- HARD -----
  if (wpm >= 100) addBadge('type_master');
  if (wpm >= 120) addBadge('god_tier');
  if (wpm >= 150) addBadge('ascended');
  if (timeTaken === 120 && accuracy === 100) addBadge('true_perfection');
  if (mode === 'code' && wpm >= 100) addBadge('code_god');
  if (mode === 'quotes' && wpm >= 100) addBadge('quote_assassin');
  if (totalSeconds >= 18000) addBadge('no_life'); // 5 hours
  if (totalTests >= 500) addBadge('typing_machine');
  if (wpm >= 100 && accuracy === 100) addBadge('unstoppable');
  
  let consecutiveHighSpeed = 0;
  for (const r of allResults) {
    if (r.wpm >= 90) consecutiveHighSpeed++;
    else consecutiveHighSpeed = 0;
    if (consecutiveHighSpeed >= 5) addBadge('legendary_streak');
  }

  // ==========================================
  // ----- NEW UNIQUE & FUN BADGES -----
  // ==========================================
  
  // Personality & Behavior
  let perfectAccCount = 0;
  let nearPerfectAccCount = 0;
  for (const r of allResults) {
    if (r.accuracy >= 98) nearPerfectAccCount++; else nearPerfectAccCount = 0;
    if (r.accuracy === 100) perfectAccCount++;
    if (nearPerfectAccCount >= 10) addBadge('perfectionist_mode');
  }
  if (perfectAccCount >= 10) addBadge('keyboard_zen');
  if (accuracy < 60) addBadge('rage_typist');
  
  if (allResults.length >= 2) {
    const prevResult = allResults[allResults.length - 2];
    if (prevResult.wpm < 30 && wpm >= 70) addBadge('comeback_king');
  }
  if (wpm >= 80 && accuracy < 85) addBadge('chaotic_energy');

  // Extreme Challenge
  const today = new Date().toDateString();
  const testsToday = allResults.filter(r => new Date(r.date).toDateString() === today);
  
  if (testsToday.length === 1 && wpm >= 90) addBadge('one_shot_wonder');
  if (timeTaken === 60 && accuracy >= 95) addBadge('blind_typist'); // Proxy for blind
  
  if (allResults.length >= 20) {
    const last20 = allResults.slice(-20);
    const avgWpm = last20.reduce((sum, r) => sum + r.wpm, 0) / 20;
    if (avgWpm > 65) addBadge('consistency_beast');
  }

  if (testsToday.length >= 2) {
    const wpmsToday = testsToday.map(r => r.wpm);
    const maxWpm = Math.max(...wpmsToday);
    const minWpm = Math.min(...wpmsToday);
    if (maxWpm - minWpm > 40) addBadge('speed_fluctuation');
    if (minWpm < 30 && maxWpm > 80) addBadge('wpm_rollercoaster');
  }

  // Time & Habit
  const dayOfWeek = new Date().getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    const testsThisWeekend = allResults.filter(r => {
      const d = new Date(r.date).getDay();
      return d === 0 || d === 6;
    });
    if (testsThisWeekend.length >= 15) addBadge('weekend_warrior');
  }

  const uniqueDays = new Set(allResults.map(r => new Date(r.date).toDateString()));
  if (uniqueDays.size >= 25) addBadge('monthly_grinder');

  if (currentHour >= 5 && currentHour < 7 && wpm >= 70) addBadge('sunrise_sprinter');
  if (currentHour >= 2 && currentHour < 5 && wpm >= 85) addBadge('after_midnight');

  // Legendary
  if (wpm >= 130 && accuracy >= 98) addBadge('typing_legend');
  
  if (allResults.length >= 30) {
    const last30 = allResults.slice(-30);
    const avgWpm = last30.reduce((sum, r) => sum + r.wpm, 0) / 30;
    if (avgWpm >= 100) addBadge('immortal_typist');
  }

  const modesOver100 = new Set(allResults.filter(r => r.wpm >= 100).map(r => r.mode));
  if (modesOver100.size >= 3) addBadge('hundred_club');

  if (allResults.length >= 2) {
    const lowestWpm = Math.min(...allResults.map(r => r.wpm));
    if (wpm >= lowestWpm + 50) addBadge('phoenix_rising');
  }

  // Bonus
  if (testsToday.length >= 50) addBadge('keyboard_addict');
  
  let zeroCorrectionCount = 0;
  for (const r of allResults) {
    if (r.accuracy === 100) zeroCorrectionCount++;
    if (zeroCorrectionCount >= 10) addBadge('silent_mode');
  }

  if (timeTaken > 120) addBadge('patient_typist');

  return newBadges;
}

export function calculateXP(newResult) {
  // XP Calculation: Base 10 + (WPM * 0.5) + (Accuracy * 0.2) + bonus for time
  let xp = 10 + (newResult.wpm * 0.5) + (newResult.accuracy * 0.2);
  if (newResult.timeTaken >= 60) xp += 10;
  return Math.round(xp);
}

export function calculateLevel(currentXp) {
  // Simple leveling formula: Level = sqrt(xp / 100)
  // 100 XP = Lvl 1, 400 XP = Lvl 2, 900 XP = Lvl 3, 2500 XP = Lvl 5
  return Math.max(1, Math.floor(Math.sqrt(currentXp / 100)) + 1);
}

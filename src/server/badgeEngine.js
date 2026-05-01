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

  // 1. Speed Milestones
  if (wpm >= 30) addBadge('beginner_typist');
  if (wpm >= 40) addBadge('novice');
  if (wpm >= 50) addBadge('average_typist');
  if (wpm >= 60) addBadge('fast_typist');
  if (wpm >= 70) addBadge('pro_typist');
  if (wpm >= 80) addBadge('speed_demon');
  if (wpm >= 90) addBadge('keyboard_warrior');
  if (wpm >= 100) addBadge('type_master');
  if (wpm >= 120) addBadge('god_tier');

  // 2. Accuracy Badges
  if (accuracy >= 95) addBadge('clean_typist');
  if (accuracy >= 98) addBadge('perfectionist');
  if (accuracy === 100) addBadge('flawless');

  let highAccCount = 0;
  let zeroErrorStreak = 0;
  for (const r of allResults) {
    if (r.accuracy >= 98) highAccCount++;
    if (r.accuracy >= 99) zeroErrorStreak++;
    else zeroErrorStreak = 0;

    if (highAccCount >= 10) addBadge('accuracy_king');
    if (zeroErrorStreak >= 5) addBadge('zero_error_streak');
  }

  // 4. Volume / Practice Badges
  if (totalTests >= 1) addBadge('first_blood');
  if (totalTests >= 10) addBadge('rookie');
  if (totalTests >= 50) addBadge('regular');
  if (totalTests >= 100) addBadge('veteran');
  if (totalTests >= 500) addBadge('typing_machine');
  if (totalTests >= 1000) addBadge('insane');

  // 5. Time Spent Badges
  const totalSeconds = allResults.reduce((acc, r) => acc + r.timeTaken, 0);
  const totalHours = totalSeconds / 3600;
  if (totalHours >= 1) addBadge('dedicated_hour');
  if (totalHours >= 10) addBadge('marathon_typist');
  if (totalHours >= 100) addBadge('keyboard_monk');

  // 6. Special / Fun Badges
  const currentHour = new Date(date).getHours();
  if (currentHour >= 0 && currentHour < 6) {
    const nightTests = allResults.filter(r => new Date(r.date).getHours() >= 0 && new Date(r.date).getHours() < 6);
    if (nightTests.length >= 5) addBadge('night_owl');
  }
  if (currentHour >= 5 && currentHour < 8) addBadge('early_bird');

  // 7. Rare Badges
  if (totalTests === 1 && wpm >= 80) addBadge('one_shot');

  // 9. Test Mode Specific
  if (timeTaken === 60 && wpm >= 80) addBadge('time_lord');
  if (mode === 'quotes' && wpm >= 70 && accuracy >= 97) addBadge('quote_slayer');

  // 14. Fun & Themed
  if (accuracy <= 80) addBadge('typo_king');
  if (currentHour >= 6 && currentHour <= 10 && wpm >= 60) addBadge('coffee_powered');

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

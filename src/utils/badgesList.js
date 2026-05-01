export const BADGES_DATA = {
  // 1. Speed Milestones
  beginner_typist: { id: 'beginner_typist', category: 'Speed Milestones', name: 'Beginner Typist', description: 'Pehli baar 30+ WPM', icon: '🐢' },
  novice: { id: 'novice', category: 'Speed Milestones', name: 'Novice', description: '40+ WPM', icon: '🚶' },
  average_typist: { id: 'average_typist', category: 'Speed Milestones', name: 'Average Typist', description: '50+ WPM', icon: '🚴' },
  fast_typist: { id: 'fast_typist', category: 'Speed Milestones', name: 'Fast Typist', description: '60+ WPM', icon: '🏎️' },
  pro_typist: { id: 'pro_typist', category: 'Speed Milestones', name: 'Pro Typist', description: '70+ WPM', icon: '🦅' },
  speed_demon: { id: 'speed_demon', category: 'Speed Milestones', name: 'Speed Demon', description: '80+ WPM', icon: '🔥' },
  keyboard_warrior: { id: 'keyboard_warrior', category: 'Speed Milestones', name: 'Keyboard Warrior', description: '90+ WPM', icon: '⚔️' },
  type_master: { id: 'type_master', category: 'Speed Milestones', name: 'Type Master', description: '100+ WPM', icon: '👑' },
  god_tier: { id: 'god_tier', category: 'Speed Milestones', name: 'God Tier', description: '120+ WPM', icon: '⚡' },

  // 2. Accuracy Badges
  clean_typist: { id: 'clean_typist', category: 'Accuracy Badges', name: 'Clean Typist', description: '95%+ accuracy', icon: '✨' },
  perfectionist: { id: 'perfectionist', category: 'Accuracy Badges', name: 'Perfectionist', description: '98%+ accuracy', icon: '💎' },
  flawless: { id: 'flawless', category: 'Accuracy Badges', name: 'Flawless', description: '100% accuracy', icon: '🎯' },
  accuracy_king: { id: 'accuracy_king', category: 'Accuracy Badges', name: 'Accuracy King', description: '10 tests with 98%+ accuracy', icon: '🏆' },
  zero_error_streak: { id: 'zero_error_streak', category: 'Accuracy Badges', name: 'Zero Error Streak', description: '5 consecutive tests with 99-100% accuracy', icon: '🧊' },

  // 3. Streak Badges
  first_step: { id: 'first_step', category: 'Streak Badges', name: 'First Step', description: '3 din ka streak', icon: '🌱' },
  dedicated: { id: 'dedicated', category: 'Streak Badges', name: 'Dedicated', description: '7 din streak', icon: '🌿' },
  committed: { id: 'committed', category: 'Streak Badges', name: 'Committed', description: '15 din streak', icon: '🌳' },
  typing_addict: { id: 'typing_addict', category: 'Streak Badges', name: 'Typing Addict', description: '30 din streak', icon: '🔥' },
  legendary_streak: { id: 'legendary_streak', category: 'Streak Badges', name: 'Legendary Streak', description: '60+ din streak', icon: '🐉' },

  // 4. Volume / Practice Badges
  first_blood: { id: 'first_blood', category: 'Volume Badges', name: 'First Blood', description: 'Pehla test complete kiya', icon: '🩸' },
  rookie: { id: 'rookie', category: 'Volume Badges', name: 'Rookie', description: '10 tests complete', icon: '🥉' },
  regular: { id: 'regular', category: 'Volume Badges', name: 'Regular', description: '50 tests', icon: '🥈' },
  veteran: { id: 'veteran', category: 'Volume Badges', name: 'Veteran', description: '100 tests', icon: '🥇' },
  typing_machine: { id: 'typing_machine', category: 'Volume Badges', name: 'Typing Machine', description: '500 tests', icon: '🤖' },
  insane: { id: 'insane', category: 'Volume Badges', name: 'Insane', description: '1000+ tests', icon: '🤯' },

  // 5. Time Spent Badges
  dedicated_hour: { id: 'dedicated_hour', category: 'Time Spent', name: 'Dedicated Hour', description: 'Total 1 hour typing', icon: '⏳' },
  marathon_typist: { id: 'marathon_typist', category: 'Time Spent', name: 'Marathon Typist', description: 'Total 10 hours', icon: '🏃' },
  keyboard_monk: { id: 'keyboard_monk', category: 'Time Spent', name: 'Keyboard Monk', description: '100+ hours', icon: '🧘' },

  // 6. Special / Fun Badges
  night_owl: { id: 'night_owl', category: 'Special Badges', name: 'Night Owl', description: 'Raat 12 baje ke baad 5+ tests', icon: '🦉' },
  early_bird: { id: 'early_bird', category: 'Special Badges', name: 'Early Bird', description: 'Subah 6 baje se pehle tests', icon: '🌅' },
  consistent_performer: { id: 'consistent_performer', category: 'Special Badges', name: 'Consistent Performer', description: '7 din tak average 60+ WPM', icon: '📈' },

  // 7. Rare / Hidden Badges
  one_shot: { id: 'one_shot', category: 'Rare Badges', name: 'One Shot', description: 'Pehle hi attempt mein 80+ WPM', icon: '🎳' },
  perfect_week: { id: 'perfect_week', category: 'Rare Badges', name: 'Perfect Week', description: '7 din mein har test 95%+ accuracy', icon: '🗓️' },

  // 9. Test Mode Specific Badges
  time_lord: { id: 'time_lord', category: 'Mode Specific', name: 'Time Lord', description: '60 seconds mode mein 80+ WPM', icon: '⏱️' },
  quote_slayer: { id: 'quote_slayer', category: 'Mode Specific', name: 'Quote Slayer', description: 'Quotes mode mein 70+ WPM with 97%+ accuracy', icon: '💬' },

  // 14. Fun & Themed Badges
  typo_king: { id: 'typo_king', category: 'Fun Badges', name: 'Typo King', description: 'Sabse zyada typos (Accuracy < 80%)', icon: '🤪' },
  coffee_powered: { id: 'coffee_powered', category: 'Fun Badges', name: 'Coffee Powered', description: 'Subah ke tests mein high performance', icon: '☕' },
};

export const LEVELS = [
  { level: 5, title: 'Bronze Typist', color: '#cd7f32' },
  { level: 15, title: 'Silver Typist', color: '#c0c0c0' },
  { level: 25, title: 'Gold Typist', color: '#ffd700' },
  { level: 35, title: 'Platinum Typist', color: '#e5e4e2' },
  { level: 50, title: 'Diamond Typist', color: '#b9f2ff' }
];

export function getTitleForLevel(level) {
  let currentTitle = 'Newbie';
  let currentColor = '#888';
  for (const t of LEVELS) {
    if (level >= t.level) {
      currentTitle = t.title;
      currentColor = t.color;
    }
  }
  return { title: currentTitle, color: currentColor };
}

export function getXPProgress(xp) {
  const currentXp = xp || 0;
  // Level = Math.floor(Math.sqrt(currentXp / 100)) + 1
  const currentLevel = Math.max(1, Math.floor(Math.sqrt(currentXp / 100)) + 1);
  const currentLevelStartXp = Math.pow(currentLevel - 1, 2) * 100;
  const nextLevelStartXp = Math.pow(currentLevel, 2) * 100;
  
  const progress = ((currentXp - currentLevelStartXp) / (nextLevelStartXp - currentLevelStartXp)) * 100;
  return { progress: Math.min(100, Math.max(0, progress)), nextLevelXp: nextLevelStartXp };
}

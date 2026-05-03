export const BADGES_DATA = {
  // ----- EASY BADGES -----
  first_blood: { id: 'first_blood', category: 'Milestone', difficulty: 'Easy', name: 'First Blood', description: 'Complete your very first typing test', icon: '🩸' },
  warmup: { id: 'warmup', category: 'Practice', difficulty: 'Easy', name: 'Warmup Complete', description: 'Complete 5 total tests', icon: '🏃' },
  steady_hands: { id: 'steady_hands', category: 'Accuracy', difficulty: 'Easy', name: 'Steady Hands', description: 'Hit 95% accuracy in any test', icon: '🎯' },
  snail_pace: { id: 'snail_pace', category: 'Fun', difficulty: 'Easy', name: 'Snail Pace', description: 'Finish a test with less than 20 WPM', icon: '🐌' },
  quick_burst: { id: 'quick_burst', category: 'Mode', difficulty: 'Easy', name: 'Quick Burst', description: 'Complete a 15-second test', icon: '⚡' },
  just_a_minute: { id: 'just_a_minute', category: 'Mode', difficulty: 'Easy', name: 'Just A Minute', description: 'Complete a 60-second test', icon: '⏱️' },
  night_owl: { id: 'night_owl', category: 'Time', difficulty: 'Easy', name: 'Night Owl', description: 'Type between 12 AM and 5 AM', icon: '🦉' },
  early_riser: { id: 'early_riser', category: 'Time', difficulty: 'Easy', name: 'Early Riser', description: 'Type between 5 AM and 8 AM', icon: '🌅' },
  typo_prone: { id: 'typo_prone', category: 'Fun', difficulty: 'Easy', name: 'Typo Prone', description: 'Finish a test with less than 80% accuracy', icon: '🤪' },
  novice_racer: { id: 'novice_racer', category: 'Speed', difficulty: 'Easy', name: 'Novice Racer', description: 'Hit 40 WPM for the first time', icon: '🛴' },

  // ----- MEDIUM BADGES -----
  speed_limit_60: { id: 'speed_limit_60', category: 'Speed', difficulty: 'Medium', name: 'Speed Limit 60', description: 'Break the 60 WPM barrier', icon: '🚗' },
  speed_demon: { id: 'speed_demon', category: 'Speed', difficulty: 'Medium', name: 'Speed Demon', description: 'Break the 80 WPM barrier', icon: '🔥' },
  perfectionist: { id: 'perfectionist', category: 'Accuracy', difficulty: 'Medium', name: 'Perfectionist', description: 'Hit 100% accuracy on any test', icon: '💎' },
  code_hacker: { id: 'code_hacker', category: 'Mode', difficulty: 'Medium', name: 'Code Hacker', description: 'Reach 50+ WPM in Code mode', icon: '💻' },
  quote_scholar: { id: 'quote_scholar', category: 'Mode', difficulty: 'Medium', name: 'Quote Scholar', description: 'Reach 60+ WPM in Quotes mode', icon: '📚' },
  marathon_runner: { id: 'marathon_runner', category: 'Mode', difficulty: 'Medium', name: 'Marathon Runner', description: 'Complete a 120-second test', icon: '🏃‍♂️' },
  consistent: { id: 'consistent', category: 'Streak', difficulty: 'Medium', name: 'Consistent', description: 'Score 98%+ accuracy in 3 consecutive tests', icon: '🔗' },
  dedicated: { id: 'dedicated', category: 'Time Spent', difficulty: 'Medium', name: 'Dedicated', description: 'Accumulate 30 minutes of total typing time', icon: '⏳' },
  century_club: { id: 'century_club', category: 'Practice', difficulty: 'Medium', name: 'Century Club', description: 'Complete 100 total tests', icon: '💯' },
  flawless_60s: { id: 'flawless_60s', category: 'Challenge', difficulty: 'Medium', name: 'Flawless Minute', description: '100% accuracy in a 60-second test', icon: '🧊' },

  // ----- HARD BADGES -----
  type_master: { id: 'type_master', category: 'Speed', difficulty: 'Hard', name: 'Type Master', description: 'Break the 100 WPM barrier', icon: '👑' },
  god_tier: { id: 'god_tier', category: 'Speed', difficulty: 'Hard', name: 'God Tier', description: 'Break the 120 WPM barrier', icon: '⚡' },
  ascended: { id: 'ascended', category: 'Speed', difficulty: 'Hard', name: 'Ascended', description: 'Break the 150 WPM barrier', icon: '🌌' },
  true_perfection: { id: 'true_perfection', category: 'Challenge', difficulty: 'Hard', name: 'True Perfection', description: '100% accuracy on a 120-second test', icon: '🌟' },
  code_god: { id: 'code_god', category: 'Challenge', difficulty: 'Hard', name: 'Code God', description: '100+ WPM in Code mode', icon: '👽' },
  quote_assassin: { id: 'quote_assassin', category: 'Challenge', difficulty: 'Hard', name: 'Quote Assassin', description: '100+ WPM in Quotes mode', icon: '🥷' },
  no_life: { id: 'no_life', category: 'Time Spent', difficulty: 'Hard', name: 'No Life', description: 'Accumulate 5 hours of total typing time', icon: '🧟' },
  typing_machine: { id: 'typing_machine', category: 'Practice', difficulty: 'Hard', name: 'Typing Machine', description: 'Complete 500 total tests', icon: '🤖' },
  unstoppable: { id: 'unstoppable', category: 'Challenge', difficulty: 'Hard', name: 'Unstoppable', description: 'Score 100+ WPM with 100% accuracy', icon: '🚀' },
  legendary_streak: { id: 'legendary_streak', category: 'Streak', difficulty: 'Hard', name: 'Legendary Streak', description: 'Score 90+ WPM in 5 consecutive tests', icon: '🐉' },

  // ==========================================
  // ----- NEW UNIQUE & FUN BADGES -----
  // ==========================================

  // Personality & Behavior
  keyboard_zen: { id: 'keyboard_zen', category: 'Style', difficulty: 'Medium', name: 'Keyboard Zen', description: 'Complete 10 tests with near perfect accuracy', icon: '🧘' },
  rage_typist: { id: 'rage_typist', category: 'Fun', difficulty: 'Easy', name: 'Rage Typist', description: 'Score below 60% accuracy due to rage', icon: '😤' },
  comeback_king: { id: 'comeback_king', category: 'Mindset', difficulty: 'Hard', name: 'Comeback King', description: 'After scoring below 30 WPM, score 70+ WPM in the next test', icon: '🔄' },
  perfectionist_mode: { id: 'perfectionist_mode', category: 'Style', difficulty: 'Hard', name: 'Perfectionist Mode', description: '10 consecutive tests with 98%+ accuracy', icon: '🧠' },
  chaotic_energy: { id: 'chaotic_energy', category: 'Fun', difficulty: 'Medium', name: 'Chaotic Energy', description: 'Reach 80+ WPM with accuracy below 85%', icon: '🌪️' },

  // Extreme Challenge
  one_shot_wonder: { id: 'one_shot_wonder', category: 'Challenge', difficulty: 'Hard', name: 'One Shot Wonder', description: 'Reach 90+ WPM on your very first attempt of the day', icon: '🎯' },
  blind_typist: { id: 'blind_typist', category: 'Challenge', difficulty: 'Legendary', name: 'Blind Typist', description: 'Complete a 60-second test with 95%+ accuracy', icon: '👁️🗨️' },
  consistency_beast: { id: 'consistency_beast', category: 'Challenge', difficulty: 'Hard', name: 'Consistency Beast', description: 'Maintain above 65 WPM average across 20 consecutive tests', icon: '📈' },
  speed_fluctuation: { id: 'speed_fluctuation', category: 'Fun', difficulty: 'Medium', name: 'Speed Fluctuation', description: 'Have >40 WPM difference between slowest and fastest test today', icon: '📊' },

  // Time & Habit
  weekend_warrior: { id: 'weekend_warrior', category: 'Time', difficulty: 'Medium', name: 'Weekend Warrior', description: 'Complete 15+ tests on Saturday or Sunday', icon: '🏖️' },
  monthly_grinder: { id: 'monthly_grinder', category: 'Streak', difficulty: 'Hard', name: 'Monthly Grinder', description: 'Type on at least 25 different days in a month', icon: '📅' },
  sunrise_sprinter: { id: 'sunrise_sprinter', category: 'Time', difficulty: 'Medium', name: 'Sunrise Sprinter', description: 'Hit 70+ WPM between 5 AM - 7 AM', icon: '🌄' },
  after_midnight: { id: 'after_midnight', category: 'Time', difficulty: 'Hard', name: 'After Midnight', description: 'Reach 85+ WPM after 2 AM', icon: '🌙' },

  // Legendary
  typing_legend: { id: 'typing_legend', category: 'Legendary', difficulty: 'Legendary', name: 'Typing Legend', description: 'Reach 130+ WPM with 98%+ accuracy', icon: '👑' },
  immortal_typist: { id: 'immortal_typist', category: 'Legendary', difficulty: 'Legendary', name: 'Immortal Typist', description: 'Maintain 100+ WPM average for 30 consecutive tests', icon: '🛡️' },
  hundred_club: { id: 'hundred_club', category: 'Challenge', difficulty: 'Hard', name: 'Hundred Club', description: 'Score 100+ WPM in 3 different modes', icon: '♣️' },
  phoenix_rising: { id: 'phoenix_rising', category: 'Mindset', difficulty: 'Hard', name: 'Phoenix Rising', description: 'Improve your lowest ever score by 50+ WPM', icon: '🔥' },

  // Bonus
  keyboard_addict: { id: 'keyboard_addict', category: 'Fun', difficulty: 'Medium', name: 'Keyboard Addict', description: 'Complete 50 tests in a single day', icon: '🖱️' },
  silent_mode: { id: 'silent_mode', category: 'Style', difficulty: 'Medium', name: 'Silent Mode', description: '10 tests with zero correction (100% accuracy)', icon: '🤫' },
  wpm_rollercoaster: { id: 'wpm_rollercoaster', category: 'Fun', difficulty: 'Medium', name: 'WPM Rollercoaster', description: 'Your WPM graph has both below 30 and above 80 in same day', icon: '🎢' },
  patient_typist: { id: 'patient_typist', category: 'Mindset', difficulty: 'Easy', name: 'Patient Typist', description: 'Spend more than 2 minutes on a single test', icon: '🐢' }
};


export const LEVELS = [
  { level: 1, title: 'Newbie', color: '#888' },
  { level: 2, title: 'Rookie', color: '#9e9e9e' },
  { level: 3, title: 'Beginner', color: '#b0bec5' },
  { level: 4, title: 'Amateur', color: '#cfd8dc' },
  { level: 5, title: 'Bronze Typist', color: '#cd7f32' },
  { level: 10, title: 'Iron Typist', color: '#a19d94' },
  { level: 15, title: 'Silver Typist', color: '#c0c0c0' },
  { level: 20, title: 'Steel Typist', color: '#78909c' },
  { level: 25, title: 'Gold Typist', color: '#ffd700' },
  { level: 35, title: 'Platinum Typist', color: '#e5e4e2' },
  { level: 50, title: 'Diamond Typist', color: '#b9f2ff' },
  { level: 75, title: 'Master Typist', color: '#9c27b0' },
  { level: 100, title: 'God Tier', color: '#f44336' }
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
  const currentLevel = Math.max(1, Math.floor(Math.sqrt(currentXp / 100)) + 1);
  const currentLevelStartXp = Math.pow(currentLevel - 1, 2) * 100;
  const nextLevelStartXp = Math.pow(currentLevel, 2) * 100;
  
  const progress = ((currentXp - currentLevelStartXp) / (nextLevelStartXp - currentLevelStartXp)) * 100;
  return { progress: Math.min(100, Math.max(0, progress)), nextLevelXp: nextLevelStartXp };
}



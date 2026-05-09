export const LEVELS = [
  { level: 1,  title: "Newcomer",          xpRequired: 0 },
  { level: 2,  title: "Observer",           xpRequired: 50 },
  { level: 3,  title: "Tracker",            xpRequired: 150 },
  { level: 4,  title: "Analyst",            xpRequired: 300 },
  { level: 5,  title: "Explorer",           xpRequired: 500 },
  { level: 6,  title: "Investigator",       xpRequired: 750 },
  { level: 7,  title: "Chronicler",         xpRequired: 1000 },
  { level: 8,  title: "Sage",               xpRequired: 1500 },
  { level: 9,  title: "Master",             xpRequired: 2000 },
  { level: 10, title: "Atmosphere Master",  xpRequired: 3000 },
];

export const ACHIEVEMENTS = [
  // Entry milestones
  { id: "first_entry",   emoji: "🌱", title: "First Step",       desc: "Log your very first entry",              xp: 10  },
  { id: "entries_5",     emoji: "✨", title: "Warming Up",       desc: "Log 5 entries",                          xp: 15  },
  { id: "entries_10",    emoji: "📓", title: "Getting Started",  desc: "Log 10 entries",                         xp: 20  },
  { id: "entries_25",    emoji: "🌿", title: "Growing",          desc: "Log 25 entries",                         xp: 30  },
  { id: "entries_50",    emoji: "⭐", title: "Dedicated",        desc: "Log 50 entries",                         xp: 50  },
  { id: "entries_100",   emoji: "💯", title: "Century",          desc: "Log 100 entries",                        xp: 75  },
  { id: "entries_200",   emoji: "🚀", title: "Committed",        desc: "Log 200 entries",                        xp: 100 },
  { id: "entries_365",   emoji: "🌍", title: "Year Strong",      desc: "Log 365 entries",                        xp: 200 },
  // Streak milestones
  { id: "streak_3",      emoji: "🔄", title: "Three Peat",       desc: "3-day logging streak",                   xp: 15  },
  { id: "streak_7",      emoji: "🔥", title: "Week Warrior",     desc: "7-day logging streak",                   xp: 25  },
  { id: "streak_14",     emoji: "🌊", title: "Fortnight",        desc: "14-day logging streak",                  xp: 40  },
  { id: "streak_30",     emoji: "🏆", title: "On Fire",          desc: "30-day logging streak",                  xp: 75  },
  { id: "streak_100",    emoji: "🏅", title: "Centurion",        desc: "100-day logging streak",                 xp: 150 },
  // Quality milestones
  { id: "reflection_10", emoji: "📝", title: "Storyteller",      desc: "10 entries with a reflection",           xp: 25  },
  { id: "reflection_25", emoji: "📖", title: "Journaller",       desc: "25 entries with a reflection",           xp: 50  },
  { id: "weather_10",    emoji: "🌤️", title: "Weather Watcher",  desc: "10 entries with weather data",           xp: 20  },
  { id: "weather_25",    emoji: "🌦️", title: "Storm Tracker",    desc: "25 entries with weather data",           xp: 40  },
  // Special
  { id: "perfect_entry",    emoji: "⚡", title: "Perfect Day",      desc: "Log mood 10 & energy 10 in one entry",  xp: 30  },
  { id: "resilient",        emoji: "💪", title: "Resilient",        desc: "Log an entry even with mood ≤ 3",       xp: 20  },
  { id: "full_week",        emoji: "📅", title: "Perfect Week",     desc: "Log every day of a full Mon–Sun week",  xp: 50  },
  // Profile
  { id: "set_display_name", emoji: "🏷️", title: "Personalized",    desc: "Set a custom display name",             xp: 10  },
  { id: "set_bio",          emoji: "✍️", title: "About Me",         desc: "Write a bio on your profile",           xp: 10  },
  { id: "set_avatar",       emoji: "🖼️", title: "Face to the Name", desc: "Upload a profile picture",              xp: 10  },
  { id: "app_installed",    emoji: "📱", title: "All In",            desc: "Install Atmosphere on your device",     xp: 20  },
];

/** Compute current streak (consecutive days with at least one entry, ending today or yesterday). */
export function computeStreak(entries) {
  if (!entries.length) return 0;

  const days = new Set(
    entries.map((e) => new Date(e.created_at).toISOString().slice(0, 10))
  );

  const today = new Date();
  let streak = 0;
  let cursor = new Date(today);

  // Allow streak to start from today OR yesterday
  const todayStr = today.toISOString().slice(0, 10);
  const yesterdayStr = new Date(today - 86400000).toISOString().slice(0, 10);
  if (!days.has(todayStr) && !days.has(yesterdayStr)) return 0;

  if (!days.has(todayStr)) cursor = new Date(today - 86400000);

  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor = new Date(cursor - 86400000);
  }
  return streak;
}

export function computeLongestStreak(entries) {
  if (!entries.length) return 0;
  const days = [...new Set(entries.map((e) => e.created_at.slice(0, 10)))].sort();
  let longest = 1, current = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = (new Date(days[i]) - new Date(days[i - 1])) / 86400000;
    if (diff === 1) { current++; longest = Math.max(longest, current); }
    else current = 1;
  }
  return longest;
}

export function computeXP(entries, profile = null) {
  let xp = 0;
  for (const e of entries) {
    xp += 10;
    if (e.weather_snapshots) xp += 5;
    if (e.reflection?.trim()) xp += 5;
  }
  // Streak bonuses
  const streak = computeStreak(entries);
  if (streak >= 30) xp += 50;
  else if (streak >= 7) xp += 20;
  // Achievement bonuses
  const unlocked = computeUnlockedAchievements(entries, profile);
  for (const a of unlocked) {
    if (a.unlocked) xp += a.xp;
  }
  return xp;
}

export function getLevelInfo(xp) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      next = LEVELS[i + 1] ?? null;
      break;
    }
  }
  const progress = next
    ? ((xp - current.xpRequired) / (next.xpRequired - current.xpRequired)) * 100
    : 100;
  return { current, next, xp, progress: Math.round(progress) };
}

function hasFullWeek(entries) {
  const days = new Set(entries.map((e) => e.created_at.slice(0, 10)));
  for (const day of days) {
    const d = new Date(day + "T12:00:00Z");
    const dow = d.getUTCDay();
    const monday = new Date(d);
    monday.setUTCDate(d.getUTCDate() - (dow === 0 ? 6 : dow - 1));
    let allPresent = true;
    for (let i = 0; i < 7; i++) {
      const check = new Date(monday);
      check.setUTCDate(monday.getUTCDate() + i);
      if (!days.has(check.toISOString().slice(0, 10))) { allPresent = false; break; }
    }
    if (allPresent) return true;
  }
  return false;
}

export function computeUnlockedAchievements(entries, profile = null) {
  const total = entries.length;
  const streak = computeStreak(entries);
  const longestStreak = computeLongestStreak(entries);
  const withWeather = entries.filter((e) => e.weather_snapshots).length;
  const withReflection = entries.filter((e) => e.reflection?.trim()).length;
  const hasPerfect = entries.some((e) => e.mood >= 10 && e.energy >= 10);
  const hasLowMood = entries.some((e) => e.mood <= 3);

  const unlocked = new Set();

  // Entry milestones
  if (total >= 1)   unlocked.add("first_entry");
  if (total >= 5)   unlocked.add("entries_5");
  if (total >= 10)  unlocked.add("entries_10");
  if (total >= 25)  unlocked.add("entries_25");
  if (total >= 50)  unlocked.add("entries_50");
  if (total >= 100) unlocked.add("entries_100");
  if (total >= 200) unlocked.add("entries_200");
  if (total >= 365) unlocked.add("entries_365");

  // Streak milestones (current or historical)
  if (streak >= 3  || longestStreak >= 3)   unlocked.add("streak_3");
  if (streak >= 7  || longestStreak >= 7)   unlocked.add("streak_7");
  if (streak >= 14 || longestStreak >= 14)  unlocked.add("streak_14");
  if (streak >= 30 || longestStreak >= 30)  unlocked.add("streak_30");
  if (streak >= 100 || longestStreak >= 100) unlocked.add("streak_100");

  // Quality milestones
  if (withReflection >= 10) unlocked.add("reflection_10");
  if (withReflection >= 25) unlocked.add("reflection_25");
  if (withWeather >= 10)    unlocked.add("weather_10");
  if (withWeather >= 25)    unlocked.add("weather_25");

  // Special
  if (hasPerfect)           unlocked.add("perfect_entry");
  if (hasLowMood)           unlocked.add("resilient");
  if (hasFullWeek(entries)) unlocked.add("full_week");

  // Profile
  if (profile?.display_name?.trim())  unlocked.add("set_display_name");
  if (profile?.bio?.trim())           unlocked.add("set_bio");
  if (profile?.avatar_url?.trim())    unlocked.add("set_avatar");
  // app_installed is checked client-side only

  return ACHIEVEMENTS.map((a) => ({ ...a, unlocked: unlocked.has(a.id) }));
}

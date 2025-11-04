/**
 * Streak management utilities using localStorage
 */

const STREAK_STORAGE_KEY = "zappmint_streak";
const LAST_VISIT_STORAGE_KEY = "zappmint_last_visit";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisitDate: string; // ISO date string
}

/**
 * Get the current streak data from localStorage
 */
export function getStreakData(): StreakData {
  if (typeof window === "undefined") {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastVisitDate: "",
    };
  }

  const stored = localStorage.getItem(STREAK_STORAGE_KEY);
  if (!stored) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastVisitDate: "",
    };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastVisitDate: "",
    };
  }
}

/**
 * Save streak data to localStorage
 */
export function saveStreakData(data: StreakData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Update streak based on current visit
 * Returns the updated streak count
 */
export function updateStreak(): number {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
  const streakData = getStreakData();

  // If no previous visit, start a new streak
  if (!streakData.lastVisitDate) {
    const newData: StreakData = {
      currentStreak: 1,
      longestStreak: 1,
      lastVisitDate: today,
    };
    saveStreakData(newData);
    return 1;
  }

  const lastVisitDate = new Date(streakData.lastVisitDate);
  const todayDate = new Date(today);
  const daysDiff = Math.floor(
    (todayDate.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  let newStreak = streakData.currentStreak;

  if (daysDiff === 0) {
    // Same day, no change
    return streakData.currentStreak;
  } else if (daysDiff === 1) {
    // Consecutive day, increment streak
    newStreak = streakData.currentStreak + 1;
  } else {
    // Streak broken, reset to 1
    newStreak = 1;
  }

  const newData: StreakData = {
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, streakData.longestStreak),
    lastVisitDate: today,
  };

  saveStreakData(newData);
  return newStreak;
}

/**
 * Check if we should show the streak popup
 * Returns true if:
 * - Wallet is connected for the first time
 * - User has a streak and it's their first visit today
 */
export function shouldShowStreakPopup(
  isFirstWalletConnection: boolean,
): boolean {
  if (typeof window === "undefined") return false;

  // Check if we've already shown the popup today
  const lastPopupShown = localStorage.getItem(LAST_VISIT_STORAGE_KEY);
  const today = new Date().toISOString().split("T")[0];

  if (lastPopupShown === today) {
    return false; // Already shown today
  }

  // Show if it's the first wallet connection or if user has a streak
  if (isFirstWalletConnection) {
    return true;
  }

  const streakData = getStreakData();
  return streakData.currentStreak > 0;
}

/**
 * Mark that the streak popup has been shown today
 */
export function markStreakPopupShown(): void {
  if (typeof window === "undefined") return;
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem(LAST_VISIT_STORAGE_KEY, today);
}

/**
 * Reset streak data (for testing or user action)
 */
export function resetStreak(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STREAK_STORAGE_KEY);
  localStorage.removeItem(LAST_VISIT_STORAGE_KEY);
}

/**
 * Reward tiers based on streak days
 */
export interface RewardTier {
  days: number;
  freeMessages: number;
  label: string;
}

export const REWARD_TIERS: RewardTier[] = [
  { days: 1, freeMessages: 3, label: "Starter" },
  { days: 3, freeMessages: 5, label: "Builder" },
  { days: 5, freeMessages: 7, label: "Creator" },
  { days: 10, freeMessages: 15, label: "Master" },
];

/**
 * Get the current reward tier based on streak days
 */
export function getCurrentRewardTier(streakDays: number): RewardTier | null {
  // Find the highest tier the user has unlocked
  for (let i = REWARD_TIERS.length - 1; i >= 0; i--) {
    if (streakDays >= REWARD_TIERS[i].days) {
      return REWARD_TIERS[i];
    }
  }
  return null;
}

/**
 * Get the next reward tier to unlock
 */
export function getNextRewardTier(streakDays: number): RewardTier | null {
  // Find the next tier the user hasn't unlocked yet
  for (const tier of REWARD_TIERS) {
    if (streakDays < tier.days) {
      return tier;
    }
  }
  return null; // User has unlocked all tiers
}

/**
 * Get progress to next tier (0-1)
 */
export function getProgressToNextTier(streakDays: number): {
  progress: number;
  currentTier: RewardTier | null;
  nextTier: RewardTier | null;
} {
  const currentTier = getCurrentRewardTier(streakDays);
  const nextTier = getNextRewardTier(streakDays);

  if (!nextTier) {
    // User has unlocked all tiers
    return { progress: 1, currentTier, nextTier: null };
  }

  // Find the previous tier to calculate progress
  const previousTierDays = currentTier?.days || 0;
  const nextTierDays = nextTier.days;

  const progress =
    (streakDays - previousTierDays) / (nextTierDays - previousTierDays);
  return {
    progress: Math.min(Math.max(progress, 0), 1),
    currentTier,
    nextTier,
  };
}

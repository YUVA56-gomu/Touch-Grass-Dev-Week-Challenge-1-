import { OutdoorVisit, ActivitySummary, AchievementMilestone } from './types';

/**
 * Returns a local calendar date string formatted as 'YYYY-MM-DD'.
 * Uses local timezone calendar components to prevent UTC date boundary shifts.
 */
export function getLocalDateString(dateInput: Date | number = new Date()): string {
  const d = typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a 'YYYY-MM-DD' local date string into a Date object at local midnight.
 */
export function parseLocalDateString(dateStr: string): Date {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  return new Date(year, month, day, 0, 0, 0, 0);
}

/**
 * Returns the local date string for the calendar day immediately preceding dateStr.
 */
export function getPreviousLocalDateString(dateStr: string): string {
  const d = parseLocalDateString(dateStr);
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
}

/**
 * Returns the local date string for the calendar day immediately following dateStr.
 */
export function getNextLocalDateString(dateStr: string): string {
  const d = parseLocalDateString(dateStr);
  d.setDate(d.getDate() + 1);
  return getLocalDateString(d);
}

/**
 * Computes deterministic activity summary, distinct outdoor days, streaks, and milestone achievements.
 */
export function calculateTrackerStats(
  visits: OutdoorVisit[],
  referenceDateStr?: string
): ActivitySummary {
  const totalVisits = visits.length;
  const totalDurationMinutes = visits.reduce((acc, v) => acc + (v.durationMinutes || 0), 0);

  if (totalVisits === 0) {
    return {
      totalVisits: 0,
      distinctOutdoorDays: 0,
      totalDurationMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      achievements: generateAchievements(0, 0, 0),
    };
  }

  // Set of unique local date strings
  const distinctDatesSet = new Set<string>();
  visits.forEach(v => {
    if (v.dateString) {
      distinctDatesSet.add(v.dateString);
    }
  });

  const distinctOutdoorDays = distinctDatesSet.size;

  // Sorted list of unique dates ascending
  const sortedDates = Array.from(distinctDatesSet).sort();

  // Longest streak calculation
  let longestStreak = 0;
  let runningStreak = 0;
  let prevDateStr: string | null = null;

  for (const dateStr of sortedDates) {
    if (prevDateStr === null) {
      runningStreak = 1;
    } else {
      const expectedPrev = getPreviousLocalDateString(dateStr);
      if (prevDateStr === expectedPrev) {
        runningStreak += 1;
      } else {
        runningStreak = 1;
      }
    }
    prevDateStr = dateStr;
    if (runningStreak > longestStreak) {
      longestStreak = runningStreak;
    }
  }

  // Current streak calculation based on reference date (default: today)
  const todayStr = referenceDateStr || getLocalDateString(new Date());
  const yesterdayStr = getPreviousLocalDateString(todayStr);

  let currentStreak = 0;
  let streakCursor: string | null = null;

  if (distinctDatesSet.has(todayStr)) {
    streakCursor = todayStr;
  } else if (distinctDatesSet.has(yesterdayStr)) {
    streakCursor = yesterdayStr;
  }

  if (streakCursor) {
    while (streakCursor && distinctDatesSet.has(streakCursor)) {
      currentStreak += 1;
      streakCursor = getPreviousLocalDateString(streakCursor);
    }
  }

  return {
    totalVisits,
    distinctOutdoorDays,
    totalDurationMinutes,
    currentStreak,
    longestStreak,
    achievements: generateAchievements(totalVisits, distinctOutdoorDays, longestStreak),
  };
}

function generateAchievements(
  totalVisits: number,
  distinctDays: number,
  longestStreak: number
): AchievementMilestone[] {
  return [
    {
      id: 'first_step',
      title: 'First Step',
      description: 'Logged your very first outdoor visit',
      iconName: 'Footprints',
      unlocked: totalVisits >= 1,
      progress: Math.min(totalVisits, 1),
      target: 1,
    },
    {
      id: 'streak_3',
      title: '3-Day Habit',
      description: 'Stepped outdoors 3 days in a row',
      iconName: 'Flame',
      unlocked: longestStreak >= 3,
      progress: Math.min(longestStreak, 3),
      target: 3,
    },
    {
      id: 'distinct_7',
      title: 'Nature Explorer',
      description: 'Spent time outdoors on 7 distinct days',
      iconName: 'Compass',
      unlocked: distinctDays >= 7,
      progress: Math.min(distinctDays, 7),
      target: 7,
    },
    {
      id: 'distinct_14',
      title: 'Forest Wanderer',
      description: 'Spent time outdoors on 14 distinct days',
      iconName: 'Trees',
      unlocked: distinctDays >= 14,
      progress: Math.min(distinctDays, 14),
      target: 14,
    },
    {
      id: 'distinct_30',
      title: 'Sunlight Seeker',
      description: 'Spent time outdoors on 30 distinct days',
      iconName: 'Sun',
      unlocked: distinctDays >= 30,
      progress: Math.min(distinctDays, 30),
      target: 30,
    },
  ];
}

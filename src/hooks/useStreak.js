import { useMemo } from 'react';
import { getTodayString } from '../utils/constants';

// Derive all streak stats from prayer data — no separate storage needed
export function useStreakStats(prayers) {
  return useMemo(() => {
    const allLogs = prayers.flatMap((p) => (p.prayerLog || []).map((ts) => ts.split('T')[0]));
    const uniqueDates = [...new Set(allLogs)].sort().reverse();
    const today = getTodayString();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Total prayers prayed (all log entries across all prayers)
    const totalPrayers = prayers.reduce((sum, p) => sum + (p.prayerLog || []).length, 0);

    // Unique days user prayed about anything
    const totalDaysPrayed = uniqueDates.length;

    // Current daily streak
    let currentStreak = 0;
    if (uniqueDates.length > 0 && (uniqueDates[0] === today || uniqueDates[0] === yesterday)) {
      currentStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prev = new Date(uniqueDates[i - 1]);
        const curr = new Date(uniqueDates[i]);
        if ((prev - curr) / 86400000 === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Longest streak
    let longestStreak = uniqueDates.length > 0 ? 1 : 0;
    let temp = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = new Date(uniqueDates[i - 1]);
      const curr = new Date(uniqueDates[i]);
      if ((prev - curr) / 86400000 === 1) {
        temp++;
        longestStreak = Math.max(longestStreak, temp);
      } else {
        temp = 1;
      }
    }

    // Has prayed today
    const hasPrayedToday = uniqueDates.includes(today);

    // Most prayed-for prayer
    let mostPrayed = null;
    let maxLog = 0;
    prayers.filter((p) => !p.answered).forEach((p) => {
      const count = (p.prayerLog || []).length;
      if (count > maxLog) {
        maxLog = count;
        mostPrayed = p;
      }
    });

    // Prayers not prayed about in 3+ days
    const neglectedPrayers = prayers
      .filter((p) => !p.answered)
      .filter((p) => {
        const log = p.prayerLog || [];
        if (log.length === 0) return true;
        const lastPrayed = new Date(log[log.length - 1]);
        const daysSince = (Date.now() - lastPrayed) / 86400000;
        return daysSince >= 3;
      });

    return {
      currentStreak,
      longestStreak,
      totalDaysPrayed,
      totalPrayers,
      hasPrayedToday,
      mostPrayed,
      neglectedPrayers,
    };
  }, [prayers]);
}

import { useState, useCallback, useMemo } from 'react';
import { loadDailyCheckins, saveDailyCheckins } from '../utils/storage';
import { getTodayString } from '../utils/constants';

export function useDailyCheckin(prayerLogDates) {
  // prayerLogDates: Set of date strings derived from prayer logs
  const [manualCheckins, setManualCheckins] = useState(() => loadDailyCheckins());

  const today = getTodayString();

  // Combined: manual check-ins + dates from prayer log activity
  const allCheckinDates = useMemo(() => {
    const combined = new Set([...manualCheckins, ...(prayerLogDates || [])]);
    return combined;
  }, [manualCheckins, prayerLogDates]);

  const hasPrayedToday = allCheckinDates.has(today);

  const checkInToday = useCallback(() => {
    if (manualCheckins.includes(today)) return;
    const updated = [...manualCheckins, today];
    setManualCheckins(updated);
    saveDailyCheckins(updated);
  }, [manualCheckins, today]);

  // Streak calculated from combined dates
  const streakStats = useMemo(() => {
    const dates = [...allCheckinDates].sort().reverse();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let currentStreak = 0;
    if (dates.length > 0 && (dates[0] === today || dates[0] === yesterday)) {
      currentStreak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        if ((prev - curr) / 86400000 === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    let longestStreak = dates.length > 0 ? 1 : 0;
    let temp = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      if ((prev - curr) / 86400000 === 1) {
        temp++;
        longestStreak = Math.max(longestStreak, temp);
      } else {
        temp = 1;
      }
    }

    return { currentStreak, longestStreak, totalDaysPrayed: dates.length };
  }, [allCheckinDates, today]);

  return {
    hasPrayedToday,
    checkInToday,
    ...streakStats,
  };
}

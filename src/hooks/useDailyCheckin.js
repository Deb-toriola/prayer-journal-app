import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { getTodayString } from '../utils/constants';

export function useDailyCheckin(userId, prayerLogDates) {
  const [manualCheckins, setManualCheckins] = useState([]);
  const today = getTodayString();

  useEffect(() => {
    if (!userId) return;
    supabase.from('daily_checkins').select('checked_date').eq('user_id', userId)
      .then(({ data }) => {
        if (data) setManualCheckins(data.map(r => r.checked_date));
      });
  }, [userId]);

  const allCheckinDates = useMemo(() => {
    return new Set([...manualCheckins, ...(prayerLogDates || [])]);
  }, [manualCheckins, prayerLogDates]);

  const hasPrayedToday = allCheckinDates.has(today);

  const checkInToday = useCallback(async () => {
    if (manualCheckins.includes(today)) return;
    setManualCheckins((prev) => [...prev, today]);
    if (userId) {
      await supabase.from('daily_checkins').upsert({ user_id: userId, checked_date: today });
    }
  }, [manualCheckins, today, userId]);

  const streakStats = useMemo(() => {
    const dates = [...allCheckinDates].sort().reverse();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let currentStreak = 0;
    if (dates.length > 0 && (dates[0] === today || dates[0] === yesterday)) {
      currentStreak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        if ((prev - curr) / 86400000 === 1) { currentStreak++; } else { break; }
      }
    }
    let longestStreak = dates.length > 0 ? 1 : 0;
    let temp = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      if ((prev - curr) / 86400000 === 1) { temp++; longestStreak = Math.max(longestStreak, temp); } else { temp = 1; }
    }
    return { currentStreak, longestStreak, totalDaysPrayed: dates.length };
  }, [allCheckinDates, today]);

  return { hasPrayedToday, checkInToday, ...streakStats };
}

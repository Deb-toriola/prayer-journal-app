import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { getTodayString } from '../utils/constants';

const LS_KEY = 'prayer-journal-daily-checkins';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(dates) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(dates));
  } catch { /* ignore */ }
}

export function useDailyCheckin(userId, prayerLogDates) {
  const [manualCheckins, setManualCheckins] = useState(() => loadFromStorage());
  const today = getTodayString();

  // Sync from Supabase on mount (merges with localStorage)
  useEffect(() => {
    if (!userId) return;
    supabase.from('daily_checkins').select('checked_date').eq('user_id', userId)
      .then(({ data, error }) => {
        if (error) { console.error('fetchCheckins failed:', error.message); return; }
        if (data) {
          const remote = data.map(r => r.checked_date);
          setManualCheckins(prev => {
            const merged = [...new Set([...prev, ...remote])];
            saveToStorage(merged);
            return merged;
          });
        }
      });
  }, [userId]);

  const allCheckinDates = useMemo(() => {
    return new Set([...manualCheckins, ...(prayerLogDates || [])]);
  }, [manualCheckins, prayerLogDates]);

  const hasPrayedToday = allCheckinDates.has(today);
  // True only if the user manually pressed the button (can be undone)
  const hasManualCheckinToday = manualCheckins.includes(today);

  const checkInToday = useCallback(async () => {
    if (manualCheckins.includes(today)) return;
    const updated = [...manualCheckins, today];
    setManualCheckins(updated);
    saveToStorage(updated); // offline-safe: save immediately
    if (userId) {
      try {
        const { error } = await supabase.from('daily_checkins').upsert({ user_id: userId, checked_date: today });
        if (error) console.error('checkInToday failed:', error.message);
      } catch (err) { console.error('checkInToday error:', err.message); }
    }
  }, [manualCheckins, today, userId]);

  const uncheckToday = useCallback(async () => {
    if (!manualCheckins.includes(today)) return;
    const updated = manualCheckins.filter(d => d !== today);
    setManualCheckins(updated);
    saveToStorage(updated);
    if (userId) {
      try {
        const { error } = await supabase.from('daily_checkins')
          .delete()
          .eq('user_id', userId)
          .eq('checked_date', today);
        if (error) console.error('uncheckToday failed:', error.message);
      } catch (err) { console.error('uncheckToday error:', err.message); }
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

  return { hasPrayedToday, hasManualCheckinToday, checkInToday, uncheckToday, ...streakStats };
}

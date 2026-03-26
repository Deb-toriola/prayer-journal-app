import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { getTodayString } from '../utils/constants';
import { savePrayerBackup, loadPrayerBackup } from '../utils/storage';
import { logStreakAction } from '../utils/auditLog';

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

// Calculate ms until next local midnight
function msUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return midnight - now;
}

export function useDailyCheckin(userId, prayerLogDates, planCheckinDates) {
  const [manualCheckins, setManualCheckins] = useState(() => loadFromStorage());
  const [today, setToday] = useState(() => getTodayString());
  const midnightTimerRef = useRef(null);

  // ── Midnight reset: recalculate "today" at local midnight ──────────
  useEffect(() => {
    const scheduleMidnightReset = () => {
      if (midnightTimerRef.current) clearTimeout(midnightTimerRef.current);
      const ms = msUntilMidnight() + 100; // +100ms buffer to ensure we're past midnight
      midnightTimerRef.current = setTimeout(() => {
        setToday(getTodayString());
        scheduleMidnightReset(); // schedule next midnight
      }, ms);
    };

    scheduleMidnightReset();
    return () => { if (midnightTimerRef.current) clearTimeout(midnightTimerRef.current); };
  }, []);

  // ── Visibility change: re-check date when app returns from background ─
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const currentToday = getTodayString();
        setToday(prev => prev !== currentToday ? currentToday : prev);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Sync from Supabase on mount — REPLACE localStorage (not merge) to prevent cross-user leaks
  useEffect(() => {
    if (!userId) return;
    supabase.from('daily_checkins').select('checked_date').eq('user_id', userId)
      .then(({ data, error }) => {
        if (error) { console.error('fetchCheckins failed:', error.message); return; }
        if (data) {
          const remote = data.map(r => r.checked_date);
          // Data integrity: compare with backup and use whichever has more entries
          const backup = loadPrayerBackup(userId);
          const missingInRemote = backup.filter(d => !remote.includes(d));
          if (missingInRemote.length > 0) {
            // Backup has entries Supabase doesn't — re-sync them
            missingInRemote.forEach(dateStr => {
              supabase.from('daily_checkins').upsert({ user_id: userId, checked_date: dateStr })
                .then(({ error: e }) => { if (e) console.error('resync:', e.message); });
            });
          }
          const authoritative = [...new Set([...remote, ...backup])];
          setManualCheckins(authoritative);
          saveToStorage(authoritative);
          savePrayerBackup(userId, authoritative);
        }
      });
  }, [userId]);

  // Merge all prayer signals: manual check-ins + prayer log dates + plan check-in dates
  const allCheckinDates = useMemo(() => {
    return new Set([
      ...manualCheckins,
      ...(prayerLogDates || []),
      ...(planCheckinDates || []),
    ]);
  }, [manualCheckins, prayerLogDates, planCheckinDates]);

  const hasPrayedToday = allCheckinDates.has(today);
  // True only if the user manually pressed the button (can be undone)
  const hasManualCheckinToday = manualCheckins.includes(today);

  const checkInToday = useCallback(async () => {
    if (manualCheckins.includes(today)) return;
    const updated = [...manualCheckins, today];
    setManualCheckins(updated);
    saveToStorage(updated);
    if (userId) {
      savePrayerBackup(userId, updated);
      logStreakAction(userId, 'prayer_logged', null, { date: today }, 'streak_card');
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
      logStreakAction(userId, 'prayer_removed', { date: today }, null, 'streak_card');
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
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yesterday = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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

  // ── Retrospective logging: log prayer for a specific past date ──────
  const logPrayerForDate = useCallback(async (dateStr) => {
    if (manualCheckins.includes(dateStr)) return;
    const updated = [...manualCheckins, dateStr];
    setManualCheckins(updated);
    saveToStorage(updated);
    if (userId) {
      savePrayerBackup(userId, updated);
      logStreakAction(userId, 'retrospective_prayer_logged', null, { date: dateStr }, 'calendar');
      try {
        const { error } = await supabase.from('daily_checkins').upsert({ user_id: userId, checked_date: dateStr });
        if (error) console.error('logPrayerForDate failed:', error.message);
      } catch (err) { console.error('logPrayerForDate error:', err.message); }
    }
  }, [manualCheckins, userId]);

  // ── Remove a logged date ──────────────────────────────────────────
  const removeLogForDate = useCallback(async (dateStr) => {
    if (!manualCheckins.includes(dateStr)) return;
    const updated = manualCheckins.filter(d => d !== dateStr);
    setManualCheckins(updated);
    saveToStorage(updated);
    if (userId) {
      try {
        const { error } = await supabase.from('daily_checkins')
          .delete()
          .eq('user_id', userId)
          .eq('checked_date', dateStr);
        if (error) console.error('removeLogForDate failed:', error.message);
      } catch (err) { console.error('removeLogForDate error:', err.message); }
    }
  }, [manualCheckins, userId]);

  const resetCheckins = useCallback(async () => {
    const oldDates = [...manualCheckins];
    setManualCheckins([]);
    saveToStorage([]);
    if (userId) {
      logStreakAction(userId, 'streak_reset', { dates: oldDates, count: oldDates.length }, { dates: [], count: 0 }, 'settings');
      try {
        await supabase.from('daily_checkins').delete().eq('user_id', userId);
      } catch (err) { console.error('resetCheckins error:', err.message); }
    }
  }, [manualCheckins, userId]);

  return {
    hasPrayedToday, hasManualCheckinToday,
    checkInToday, uncheckToday, resetCheckins,
    logPrayerForDate, removeLogForDate,
    allCheckinDates,
    ...streakStats,
  };
}

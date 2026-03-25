import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'prayer-schedule';
const DEFAULT_SCHEDULE = {
  monday: [], tuesday: [], wednesday: [],
  thursday: [], friday: [], saturday: [], sunday: [],
};

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_SCHEDULE, ...JSON.parse(raw) } : DEFAULT_SCHEDULE;
  } catch {
    return DEFAULT_SCHEDULE;
  }
}

function saveLocal(schedule) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule)); } catch { /* ignore */ }
}

export function usePrayerSchedule(userId) {
  const [schedule, setSchedule] = useState(loadLocal);

  // Fetch from Supabase when authenticated
  useEffect(() => {
    if (!userId) return;
    supabase
      .from('settings')
      .select('prayer_schedule')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.prayer_schedule && typeof data.prayer_schedule === 'object') {
          const merged = { ...DEFAULT_SCHEDULE, ...data.prayer_schedule };
          setSchedule(merged);
          saveLocal(merged);
        }
      });
  }, [userId]);

  const updateDay = useCallback((dayName, categories) => {
    setSchedule(prev => {
      const next = { ...prev, [dayName]: categories };
      saveLocal(next);
      if (userId) {
        supabase.from('settings').upsert({
          user_id: userId,
          prayer_schedule: next,
          updated_at: new Date().toISOString(),
        }).then(({ error }) => {
          if (error) console.error('updateDay failed:', error.message);
        });
      }
      return next;
    });
  }, [userId]);

  return { schedule, updateDay };
}

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULTS = {
  theme: 'minimal',
  fontSize: 'medium',
  showStreak: true,
  showNeglected: true,
  showWeeklyFocusOnHome: true,
  notificationsEnabled: false,
  communityAlerts: false,
  bibleTranslation: 'NKJV',
};

function applyTheme(settings) {
  // Persist theme so the inline <head> script can apply it on next load (no flash)
  try { localStorage.setItem('prayer-app-theme', settings.theme); } catch (_) {}
  const root = document.documentElement;
  root.classList.remove('light-mode', 'minimal-mode');
  if (settings.theme === 'light') {
    root.classList.add('light-mode');
  } else if (settings.theme === 'minimal') {
    root.classList.add('light-mode');   // inherit light-mode base overrides
    root.classList.add('minimal-mode'); // then apply minimal-specific overrides
  }
  // 'dark' = no class (default :root variables)
  root.classList.remove('font-small', 'font-large');
  if (settings.fontSize === 'small') root.classList.add('font-small');
  if (settings.fontSize === 'large') root.classList.add('font-large');
}

export function useSettings(userId) {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    if (!userId) { applyTheme(DEFAULTS); return; }
    supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const loaded = {
            theme: data.theme || DEFAULTS.theme,
            fontSize: data.font_size || DEFAULTS.fontSize,
            showStreak: data.show_streak ?? DEFAULTS.showStreak,
            showNeglected: data.show_neglected ?? DEFAULTS.showNeglected,
            showWeeklyFocusOnHome: data.show_weekly_focus_on_home ?? DEFAULTS.showWeeklyFocusOnHome,
            notificationsEnabled: data.notifications_enabled ?? DEFAULTS.notificationsEnabled,
            communityAlerts: data.community_alerts ?? DEFAULTS.communityAlerts,
            bibleTranslation: data.bible_translation || DEFAULTS.bibleTranslation,
          };
          setSettings(loaded);
          applyTheme(loaded);
        } else {
          applyTheme(DEFAULTS);
        }
      });
  }, [userId]);

  const update = (patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      applyTheme(next);
      if (userId) {
        supabase.from('settings').upsert({
          user_id: userId,
          theme: next.theme,
          font_size: next.fontSize,
          show_streak: next.showStreak,
          show_neglected: next.showNeglected,
          show_weekly_focus_on_home: next.showWeeklyFocusOnHome,
          notifications_enabled: next.notificationsEnabled,
          community_alerts: next.communityAlerts,
          bible_translation: next.bibleTranslation,
          updated_at: new Date().toISOString(),
        });
      }
      return next;
    });
  };

  return { settings, update };
}

import { useState, useEffect } from 'react';

const SETTINGS_KEY = 'prayer-journal-settings';

const DEFAULTS = {
  theme: 'dark',
  fontSize: 'medium',
  showStreak: true,
  showNeglected: true,
  showWeeklyFocusOnHome: false,
  notificationsEnabled: false,
};

function loadSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULTS, ...JSON.parse(data) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function saveSettings(s) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch {}
}

export function useSettings() {
  const [settings, setSettings] = useState(loadSettings);

  const update = (patch) => {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') root.classList.add('light-mode');
    else root.classList.remove('light-mode');
  }, [settings.theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-small', 'font-large');
    if (settings.fontSize === 'small') root.classList.add('font-small');
    if (settings.fontSize === 'large') root.classList.add('font-large');
  }, [settings.fontSize]);

  return { settings, update };
}

import { useState, useEffect } from 'react';

const SETTINGS_KEY = 'prayer-journal-settings';

function loadSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : {
      theme: 'dark',         // 'dark' | 'light'
      fontSize: 'medium',    // 'small' | 'medium' | 'large'
      showStreak: true,
      showNeglected: true,
    };
  } catch {
    return { theme: 'dark', fontSize: 'medium', showStreak: true, showNeglected: true };
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

  // Apply theme class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.add('light-mode');
    } else {
      root.classList.remove('light-mode');
    }
  }, [settings.theme]);

  // Apply font size class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-small', 'font-large');
    if (settings.fontSize === 'small') root.classList.add('font-small');
    if (settings.fontSize === 'large') root.classList.add('font-large');
  }, [settings.fontSize]);

  return { settings, update };
}

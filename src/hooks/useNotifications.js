import { useState, useEffect, useCallback, useRef } from 'react';
import { loadNotificationSettings, saveNotificationSettings } from '../utils/storage';

export function useNotifications() {
  const [settings, setSettings] = useState(() => loadNotificationSettings());
  const timersRef = useRef([]);

  useEffect(() => {
    saveNotificationSettings(settings);
  }, [settings]);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'granted') return 'granted';
    const result = await Notification.requestPermission();
    return result;
  }, []);

  const scheduleNotifications = useCallback(() => {
    // Clear existing timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (!settings.enabled || Notification.permission !== 'granted') return;

    settings.times.forEach((time) => {
      const now = new Date();
      const target = new Date();
      target.setHours(time.hour, time.minute, 0, 0);

      // If time already passed today, schedule for tomorrow
      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }

      const delay = target - now;
      const timer = setTimeout(() => {
        new Notification('My Prayer App', {
          body: time.label || 'Time to pray 🙏',
          icon: '/icon-192.svg',
          tag: `prayer-${time.hour}-${time.minute}`,
        });
        // Reschedule for tomorrow
        scheduleNotifications();
      }, delay);

      timersRef.current.push(timer);
    });
  }, [settings]);

  useEffect(() => {
    scheduleNotifications();
    return () => timersRef.current.forEach(clearTimeout);
  }, [scheduleNotifications]);

  const toggleEnabled = useCallback(async () => {
    if (!settings.enabled) {
      const perm = await requestPermission();
      if (perm !== 'granted') return false;
    }
    setSettings((prev) => ({ ...prev, enabled: !prev.enabled }));
    return true;
  }, [settings.enabled, requestPermission]);

  const addTime = useCallback((hour, minute, label) => {
    setSettings((prev) => ({
      ...prev,
      times: [...prev.times, { hour, minute, label }],
    }));
  }, []);

  const removeTime = useCallback((index) => {
    setSettings((prev) => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index),
    }));
  }, []);

  const updateTime = useCallback((index, updates) => {
    setSettings((prev) => ({
      ...prev,
      times: prev.times.map((t, i) => (i === index ? { ...t, ...updates } : t)),
    }));
  }, []);

  return {
    settings,
    toggleEnabled,
    addTime,
    removeTime,
    updateTime,
    notificationSupported: 'Notification' in window,
  };
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { loadNotificationSettings, saveNotificationSettings } from '../utils/storage';

const IS_NATIVE = Capacitor.isNativePlatform();

// Lazily import the native plugin to avoid errors in browser builds
async function getLocalNotif() {
  if (!IS_NATIVE) return null;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    return LocalNotifications;
  } catch (e) {
    console.error('LocalNotifications unavailable:', e?.message);
    return null;
  }
}

// ─── Schedule native local notifications (iOS / Android) ──────────────────
async function scheduleNative(times, enabled) {
  const LN = await getLocalNotif();
  if (!LN) return;

  // Cancel all existing scheduled notifications first
  try {
    const { notifications: pending } = await LN.getPending();
    if (pending.length > 0) {
      await LN.cancel({ notifications: pending.map(n => ({ id: n.id })) });
    }
  } catch { /* ignore */ }

  if (!enabled || !times.length) return;

  try {
    await LN.schedule({
      notifications: times.map((t, i) => ({
        id: i + 1,
        title: 'My Prayer App 🙏',
        body: t.label || 'Time to pray',
        schedule: {
          on: { hour: t.hour, minute: t.minute },
          repeats: true,
          allowWhileIdle: true,
        },
        smallIcon: 'ic_notification',
        iconColor: '#0F172A',
        channelId: 'prayer-reminders',
      })),
    });
  } catch (e) {
    console.error('scheduleNative failed:', e?.message);
  }
}

export function useNotifications() {
  const [settings, setSettings] = useState(() => loadNotificationSettings());
  // 'unknown' | 'granted' | 'denied' | 'prompt' | 'prompt-with-rationale'
  const [permissionState, setPermissionState] = useState('unknown');
  const webTimers = useRef([]);

  // Persist settings whenever they change
  useEffect(() => {
    saveNotificationSettings(settings);
  }, [settings]);

  // Check current permission state on mount
  useEffect(() => {
    (async () => {
      if (IS_NATIVE) {
        const LN = await getLocalNotif();
        if (LN) {
          const { display } = await LN.checkPermissions();
          setPermissionState(display);
        }
      } else if ('Notification' in window) {
        setPermissionState(Notification.permission);
      }
    })();
  }, []);

  // ── Web: schedule with setTimeout (fires while tab is open) ──────────────
  const scheduleWeb = useCallback((times, enabled) => {
    webTimers.current.forEach(clearTimeout);
    webTimers.current = [];
    if (!enabled || !('Notification' in window) || Notification.permission !== 'granted') return;

    times.forEach(time => {
      const now = new Date();
      const target = new Date();
      target.setHours(time.hour, time.minute, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);

      const timer = setTimeout(() => {
        try {
          new Notification('My Prayer App', {
            body: time.label || 'Time to pray 🙏',
            icon: '/icon-192.svg',
            tag: `prayer-${time.hour}-${time.minute}`,
          });
        } catch { /* ignore */ }
        scheduleWeb(times, enabled); // re-schedule for tomorrow
      }, target - now);

      webTimers.current.push(timer);
    });
  }, []); // stable — times/enabled come in as params

  // Re-apply schedule whenever settings or permission changes
  useEffect(() => {
    if (IS_NATIVE) {
      if (permissionState === 'granted') {
        scheduleNative(settings.times, settings.enabled);
      }
    } else {
      scheduleWeb(settings.times, settings.enabled);
    }
    return () => {
      if (!IS_NATIVE) webTimers.current.forEach(clearTimeout);
    };
  }, [settings.times, settings.enabled, permissionState, scheduleWeb]);

  // ── Toggle notifications on/off ────────────────────────────────────────
  const toggleEnabled = useCallback(async () => {
    if (settings.enabled) {
      // Turning OFF
      setSettings(prev => ({ ...prev, enabled: false }));
      if (IS_NATIVE) await scheduleNative(settings.times, false);
      return true;
    }

    // Turning ON — request permission first
    if (IS_NATIVE) {
      const LN = await getLocalNotif();
      if (!LN) return false;
      const { display } = await LN.requestPermissions();
      setPermissionState(display);
      if (display !== 'granted') return false; // user denied → show blocked message
    } else {
      if (!('Notification' in window)) return false;
      if (Notification.permission === 'denied') {
        setPermissionState('denied');
        return false;
      }
      const result = await Notification.requestPermission();
      setPermissionState(result);
      if (result !== 'granted') return false;
    }

    setSettings(prev => ({ ...prev, enabled: true }));
    return true;
  }, [settings.enabled, settings.times]);

  const addTime = useCallback((hour, minute, label) => {
    setSettings(prev => ({ ...prev, times: [...prev.times, { hour, minute, label }] }));
  }, []);

  const removeTime = useCallback((index) => {
    setSettings(prev => ({ ...prev, times: prev.times.filter((_, i) => i !== index) }));
  }, []);

  const updateTime = useCallback((index, updates) => {
    setSettings(prev => ({
      ...prev,
      times: prev.times.map((t, i) => i === index ? { ...t, ...updates } : t),
    }));
  }, []);

  return {
    settings,
    toggleEnabled,
    addTime,
    removeTime,
    updateTime,
    notificationSupported: IS_NATIVE || ('Notification' in window),
    permissionState,
    isNative: IS_NATIVE,
  };
}

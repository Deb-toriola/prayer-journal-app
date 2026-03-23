import { useState, useEffect, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { loadNotificationSettings, saveNotificationSettings } from '../utils/storage';

const IS_NATIVE = Capacitor.isNativePlatform();

// Reserved notification IDs for special notifications (avoid collision with prayer reminders)
const STREAK_REMINDER_ID = 9000;
const NEGLECTED_PRAYER_ID = 9001;

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

  // Cancel only prayer reminder notifications (IDs 1-100), not streak/neglected
  try {
    const { notifications: pending } = await LN.getPending();
    const reminderIds = pending.filter(n => n.id < STREAK_REMINDER_ID).map(n => ({ id: n.id }));
    if (reminderIds.length > 0) {
      await LN.cancel({ notifications: reminderIds });
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

// ─── Schedule streak end-of-day reminder (native) ─────────────────────────
async function scheduleStreakReminder(enabled) {
  const LN = await getLocalNotif();
  if (!LN) return;

  // Always cancel existing streak reminder first
  try {
    await LN.cancel({ notifications: [{ id: STREAK_REMINDER_ID }] });
  } catch { /* ignore */ }

  if (!enabled) return;

  try {
    await LN.schedule({
      notifications: [{
        id: STREAK_REMINDER_ID,
        title: 'Your streak is waiting 🔥',
        body: "You haven't prayed today yet. One tap to keep your streak alive.",
        schedule: {
          on: { hour: 20, minute: 0 },
          repeats: true,
          allowWhileIdle: true,
        },
        smallIcon: 'ic_notification',
        iconColor: '#D4891A',
        channelId: 'prayer-reminders',
      }],
    });
  } catch (e) {
    console.error('scheduleStreakReminder failed:', e?.message);
  }
}

// ─── Schedule neglected prayer reminder (native) ──────────────────────────
async function scheduleNeglectedReminder(enabled, neglectedPrayers = []) {
  const LN = await getLocalNotif();
  if (!LN) return;

  // Always cancel existing neglected reminder first
  try {
    await LN.cancel({ notifications: [{ id: NEGLECTED_PRAYER_ID }] });
  } catch { /* ignore */ }

  if (!enabled || neglectedPrayers.length === 0) return;

  // Find the most neglected prayer (longest time since last prayed)
  let mostNeglected = neglectedPrayers[0];
  let maxDays = 0;
  neglectedPrayers.forEach(p => {
    const log = p.prayerLog || [];
    let days;
    if (log.length === 0) {
      days = Math.floor((Date.now() - new Date(p.created_at || Date.now()).getTime()) / 86400000);
    } else {
      days = Math.floor((Date.now() - new Date(log[log.length - 1]).getTime()) / 86400000);
    }
    if (days > maxDays) {
      maxDays = days;
      mostNeglected = p;
    }
  });

  try {
    await LN.schedule({
      notifications: [{
        id: NEGLECTED_PRAYER_ID,
        title: 'A prayer needs your attention',
        body: `You haven't prayed for "${mostNeglected.title}" in ${maxDays} days. Don't let it slip away.`,
        schedule: {
          on: { hour: 10, minute: 0 },
          repeats: true,
          allowWhileIdle: true,
        },
        smallIcon: 'ic_notification',
        iconColor: '#D4891A',
        channelId: 'prayer-reminders',
      }],
    });
  } catch (e) {
    console.error('scheduleNeglectedReminder failed:', e?.message);
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

  // Check current permission state on mount + create notification channel on Android
  useEffect(() => {
    (async () => {
      if (IS_NATIVE) {
        const LN = await getLocalNotif();
        if (LN) {
          // Create channel with IMPORTANCE_HIGH (4) so reminders show as banners with sound.
          // This is idempotent — calling it again on an existing channel is a no-op.
          try {
            await LN.createChannel({
              id: 'prayer-reminders',
              name: 'Prayer Reminders',
              description: 'Daily prayer reminder notifications',
              importance: 4,   // IMPORTANCE_HIGH — banner + sound
              sound: 'default',
              vibration: true,
              visibility: 1,   // VISIBILITY_PUBLIC — shows on lock screen
            });
          } catch { /* ignore — older Capacitor versions may not support createChannel */ }

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

  // ── Streak reminder: schedule/cancel based on setting ───────────────────
  const updateStreakReminder = useCallback(async (enabled) => {
    if (IS_NATIVE && permissionState === 'granted') {
      await scheduleStreakReminder(enabled);
    }
    // Web fallback: no-op for now (streak reminder is native-only)
  }, [permissionState]);

  // ── Neglected prayer reminder: schedule/cancel based on setting + data ─
  const updateNeglectedReminder = useCallback(async (enabled, neglectedPrayers = []) => {
    if (IS_NATIVE && permissionState === 'granted') {
      await scheduleNeglectedReminder(enabled, neglectedPrayers);
    }
    // Web fallback: no-op for now
  }, [permissionState]);

  return {
    settings,
    toggleEnabled,
    addTime,
    removeTime,
    updateTime,
    updateStreakReminder,
    updateNeglectedReminder,
    notificationSupported: IS_NATIVE || ('Notification' in window),
    permissionState,
    isNative: IS_NATIVE,
  };
}

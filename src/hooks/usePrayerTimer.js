import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'prayer-timer-state';

function loadTimerState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveTimerState(state) {
  if (state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function usePrayerTimer() {
  // Active timer: { prayerId, partnerId (optional), startedAt (ISO string) } or null
  const [activeTimer, setActiveTimer] = useState(() => loadTimerState());
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  // Keep a ref so stopTimer always reads the latest value
  const activeTimerRef = useRef(activeTimer);
  useEffect(() => {
    activeTimerRef.current = activeTimer;
  }, [activeTimer]);

  // Calculate elapsed from start timestamp (background-safe)
  const calcElapsed = useCallback(() => {
    const timer = activeTimerRef.current;
    if (!timer) return 0;
    return Math.floor((Date.now() - new Date(timer.startedAt).getTime()) / 1000);
  }, []);

  // Start ticking
  useEffect(() => {
    if (activeTimer) {
      setElapsed(Math.floor((Date.now() - new Date(activeTimer.startedAt).getTime()) / 1000));
      intervalRef.current = setInterval(() => {
        setElapsed(calcElapsed());
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeTimer, calcElapsed]);

  // Persist timer state
  useEffect(() => {
    saveTimerState(activeTimer);
  }, [activeTimer]);

  // Start timer — partnerId is optional (null = personal, string = partner)
  const startTimer = useCallback((prayerId, partnerId = null) => {
    setActiveTimer({ prayerId, partnerId, startedAt: new Date().toISOString() });
  }, []);

  // Use ref to always get the current timer, avoiding stale closures
  const stopTimer = useCallback(() => {
    const timer = activeTimerRef.current;
    if (!timer) return null;
    const duration = Math.floor(
      (Date.now() - new Date(timer.startedAt).getTime()) / 1000
    );
    const session = {
      prayerId: timer.prayerId,
      partnerId: timer.partnerId || null,
      startedAt: timer.startedAt,
      duration,
    };
    setActiveTimer(null);
    return session;
  }, []);

  const cancelTimer = useCallback(() => {
    setActiveTimer(null);
  }, []);

  return {
    activeTimer,
    elapsed,
    startTimer,
    stopTimer,
    cancelTimer,
    isTimerRunning: !!activeTimer,
    timerPrayerId: activeTimer?.prayerId || null,
    timerPartnerId: activeTimer?.partnerId || null,
  };
}

export function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatDurationReadable(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  return parts.join(' ');
}

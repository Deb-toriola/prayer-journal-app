import { useState, useCallback } from 'react';
import { loadPrayerPlan, savePrayerPlan } from '../utils/storage';
import { getTodayString } from '../utils/constants';

export const PLAN_TEMPLATES = [
  { id: '7day', name: '7-Day Prayer Starter', days: 7, icon: '🌱', desc: 'Begin your prayer journey with a simple 7-day commitment.' },
  { id: '21day', name: '21-Day Prayer Habit Builder', days: 21, icon: '🔁', desc: 'Build a lasting prayer habit over three weeks.' },
  { id: '30day', name: '30-Day Prayer Warrior Challenge', days: 30, icon: '🛡️', desc: 'Deepen your prayer life with a month-long challenge.' },
  { id: '40day', name: '40-Day Prayer & Fasting Journey', days: 40, icon: '🔥', desc: 'A transformative journey of prayer and fasting.' },
];

// Separate storage key just for completed plan count
const COMPLETED_KEY = 'prayer-journal-completed-plans';

function loadCompletedCount() {
  try { return parseInt(localStorage.getItem(COMPLETED_KEY) || '0'); } catch { return 0; }
}
function saveCompletedCount(n) {
  try { localStorage.setItem(COMPLETED_KEY, String(n)); } catch {}
}

export function usePrayerPlan() {
  const [plan, setPlan] = useState(() => {
    const stored = loadPrayerPlan();
    // Guard against sentinel objects from old buggy deletePlan
    if (stored && !stored.name) return null;
    return stored;
  });
  const [completedCount, setCompletedCount] = useState(() => loadCompletedCount());

  const startPlan = useCallback((templateId, customName, customDays) => {
    const template = PLAN_TEMPLATES.find((t) => t.id === templateId);
    const days = template ? template.days : Math.max(1, parseInt(customDays) || 7);
    const name = customName.trim() || (template ? template.name : `${days}-Day Prayer Plan`);

    const newPlan = {
      id: Date.now().toString(),
      name,
      totalDays: days,
      startDate: getTodayString(),
      checkedDays: [],
    };
    setPlan(newPlan);
    savePrayerPlan(newPlan);
  }, []);

  const checkInToday = useCallback(() => {
    if (!plan) return;
    const today = getTodayString();
    if (plan.checkedDays.includes(today)) return;
    const updated = { ...plan, checkedDays: [...plan.checkedDays, today] };
    setPlan(updated);
    savePrayerPlan(updated);
  }, [plan]);

  const deletePlan = useCallback(() => {
    if (!plan) return;
    const wasComplete = plan.checkedDays.length >= plan.totalDays;
    if (wasComplete) {
      const newCount = completedCount + 1;
      setCompletedCount(newCount);
      saveCompletedCount(newCount);
    }
    setPlan(null);
    savePrayerPlan(null);
  }, [plan, completedCount]);

  // Derived state
  const today = getTodayString();
  const hasPrayedToday = plan ? plan.checkedDays.includes(today) : false;

  let currentDayNumber = 1;
  if (plan) {
    const start = new Date(plan.startDate);
    const now = new Date(today);
    currentDayNumber = Math.min(
      Math.floor((now - start) / 86400000) + 1,
      plan.totalDays
    );
  }

  const isComplete = plan ? plan.checkedDays.length >= plan.totalDays : false;

  return {
    plan,
    startPlan,
    checkInToday,
    deletePlan,
    hasPrayedToday,
    currentDayNumber,
    isComplete,
    completedPlansCount: completedCount,
  };
}

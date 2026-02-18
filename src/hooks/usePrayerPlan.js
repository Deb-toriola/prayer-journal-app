import { useState, useCallback } from 'react';
import { loadPrayerPlan, savePrayerPlan } from '../utils/storage';
import { getTodayString } from '../utils/constants';

export const PLAN_TEMPLATES = [
  { id: '7day', name: '7-Day Prayer Starter', days: 7, icon: '🌱', desc: 'Begin your prayer journey with a simple 7-day commitment.' },
  { id: '21day', name: '21-Day Prayer Habit Builder', days: 21, icon: '🔁', desc: 'Build a lasting prayer habit over three weeks.' },
  { id: '30day', name: '30-Day Prayer Warrior Challenge', days: 30, icon: '🛡️', desc: 'Deepen your prayer life with a month-long challenge.' },
  { id: '40day', name: '40-Day Prayer & Fasting Journey', days: 40, icon: '🔥', desc: 'A transformative journey of prayer and fasting.' },
];

export function usePrayerPlan() {
  const [plan, setPlan] = useState(() => loadPrayerPlan());

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
      completedCount: plan ? (plan.completedCount || 0) : 0,
    };
    setPlan(newPlan);
    savePrayerPlan(newPlan);
  }, [plan]);

  const checkInToday = useCallback(() => {
    if (!plan) return;
    const today = getTodayString();
    if (plan.checkedDays.includes(today)) return;
    const updated = { ...plan, checkedDays: [...plan.checkedDays, today] };
    setPlan(updated);
    savePrayerPlan(updated);
  }, [plan]);

  const deletePlan = useCallback(() => {
    // Preserve completed count across plans
    const completedCount = plan ? (plan.completedCount || 0) : 0;
    const isComplete = plan && plan.checkedDays.length >= plan.totalDays;
    // Save completed count to a temp placeholder so next plan can inherit it
    savePrayerPlan(null);
    setPlan(null);
    // Store completed count separately so startPlan can use it
    if (isComplete) {
      const stored = loadPrayerPlan();
      if (!stored) {
        // Store just the count as a side-effect via a sentinel
        savePrayerPlan({ _completedCount: completedCount + 1 });
        setTimeout(() => savePrayerPlan(null), 0);
      }
    }
  }, [plan]);

  // Derived state
  const today = getTodayString();
  const hasPrayedToday = plan ? plan.checkedDays.includes(today) : false;

  // Current day number (1-based, how many days since start)
  let currentDayNumber = 1;
  if (plan) {
    const start = new Date(plan.startDate);
    const now = new Date(today);
    currentDayNumber = Math.min(
      Math.floor((now - start) / 86400000) + 1,
      plan.totalDays
    );
  }

  const isComplete = plan && plan.checkedDays.length >= plan.totalDays;
  const completedPlansCount = plan ? (plan.completedCount || 0) + (isComplete ? 1 : 0) : 0;

  return {
    plan,
    startPlan,
    checkInToday,
    deletePlan,
    hasPrayedToday,
    currentDayNumber,
    isComplete,
    completedPlansCount,
  };
}

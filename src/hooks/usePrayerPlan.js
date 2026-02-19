import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getTodayString } from '../utils/constants';

export const PLAN_TEMPLATES = [
  { id: '7day', name: '7-Day Prayer Starter', days: 7, icon: '🌱', desc: 'Begin your prayer journey with a simple 7-day commitment.' },
  { id: '21day', name: '21-Day Prayer Habit Builder', days: 21, icon: '🔁', desc: 'Build a lasting prayer habit over three weeks.' },
  { id: '30day', name: '30-Day Prayer Warrior Challenge', days: 30, icon: '🛡️', desc: 'Deepen your prayer life with a month-long challenge.' },
  { id: '40day', name: '40-Day Prayer & Fasting Journey', days: 40, icon: '🔥', desc: 'A transformative journey of prayer and fasting.' },
];

export function usePrayerPlan(userId) {
  const [plan, setPlan] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    // Load active plan
    supabase.from('prayer_plans').select('*').eq('user_id', userId)
      .order('created_at', { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setPlan({
            id: data.id,
            name: data.name,
            totalDays: data.total_days,
            startDate: data.start_date,
            checkedDays: data.checked_days || [],
          });
        }
      });
    // Load completed count
    supabase.from('user_stats').select('completed_plans_count').eq('user_id', userId).maybeSingle()
      .then(({ data }) => { if (data) setCompletedCount(data.completed_plans_count || 0); });
  }, [userId]);

  const startPlan = useCallback(async (templateId, customName, customDays) => {
    const template = PLAN_TEMPLATES.find((t) => t.id === templateId);
    const days = template ? template.days : Math.max(1, parseInt(customDays) || 7);
    const name = (customName || '').trim() || (template ? template.name : `${days}-Day Prayer Plan`);
    const newPlan = { name, totalDays: days, startDate: getTodayString(), checkedDays: [] };
    // Delete old plan first
    if (plan) await supabase.from('prayer_plans').delete().eq('id', plan.id);
    const { data } = await supabase.from('prayer_plans').insert({
      user_id: userId, name, total_days: days, start_date: newPlan.startDate, checked_days: [],
    }).select().single();
    if (data) setPlan({ id: data.id, name: data.name, totalDays: data.total_days, startDate: data.start_date, checkedDays: [] });
  }, [userId, plan]);

  const checkInToday = useCallback(async () => {
    if (!plan) return;
    const today = getTodayString();
    if (plan.checkedDays.includes(today)) return;
    const updated = [...plan.checkedDays, today];
    setPlan((p) => ({ ...p, checkedDays: updated }));
    await supabase.from('prayer_plans').update({ checked_days: updated }).eq('id', plan.id);
  }, [plan]);

  const deletePlan = useCallback(async () => {
    if (!plan) return;
    const wasComplete = plan.checkedDays.length >= plan.totalDays;
    await supabase.from('prayer_plans').delete().eq('id', plan.id);
    setPlan(null);
    if (wasComplete && userId) {
      const newCount = completedCount + 1;
      setCompletedCount(newCount);
      await supabase.from('user_stats').upsert({ user_id: userId, completed_plans_count: newCount, updated_at: new Date().toISOString() });
    }
  }, [plan, completedCount, userId]);

  const today = getTodayString();
  const hasPrayedToday = plan ? plan.checkedDays.includes(today) : false;
  let currentDayNumber = 1;
  if (plan) {
    const start = new Date(plan.startDate);
    const now = new Date(today);
    currentDayNumber = Math.min(Math.floor((now - start) / 86400000) + 1, plan.totalDays);
  }
  const isComplete = plan ? plan.checkedDays.length >= plan.totalDays : false;

  return { plan, startPlan, checkInToday, deletePlan, hasPrayedToday, currentDayNumber, isComplete, completedPlansCount: completedCount };
}

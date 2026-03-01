import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getTodayString } from '../utils/constants';

export const PLAN_TEMPLATES = [
  // Prayer Habits
  { id: '7day',  name: '7-Day Prayer Starter',           days: 7,  icon: '🌱', desc: 'Begin your prayer journey with a simple 7-day commitment.',          category: 'habits' },
  { id: '21day', name: '21-Day Prayer Habit Builder',    days: 21, icon: '🔁', desc: 'Build a lasting prayer habit over three weeks.',                      category: 'habits' },
  { id: '30day', name: '30-Day Prayer Warrior Challenge',days: 30, icon: '🛡️', desc: 'Deepen your prayer life with a month-long challenge.',                category: 'habits' },
  { id: '40day', name: '40-Day Prayer & Fasting Journey',days: 40, icon: '🔥', desc: 'A transformative journey of prayer and fasting.',                     category: 'habits' },
  // Thanksgiving & Praise
  { id: 'thanks-7',  name: '7-Day Thanksgiving Journey', days: 7,  icon: '🙌', desc: 'Seven days of intentional gratitude and praise to God.',             category: 'thanksgiving' },
  { id: 'thanks-21', name: '21-Day Praise & Gratitude',  days: 21, icon: '🙌', desc: 'Build a daily habit of thanksgiving and praise.',                    category: 'thanksgiving' },
  // Personal Intercession
  { id: 'intercede-14', name: '14-Day Personal Intercession', days: 14, icon: '🛡️', desc: 'Dedicated intercession for people and situations on your heart.', category: 'intercession' },
  { id: 'intercede-30', name: '30-Day Intercession Journey',  days: 30, icon: '🛡️', desc: 'A month of standing in the gap for others in prayer.',             category: 'intercession' },
];

export const PLAN_CATEGORIES = [
  { id: 'habits',       label: 'Prayer Habits' },
  { id: 'thanksgiving', label: 'Thanksgiving & Praise' },
  { id: 'intercession', label: 'Personal Intercession' },
];

function parsePlan(data) {
  return {
    id: data.id,
    name: data.name,
    totalDays: data.total_days,
    startDate: data.start_date,
    checkedDays: data.checked_days || [],
    notes: data.notes || [],
    partners: data.partners || [],
  };
}

export function usePrayerPlan(userId) {
  const [plans, setPlans] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    // Load all active plans
    supabase.from('prayer_plans').select('*').eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) { console.error('fetchPlans failed:', error.message); return; }
        if (data) setPlans(data.map(parsePlan));
      });
    // Load completed count
    supabase.from('user_stats').select('completed_plans_count').eq('user_id', userId).maybeSingle()
      .then(({ data, error }) => {
        if (error) { console.error('fetchUserStats failed:', error.message); return; }
        if (data) setCompletedCount(data.completed_plans_count || 0);
      });
  }, [userId]);

  const startPlan = useCallback(async (templateId, customName, customDays) => {
    const template = PLAN_TEMPLATES.find((t) => t.id === templateId);
    const days = template ? template.days : Math.max(1, parseInt(customDays) || 7);
    const name = (customName || '').trim() || (template ? template.name : `${days}-Day Prayer Plan`);
    const startDate = getTodayString();

    // Guest mode — local state only
    if (!userId) {
      const newPlan = { id: crypto.randomUUID(), name, totalDays: days, startDate, checkedDays: [], notes: [], partners: [] };
      setPlans(prev => [newPlan, ...prev]);
      return;
    }

    // Signed-in — persist to Supabase (no deletion of existing plans)
    try {
      const { data, error } = await supabase.from('prayer_plans').insert({
        user_id: userId, name, total_days: days, start_date: startDate, checked_days: [],
      }).select().single();
      if (error) { console.error('startPlan failed:', error.message); return; }
      if (data) setPlans(prev => [parsePlan(data), ...prev]);
    } catch (err) { console.error('startPlan error:', err.message); }
  }, [userId]);

  const checkInPlan = useCallback(async (planId) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    const today = getTodayString();
    if (plan.checkedDays.includes(today)) return;
    const updated = [...plan.checkedDays, today];
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, checkedDays: updated } : p));
    if (userId) {
      try {
        const { error } = await supabase.from('prayer_plans').update({ checked_days: updated }).eq('id', planId);
        if (error) console.error('checkInPlan failed:', error.message);
      } catch (err) { console.error('checkInPlan error:', err.message); }
    }
  }, [plans, userId]);

  const deletePlan = useCallback(async (planId) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    const wasComplete = plan.checkedDays.length >= plan.totalDays;
    setPlans(prev => prev.filter(p => p.id !== planId));
    if (userId) {
      try {
        const { error } = await supabase.from('prayer_plans').delete().eq('id', planId);
        if (error) { console.error('deletePlan failed:', error.message); return; }
        if (wasComplete) {
          const newCount = completedCount + 1;
          setCompletedCount(newCount);
          const { error: sErr } = await supabase.from('user_stats').upsert({ user_id: userId, completed_plans_count: newCount, updated_at: new Date().toISOString() });
          if (sErr) console.error('updateUserStats failed:', sErr.message);
        }
      } catch (err) { console.error('deletePlan error:', err.message); }
    }
  }, [plans, completedCount, userId]);

  const addPlanNote = useCallback(async (planId, text, type) => {
    const note = { id: crypto.randomUUID(), text, type, createdAt: new Date().toISOString() };
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    const updated = [...(plan.notes || []), note];
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, notes: updated } : p));
    if (userId) {
      try {
        const { error } = await supabase.from('prayer_plans').update({ notes: updated }).eq('id', planId);
        if (error) console.error('addPlanNote failed:', error.message);
      } catch (err) { console.error('addPlanNote error:', err.message); }
    }
  }, [plans, userId]);

  const deletePlanNote = useCallback(async (planId, noteId) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    const updated = (plan.notes || []).filter(n => n.id !== noteId);
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, notes: updated } : p));
    if (userId) {
      try {
        const { error } = await supabase.from('prayer_plans').update({ notes: updated }).eq('id', planId);
        if (error) console.error('deletePlanNote failed:', error.message);
      } catch (err) { console.error('deletePlanNote error:', err.message); }
    }
  }, [plans, userId]);

  const addPlanPartner = useCallback(async (planId, name) => {
    const partner = { id: crypto.randomUUID(), name, prayerLog: [], prayerSessions: [] };
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    const updated = [...(plan.partners || []), partner];
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, partners: updated } : p));
    if (userId) {
      try {
        const { error } = await supabase.from('prayer_plans').update({ partners: updated }).eq('id', planId);
        if (error) console.error('addPlanPartner failed:', error.message);
      } catch (err) { console.error('addPlanPartner error:', err.message); }
    }
  }, [plans, userId]);

  const removePlanPartner = useCallback(async (planId, partnerId) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    const updated = (plan.partners || []).filter(p => p.id !== partnerId);
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, partners: updated } : p));
    if (userId) {
      try {
        const { error } = await supabase.from('prayer_plans').update({ partners: updated }).eq('id', planId);
        if (error) console.error('removePlanPartner failed:', error.message);
      } catch (err) { console.error('removePlanPartner error:', err.message); }
    }
  }, [plans, userId]);

  const logPlanPartnerPrayed = useCallback(async (planId, partnerId) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    const updated = (plan.partners || []).map(p =>
      p.id === partnerId ? { ...p, prayerLog: [...(p.prayerLog || []), new Date().toISOString()] } : p
    );
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, partners: updated } : p));
    if (userId) {
      try {
        const { error } = await supabase.from('prayer_plans').update({ partners: updated }).eq('id', planId);
        if (error) console.error('logPlanPartnerPrayed failed:', error.message);
      } catch (err) { console.error('logPlanPartnerPrayed error:', err.message); }
    }
  }, [plans, userId]);

  const undoPlanPartnerPrayed = useCallback(async (planId, partnerId) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    const updated = (plan.partners || []).map(p =>
      p.id === partnerId ? { ...p, prayerLog: (p.prayerLog || []).slice(0, -1) } : p
    );
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, partners: updated } : p));
    if (userId) {
      try {
        const { error } = await supabase.from('prayer_plans').update({ partners: updated }).eq('id', planId);
        if (error) console.error('undoPlanPartnerPrayed failed:', error.message);
      } catch (err) { console.error('undoPlanPartnerPrayed error:', err.message); }
    }
  }, [plans, userId]);

  const today = getTodayString();

  return {
    plans, startPlan, checkInPlan, deletePlan,
    addPlanNote, deletePlanNote,
    addPlanPartner, removePlanPartner, logPlanPartnerPrayed, undoPlanPartnerPrayed,
    completedPlansCount: completedCount, today,
  };
}

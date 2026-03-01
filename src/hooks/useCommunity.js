import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getTodayString as getToday } from '../utils/constants';

function genId() {
  try { return crypto.randomUUID(); } catch { return Math.random().toString(36).slice(2); }
}

export function useCommunity(userId) {
  const [members, setMembers] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!userId) return;
    supabase.from('community_members').select('*').eq('user_id', userId)
      .then(({ data, error }) => {
        if (error) { console.error('fetchMembers failed:', error.message); return; }
        if (data) setMembers(data.map(r => ({ id: r.id, name: r.name, joinedAt: r.joined_at })));
      });
    supabase.from('community_sessions').select('*').eq('user_id', userId)
      .then(({ data, error }) => {
        if (error) { console.error('fetchSessions failed:', error.message); return; }
        if (data) setSessions(data.map(r => ({ id: r.id, memberId: r.member_id, minutes: r.minutes, date: r.session_date, loggedAt: r.logged_at })));
      });
  }, [userId]);

  const addMember = useCallback(async (name) => {
    if (!name.trim()) return;
    const optimistic = { id: genId(), name: name.trim(), joinedAt: new Date().toISOString() };
    setMembers((prev) => [...prev, optimistic]);
    if (userId) {
      try {
        const { data, error } = await supabase.from('community_members').insert({ user_id: userId, name: name.trim() }).select().single();
        if (error) { console.error('addMember failed:', error.message); }
        else if (data) setMembers((prev) => prev.map(m => m.id === optimistic.id ? { id: data.id, name: data.name, joinedAt: data.joined_at } : m));
      } catch (err) { console.error('addMember error:', err.message); }
    }
  }, [userId]);

  const removeMember = useCallback(async (memberId) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    setSessions((prev) => prev.filter((s) => s.memberId !== memberId));
    if (userId) {
      try {
        const { error } = await supabase.from('community_members').delete().eq('id', memberId).eq('user_id', userId);
        if (error) console.error('removeMember failed:', error.message);
      } catch (err) { console.error('removeMember error:', err.message); }
    }
  }, [userId]);

  const logSession = useCallback(async (memberId, minutes) => {
    const mins = Math.max(1, parseInt(minutes) || 0);
    if (!mins) return;
    const optimistic = { id: genId(), memberId, minutes: mins, date: getToday(), loggedAt: new Date().toISOString() };
    setSessions((prev) => [...prev, optimistic]);
    if (userId) {
      try {
        const { data, error } = await supabase.from('community_sessions').insert({
          user_id: userId, member_id: memberId, minutes: mins, session_date: getToday(),
        }).select().single();
        if (error) { console.error('logSession failed:', error.message); }
        else if (data) setSessions((prev) => prev.map(s => s.id === optimistic.id ? { id: data.id, memberId: data.member_id, minutes: data.minutes, date: data.session_date, loggedAt: data.logged_at } : s));
      } catch (err) { console.error('logSession error:', err.message); }
    }
  }, [userId]);

  const deleteSession = useCallback(async (sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (userId) {
      try {
        const { error } = await supabase.from('community_sessions').delete().eq('id', sessionId).eq('user_id', userId);
        if (error) console.error('deleteSession failed:', error.message);
      } catch (err) { console.error('deleteSession error:', err.message); }
    }
  }, [userId]);

  const memberStats = members.map((m) => {
    const mSessions = sessions.filter((s) => s.memberId === m.id);
    const totalMinutes = mSessions.reduce((sum, s) => sum + s.minutes, 0);
    const today = getToday();
    const todayMinutes = mSessions.filter((s) => s.date === today).reduce((sum, s) => sum + s.minutes, 0);
    const lastSession = [...mSessions].sort((a, b) => b.loggedAt.localeCompare(a.loggedAt))[0];
    return { ...m, totalMinutes, todayMinutes, sessionCount: mSessions.length, lastSession };
  }).sort((a, b) => b.totalMinutes - a.totalMinutes);

  const totalGroupMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
  const todayGroupMinutes = sessions.filter((s) => s.date === getToday()).reduce((sum, s) => sum + s.minutes, 0);

  return { members, sessions, memberStats, totalGroupMinutes, todayGroupMinutes, addMember, removeMember, logSession, deleteSession };
}

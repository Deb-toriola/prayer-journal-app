import { useState, useCallback } from 'react';
import { loadCommunityData, saveCommunityData } from '../utils/storage';
import { getTodayString as getToday } from '../utils/constants';

function genId() {
  try { return crypto.randomUUID(); } catch {
    return Math.random().toString(36).slice(2);
  }
}

export function useCommunity() {
  const [data, setData] = useState(() => loadCommunityData());

  const save = (updated) => {
    setData(updated);
    saveCommunityData(updated);
  };

  const addMember = useCallback((name) => {
    if (!name.trim()) return;
    const updated = {
      ...data,
      members: [
        ...data.members,
        { id: genId(), name: name.trim(), joinedAt: new Date().toISOString() },
      ],
    };
    save(updated);
  }, [data]);

  const removeMember = useCallback((memberId) => {
    const updated = {
      ...data,
      members: data.members.filter((m) => m.id !== memberId),
      sessions: data.sessions.filter((s) => s.memberId !== memberId),
    };
    save(updated);
  }, [data]);

  const logSession = useCallback((memberId, minutes) => {
    const mins = Math.max(1, parseInt(minutes) || 0);
    if (!mins) return;
    const updated = {
      ...data,
      sessions: [
        ...data.sessions,
        {
          id: genId(),
          memberId,
          minutes: mins,
          date: getToday(),
          loggedAt: new Date().toISOString(),
        },
      ],
    };
    save(updated);
  }, [data]);

  const deleteSession = useCallback((sessionId) => {
    const updated = {
      ...data,
      sessions: data.sessions.filter((s) => s.id !== sessionId),
    };
    save(updated);
  }, [data]);

  // Stats per member
  const memberStats = data.members.map((m) => {
    const sessions = data.sessions.filter((s) => s.memberId === m.id);
    const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
    const today = getToday();
    const todaySessions = sessions.filter((s) => s.date === today);
    const todayMinutes = todaySessions.reduce((sum, s) => sum + s.minutes, 0);
    const lastSession = sessions.sort((a, b) => b.loggedAt.localeCompare(a.loggedAt))[0];
    return { ...m, totalMinutes, todayMinutes, sessionCount: sessions.length, lastSession };
  }).sort((a, b) => b.totalMinutes - a.totalMinutes);

  const totalGroupMinutes = data.sessions.reduce((sum, s) => sum + s.minutes, 0);
  const today = getToday();
  const todayGroupMinutes = data.sessions
    .filter((s) => s.date === today)
    .reduce((sum, s) => sum + s.minutes, 0);

  return {
    members: data.members,
    sessions: data.sessions,
    memberStats,
    totalGroupMinutes,
    todayGroupMinutes,
    addMember,
    removeMember,
    logSession,
    deleteSession,
  };
}

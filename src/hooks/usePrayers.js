import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Convert Supabase row → app prayer shape
function rowToPrayer(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category || 'personal',
    scripture: row.scripture || '',
    urgent: row.urgent || false,
    answered: row.answered || false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    answeredAt: row.answered_at || null,
    testimonyNote: row.testimony_note || '',
    prayerLog: row.prayer_log || [],
    notes: row.notes || [],
    partners: row.partners || [],
    prayerSessions: row.prayer_sessions || [],
  };
}

// Convert app prayer shape → Supabase row
function prayerToRow(prayer, userId) {
  return {
    id: prayer.id,
    user_id: userId,
    title: prayer.title,
    content: prayer.content,
    category: prayer.category || 'personal',
    scripture: prayer.scripture || null,
    urgent: prayer.urgent || false,
    answered: prayer.answered || false,
    created_at: prayer.createdAt,
    updated_at: prayer.updatedAt,
    answered_at: prayer.answeredAt || null,
    testimony_note: prayer.testimonyNote || '',
    prayer_log: prayer.prayerLog || [],
    notes: prayer.notes || [],
    partners: prayer.partners || [],
    prayer_sessions: prayer.prayerSessions || [],
  };
}

function generateId() {
  return crypto.randomUUID?.() || Math.random().toString(36).slice(2);
}

export function usePrayers(userId) {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load prayers from Supabase on mount
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from('prayers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setPrayers(data.map(rowToPrayer));
        setLoading(false);
      });
  }, [userId]);

  // Helper: update a single prayer in state and sync to Supabase
  const syncPrayer = useCallback(async (updatedPrayer) => {
    if (!userId) return;
    const row = prayerToRow(updatedPrayer, userId);
    await supabase.from('prayers').upsert(row);
  }, [userId]);

  const addPrayer = useCallback(async (prayer) => {
    const now = new Date().toISOString();
    const newPrayer = {
      id: generateId(),
      ...prayer,
      answered: false,
      urgent: prayer.urgent || false,
      createdAt: now,
      updatedAt: now,
      answeredAt: null,
      testimonyNote: '',
      prayerLog: [now],
      notes: [],
      partners: [],
      prayerSessions: [],
    };
    // Optimistic update
    setPrayers((prev) => [newPrayer, ...prev]);
    // Sync to Supabase
    await syncPrayer(newPrayer);
    return newPrayer;
  }, [syncPrayer]);

  const updatePrayer = useCallback(async (id, updates) => {
    let updated;
    setPrayers((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      updated = { ...p, ...updates, updatedAt: new Date().toISOString() };
      return updated;
    }));
    if (updated) await syncPrayer(updated);
  }, [syncPrayer]);

  const deletePrayer = useCallback(async (id) => {
    setPrayers((prev) => prev.filter((p) => p.id !== id));
    if (userId) await supabase.from('prayers').delete().eq('id', id).eq('user_id', userId);
  }, [userId]);

  const markAnswered = useCallback(async (id, testimonyNote = '') => {
    let updated;
    setPrayers((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      updated = { ...p, answered: true, answeredAt: new Date().toISOString(), testimonyNote };
      return updated;
    }));
    if (updated) await syncPrayer(updated);
  }, [syncPrayer]);

  const restorePrayer = useCallback(async (id) => {
    let updated;
    setPrayers((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      updated = { ...p, answered: false, answeredAt: null };
      return updated;
    }));
    if (updated) await syncPrayer(updated);
  }, [syncPrayer]);

  const logPrayed = useCallback(async (id) => {
    let updated;
    setPrayers((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      updated = { ...p, prayerLog: [...(p.prayerLog || []), new Date().toISOString()] };
      return updated;
    }));
    if (updated) await syncPrayer(updated);
  }, [syncPrayer]);

  const undoLogPrayed = useCallback(async (id) => {
    let updated;
    setPrayers((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const log = [...(p.prayerLog || [])];
      if (log.length > 1) log.pop();
      updated = { ...p, prayerLog: log };
      return updated;
    }));
    if (updated) await syncPrayer(updated);
  }, [syncPrayer]);

  const addPrayerSession = useCallback(async (id, session) => {
    let updated;
    setPrayers((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      updated = { ...p, prayerSessions: [...(p.prayerSessions || []), session] };
      return updated;
    }));
    if (updated) await syncPrayer(updated);
  }, [syncPrayer]);

  const toggleUrgent = useCallback(async (id) => {
    let updated;
    setPrayers((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      updated = { ...p, urgent: !p.urgent };
      return updated;
    }));
    if (updated) await syncPrayer(updated);
  }, [syncPrayer]);

  const addNote = useCallback(async (id, text, type = 'update') => {
    let updated;
    setPrayers((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      updated = {
        ...p,
        notes: [...(p.notes || []), { id: generateId(), text, type, createdAt: new Date().toISOString() }],
      };
      return updated;
    }));
    if (updated) await syncPrayer(updated);
  }, [syncPrayer]);

  const deleteNote = useCallback(async (prayerId, noteId) => {
    let updated;
    setPrayers((prev) => prev.map((p) => {
      if (p.id !== prayerId) return p;
      updated = { ...p, notes: (p.notes || []).filter((n) => n.id !== noteId) };
      return updated;
    }));
    if (updated) await syncPrayer(updated);
  }, [syncPrayer]);

  const addPartner = useCallback(async (prayerId, name) => {
    let updated;
    setPrayers((prev) => prev.map((p) => {
      if (p.id !== prayerId) return p;
      const partners = p.partners || [];
      if (partners.some((pt) => pt.name.toLowerCase() === name.toLowerCase())) return p;
      updated = { ...p, partners: [...partners, { id: generateId(), name, prayerLog: [], prayerSessions: [] }] };
      return updated;
    }));
    if (updated) await syncPrayer(updated);
  }, [syncPrayer]);

  const removePartner = useCallback(async (prayerId, partnerId) => {
    let updated;
    setPrayers((prev) => prev.map((p) => {
      if (p.id !== prayerId) return p;
      updated = { ...p, partners: (p.partners || []).filter((pt) => pt.id !== partnerId) };
      return updated;
    }));
    if (updated) await syncPrayer(updated);
  }, [syncPrayer]);

  const logPartnerPrayed = useCallback(async (prayerId, partnerId) => {
    let updated;
    setPrayers((prev) => prev.map((p) => {
      if (p.id !== prayerId) return p;
      updated = {
        ...p,
        partners: (p.partners || []).map((pt) =>
          pt.id === partnerId
            ? { ...pt, prayerLog: [...(pt.prayerLog || []), new Date().toISOString()] }
            : pt
        ),
      };
      return updated;
    }));
    if (updated) await syncPrayer(updated);
  }, [syncPrayer]);

  const addPartnerSession = useCallback(async (prayerId, partnerId, session) => {
    let updated;
    setPrayers((prev) => prev.map((p) => {
      if (p.id !== prayerId) return p;
      updated = {
        ...p,
        partners: (p.partners || []).map((pt) =>
          pt.id === partnerId
            ? { ...pt, prayerSessions: [...(pt.prayerSessions || []), session] }
            : pt
        ),
      };
      return updated;
    }));
    if (updated) await syncPrayer(updated);
  }, [syncPrayer]);

  const undoPartnerPrayed = useCallback(async (prayerId, partnerId) => {
    let updated;
    setPrayers((prev) => prev.map((p) => {
      if (p.id !== prayerId) return p;
      updated = {
        ...p,
        partners: (p.partners || []).map((pt) => {
          if (pt.id !== partnerId) return pt;
          const log = [...(pt.prayerLog || [])];
          if (log.length > 0) log.pop();
          return { ...pt, prayerLog: log };
        }),
      };
      return updated;
    }));
    if (updated) await syncPrayer(updated);
  }, [syncPrayer]);

  const activePrayers = prayers
    .filter((p) => !p.answered)
    .sort((a, b) => {
      if (a.urgent && !b.urgent) return -1;
      if (!a.urgent && b.urgent) return 1;
      return 0;
    });

  const testimonies = prayers.filter((p) => p.answered);

  return {
    prayers,
    activePrayers,
    testimonies,
    loading,
    addPrayer,
    updatePrayer,
    deletePrayer,
    markAnswered,
    restorePrayer,
    logPrayed,
    undoLogPrayed,
    toggleUrgent,
    addNote,
    deleteNote,
    addPrayerSession,
    addPartner,
    removePartner,
    logPartnerPrayed,
    addPartnerSession,
    undoPartnerPrayed,
  };
}

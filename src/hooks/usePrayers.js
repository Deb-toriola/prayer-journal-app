import { useState, useEffect, useCallback } from 'react';
import { loadPrayers, savePrayers, generateId } from '../utils/storage';

export function usePrayers() {
  const [prayers, setPrayers] = useState(() => loadPrayers());

  useEffect(() => {
    savePrayers(prayers);
  }, [prayers]);

  const addPrayer = useCallback((prayer) => {
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
    };
    setPrayers((prev) => [newPrayer, ...prev]);
    return newPrayer;
  }, []);

  const updatePrayer = useCallback((id, updates) => {
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      )
    );
  }, []);

  const deletePrayer = useCallback((id) => {
    setPrayers((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const markAnswered = useCallback((id, testimonyNote = '') => {
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, answered: true, answeredAt: new Date().toISOString(), testimonyNote }
          : p
      )
    );
  }, []);

  const restorePrayer = useCallback((id) => {
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, answered: false, answeredAt: null } : p
      )
    );
  }, []);

  // Log a prayer session (add timestamp)
  const logPrayed = useCallback((id) => {
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, prayerLog: [...(p.prayerLog || []), new Date().toISOString()] }
          : p
      )
    );
  }, []);

  // Undo last prayer log entry
  const undoLogPrayed = useCallback((id) => {
    setPrayers((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const log = [...(p.prayerLog || [])];
        if (log.length > 1) log.pop(); // keep at least the creation entry
        return { ...p, prayerLog: log };
      })
    );
  }, []);

  // Add a timed prayer session { startedAt, duration }
  const addPrayerSession = useCallback((id, session) => {
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, prayerSessions: [...(p.prayerSessions || []), session] }
          : p
      )
    );
  }, []);

  // Toggle urgent
  const toggleUrgent = useCallback((id) => {
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, urgent: !p.urgent } : p
      )
    );
  }, []);

  // Add a note/update to a prayer (type: update, word, confirmation, scripture, vision)
  const addNote = useCallback((id, text, type = 'update') => {
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              notes: [...(p.notes || []), { id: generateId(), text, type, createdAt: new Date().toISOString() }],
            }
          : p
      )
    );
  }, []);

  // Delete a note
  const deleteNote = useCallback((prayerId, noteId) => {
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === prayerId
          ? { ...p, notes: (p.notes || []).filter((n) => n.id !== noteId) }
          : p
      )
    );
  }, []);

  // Add a prayer partner
  const addPartner = useCallback((prayerId, name) => {
    setPrayers((prev) =>
      prev.map((p) => {
        if (p.id !== prayerId) return p;
        const partners = p.partners || [];
        // Avoid duplicate names (case-insensitive)
        if (partners.some((pt) => pt.name.toLowerCase() === name.toLowerCase())) return p;
        return {
          ...p,
          partners: [...partners, { id: generateId(), name, prayerLog: [] }],
        };
      })
    );
  }, []);

  // Remove a prayer partner
  const removePartner = useCallback((prayerId, partnerId) => {
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === prayerId
          ? { ...p, partners: (p.partners || []).filter((pt) => pt.id !== partnerId) }
          : p
      )
    );
  }, []);

  // Log that a partner prayed
  const logPartnerPrayed = useCallback((prayerId, partnerId) => {
    setPrayers((prev) =>
      prev.map((p) => {
        if (p.id !== prayerId) return p;
        return {
          ...p,
          partners: (p.partners || []).map((pt) =>
            pt.id === partnerId
              ? { ...pt, prayerLog: [...pt.prayerLog, new Date().toISOString()] }
              : pt
          ),
        };
      })
    );
  }, []);

  // Add a timed prayer session for a partner
  const addPartnerSession = useCallback((prayerId, partnerId, session) => {
    setPrayers((prev) =>
      prev.map((p) => {
        if (p.id !== prayerId) return p;
        return {
          ...p,
          partners: (p.partners || []).map((pt) =>
            pt.id === partnerId
              ? { ...pt, prayerSessions: [...(pt.prayerSessions || []), session] }
              : pt
          ),
        };
      })
    );
  }, []);

  // Undo partner prayer log
  const undoPartnerPrayed = useCallback((prayerId, partnerId) => {
    setPrayers((prev) =>
      prev.map((p) => {
        if (p.id !== prayerId) return p;
        return {
          ...p,
          partners: (p.partners || []).map((pt) => {
            if (pt.id !== partnerId) return pt;
            const log = [...pt.prayerLog];
            if (log.length > 0) log.pop();
            return { ...pt, prayerLog: log };
          }),
        };
      })
    );
  }, []);

  const activePrayers = prayers
    .filter((p) => !p.answered)
    .sort((a, b) => {
      // Urgent first, then by most recent prayer log
      if (a.urgent && !b.urgent) return -1;
      if (!a.urgent && b.urgent) return 1;
      return 0; // keep creation order within same urgency
    });

  const testimonies = prayers.filter((p) => p.answered);

  return {
    prayers,
    activePrayers,
    testimonies,
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

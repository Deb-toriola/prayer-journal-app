import { useState, useCallback } from 'react';

const KEY = 'prayer-journal-intercede';

function genId() {
  try { return crypto.randomUUID(); } catch { return Math.random().toString(36).slice(2); }
}

function load() {
  try { const d = localStorage.getItem(KEY); return d ? JSON.parse(d) : []; } catch { return []; }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export function useIntercede() {
  const [requests, setRequests] = useState(load);

  const addRequest = useCallback((burden) => {
    if (!burden.trim()) return;
    const updated = [
      {
        id: genId(),
        burden: burden.trim(),
        createdAt: new Date().toISOString(),
        prayerCount: 0,
        hasPrayed: false,
      },
      ...requests,
    ];
    setRequests(updated);
    save(updated);
  }, [requests]);

  const prayForRequest = useCallback((id) => {
    const updated = requests.map(r =>
      r.id === id && !r.hasPrayed
        ? { ...r, prayerCount: r.prayerCount + 1, hasPrayed: true }
        : r
    );
    setRequests(updated);
    save(updated);
  }, [requests]);

  const deleteRequest = useCallback((id) => {
    const updated = requests.filter(r => r.id !== id);
    setRequests(updated);
    save(updated);
  }, [requests]);

  return { requests, addRequest, prayForRequest, deleteRequest };
}

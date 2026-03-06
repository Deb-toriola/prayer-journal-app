// ── Guest → Supabase migration ────────────────────────────────
// Called once when a guest user creates an account and their
// auth session becomes active. Reads prayers and checkins from
// localStorage, upserts them into Supabase under the new userId,
// then clears the guest storage so it never runs again.

import { supabase } from '../lib/supabase';
import {
  GUEST_ID_KEY,
  GUEST_CHECKINS_KEY,
  loadGuestPrayers,
  clearGuestStorage,
} from '../hooks/useGuestStorage';

export async function migrateGuestData(userId) {
  if (!userId) return;

  // Nothing to migrate if there's no guest session on this device
  const guestId = localStorage.getItem(GUEST_ID_KEY);
  if (!guestId) return;

  const prayers = loadGuestPrayers();

  let checkins = [];
  try {
    const raw = localStorage.getItem(GUEST_CHECKINS_KEY);
    checkins = raw ? JSON.parse(raw) : [];
  } catch {
    checkins = [];
  }

  if (prayers.length === 0 && checkins.length === 0) {
    clearGuestStorage();
    return;
  }

  // ── Migrate prayers ──────────────────────────────────────────
  if (prayers.length > 0) {
    const rows = prayers.map((p) => ({
      id: p.id,
      user_id: userId,
      title: p.title,
      content: p.content,
      category: p.category || 'personal',
      scripture: p.scripture || null,
      urgent: p.urgent || false,
      answered: p.answered || false,
      created_at: p.createdAt,
      updated_at: p.updatedAt,
      answered_at: p.answeredAt || null,
      testimony_note: p.testimonyNote || '',
      prayer_log: p.prayerLog || [],
      notes: p.notes || [],
      partners: p.partners || [],
      prayer_sessions: p.prayerSessions || [],
    }));

    const { error } = await supabase
      .from('prayers')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.error('[migrateGuestData] prayers failed:', error.message);
    }
  }

  // ── Migrate checkins ─────────────────────────────────────────
  if (checkins.length > 0) {
    const rows = checkins.map((date) => ({
      user_id: userId,
      checked_date: date,
    }));

    const { error } = await supabase
      .from('daily_checkins')
      .upsert(rows, { onConflict: 'user_id,checked_date' });

    if (error) {
      console.error('[migrateGuestData] checkins failed:', error.message);
    }
  }

  // ── Clear guest data now that it's safely in Supabase ────────
  clearGuestStorage();
}

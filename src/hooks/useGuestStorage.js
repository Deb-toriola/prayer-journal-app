// ── Guest storage: localStorage-backed prayer persistence ────
// Used when no authenticated userId exists.
// All keys are namespaced under a per-device guestId UUID so that
// if the same device later signs up, migrateGuestData can cleanly
// identify and move exactly this guest's data into Supabase.

export const GUEST_ID_KEY = 'guest-id';
export const GUEST_CHECKINS_KEY = 'prayer-journal-daily-checkins'; // shared with useDailyCheckin

function guestPrayersKey(guestId) {
  return `guest-prayers-${guestId}`;
}

// Get or create a stable guest ID for this device
export function getGuestId() {
  let id = localStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    localStorage.setItem(GUEST_ID_KEY, id);
  }
  return id;
}

// Load prayers array from localStorage (returns [] if nothing stored)
export function loadGuestPrayers() {
  try {
    const id = localStorage.getItem(GUEST_ID_KEY);
    if (!id) return [];
    const raw = localStorage.getItem(guestPrayersKey(id));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Persist the full prayers array to localStorage
export function saveGuestPrayers(prayers) {
  try {
    const id = getGuestId(); // creates one if it doesn't exist yet
    localStorage.setItem(guestPrayersKey(id), JSON.stringify(prayers));
  } catch {
    // Storage quota exceeded — fail silently
  }
}

// Remove all guest data (called after successful migration to Supabase)
export function clearGuestStorage() {
  const id = localStorage.getItem(GUEST_ID_KEY);
  if (id) {
    localStorage.removeItem(guestPrayersKey(id));
  }
  localStorage.removeItem(GUEST_ID_KEY);
  // Note: GUEST_CHECKINS_KEY is intentionally NOT cleared here because
  // useDailyCheckin reuses that key as its offline cache for logged-in users too.
}

// ─── Input Validation & Sanitisation ────────────────────────────────────
// Client-side validation for all user input.
// RLS + Supabase parameterised queries handle SQL injection server-side.
// React's JSX escaping handles XSS for rendered content.

const LIMITS = {
  PRAYER_TITLE: 200,
  PRAYER_CONTENT: 2000,
  TESTIMONY_NOTE: 2000,
  DISPLAY_NAME: 50,
  USERNAME: 30,
  SHARED_REQUEST: 500,
  GROUP_NAME: 100,
  NOTE_CONTENT: 1000,
  INVITE_MESSAGE: 140,
  SCRIPTURE_REF: 200,
};

/**
 * Truncate a string to a max length.
 * Returns the original string if within limits.
 */
export function truncate(str, maxLength) {
  if (!str || typeof str !== 'string') return str || '';
  return str.length > maxLength ? str.slice(0, maxLength) : str;
}

/**
 * Validate and sanitise prayer input.
 * Returns sanitised prayer object.
 */
export function sanitisePrayer(prayer) {
  return {
    ...prayer,
    title: truncate((prayer.title || '').trim(), LIMITS.PRAYER_TITLE),
    content: truncate((prayer.content || '').trim(), LIMITS.PRAYER_CONTENT),
    scripture: truncate((prayer.scripture || '').trim(), LIMITS.SCRIPTURE_REF),
    testimonyNote: truncate((prayer.testimonyNote || '').trim(), LIMITS.TESTIMONY_NOTE),
  };
}

/**
 * Validate shared prayer request content.
 */
export function sanitiseSharedRequest(content) {
  return truncate((content || '').trim(), LIMITS.SHARED_REQUEST);
}

/**
 * Validate display name.
 */
export function sanitiseDisplayName(name) {
  return truncate((name || '').trim(), LIMITS.DISPLAY_NAME);
}

/**
 * Validate group name.
 */
export function sanitiseGroupName(name) {
  return truncate((name || '').trim(), LIMITS.GROUP_NAME);
}

/**
 * Validate note content.
 */
export function sanitiseNote(content) {
  return truncate((content || '').trim(), LIMITS.NOTE_CONTENT);
}

export { LIMITS };

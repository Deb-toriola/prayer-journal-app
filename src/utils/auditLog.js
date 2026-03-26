import { supabase } from '../lib/supabase';

/**
 * Log a streak-related action to the streak_audit_log table.
 * Runs silently — never blocks the main flow.
 */
export async function logStreakAction(userId, action, oldValue, newValue, source) {
  if (!userId) return;
  try {
    await supabase.from('streak_audit_log').insert({
      user_id: userId,
      action,
      old_value: oldValue,
      new_value: newValue,
      source: source || 'app',
    });
  } catch (e) {
    // Silent — audit logging should never break the app
    if (import.meta.env.DEV) console.warn('audit log failed:', e?.message);
  }
}

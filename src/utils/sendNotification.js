import { supabase } from '../lib/supabase';

/**
 * Insert a cross-user in-app notification.
 * RLS allows any authenticated user to INSERT; only the recipient can SELECT.
 */
export async function sendNotification(recipientUserId, type, title, body, metadata = {}) {
  if (!recipientUserId) return;
  const { error } = await supabase.from('in_app_notifications').insert({
    user_id: recipientUserId,
    type,
    title,
    body,
    metadata,
  });
  if (error) console.error('sendNotification failed:', error.message);
}

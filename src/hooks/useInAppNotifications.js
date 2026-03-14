import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export function useInAppNotifications(userId, { onPartnerAccepted } = {}) {
  const [notifications, setNotifications] = useState([]);
  const channelRef = useRef(null);

  const fetchNotifications = async () => {
    if (!userId) { setNotifications([]); return; }
    const { data, error } = await supabase
      .from('in_app_notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error && data) setNotifications(data);
  };

  useEffect(() => {
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    if (!userId) { setNotifications([]); return; }

    fetchNotifications();

    channelRef.current = supabase
      .channel(`notifs-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'in_app_notifications',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        // Auto-handle partner_accepted: add partner to their prayer
        if (payload.new?.type === 'partner_accepted' && onPartnerAccepted) {
          const { prayerId, partnerName, partnerUserId } = payload.new.metadata || {};
          if (prayerId && partnerName) {
            onPartnerAccepted(prayerId, partnerName, partnerUserId || null);
          }
        }
        fetchNotifications();
      })
      .subscribe();

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const markRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await supabase.from('in_app_notifications').update({ read: true }).eq('id', id).eq('user_id', userId);
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (userId) {
      await supabase.from('in_app_notifications').update({ read: true }).eq('user_id', userId).eq('read', false);
    }
  };

  const dismissNotification = async (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    await supabase.from('in_app_notifications').delete().eq('id', id).eq('user_id', userId);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, unreadCount, markRead, markAllRead, dismissNotification };
}

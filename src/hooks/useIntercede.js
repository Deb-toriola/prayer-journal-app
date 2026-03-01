import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useIntercede(userId) {
  const [requests, setRequests] = useState([]);
  const [myPrayers, setMyPrayers] = useState(new Set()); // request IDs the user has prayed for

  useEffect(() => {
    const fetchRequests = () => {
      supabase.from('intercede_requests').select('*').order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) { console.error('fetchRequests failed:', error.message); return; }
          if (data) setRequests(data.map(r => ({
            id: r.id, burden: r.burden, createdAt: r.created_at,
            prayerCount: r.prayer_count || 0, userId: r.user_id,
          })));
        });
    };

    // Load public feed for everyone (guests and signed-in)
    fetchRequests();

    // Load which requests this signed-in user has prayed for
    if (userId) {
      supabase.from('intercede_prayers').select('request_id').eq('user_id', userId)
        .then(({ data, error }) => {
          if (error) { console.error('fetchMyPrayers failed:', error.message); return; }
          if (data) setMyPrayers(new Set(data.map(r => r.request_id)));
        });
    }

    // Real-time subscription for live updates
    const channel = supabase.channel('intercede-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'intercede_requests' }, fetchRequests)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const addRequest = useCallback(async (burden) => {
    if (!burden.trim() || !userId) return;
    try {
      const { error } = await supabase.from('intercede_requests').insert({
        user_id: userId, burden: burden.trim(), prayer_count: 0,
      });
      if (error) console.error('addRequest failed:', error.message);
      // Real-time will update the list
    } catch (err) { console.error('addRequest error:', err.message); }
  }, [userId]);

  const prayForRequest = useCallback(async (id) => {
    if (myPrayers.has(id) || !userId) return;
    // Optimistic update
    setMyPrayers((prev) => new Set([...prev, id]));
    setRequests((prev) => prev.map(r => r.id === id ? { ...r, prayerCount: r.prayerCount + 1 } : r));
    // Record the prayer
    await supabase.from('intercede_prayers').insert({ user_id: userId, request_id: id });
    // Increment count in DB
    await supabase.rpc('increment_prayer_count', { request_id: id }).catch(async () => {
      // Fallback if RPC not available: manual update
      const { data } = await supabase.from('intercede_requests').select('prayer_count').eq('id', id).single();
      if (data) await supabase.from('intercede_requests').update({ prayer_count: (data.prayer_count || 0) + 1 }).eq('id', id);
    });
  }, [userId, myPrayers]);

  const deleteRequest = useCallback(async (id) => {
    setRequests((prev) => prev.filter(r => r.id !== id));
    try {
      const { error } = await supabase.from('intercede_requests').delete().eq('id', id).eq('user_id', userId);
      if (error) console.error('deleteRequest failed:', error.message);
    } catch (err) { console.error('deleteRequest error:', err.message); }
  }, [userId]);

  // Merge hasPrayed into requests
  const requestsWithStatus = requests.map(r => ({ ...r, hasPrayed: myPrayers.has(r.id) }));

  return { requests: requestsWithStatus, addRequest, prayForRequest, deleteRequest };
}

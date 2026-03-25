import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { sendNotification } from '../utils/sendNotification';
import { getTodayString } from '../utils/constants';

const MAX_PARTNERS = 2;

function getPartnerId(partnership, userId) {
  return partnership.user_id_1 === userId ? partnership.user_id_2 : partnership.user_id_1;
}

function getPartnerName(partnership, userId) {
  return partnership.user_id_1 === userId ? partnership.invitee_name : partnership.inviter_name;
}

export function usePartnership(userId, displayName) {
  const [partnerships, setPartnerships] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [prayerLogs, setPrayerLogs] = useState([]);
  const [sharedRequests, setSharedRequests] = useState([]);
  const channelRef = useRef(null);

  // ── Fetch partnerships ─────────────────────────────────────────
  const fetchPartnerships = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('prayer_partnerships')
      .select('*')
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
      .in('status', ['active', 'pending'])
      .order('created_at', { ascending: false });
    if (error) { console.error('fetchPartnerships:', error.message); return; }

    const active = (data || []).filter(p => p.status === 'active');
    const pending = (data || []).filter(p => p.status === 'pending');
    setPartnerships(active);
    setPendingInvites(pending);

    // Fetch prayer logs for active partnerships
    if (active.length > 0) {
      const ids = active.map(p => p.id);
      const { data: logs } = await supabase
        .from('partner_prayer_log')
        .select('*')
        .in('partnership_id', ids)
        .order('prayed_date', { ascending: false });
      setPrayerLogs(logs || []);

      // Fetch shared requests
      const { data: reqs } = await supabase
        .from('shared_prayer_requests')
        .select('*')
        .in('partnership_id', ids)
        .order('created_at', { ascending: false });
      setSharedRequests(reqs || []);
    }
  }, [userId]);

  useEffect(() => { fetchPartnerships(); }, [fetchPartnerships]);

  // ── Real-time subscription ─────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    channelRef.current = supabase
      .channel(`partnerships-${userId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'prayer_partnerships',
      }, () => fetchPartnerships())
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'partner_prayer_log',
      }, () => fetchPartnerships())
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'shared_prayer_requests',
      }, () => fetchPartnerships())
      .subscribe();

    return () => { channelRef.current?.unsubscribe(); };
  }, [userId, fetchPartnerships]);

  // ── Invite a partner by email ──────────────────────────────────
  const invitePartner = useCallback(async (email, message = '') => {
    if (!userId) return { error: 'Not signed in' };

    // Check max partners
    if (partnerships.length >= MAX_PARTNERS) {
      return { error: 'You can have up to 2 prayer partners' };
    }

    // Look up user by email
    const { data: targetId, error: rpcErr } = await supabase.rpc('get_user_id_by_email', { lookup_email: email.toLowerCase() });
    if (rpcErr || !targetId) return { error: 'No user found with that email' };
    if (targetId === userId) return { error: "You can't partner with yourself" };

    // Check if already partnered or pending
    const existing = [...partnerships, ...pendingInvites].find(p =>
      (p.user_id_1 === targetId || p.user_id_2 === targetId)
    );
    if (existing) return { error: 'You already have a partnership with this person' };

    const { error: insertErr } = await supabase.from('prayer_partnerships').insert({
      user_id_1: userId,
      user_id_2: targetId,
      status: 'pending',
      invited_by: userId,
      inviter_name: displayName || 'A friend',
      message: message || null,
    });
    if (insertErr) return { error: insertErr.message };

    await sendNotification(
      targetId,
      'partner_invite_new',
      `${displayName || 'Someone'} wants to pray with you 🙏`,
      message || "They invited you to be their prayer partner.",
      { inviterId: userId, inviterName: displayName }
    );

    await fetchPartnerships();
    return { success: true };
  }, [userId, displayName, partnerships, pendingInvites, fetchPartnerships]);

  // ── Accept partnership ─────────────────────────────────────────
  const acceptPartnership = useCallback(async (partnershipId) => {
    const { error } = await supabase.from('prayer_partnerships')
      .update({ status: 'active', accepted_at: new Date().toISOString(), invitee_name: displayName })
      .eq('id', partnershipId);
    if (error) { console.error('acceptPartnership:', error.message); return; }

    const partnership = pendingInvites.find(p => p.id === partnershipId);
    if (partnership) {
      const inviterId = partnership.invited_by;
      await sendNotification(
        inviterId,
        'partnership_created',
        `${displayName || 'Your partner'} accepted! 🔥`,
        `You and ${displayName} are now prayer partners. Pray together today.`,
        { partnershipId }
      );
    }
    await fetchPartnerships();
  }, [displayName, pendingInvites, fetchPartnerships]);

  // ── Decline partnership ────────────────────────────────────────
  const declinePartnership = useCallback(async (partnershipId) => {
    await supabase.from('prayer_partnerships')
      .update({ status: 'ended', ended_at: new Date().toISOString(), ended_by: userId })
      .eq('id', partnershipId);
    await fetchPartnerships();
  }, [userId, fetchPartnerships]);

  // ── Cancel sent invite ─────────────────────────────────────────
  const cancelInvite = useCallback(async (partnershipId) => {
    await supabase.from('prayer_partnerships').delete().eq('id', partnershipId).eq('invited_by', userId);
    await fetchPartnerships();
  }, [userId, fetchPartnerships]);

  // ── End partnership ────────────────────────────────────────────
  const endPartnership = useCallback(async (partnershipId) => {
    const partnership = partnerships.find(p => p.id === partnershipId);
    if (!partnership) return;

    await supabase.from('prayer_partnerships')
      .update({ status: 'ended', ended_at: new Date().toISOString(), ended_by: userId })
      .eq('id', partnershipId);

    const partnerId = getPartnerId(partnership, userId);
    await sendNotification(
      partnerId,
      'partnership_ended',
      `${displayName} has ended your prayer partnership.`,
      'Your shared prayer requests have been archived.',
      { partnershipId }
    );
    await fetchPartnerships();
  }, [userId, displayName, partnerships, fetchPartnerships]);

  // ── Log prayer for partnership ─────────────────────────────────
  const logPartnershipPrayer = useCallback(async (partnershipId) => {
    const today = getTodayString();
    const { error } = await supabase.from('partner_prayer_log').upsert({
      partnership_id: partnershipId,
      user_id: userId,
      prayed_date: today,
    });
    if (error) { console.error('logPartnershipPrayer:', error.message); return; }

    const partnership = partnerships.find(p => p.id === partnershipId);
    if (partnership) {
      const partnerId = getPartnerId(partnership, userId);
      const partnerName = getPartnerName(partnership, userId);

      // Check if partner also prayed today
      const partnerPrayed = prayerLogs.some(l =>
        l.partnership_id === partnershipId && l.user_id === partnerId && l.prayed_date === today
      );

      if (partnerPrayed) {
        // Both prayed — notify both
        await sendNotification(partnerId, 'both_prayed', 'You both prayed today! 🔥',
          `You and ${displayName} both showed up. That's a partnership streak.`, { partnershipId });
      } else {
        await sendNotification(partnerId, 'partner_prayed_today', `${displayName} prayed today 🙏`,
          'Your prayer partner showed up. Keep the streak going.', { partnershipId });
      }
    }
    await fetchPartnerships();
  }, [userId, displayName, partnerships, prayerLogs, fetchPartnerships]);

  // ── Send encouragement ─────────────────────────────────────────
  const sendEncouragement = useCallback(async (partnershipId) => {
    const partnership = partnerships.find(p => p.id === partnershipId);
    if (!partnership) return;
    const partnerId = getPartnerId(partnership, userId);
    await sendNotification(
      partnerId,
      'partner_encouraged',
      `${displayName} is praying for you 🙏`,
      'Your prayer partner sent you encouragement.',
      { partnershipId }
    );
  }, [userId, displayName, partnerships]);

  // ── Shared prayer requests ─────────────────────────────────────
  const addSharedRequest = useCallback(async (partnershipId, content) => {
    const { error } = await supabase.from('shared_prayer_requests').insert({
      partnership_id: partnershipId,
      created_by: userId,
      content,
    });
    if (error) { console.error('addSharedRequest:', error.message); return; }

    const partnership = partnerships.find(p => p.id === partnershipId);
    if (partnership) {
      const partnerId = getPartnerId(partnership, userId);
      await sendNotification(partnerId, 'shared_request_new',
        `${displayName} shared a prayer request`,
        content.slice(0, 80), { partnershipId });
    }
    await fetchPartnerships();
  }, [userId, displayName, partnerships, fetchPartnerships]);

  const markRequestAnswered = useCallback(async (requestId) => {
    const request = sharedRequests.find(r => r.id === requestId);
    if (!request) return;

    await supabase.from('shared_prayer_requests')
      .update({ status: 'answered', answered_at: new Date().toISOString(), answered_by: userId })
      .eq('id', requestId);

    // Notify the other partner
    const partnership = partnerships.find(p => p.id === request.partnership_id);
    if (partnership) {
      const partnerId = getPartnerId(partnership, userId);
      await sendNotification(partnerId, 'shared_prayer_answered',
        'Answered prayer! ✨',
        `${displayName} marked a shared prayer as answered.`,
        { partnershipId: request.partnership_id, requestId });
    }
    await fetchPartnerships();
  }, [userId, displayName, partnerships, sharedRequests, fetchPartnerships]);

  // ── Computed: partnership streak & prayer status ────────────────
  const getPartnershipData = useCallback((partnership) => {
    const today = getTodayString();
    const partnerId = getPartnerId(partnership, userId);
    const partnerName = getPartnerName(partnership, userId);
    const logs = prayerLogs.filter(l => l.partnership_id === partnership.id);

    const myPrayedToday = logs.some(l => l.user_id === userId && l.prayed_date === today);
    const partnerPrayedToday = logs.some(l => l.user_id === partnerId && l.prayed_date === today);

    // Partnership streak: consecutive days BOTH prayed
    const myDates = new Set(logs.filter(l => l.user_id === userId).map(l => l.prayed_date));
    const partnerDates = new Set(logs.filter(l => l.user_id === partnerId).map(l => l.prayed_date));
    const bothDates = [...myDates].filter(d => partnerDates.has(d)).sort().reverse();

    let streak = 0;
    if (bothDates.length > 0) {
      const d = new Date();
      const yd = new Date(); yd.setDate(yd.getDate() - 1);
      const todayStr = getTodayString();
      const yesterdayStr = `${yd.getFullYear()}-${String(yd.getMonth() + 1).padStart(2, '0')}-${String(yd.getDate()).padStart(2, '0')}`;

      if (bothDates[0] === todayStr || bothDates[0] === yesterdayStr) {
        streak = 1;
        for (let i = 1; i < bothDates.length; i++) {
          const prev = new Date(bothDates[i - 1]);
          const curr = new Date(bothDates[i]);
          if ((prev - curr) / 86400000 === 1) streak++;
          else break;
        }
      }
    }

    // Milestone
    const MILESTONES = [
      { days: 7, label: 'One week together 🕯' },
      { days: 14, label: 'Two weeks faithful 🔥' },
      { days: 30, label: '30 days of prayer 💛' },
      { days: 60, label: 'Two months strong ⭐' },
      { days: 100, label: '100 days — prayer warriors 👑' },
    ];
    const milestone = MILESTONES.filter(m => m.days <= streak).pop() || null;

    const requests = sharedRequests.filter(r => r.partnership_id === partnership.id);
    const activeRequests = requests.filter(r => r.status === 'active');

    return {
      partnerId,
      partnerName: partnerName || 'Prayer Partner',
      myPrayedToday,
      partnerPrayedToday,
      streak,
      milestone,
      requests,
      activeRequests,
      partnerSince: partnership.accepted_at || partnership.created_at,
    };
  }, [userId, prayerLogs, sharedRequests]);

  return {
    partnerships,
    pendingInvites,
    invitePartner,
    acceptPartnership,
    declinePartnership,
    cancelInvite,
    endPartnership,
    logPartnershipPrayer,
    sendEncouragement,
    addSharedRequest,
    markRequestAnswered,
    getPartnershipData,
  };
}

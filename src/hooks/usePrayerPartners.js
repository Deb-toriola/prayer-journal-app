import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { sendNotification } from '../utils/sendNotification';

export function usePrayerPartners(userId, userEmail, userDisplayName) {
  const [pendingInvites, setPendingInvites] = useState([]);

  // On login: claim invites sent to this email + fetch pending ones
  const claimAndFetchInvites = async () => {
    if (!userId || !userEmail) return;
    try {
      const { data, error } = await supabase.rpc('claim_partner_invites');
      if (error) { console.error('claim_partner_invites error:', error.message); return; }
      setPendingInvites(data || []);
    } catch (err) {
      console.error('claimAndFetchInvites error:', err.message);
    }
  };

  useEffect(() => {
    claimAndFetchInvites();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, userEmail]);

  // Real-time: watch for new invites where invitee_id = userId
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`partner-invites-${userId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'prayer_partner_invites',
        filter: `invitee_id=eq.${userId}`,
      }, () => claimAndFetchInvites())
      .subscribe();
    return () => supabase.removeChannel(channel);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Send an invite to someone by email
  const invitePartner = async (prayerId, prayerTitle, inviteeEmail) => {
    if (!userId) return { error: 'Not signed in' };
    const normalizedEmail = inviteeEmail.trim().toLowerCase();
    if (normalizedEmail === userEmail?.toLowerCase()) return { error: "You can't invite yourself." };

    // Check for duplicate
    const { data: existing } = await supabase
      .from('prayer_partner_invites')
      .select('id, status')
      .eq('prayer_id', prayerId)
      .eq('invitee_email', normalizedEmail)
      .maybeSingle();

    if (existing) {
      if (existing.status === 'pending') return { error: 'An invite is already pending for this email.' };
      if (existing.status === 'accepted') return { error: 'This person is already a prayer partner for this request.' };
    }

    const { error } = await supabase.from('prayer_partner_invites').insert({
      prayer_id: prayerId,
      prayer_title: prayerTitle,
      inviter_id: userId,
      inviter_name: userDisplayName || userEmail?.split('@')[0] || 'A friend',
      invitee_email: normalizedEmail,
      status: 'pending',
    });

    if (error) return { error: 'Failed to send invite. Please try again.' };
    return { success: true };
  };

  // Accept an invite
  const acceptInvite = async (invite) => {
    const { error } = await supabase
      .from('prayer_partner_invites')
      .update({ status: 'accepted' })
      .eq('id', invite.id);
    if (error) { console.error('acceptInvite error:', error.message); return; }

    setPendingInvites(prev => prev.filter(i => i.id !== invite.id));

    // Notify inviter — metadata carries prayerId + partnerName so the inviter can add them locally
    const displayName = userDisplayName || userEmail?.split('@')[0] || 'Your contact';
    await sendNotification(
      invite.inviter_id,
      'partner_accepted',
      'Prayer partner accepted 🤝',
      `${displayName} accepted your invite to pray for "${invite.prayer_title}"`,
      { prayerId: invite.prayer_id, partnerName: displayName, partnerUserId: userId }
    );
  };

  // Decline an invite
  const declineInvite = async (invite) => {
    const { error } = await supabase
      .from('prayer_partner_invites')
      .update({ status: 'declined' })
      .eq('id', invite.id);
    if (error) { console.error('declineInvite error:', error.message); return; }

    setPendingInvites(prev => prev.filter(i => i.id !== invite.id));

    await sendNotification(
      invite.inviter_id,
      'partner_declined',
      'Prayer partner invite declined',
      `Your invite for "${invite.prayer_title}" was not accepted`,
      { prayerId: invite.prayer_id }
    );
  };

  return { pendingInvites, invitePartner, acceptInvite, declineInvite };
}

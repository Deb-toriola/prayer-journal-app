import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { sendNotification } from '../utils/sendNotification';

const today = () => new Date().toISOString().split('T')[0];

export function useGroups(userId) {
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [members, setMembers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const channelsRef = useRef([]);

  // ── Fetch all groups this user belongs to ──────────────
  const fetchGroups = async () => {
    if (!userId) { setGroups([]); return; }
    const { data, error } = await supabase
      .from('group_members')
      .select('role, joined_at, status, prayer_groups(*)')
      .eq('user_id', userId);
    if (error) { console.error('fetchGroups', error); return; }
    const parsed = (data || []).map(row => ({
      ...row.prayer_groups,
      role: row.role,
      joined_at: row.joined_at,
      myStatus: row.status || 'approved',
    }));
    setGroups(parsed);
    if (parsed.length > 0 && !activeGroupId) {
      const firstApproved = parsed.find(g => g.myStatus === 'approved') || parsed[0];
      setActiveGroupId(firstApproved.id);
    }
    if (parsed.length === 0) setActiveGroupId(null);
  };

  useEffect(() => {
    fetchGroups();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // ── Pending join requests across ALL admin groups ───────
  const fetchPendingCount = async () => {
    if (!userId) { setPendingCount(0); return; }
    // Get group IDs where I'm an approved admin
    const { data: adminGroups } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .eq('status', 'approved');
    if (!adminGroups?.length) { setPendingCount(0); return; }
    const groupIds = adminGroups.map(g => g.group_id);
    const { count } = await supabase
      .from('group_members')
      .select('id', { count: 'exact', head: true })
      .in('group_id', groupIds)
      .eq('status', 'pending');
    setPendingCount(count || 0);
  };

  useEffect(() => {
    fetchPendingCount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, groups]);

  // Real-time: two subscriptions for membership changes
  // 1. Unfiltered — lets admins see new JOIN requests so the pending badge updates
  // 2. Filtered by user_id — catches THIS user's own status changing (pending→approved/rejected)
  //    and refreshes fetchGroups() so activeGroup.myStatus is no longer stale
  useEffect(() => {
    if (!userId) return;

    const chGlobal = supabase
      .channel(`pending-watch-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'group_members',
      }, () => fetchPendingCount())
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'group_members',
      }, () => fetchPendingCount())
      .on('postgres_changes', {
        event: 'DELETE', schema: 'public', table: 'group_members',
      }, () => fetchPendingCount())
      .subscribe();

    // Catch changes to THIS user's own membership rows (approved / rejected / removed)
    const chMyStatus = supabase
      .channel(`my-membership-${userId}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'group_members',
        filter: `user_id=eq.${userId}`,
      }, () => { fetchGroups(); fetchPendingCount(); })
      .on('postgres_changes', {
        event: 'DELETE', schema: 'public', table: 'group_members',
        filter: `user_id=eq.${userId}`,
      }, () => { fetchGroups(); fetchPendingCount(); })
      .subscribe();

    return () => {
      supabase.removeChannel(chGlobal);
      supabase.removeChannel(chMyStatus);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // ── Fetch members for active group ─────────────────────
  const fetchMembers = async (groupId) => {
    const id = groupId || activeGroupId;
    if (!id) { setMembers([]); return; }
    const { data, error } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', id)
      .order('joined_at');
    if (error) { console.error('fetchMembers failed:', error.message); return; }
    setMembers(data || []);
  };

  // ── Fetch logs for active group ────────────────────────
  const fetchLogs = async (groupId) => {
    const id = groupId || activeGroupId;
    if (!id) { setLogs([]); return; }
    const { data, error } = await supabase
      .from('group_prayer_logs')
      .select('*')
      .eq('group_id', id)
      .order('logged_at', { ascending: false });
    if (error) { console.error('fetchLogs failed:', error.message); return; }
    setLogs(data || []);
  };

  // ── Fetch posts for active group ───────────────────────
  const fetchPosts = async (groupId) => {
    const id = groupId || activeGroupId;
    if (!id) { setPosts([]); return; }
    const { data, error } = await supabase
      .from('group_posts')
      .select('*')
      .eq('group_id', id)
      .order('created_at', { ascending: false });
    if (error) { console.error('fetchPosts failed:', error.message); return; }
    setPosts(data || []);
  };

  // ── Unsubscribe all real-time channels ─────────────────
  const clearChannels = () => {
    channelsRef.current.forEach(ch => supabase.removeChannel(ch));
    channelsRef.current = [];
  };

  // ── Subscribe to real-time updates for active group ────
  useEffect(() => {
    clearChannels();
    if (!activeGroupId) { setMembers([]); setLogs([]); setPosts([]); return; }

    setLoading(true);
    Promise.all([
      fetchMembers(activeGroupId),
      fetchLogs(activeGroupId),
      fetchPosts(activeGroupId),
    ]).finally(() => setLoading(false));

    const chMembers = supabase
      .channel(`group-members-${activeGroupId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'group_members',
        filter: `group_id=eq.${activeGroupId}`,
      }, () => { fetchMembers(activeGroupId); fetchPendingCount(); })
      .subscribe();

    const chLogs = supabase
      .channel(`group-logs-${activeGroupId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'group_prayer_logs',
        filter: `group_id=eq.${activeGroupId}`,
      }, () => fetchLogs(activeGroupId))
      .subscribe();

    const chPosts = supabase
      .channel(`group-posts-${activeGroupId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'group_posts',
        filter: `group_id=eq.${activeGroupId}`,
      }, () => fetchPosts(activeGroupId))
      .subscribe();

    channelsRef.current = [chMembers, chLogs, chPosts];

    return () => clearChannels();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGroupId]);

  // ── Computed member stats ──────────────────────────────
  const memberStats = members.map(m => {
    const memberLogs = logs.filter(l => l.user_id === m.user_id);
    const totalMinutes = memberLogs.reduce((sum, l) => sum + l.minutes, 0);
    const todayMinutes = memberLogs
      .filter(l => l.session_date === today())
      .reduce((sum, l) => sum + l.minutes, 0);
    const lastLog = memberLogs[0] || null;
    return { ...m, totalMinutes, todayMinutes, lastLog };
  }).sort((a, b) => b.totalMinutes - a.totalMinutes);

  const totalGroupMinutes = logs.reduce((sum, l) => sum + l.minutes, 0);
  const todayGroupMinutes = logs
    .filter(l => l.session_date === today())
    .reduce((sum, l) => sum + l.minutes, 0);

  // ── Active group object ────────────────────────────────
  const activeGroup = groups.find(g => g.id === activeGroupId) || null;
  const myMember = members.find(m => m.user_id === userId) || null;
  const isAdmin = myMember?.role === 'admin';
  // Use ?? so fresh myMember.status takes priority over possibly-stale activeGroup.myStatus
  const isPending = (myMember?.status ?? activeGroup?.myStatus) === 'pending';

  // ── Actions ────────────────────────────────────────────
  const createGroup = async (name, description, displayName) => {
    if (!userId) return null;
    const { data: group, error: gErr } = await supabase
      .from('prayer_groups')
      .insert({ name, description, created_by: userId })
      .select()
      .single();
    if (gErr) { console.error('createGroup', gErr); return null; }

    const { error: mErr } = await supabase
      .from('group_members')
      .insert({ group_id: group.id, user_id: userId, display_name: displayName, role: 'admin', status: 'approved' });
    if (mErr) { console.error('createGroup member', mErr); return null; }

    await fetchGroups();
    setActiveGroupId(group.id);
    return group;
  };

  const GROUP_MAX = 10;

  const joinGroup = async (inviteCode, displayName) => {
    if (!userId) return { error: 'Not signed in' };
    const { data: group, error: gErr } = await supabase
      .from('prayer_groups')
      .select('*')
      .eq('invite_code', inviteCode.trim().toLowerCase())
      .single();
    if (gErr || !group) return { error: 'Group not found. Check the invite code.' };

    const { data: existing } = await supabase
      .from('group_members')
      .select('id, status')
      .eq('group_id', group.id)
      .eq('user_id', userId)
      .maybeSingle();
    if (existing) {
      if (existing.status === 'pending') return { error: 'Your request is still pending admin approval.' };
      return { error: 'You are already in this group.' };
    }

    // Check member cap
    const { count: approvedCount } = await supabase
      .from('group_members')
      .select('id', { count: 'exact', head: true })
      .eq('group_id', group.id)
      .eq('status', 'approved');
    if ((approvedCount || 0) >= GROUP_MAX) return { error: `This group is full (${GROUP_MAX} members max).` };

    const { error: mErr } = await supabase
      .from('group_members')
      .insert({ group_id: group.id, user_id: userId, display_name: displayName, role: 'member', status: 'pending' });
    if (mErr) return { error: 'Failed to join group. Please try again.' };

    await fetchGroups();
    setActiveGroupId(group.id);
    return { group, pending: true };
  };

  const approveMember = async (memberId) => {
    if (!isAdmin) return { error: 'Not authorized' };
    // Check cap before approving
    const approvedCount = members.filter(m => m.status === 'approved').length;
    if (approvedCount >= GROUP_MAX) {
      return { error: `Group is full (${GROUP_MAX}/${GROUP_MAX} members). Remove someone first.` };
    }
    // Capture member before updating (to notify them)
    const member = members.find(m => m.id === memberId);

    const { error } = await supabase
      .from('group_members')
      .update({ status: 'approved' })
      .eq('id', memberId)
      .eq('group_id', activeGroupId);

    if (!error) {
      fetchMembers(activeGroupId);
      fetchPendingCount();
      // Notify the approved user
      if (member?.user_id && activeGroup?.name) {
        await sendNotification(
          member.user_id,
          'group_approved',
          'Group request approved ✅',
          `You've been approved to join "${activeGroup.name}". Welcome! 🙏`,
          { groupId: activeGroupId, groupName: activeGroup.name }
        );
      }
      return { success: true };
    }
    return { error: 'Failed to approve member.' };
  };

  const rejectMember = async (memberId) => {
    if (!isAdmin) return;
    const member = members.find(m => m.id === memberId);
    try {
      const { error } = await supabase.from('group_members').delete().eq('id', memberId).eq('group_id', activeGroupId);
      if (error) { console.error('rejectMember failed:', error.message); return; }
      fetchMembers(activeGroupId);
      fetchPendingCount();
      // Notify the rejected user
      if (member?.user_id && activeGroup?.name) {
        await sendNotification(
          member.user_id,
          'group_rejected',
          'Group request not approved',
          `Your request to join "${activeGroup.name}" was not approved at this time.`,
          { groupId: activeGroupId, groupName: activeGroup.name }
        );
      }
    } catch (err) { console.error('rejectMember error:', err.message); }
  };

  // Admin: add a member directly by email (no invite code needed)
  const addMemberDirect = async (email, displayName) => {
    if (!isAdmin || !activeGroupId) return { error: 'Not authorized' };
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) return { error: 'Please enter an email address.' };

    // Look up user ID by email using a SECURITY DEFINER function
    const { data: targetUserId, error: lookupError } = await supabase
      .rpc('get_user_id_by_email', { lookup_email: trimmedEmail });

    if (lookupError || !targetUserId) {
      return { error: 'No account found with that email. They need to sign up first.' };
    }

    const { data: existing } = await supabase
      .from('group_members')
      .select('id, status')
      .eq('group_id', activeGroupId)
      .eq('user_id', targetUserId)
      .maybeSingle();

    if (existing) {
      return { error: existing.status === 'pending' ? 'This person already has a pending request.' : 'This person is already a member.' };
    }

    // Check cap before direct-adding
    const approvedCount = members.filter(m => m.status === 'approved').length;
    if (approvedCount >= GROUP_MAX) {
      return { error: `This group is full (${GROUP_MAX} members max). Remove someone first.` };
    }

    const name = displayName?.trim() || trimmedEmail.split('@')[0];
    const { error } = await supabase.from('group_members').insert({
      group_id: activeGroupId,
      user_id: targetUserId,
      display_name: name,
      role: 'member',
      status: 'approved',
    });

    if (error) return { error: 'Failed to add member. Please try again.' };

    await sendNotification(
      targetUserId,
      'group_approved',
      'Added to prayer group 🙏',
      `You've been added to "${activeGroup.name}" by the group admin.`,
      { groupId: activeGroupId, groupName: activeGroup.name }
    );

    fetchMembers(activeGroupId);
    return { success: true };
  };

  const leaveGroup = async (groupId) => {
    if (!userId) return;
    try {
      const { error } = await supabase.from('group_members').delete().eq('group_id', groupId).eq('user_id', userId);
      if (error) { console.error('leaveGroup failed:', error.message); return; }
      setActiveGroupId(null);
      await fetchGroups();
    } catch (err) { console.error('leaveGroup error:', err.message); }
  };

  const deleteGroup = async (groupId) => {
    if (!isAdmin || !userId) return;
    try {
      const { error } = await supabase.from('prayer_groups').delete().eq('id', groupId).eq('created_by', userId);
      if (error) { console.error('deleteGroup failed:', error.message); return; }
      setActiveGroupId(null);
      await fetchGroups();
    } catch (err) { console.error('deleteGroup error:', err.message); }
  };

  const updateGroupFocus = async (groupId, focus, scripture) => {
    if (!isAdmin) return;
    const { error } = await supabase
      .from('prayer_groups')
      .update({ focus, scripture })
      .eq('id', groupId);
    if (!error) {
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, focus, scripture } : g));
    }
  };

  const logTime = async (groupId, minutes) => {
    if (!userId || minutes < 1) return;
    const tempLog = { id: `temp-${Date.now()}`, group_id: groupId, user_id: userId, minutes, session_date: today(), logged_at: new Date().toISOString() };
    setLogs(prev => [tempLog, ...prev]);
    const { error } = await supabase.from('group_prayer_logs').insert({
      group_id: groupId,
      user_id: userId,
      minutes,
      session_date: today(),
    });
    if (error) {
      setLogs(prev => prev.filter(l => l.id !== tempLog.id));
    }
  };

  const addPost = async (groupId, content, type = 'note') => {
    if (!userId || !myMember) return;
    const tempPost = {
      id: `temp-${Date.now()}`,
      group_id: groupId,
      user_id: userId,
      display_name: myMember.display_name,
      type,
      content,
      created_at: new Date().toISOString(),
    };
    setPosts(prev => [tempPost, ...prev]);
    const { error } = await supabase.from('group_posts').insert({
      group_id: groupId,
      user_id: userId,
      display_name: myMember.display_name,
      type,
      content,
    });
    if (error) {
      setPosts(prev => prev.filter(p => p.id !== tempPost.id));
    }
  };

  // ── Promote a member to co-admin ──────────────────────
  const promoteToAdmin = async (memberId) => {
    if (!isAdmin) return { error: 'Not authorized' };
    const { error } = await supabase
      .from('group_members')
      .update({ role: 'admin' })
      .eq('id', memberId)
      .eq('group_id', activeGroupId);
    if (error) return { error: error.message };
    fetchMembers(activeGroupId);
    return { success: true };
  };

  // ── Demote an admin back to member ────────────────────
  const demoteToMember = async (memberId) => {
    if (!isAdmin) return { error: 'Not authorized' };
    // Prevent stranding the group with no admin
    const adminCount = members.filter(m => m.role === 'admin' && m.status === 'approved').length;
    if (adminCount <= 1) return { error: 'Cannot remove the only admin. Promote someone else first.' };
    const { error } = await supabase
      .from('group_members')
      .update({ role: 'member' })
      .eq('id', memberId)
      .eq('group_id', activeGroupId);
    if (error) return { error: error.message };
    fetchMembers(activeGroupId);
    return { success: true };
  };

  const deletePost = async (postId) => {
    if (!userId) return;
    setPosts(prev => prev.filter(p => p.id !== postId));
    try {
      const { error } = await supabase.from('group_posts').delete().eq('id', postId).eq('user_id', userId);
      if (error) console.error('deletePost failed:', error.message);
    } catch (err) { console.error('deletePost error:', err.message); }
  };

  return {
    groups,
    activeGroupId, setActiveGroupId,
    activeGroup,
    members: memberStats,
    logs,
    posts,
    loading,
    totalGroupMinutes,
    todayGroupMinutes,
    isAdmin,
    isPending,
    myMember,
    pendingCount,
    createGroup,
    joinGroup,
    leaveGroup,
    deleteGroup,
    updateGroupFocus,
    logTime,
    addPost,
    deletePost,
    approveMember,
    rejectMember,
    addMemberDirect,
    promoteToAdmin,
    demoteToMember,
    groupMax: GROUP_MAX,
    fetchPosts: () => fetchPosts(activeGroupId),
  };
}

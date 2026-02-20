import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const today = () => new Date().toISOString().split('T')[0];

export function useGroups(userId) {
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [members, setMembers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const channelsRef = useRef([]);

  // ── Fetch all groups this user belongs to ──────────────
  const fetchGroups = async () => {
    if (!userId) { setGroups([]); return; }
    const { data, error } = await supabase
      .from('group_members')
      .select('role, joined_at, prayer_groups(*)')
      .eq('user_id', userId);
    if (error) { console.error('fetchGroups', error); return; }
    const parsed = (data || []).map(row => ({
      ...row.prayer_groups,
      role: row.role,
      joined_at: row.joined_at,
    }));
    setGroups(parsed);
    // Auto-select first group if none active
    if (parsed.length > 0 && !activeGroupId) {
      setActiveGroupId(parsed[0].id);
    }
    if (parsed.length === 0) {
      setActiveGroupId(null);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [userId]);

  // ── Fetch members for active group ─────────────────────
  const fetchMembers = async (groupId) => {
    const id = groupId || activeGroupId;
    if (!id) { setMembers([]); return; }
    const { data } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', id)
      .order('joined_at');
    setMembers(data || []);
  };

  // ── Fetch logs for active group ────────────────────────
  const fetchLogs = async (groupId) => {
    const id = groupId || activeGroupId;
    if (!id) { setLogs([]); return; }
    const { data } = await supabase
      .from('group_prayer_logs')
      .select('*')
      .eq('group_id', id)
      .order('logged_at', { ascending: false });
    setLogs(data || []);
  };

  // ── Fetch posts for active group ───────────────────────
  const fetchPosts = async (groupId) => {
    const id = groupId || activeGroupId;
    if (!id) { setPosts([]); return; }
    const { data } = await supabase
      .from('group_posts')
      .select('*')
      .eq('group_id', id)
      .order('created_at', { ascending: false });
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
      }, () => fetchMembers(activeGroupId))
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
      .insert({ group_id: group.id, user_id: userId, display_name: displayName, role: 'admin' });
    if (mErr) { console.error('createGroup member', mErr); return null; }

    await fetchGroups();
    setActiveGroupId(group.id);
    return group;
  };

  const joinGroup = async (inviteCode, displayName) => {
    if (!userId) return { error: 'Not signed in' };
    // Look up group by invite code
    const { data: group, error: gErr } = await supabase
      .from('prayer_groups')
      .select('*')
      .eq('invite_code', inviteCode.trim().toLowerCase())
      .single();
    if (gErr || !group) return { error: 'Group not found. Check the invite code.' };

    // Check already a member
    const { data: existing } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', group.id)
      .eq('user_id', userId)
      .single();
    if (existing) return { error: 'You are already in this group.' };

    const { error: mErr } = await supabase
      .from('group_members')
      .insert({ group_id: group.id, user_id: userId, display_name: displayName, role: 'member' });
    if (mErr) return { error: 'Failed to join group. Please try again.' };

    await fetchGroups();
    setActiveGroupId(group.id);
    return { group };
  };

  const leaveGroup = async (groupId) => {
    if (!userId) return;
    await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);
    setActiveGroupId(null);
    await fetchGroups();
  };

  const deleteGroup = async (groupId) => {
    await supabase.from('prayer_groups').delete().eq('id', groupId);
    setActiveGroupId(null);
    await fetchGroups();
  };

  const updateGroupFocus = async (groupId, focus, scripture) => {
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
    await supabase.from('group_prayer_logs').insert({
      group_id: groupId,
      user_id: userId,
      minutes,
      session_date: today(),
    });
  };

  const addPost = async (groupId, content, type = 'note') => {
    if (!userId || !myMember) return;
    await supabase.from('group_posts').insert({
      group_id: groupId,
      user_id: userId,
      display_name: myMember.display_name,
      type,
      content,
    });
  };

  const deletePost = async (postId) => {
    await supabase.from('group_posts').delete().eq('id', postId);
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
    myMember,
    createGroup,
    joinGroup,
    leaveGroup,
    deleteGroup,
    updateGroupFocus,
    logTime,
    addPost,
    deletePost,
  };
}

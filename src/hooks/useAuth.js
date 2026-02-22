import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    setError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); return false; }
    // If session is returned immediately, user is already signed in (email confirm OFF)
    if (data?.session) {
      setUser(data.session.user);
    }
    return true;
  };

  const signIn = async (email, password) => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); return false; }
    return true;
  };

  const signOut = async () => {
    setError(null);
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
  };

  const resetPassword = async (email) => {
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) { setError(error.message); return false; }
    return true;
  };

  const clearError = () => setError(null);

  const deleteAccount = async () => {
    if (!user) return false;
    setError(null);
    const uid = user.id;
    try {
      // Delete all user data from every table (cascade)
      await Promise.all([
        supabase.from('prayers').delete().eq('user_id', uid),
        supabase.from('settings').delete().eq('user_id', uid),
        supabase.from('prayer_plans').delete().eq('user_id', uid),
        supabase.from('weekly_projects').delete().eq('user_id', uid),
        supabase.from('daily_checkins').delete().eq('user_id', uid),
        supabase.from('categories').delete().eq('user_id', uid),
        supabase.from('intercede_requests').delete().eq('user_id', uid),
        supabase.from('intercede_prayers').delete().eq('user_id', uid),
        supabase.from('community_members').delete().eq('user_id', uid),
        supabase.from('community_sessions').delete().eq('user_id', uid),
        supabase.from('user_stats').delete().eq('user_id', uid),
        supabase.from('group_members').delete().eq('user_id', uid),
        supabase.from('group_prayer_logs').delete().eq('user_id', uid),
        supabase.from('group_posts').delete().eq('user_id', uid),
      ]);
      // Clear all local data
      localStorage.clear();
      // Sign out (auth record deletion requires server-side admin — handled post-launch)
      await supabase.auth.signOut();
      return true;
    } catch (err) {
      setError('Failed to delete account. Please try again.');
      return false;
    }
  };

  return { user, loading, error, signUp, signIn, signOut, resetPassword, clearError, deleteAccount };
}

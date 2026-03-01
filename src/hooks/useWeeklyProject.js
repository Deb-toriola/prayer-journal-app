import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_PROJECT = { title: '', content: '', lastUpdated: null };

export function useWeeklyProject(userId) {
  const [project, setProject] = useState(DEFAULT_PROJECT);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('weekly_projects')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) { console.error('useWeeklyProject fetch failed:', error.message); return; }
        if (data) {
          setProject({ title: data.title || '', content: data.content || '', lastUpdated: data.updated_at });
        }
      });
  }, [userId]);

  const updateProject = useCallback((updates) => {
    const now = new Date().toISOString();
    setProject((prev) => {
      const next = { ...prev, ...updates, lastUpdated: now };
      if (userId) {
        supabase.from('weekly_projects').upsert({
          user_id: userId,
          title: next.title || '',
          content: next.content || '',
          updated_at: now,
        }).then(({ error }) => {
          if (error) console.error('updateProject failed:', error.message);
        });
      }
      return next;
    });
  }, [userId]);

  return { project, updateProject };
}

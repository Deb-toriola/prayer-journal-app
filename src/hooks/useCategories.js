import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { DEFAULT_CATEGORIES } from '../utils/constants';

export function useCategories(userId) {
  const [customCategories, setCustomCategories] = useState([]);

  useEffect(() => {
    if (!userId) return;
    supabase.from('categories').select('*').eq('user_id', userId)
      .then(({ data, error }) => {
        if (error) { console.error('fetchCategories failed:', error.message); return; }
        if (data) setCustomCategories(data.map(r => ({ value: r.value, label: r.label, color: r.color, isDefault: false, id: r.id })));
      });
  }, [userId]);

  const allCategories = useMemo(() => [...DEFAULT_CATEGORIES, ...customCategories], [customCategories]);

  const addCategory = useCallback(async (label, color) => {
    const value = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const exists = DEFAULT_CATEGORIES.some((c) => c.value === value) || customCategories.some((c) => c.value === value);
    if (exists) return null;
    const newCat = { value, label: label.trim(), color, isDefault: false };
    setCustomCategories((prev) => [...prev, newCat]);
    if (userId) {
      try {
        const { data, error } = await supabase.from('categories').insert({ user_id: userId, value, label: label.trim(), color }).select().single();
        if (error) { console.error('addCategory failed:', error.message); }
        else if (data) setCustomCategories((prev) => prev.map(c => c.value === value ? { ...c, id: data.id } : c));
      } catch (err) { console.error('addCategory error:', err.message); }
    }
    return newCat;
  }, [customCategories, userId]);

  const deleteCategory = useCallback(async (value) => {
    const cat = customCategories.find(c => c.value === value);
    setCustomCategories((prev) => prev.filter((c) => c.value !== value));
    if (userId && cat?.id) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', cat.id);
        if (error) console.error('deleteCategory failed:', error.message);
      } catch (err) { console.error('deleteCategory error:', err.message); }
    }
  }, [customCategories, userId]);

  return { allCategories, customCategories, addCategory, deleteCategory };
}

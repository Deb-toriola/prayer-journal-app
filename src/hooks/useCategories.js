import { useState, useEffect, useCallback, useMemo } from 'react';
import { loadCustomCategories, saveCustomCategories } from '../utils/storage';
import { DEFAULT_CATEGORIES } from '../utils/constants';

export function useCategories() {
  const [customCategories, setCustomCategories] = useState(() => loadCustomCategories());

  useEffect(() => {
    saveCustomCategories(customCategories);
  }, [customCategories]);

  const allCategories = useMemo(
    () => [...DEFAULT_CATEGORIES, ...customCategories],
    [customCategories]
  );

  const addCategory = useCallback((label, color) => {
    const value = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const exists = DEFAULT_CATEGORIES.some((c) => c.value === value) ||
                   customCategories.some((c) => c.value === value);
    if (exists) return null;

    const newCat = { value, label: label.trim(), color, isDefault: false };
    setCustomCategories((prev) => [...prev, newCat]);
    return newCat;
  }, [customCategories]);

  const deleteCategory = useCallback((value) => {
    setCustomCategories((prev) => prev.filter((c) => c.value !== value));
  }, []);

  return { allCategories, customCategories, addCategory, deleteCategory };
}

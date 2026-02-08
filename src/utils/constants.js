export const DEFAULT_CATEGORIES = [
  { value: 'personal', label: 'Personal', color: '#8B5CF6', isDefault: true },
  { value: 'family', label: 'Family', color: '#A855F7', isDefault: true },
  { value: 'health', label: 'Health', color: '#C084FC', isDefault: true },
  { value: 'gratitude', label: 'Gratitude', color: '#D946EF', isDefault: true },
  { value: 'guidance', label: 'Guidance', color: '#7C3AED', isDefault: true },
  { value: 'others', label: 'Others', color: '#9333EA', isDefault: true },
];

// Keep backward compat
export const CATEGORIES = DEFAULT_CATEGORIES;

// Color palette for custom categories
export const CATEGORY_COLORS = [
  '#8B5CF6', '#A855F7', '#C084FC', '#D946EF', '#7C3AED', '#9333EA',
  '#EC4899', '#F43F5E', '#EF4444', '#F97316', '#FBBF24', '#84CC16',
  '#22C55E', '#14B8A6', '#06B6D4', '#3B82F6', '#6366F1', '#78716C',
];

export function getCategoryByValue(value, allCategories) {
  const list = allCategories || DEFAULT_CATEGORIES;
  return list.find((c) => c.value === value) || { value, label: value, color: '#9333EA', isDefault: false };
}

export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  return formatDate(isoString);
}

export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

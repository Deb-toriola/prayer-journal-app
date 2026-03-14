export const DEFAULT_CATEGORIES = [
  { value: 'personal',  label: 'Personal',  color: '#8b5a2b', isDefault: true }, // warm brown
  { value: 'family',    label: 'Family',    color: '#a06030', isDefault: true }, // amber
  { value: 'health',    label: 'Health',    color: '#6b7a3a', isDefault: true }, // muted olive
  { value: 'gratitude', label: 'Gratitude', color: '#c9820a', isDefault: true }, // gold
  { value: 'guidance',  label: 'Guidance',  color: '#5a6ea0', isDefault: true }, // muted blue (intentional contrast)
  { value: 'others',    label: 'Others',    color: '#7a6a5a', isDefault: true }, // warm grey
];

// Keep backward compat
export const CATEGORIES = DEFAULT_CATEGORIES;

// Color palette for custom categories — warm/earthy tones on-brand
export const CATEGORY_COLORS = [
  '#8b5a2b', '#a06030', '#b87040', '#c9820a', '#6b7a3a', '#5a8050',
  '#5a6ea0', '#7a6a5a', '#a05050', '#c05030', '#8b4a00', '#6b5a80',
  '#4a7090', '#7a9060', '#b04060', '#805070', '#6b4030', '#909090',
];

export function getCategoryByValue(value, allCategories) {
  const list = allCategories || DEFAULT_CATEGORIES;
  return list.find((c) => c.value === value) || { value, label: value, color: '#D4891A', isDefault: false };
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

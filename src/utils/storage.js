// Secure-context-safe UUID generator (crypto.randomUUID requires HTTPS/localhost)
export function generateId() {
  try {
    return crypto.randomUUID();
  } catch {
    // Fallback for non-secure contexts (e.g. HTTP on LAN)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

const PRAYERS_KEY = 'prayer-journal-prayers';
const WEEKLY_PROJECT_KEY = 'prayer-journal-weekly-project';
const CUSTOM_CATEGORIES_KEY = 'prayer-journal-custom-categories';
const STREAK_KEY = 'prayer-journal-streak';
const NOTIFICATION_KEY = 'prayer-journal-notifications';

// --- Prayers ---
export function loadPrayers() {
  try {
    const data = localStorage.getItem(PRAYERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePrayers(prayers) {
  try {
    localStorage.setItem(PRAYERS_KEY, JSON.stringify(prayers));
  } catch (e) {
    console.error('Failed to save prayers:', e);
  }
}

// --- Weekly Project ---
export function loadWeeklyProject() {
  try {
    const data = localStorage.getItem(WEEKLY_PROJECT_KEY);
    return data
      ? JSON.parse(data)
      : { title: '', content: '', lastUpdated: null };
  } catch {
    return { title: '', content: '', lastUpdated: null };
  }
}

export function saveWeeklyProject(project) {
  try {
    localStorage.setItem(WEEKLY_PROJECT_KEY, JSON.stringify(project));
  } catch (e) {
    console.error('Failed to save weekly project:', e);
  }
}

// --- Custom Categories ---
export function loadCustomCategories() {
  try {
    const data = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCustomCategories(categories) {
  try {
    localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save custom categories:', e);
  }
}

// --- Streak Data ---
export function loadStreakData() {
  try {
    const data = localStorage.getItem(STREAK_KEY);
    return data
      ? JSON.parse(data)
      : { prayedDates: [], currentStreak: 0, longestStreak: 0 };
  } catch {
    return { prayedDates: [], currentStreak: 0, longestStreak: 0 };
  }
}

export function saveStreakData(streakData) {
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
  } catch (e) {
    console.error('Failed to save streak data:', e);
  }
}

// --- Notification Settings ---
export function loadNotificationSettings() {
  try {
    const data = localStorage.getItem(NOTIFICATION_KEY);
    return data
      ? JSON.parse(data)
      : { enabled: false, times: [{ hour: 7, minute: 0, label: 'Morning Prayer' }] };
  } catch {
    return { enabled: false, times: [{ hour: 7, minute: 0, label: 'Morning Prayer' }] };
  }
}

export function saveNotificationSettings(settings) {
  try {
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save notification settings:', e);
  }
}

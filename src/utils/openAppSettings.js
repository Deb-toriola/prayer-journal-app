// ── openAppSettings ────────────────────────────────────────────
// Opens the device's native app-settings page so the user can
// manually enable notification permission when the OS has blocked it.
// No-ops gracefully on the web (instructions are shown instead).

import { Capacitor } from '@capacitor/core';

export async function openAppSettings() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { App } = await import('@capacitor/app');
    const platform = Capacitor.getPlatform();

    if (platform === 'ios') {
      // Opens iOS Settings directly to this app's settings page
      await App.openUrl({ url: 'app-settings:' });
    } else if (platform === 'android') {
      // Opens Android App Info (Settings → Apps → My Prayer App)
      // User can then navigate to Notifications and enable them
      await App.openUrl({ url: 'package:com.myprayerapp.app' });
    }
  } catch {
    // If the URL scheme fails, the text instructions remain visible
  }
}

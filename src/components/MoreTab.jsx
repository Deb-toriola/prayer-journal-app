import { useState } from 'react';
import { FileDown, Bell, Settings, ChevronRight } from 'lucide-react';
import NotificationSettings from './NotificationSettings';
import SettingsPanel from './SettingsPanel';

export default function MoreTab({
  notifSettings,
  onToggleNotif,
  onAddTime,
  onRemoveTime,
  onUpdateTime,
  notificationSupported,
  prayers,
  onShowExport,
  appSettings,
  onUpdateSettings,
  user,
  onSignOut,
}) {
  const [showSettings, setShowSettings] = useState(false);

  if (showSettings) {
    return (
      <SettingsPanel
        settings={appSettings}
        onUpdate={onUpdateSettings}
        onClose={() => setShowSettings(false)}
        notifSettings={notifSettings}
        onToggleNotif={onToggleNotif}
        user={user}
        onSignOut={onSignOut}
      />
    );
  }

  return (
    <div className="more-tab">

      {/* Settings row — taps into full settings page */}
      <div className="more-menu-group">
        <button className="more-menu-row" onClick={() => setShowSettings(true)}>
          <div className="more-menu-icon more-menu-icon-settings">
            <Settings size={18} />
          </div>
          <div className="more-menu-text">
            <span className="more-menu-label">Settings</span>
            <span className="more-menu-sub">Theme, text size, home screen, account</span>
          </div>
          <ChevronRight size={16} className="more-menu-chevron" />
        </button>

        {notificationSupported && (
          <div className="more-section" style={{ marginTop: 12 }}>
            <div className="more-section-label">
              <Bell size={14} />
              Prayer Reminders
            </div>
            <NotificationSettings
              settings={notifSettings}
              onToggle={onToggleNotif}
              onAddTime={onAddTime}
              onRemoveTime={onRemoveTime}
              onUpdateTime={onUpdateTime}
              notificationSupported={notificationSupported}
            />
          </div>
        )}

        {prayers.length > 0 && (
          <div className="more-section" style={{ marginTop: 12 }}>
            <button className="btn-export" onClick={onShowExport}>
              <FileDown size={14} />
              <span>Export Prayer Journey</span>
            </button>
          </div>
        )}
      </div>

      <div className="more-app-info">
        <div className="more-app-flame">🔥</div>
        <p className="more-app-name">My Prayer App</p>
        <p className="more-app-sub">A sacred space for your conversations with God</p>
        <p className="more-app-version">v1.0.0</p>
      </div>
    </div>
  );
}

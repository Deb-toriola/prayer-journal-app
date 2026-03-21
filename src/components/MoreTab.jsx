import { useState } from 'react';
import { FileDown, Bell, Settings, ChevronRight, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import NotificationSettings from './NotificationSettings';
import SettingsPanel from './SettingsPanel';

export default function MoreTab({
  notifSettings,
  onToggleNotif,
  onAddTime,
  onRemoveTime,
  onUpdateTime,
  notificationSupported,
  notifPermission,
  notifIsNative,
  prayers,
  onShowExport,
  appSettings,
  onUpdateSettings,
  user,
  onSignOut,
  onSignIn,
  onSignUp,
  onDeleteAccount,
  onResetStreak,
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);

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
        onSignIn={onSignIn}
        onSignUp={onSignUp}
        onDeleteAccount={onDeleteAccount}
        onResetStreak={onResetStreak}
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

        {notifSettings && (
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
              permissionState={notifPermission}
              isNative={notifIsNative}
            />
          </div>
        )}

        <div className="more-section" style={{ marginTop: 12 }}>
          <button className="btn-export" onClick={onShowExport}>
            <FileDown size={14} />
            <span>Export Prayer Journey</span>
          </button>
        </div>
      </div>

      {/* What's New */}
      <div className="more-menu-group" style={{ marginTop: 12 }}>
        <button
          className="more-menu-row"
          onClick={() => setShowWhatsNew(v => !v)}
          style={{ borderRadius: showWhatsNew ? '12px 12px 0 0' : 12 }}
        >
          <div className="more-menu-icon" style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>
            <Sparkles size={18} />
          </div>
          <div className="more-menu-text">
            <span className="more-menu-label">What's New</span>
            <span className="more-menu-sub">Features &amp; coming soon</span>
          </div>
          {showWhatsNew ? <ChevronUp size={16} className="more-menu-chevron" /> : <ChevronDown size={16} className="more-menu-chevron" />}
        </button>

        {showWhatsNew && (
          <div className="whats-new-panel">
            <p className="whats-new-version">v1.0 — Now available</p>

            <ul className="whats-new-list">
              {[
                '📖 Prayer journal with categories &amp; scripture',
                '🔥 Daily streak tracking',
                '📅 Prayer plans (7, 14, 21 &amp; 30 day)',
                '🤝 Prayer groups &amp; group posts',
                '🌍 Community intercede feed',
                '👤 Guest mode — pray without signing in',
              ].map((item, i) => (
                <li key={i} className="whats-new-item">
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>

            {/* Coming Soon card */}
            <div className="whats-new-coming-soon">
              <div className="whats-new-coming-soon-badge">Coming Soon</div>
              <p className="whats-new-coming-soon-title">🤝 Intercede with Me</p>
              <p className="whats-new-coming-soon-sub">
                Match with a prayer partner and pray together in real time — live co-prayer with someone who believes alongside you.
              </p>
            </div>
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

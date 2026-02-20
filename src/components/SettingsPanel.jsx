import { useState } from 'react';
import { Sun, Moon, Type, Eye, EyeOff, Flame, Bell, BellOff, User, Target, ArrowLeft, ChevronRight, Lock, LogOut, LogIn, UserPlus, Trash2 } from 'lucide-react';
import AppIcon from './AppIcon';

function Toggle({ on, onToggle, disabled }) {
  return (
    <button
      className={`settings-toggle ${on ? 'settings-toggle-on' : ''} ${disabled ? 'settings-toggle-disabled' : ''}`}
      onClick={disabled ? undefined : onToggle}
      aria-label="Toggle"
    >
      <span className="settings-toggle-knob" />
    </button>
  );
}

function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="settings-segmented">
      {options.map(opt => (
        <button
          key={opt.value}
          className={`settings-segment ${value === opt.value ? 'settings-segment-active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SettingRow({ icon, label, sub, children, onClick, chevron, destructive }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag className={`setting-row ${onClick ? 'setting-row-tappable' : ''} ${destructive ? 'setting-row-destructive' : ''}`} onClick={onClick}>
      <div className="setting-row-icon">{icon}</div>
      <div className="setting-row-text">
        <span className="setting-row-label">{label}</span>
        {sub && <span className="setting-row-sub">{sub}</span>}
      </div>
      <div className="setting-row-control">
        {children}
        {chevron && <ChevronRight size={16} className="setting-row-chevron" />}
      </div>
    </Tag>
  );
}

function Group({ title, children }) {
  return (
    <div className="settings-group">
      <p className="settings-group-title">{title}</p>
      {children}
    </div>
  );
}

export default function SettingsPanel({ settings, onUpdate, onClose, notifSettings, onToggleNotif, user, onSignOut, onSignIn, onSignUp, onDeleteAccount }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    await onDeleteAccount?.();
    setDeleting(false);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-page-header">
        <button className="settings-back-btn" onClick={onClose} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h2 className="settings-page-title">Settings</h2>
      </div>

      <div className="settings-page-body">

        {/* Appearance */}
        <Group title="Appearance">
          <SettingRow
            icon={settings.theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            label="Theme"
            sub={settings.theme === 'dark' ? 'Dark mode' : 'Light mode'}
          >
            <SegmentedControl
              options={[{ value: 'dark', label: '🌙 Dark' }, { value: 'light', label: '☀️ Light' }]}
              value={settings.theme}
              onChange={(v) => onUpdate({ theme: v })}
            />
          </SettingRow>
          <SettingRow
            icon={<Type size={16} />}
            label="Text size"
            sub="Adjusts reading size throughout"
          >
            <SegmentedControl
              options={[{ value: 'small', label: 'S' }, { value: 'medium', label: 'M' }, { value: 'large', label: 'L' }]}
              value={settings.fontSize}
              onChange={(v) => onUpdate({ fontSize: v })}
            />
          </SettingRow>
        </Group>

        {/* Home screen */}
        <Group title="Home Screen">
          <SettingRow
            icon={<Flame size={16} />}
            label="Show streak stats"
            sub="Daily streak, best, days prayed"
          >
            <Toggle on={settings.showStreak !== false} onToggle={() => onUpdate({ showStreak: !settings.showStreak })} />
          </SettingRow>
          <SettingRow
            icon={settings.showNeglected !== false ? <Eye size={16} /> : <EyeOff size={16} />}
            label="Neglected prayer alerts"
            sub="Warn when prayers uncovered 3+ days"
          >
            <Toggle on={settings.showNeglected !== false} onToggle={() => onUpdate({ showNeglected: !settings.showNeglected })} />
          </SettingRow>
          <SettingRow
            icon={<Target size={16} />}
            label="Weekly Focus on Home"
            sub="Show your weekly prayer focus on the Home tab"
          >
            <Toggle
              on={settings.showWeeklyFocusOnHome === true}
              onToggle={() => onUpdate({ showWeeklyFocusOnHome: !settings.showWeeklyFocusOnHome })}
            />
          </SettingRow>
        </Group>

        {/* Notifications */}
        <Group title="Notifications">
          <SettingRow
            icon={notifSettings?.enabled ? <Bell size={16} /> : <BellOff size={16} />}
            label="Prayer reminders"
            sub={notifSettings?.enabled
              ? `${notifSettings.times?.length || 0} reminder${(notifSettings.times?.length || 0) !== 1 ? 's' : ''} set`
              : 'Tap to set up daily reminders'}
          >
            <Toggle
              on={notifSettings?.enabled || false}
              onToggle={onToggleNotif}
            />
          </SettingRow>
          <SettingRow
            icon={<Bell size={16} />}
            label="Community prayer alerts"
            sub="Notify when someone requests intercession"
          >
            <Toggle
              on={settings.communityAlerts === true}
              onToggle={() => onUpdate({ communityAlerts: !settings.communityAlerts })}
            />
          </SettingRow>
        </Group>

        {/* Account */}
        <Group title="Account">
          {user ? (
            <>
              <SettingRow
                icon={<User size={16} />}
                label="Signed in"
                sub={user.email}
              />
              <SettingRow
                icon={<Lock size={16} />}
                label="Privacy"
                sub="Your prayers are private and encrypted"
              />
              <SettingRow
                icon={<LogOut size={16} />}
                label="Sign out"
                sub="Your data stays on this device"
                onClick={onSignOut}
                chevron
              />
              <SettingRow
                icon={<Trash2 size={16} />}
                label="Delete account"
                sub="Permanently delete your account and all data"
                onClick={() => setShowDeleteConfirm(true)}
                chevron
                destructive
              />
            </>
          ) : (
            <>
              <SettingRow
                icon={<User size={16} />}
                label="Guest mode"
                sub="Your data is saved on this device only"
              />
              <SettingRow
                icon={<LogIn size={16} />}
                label="Sign in"
                sub="Access your prayers on any device"
                onClick={onSignIn}
                chevron
              />
              <SettingRow
                icon={<UserPlus size={16} />}
                label="Create account"
                sub="Free — sync & backup your prayers"
                onClick={onSignUp}
                chevron
              />
            </>
          )}
        </Group>

        {/* About */}
        <div className="settings-group">
          <p className="settings-group-title">About</p>
          <div className="settings-about">
            <div className="settings-about-icon"><AppIcon size={36} /></div>
            <div>
              <p className="settings-about-name">My Prayer App</p>
              <p className="settings-about-version">Version 1.0.0 · Built with faith</p>
            </div>
          </div>
        </div>

      </div>

      {/* Delete account confirmation modal */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay" onClick={() => !deleting && setShowDeleteConfirm(false)}>
          <div className="delete-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="delete-confirm-icon">⚠️</div>
            <h3 className="delete-confirm-title">Delete account?</h3>
            <p className="delete-confirm-body">
              This will permanently delete your account and all your prayers, plans, and data. This cannot be undone.
            </p>
            <div className="delete-confirm-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-destructive"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

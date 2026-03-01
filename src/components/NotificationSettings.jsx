import { useState } from 'react';
import { Bell, BellOff, Plus, X, Clock, Settings, AlertCircle } from 'lucide-react';

export default function NotificationSettings({
  settings,
  onToggle,
  onAddTime,
  onRemoveTime,
  onUpdateTime,
  notificationSupported,
  permissionState,
  isNative,
}) {
  const [showPanel, setShowPanel] = useState(false);
  const [newHour, setNewHour] = useState(8);
  const [newMinute, setNewMinute] = useState(0);
  const [newLabel, setNewLabel] = useState('');

  const formatTime = (hour, minute) => {
    const h = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${h}:${String(minute).padStart(2, '0')} ${ampm}`;
  };

  const handleAdd = () => {
    onAddTime(newHour, newMinute, newLabel.trim() || 'Prayer Time');
    setNewLabel('');
  };

  if (!notificationSupported || !settings) return null;

  const isBlocked = permissionState === 'denied';

  const blockedMessage = isNative
    ? 'Notifications are blocked. Open iPhone Settings → My Prayer App → Notifications → turn on Allow Notifications, then come back.'
    : 'Notifications are blocked in your browser. Click the lock icon (🔒) in the address bar, set Notifications to Allow, then refresh.';

  return (
    <div className="notification-section">
      <button
        className="notification-toggle"
        onClick={() => setShowPanel(!showPanel)}
      >
        <div className="notification-toggle-left">
          {settings.enabled ? <Bell size={16} /> : <BellOff size={16} />}
          <span>Prayer Reminders</span>
          {settings.enabled && <span className="notification-on-badge">ON</span>}
          {isBlocked && <span className="notification-blocked-badge">Blocked</span>}
        </div>
        <Settings size={14} className={showPanel ? 'icon-rotate' : ''} />
      </button>

      {showPanel && (
        <div className="notification-panel">
          {/* Blocked — show clear instructions instead of toggle */}
          {isBlocked ? (
            <div className="notification-blocked-msg">
              <AlertCircle size={15} />
              <p>{blockedMessage}</p>
            </div>
          ) : (
            <div className="notification-enable-row">
              <span>Enable Notifications</span>
              <button
                className={`toggle-switch ${settings.enabled ? 'toggle-on' : ''}`}
                onClick={onToggle}
                aria-label="Toggle notifications"
              >
                <span className="toggle-knob" />
              </button>
            </div>
          )}

          {/* Time list + add form — only when enabled and not blocked */}
          {settings.enabled && !isBlocked && (
            <>
              <div className="notification-times">
                {(settings.times || []).map((time, i) => (
                  <div key={i} className="notification-time-row">
                    <Clock size={13} />
                    <span className="notification-time-label">{time.label}</span>
                    <span className="notification-time-value">
                      {formatTime(time.hour, time.minute)}
                    </span>
                    <button
                      className="btn-icon notification-remove"
                      onClick={() => onRemoveTime(i)}
                      aria-label="Remove time"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="notification-add-form">
                <input
                  type="text"
                  className="form-input form-input-sm"
                  placeholder="Label (e.g. Evening Prayer)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  maxLength={40}
                />
                <div className="notification-time-inputs">
                  <select
                    className="form-select"
                    value={newHour}
                    onChange={(e) => setNewHour(Number(e.target.value))}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i % 12 || 12} {i < 12 ? 'AM' : 'PM'}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-select"
                    value={newMinute}
                    onChange={(e) => setNewMinute(Number(e.target.value))}
                  >
                    {[0, 15, 30, 45].map((m) => (
                      <option key={m} value={m}>:{String(m).padStart(2, '0')}</option>
                    ))}
                  </select>
                  <button className="btn btn-sm btn-primary" onClick={handleAdd}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

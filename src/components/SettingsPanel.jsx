import { Sun, Moon, Type, Eye, EyeOff, Flame, Info } from 'lucide-react';

function SettingRow({ icon, label, sub, children }) {
  return (
    <div className="setting-row">
      <div className="setting-row-icon">{icon}</div>
      <div className="setting-row-text">
        <span className="setting-row-label">{label}</span>
        {sub && <span className="setting-row-sub">{sub}</span>}
      </div>
      <div className="setting-row-control">{children}</div>
    </div>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <button
      className={`settings-toggle ${on ? 'settings-toggle-on' : ''}`}
      onClick={onToggle}
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

export default function SettingsPanel({ settings, onUpdate }) {
  return (
    <div className="settings-panel">

      {/* Appearance */}
      <div className="settings-group">
        <p className="settings-group-title">Appearance</p>

        <SettingRow
          icon={settings.theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
          label="Theme"
          sub={settings.theme === 'dark' ? 'Dark mode active' : 'Light mode active'}
        >
          <SegmentedControl
            options={[
              { value: 'dark', label: '🌙 Dark' },
              { value: 'light', label: '☀️ Light' },
            ]}
            value={settings.theme}
            onChange={(v) => onUpdate({ theme: v })}
          />
        </SettingRow>

        <SettingRow
          icon={<Type size={16} />}
          label="Text size"
          sub="Adjusts prayer card text"
        >
          <SegmentedControl
            options={[
              { value: 'small', label: 'S' },
              { value: 'medium', label: 'M' },
              { value: 'large', label: 'L' },
            ]}
            value={settings.fontSize}
            onChange={(v) => onUpdate({ fontSize: v })}
          />
        </SettingRow>
      </div>

      {/* Dashboard */}
      <div className="settings-group">
        <p className="settings-group-title">Home Screen</p>

        <SettingRow
          icon={<Flame size={16} />}
          label="Show streak stats"
          sub="Daily streak, best streak, days prayed"
        >
          <Toggle on={settings.showStreak} onToggle={() => onUpdate({ showStreak: !settings.showStreak })} />
        </SettingRow>

        <SettingRow
          icon={settings.showNeglected ? <Eye size={16} /> : <EyeOff size={16} />}
          label="Neglected prayer alerts"
          sub="Warn when prayers uncovered 3+ days"
        >
          <Toggle on={settings.showNeglected} onToggle={() => onUpdate({ showNeglected: !settings.showNeglected })} />
        </SettingRow>
      </div>

      {/* About */}
      <div className="settings-group">
        <p className="settings-group-title">About</p>
        <div className="settings-about">
          <div className="settings-about-icon">🔥</div>
          <div>
            <p className="settings-about-name">Prayer Journal</p>
            <p className="settings-about-version">Version 1.0.0 · Built with faith</p>
          </div>
        </div>
      </div>

    </div>
  );
}

import { BookOpen, Flame, Settings } from 'lucide-react';

export default function Header({ streakCount, hasPrayedToday, onToggleStreak, onOpenSettings }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="header-icon">
            <BookOpen size={22} strokeWidth={1.5} />
          </div>
          <h1 className="header-title">Prayer Journal</h1>
        </div>
        <div className="header-right">
          <button
            className="header-streak-btn"
            onClick={onToggleStreak}
            aria-label={`${streakCount} day streak`}
            aria-live="polite"
          >
            <Flame
              size={18}
              className={`header-streak-flame ${streakCount > 0 ? 'streak-flame-active' : ''}`}
            />
            <span className="header-streak-count">{streakCount}</span>
            {hasPrayedToday && <span className="header-prayed-dot" />}
          </button>
          <button
            className="header-settings-btn"
            onClick={onOpenSettings}
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

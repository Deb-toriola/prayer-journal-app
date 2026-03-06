import { CheckCircle2, Flame } from 'lucide-react';
import { getStreakTheme } from '../utils/streakTheme';
import FireAnimation from './FireAnimation';

export default function DailyCheckin({
  hasPrayedToday,
  hasManualCheckinToday,
  onCheckIn,
  onUncheck,
  currentStreak,
  longestStreak,
  totalDaysPrayed,
}) {
  // Theme recalculated live every render — shifts instantly when streak changes
  const theme = getStreakTheme(currentStreak);

  const cardStyle = {
    background: theme.background,
    boxShadow: theme.boxShadow,
  };

  const numberStyle = theme.goldText
    ? { textShadow: '0 0 16px rgba(255,200,0,0.9), 0 0 32px rgba(255,140,0,0.5), 0 2px 8px rgba(0,0,0,0.3)' }
    : { textShadow: '0 2px 8px rgba(0,0,0,0.2)' };

  return (
    <div className="daily-checkin-card" style={cardStyle}>

      {/* ── Hero: animated fire + streak number + label ── */}
      <div className="streak-hero">
        <div className="streak-hero-icon-wrap">
          <FireAnimation
            size={theme.flameSize}
            style={{ filter: theme.flameFilter }}
          />
          {hasPrayedToday && (
            <CheckCircle2 size={20} className="streak-hero-check" />
          )}
        </div>
        <div className="streak-hero-number" style={numberStyle}>{currentStreak}</div>
        <div className="streak-hero-msg">{theme.label}</div>
      </div>

      {/* ── Stats row ── */}
      <div className="streak-stats-row">
        <div className="streak-stat-item">
          <span className="streak-stat-num">{currentStreak}</span>
          <span className="streak-stat-lbl">Day Streak</span>
        </div>
        <div className="streak-stat-sep" />
        <div className="streak-stat-item">
          <span className="streak-stat-num">{longestStreak}</span>
          <span className="streak-stat-lbl">Best</span>
        </div>
        <div className="streak-stat-sep" />
        <div className="streak-stat-item">
          <span className="streak-stat-num">{totalDaysPrayed}</span>
          <span className="streak-stat-lbl">Days Prayed</span>
        </div>
      </div>

      {/* ── Toggle button ──────────────────────────────────────────
          State is ONLY driven by hasManualCheckinToday — never by
          prayer-log or plan dates — so it always toggles freely.
          Direct tap: no type-picker, no confirmation sheet.
      ────────────────────────────────────────────────────────── */}
      {hasManualCheckinToday ? (
        <button
          className="daily-checkin-prayed-btn daily-checkin-prayed-btn-tappable"
          onClick={onUncheck}
          aria-label="Prayed today — tap to remove"
        >
          <CheckCircle2 size={16} />
          <span>Prayed today</span>
          <span className="daily-checkin-prayed-hint">tap to remove</span>
        </button>
      ) : (
        <button
          className="daily-checkin-btn"
          onClick={onCheckIn}
          aria-label="Record today's prayer"
        >
          <Flame size={14} />
          I prayed today
        </button>
      )}
    </div>
  );
}

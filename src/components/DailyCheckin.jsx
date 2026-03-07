import { CheckCircle2, Flame } from 'lucide-react';
import { getStreakTheme } from '../utils/streakTheme';
import FireAnimation from './FireAnimation';
import CardFireAnimation from './CardFireAnimation';

// ── Card-fire seed heat per streak tier ───────────────────────────────────
// seedHeat controls how high the flames rise (higher = taller fire).
// Values tuned down from the original so the fire is warm and alive,
// not frantic. The ~15 fps throttle in CardFireAnimation keeps it calm.
//   null → no card fire (gradient only)        — streak 0–2
//   175  → gentle glow, lower ~45 % of card    — streak 3–6
//   200  → steady flame, lower ~70 %           — streak 7–13
//   220  → strong fire, lower ~85 %            — streak 14–29
//   238  → near-full card, tips barely visible — streak 30+
function cardFireSeed(streak) {
  if (streak >= 30) return 238;
  if (streak >= 14) return 220;
  if (streak >= 7)  return 200;
  if (streak >= 3)  return 175;
  return null;
}

export default function DailyCheckin({
  hasPrayedToday,
  hasManualCheckinToday,
  onCheckIn,
  onUncheck,
  currentStreak,
  longestStreak,
  totalDaysPrayed,
}) {
  const theme    = getStreakTheme(currentStreak);
  const fireSeed = cardFireSeed(currentStreak);

  const cardStyle = {
    background: theme.background,
    boxShadow:  theme.boxShadow,
  };

  const numberStyle = theme.goldText
    ? { textShadow: '0 0 16px rgba(255,200,0,0.9), 0 0 32px rgba(255,140,0,0.5), 0 2px 8px rgba(0,0,0,0.3)' }
    : { textShadow: '0 2px 8px rgba(0,0,0,0.35)' };

  return (
    <div
      className={`daily-checkin-card${fireSeed !== null ? ' daily-checkin-card--fire' : ''}`}
      style={cardStyle}
    >
      {/* ── Live fire canvas background (streak ≥ 3) ── */}
      {fireSeed !== null && (
        <>
          <CardFireAnimation seedHeat={fireSeed} />
          <div className="card-fire-overlay" />
        </>
      )}

      {/* ── Content sits above the fire at z-index 2 ── */}
      <div className="daily-checkin-content">

        {/* ── Hero: animated flame icon + streak number + label ── */}
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

      </div>{/* /.daily-checkin-content */}
    </div>
  );
}

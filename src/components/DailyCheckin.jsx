import { useState } from 'react';
import { Flame, CheckCircle2 } from 'lucide-react';
import { getStreakTheme } from '../utils/streakTheme';

const PRAYER_TYPES = [
  { id: 'personal', icon: '🙏', label: 'Personal prayer' },
  { id: 'app',      icon: '📱', label: 'Used the app' },
  { id: 'scripture',icon: '📖', label: 'Read scripture' },
  { id: 'other',    icon: '✨', label: 'Other' },
];

export default function DailyCheckin({
  hasPrayedToday,
  hasManualCheckinToday,
  onCheckIn,
  onUncheck,
  currentStreak,
  longestStreak,
  totalDaysPrayed,
}) {
  const [showTypeSheet, setShowTypeSheet]           = useState(false);
  const [showUncheckConfirm, setShowUncheckConfirm] = useState(false);

  const handleSelectType = () => {
    setShowTypeSheet(false);
    onCheckIn();
  };

  // getStreakTheme runs live on every render — never cached, always honest.
  // When streak drops (e.g. un-tap), colour shifts immediately.
  const theme = getStreakTheme(currentStreak);

  const cardStyle = { background: theme.background, boxShadow: theme.boxShadow };

  const numberStyle = theme.goldText
    ? { textShadow: '0 0 16px rgba(255,200,0,0.9), 0 0 32px rgba(255,140,0,0.5), 0 2px 8px rgba(0,0,0,0.3)' }
    : { textShadow: '0 2px 8px rgba(0,0,0,0.2)' };

  return (
    <div className="daily-checkin-card" style={cardStyle}>

      {/* Hero — flame + big number + dynamic theme label */}
      <div className="streak-hero">
        <div className="streak-hero-icon-wrap">
          <Flame
            size={theme.flameSize}
            className={!hasPrayedToday ? 'streak-hero-flame-pulse' : ''}
            style={{ color: 'rgba(255,255,255,0.95)', filter: theme.flameFilter }}
          />
          {hasPrayedToday && <CheckCircle2 size={20} className="streak-hero-check" />}
        </div>
        <div className="streak-hero-number" style={numberStyle}>{currentStreak}</div>
        <div className="streak-hero-msg">{theme.label}</div>
      </div>

      {/* Stats row */}
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

      {/* ── Action area ──────────────────────────────────────── */}
      {hasPrayedToday ? (

        /* Prayed state ---------------------------------------- */
        <>
          {showUncheckConfirm ? (
            /* Confirmation sheet */
            <div className="daily-checkin-uncheck-sheet">
              <p className="daily-checkin-uncheck-msg">
                Remove today's prayer record?
              </p>
              <p className="daily-checkin-uncheck-sub">
                Your streak will update immediately.
              </p>
              <div className="daily-checkin-uncheck-actions">
                <button
                  className="daily-checkin-uncheck-cancel"
                  onClick={() => setShowUncheckConfirm(false)}
                >
                  Keep it
                </button>
                <button
                  className="daily-checkin-uncheck-confirm"
                  onClick={() => { onUncheck(); setShowUncheckConfirm(false); }}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            /* Confirmed button — tappable only for manual check-ins */
            <button
              className={`daily-checkin-prayed-btn${hasManualCheckinToday ? ' daily-checkin-prayed-btn-tappable' : ''}`}
              onClick={() => hasManualCheckinToday && onUncheck && setShowUncheckConfirm(true)}
              aria-label={hasManualCheckinToday ? 'Prayer recorded — tap to remove' : 'Prayer recorded today'}
            >
              <CheckCircle2 size={16} />
              <span>Prayed today</span>
              {hasManualCheckinToday && (
                <span className="daily-checkin-prayed-hint">tap to remove</span>
              )}
            </button>
          )}
        </>

      ) : showTypeSheet ? (

        /* "How did you pray?" type-picker -------------------- */
        <div className="prayer-type-sheet">
          <p className="prayer-type-sheet-title">How did you pray today?</p>
          <div className="prayer-type-options">
            {PRAYER_TYPES.map(pt => (
              <button
                key={pt.id}
                className="prayer-type-option"
                onClick={() => handleSelectType(pt.id)}
              >
                <span className="prayer-type-icon">{pt.icon}</span>
                <span className="prayer-type-label">{pt.label}</span>
              </button>
            ))}
          </div>
          <button className="prayer-type-cancel" onClick={() => setShowTypeSheet(false)}>
            Cancel
          </button>
        </div>

      ) : (

        /* Not yet prayed ------------------------------------- */
        <button
          className="daily-checkin-btn"
          onClick={() => setShowTypeSheet(true)}
          aria-label="Record today's prayer"
        >
          <Flame size={16} />
          I prayed today
        </button>
      )}
    </div>
  );
}

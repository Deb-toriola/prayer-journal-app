import { useState } from 'react';
import { Flame, CheckCircle2 } from 'lucide-react';

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
  const [showTypeSheet, setShowTypeSheet] = useState(false);

  const handleSelectType = () => {
    setShowTypeSheet(false);
    onCheckIn();
  };

  const stateClass = hasPrayedToday ? 'daily-checkin-prayed' : 'daily-checkin-not-prayed';

  return (
    <div className={`daily-checkin-card ${stateClass}`}>

      {/* Hero — icon + big number + message */}
      <div className="streak-hero">
        <div className="streak-hero-icon-wrap">
          <Flame
            size={40}
            className={`streak-hero-flame ${!hasPrayedToday ? 'streak-hero-flame-pulse' : ''}`}
          />
          {hasPrayedToday && <CheckCircle2 size={20} className="streak-hero-check" />}
        </div>
        <div className="streak-hero-number">{currentStreak}</div>
        <div className="streak-hero-msg">
          {hasPrayedToday ? 'Streak safe — well done.' : 'Keep your streak alive'}
        </div>
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

      {/* Action */}
      {hasPrayedToday ? (
        <div className="daily-checkin-done">
          <span>✨ You prayed today — your streak is safe!</span>
          {hasManualCheckinToday && onUncheck && (
            <button className="daily-checkin-undo" onClick={onUncheck} title="Undo check-in">
              Undo
            </button>
          )}
        </div>
      ) : showTypeSheet ? (
        /* Intentional prayer — "How did you pray?" sheet */
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

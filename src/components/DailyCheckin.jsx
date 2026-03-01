import { useState } from 'react';
import { Flame, CheckCircle2 } from 'lucide-react';

export default function DailyCheckin({
  hasPrayedToday,
  hasManualCheckinToday,
  onCheckIn,
  onUncheck,
  currentStreak,
  longestStreak,
  totalDaysPrayed,
}) {
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  const handleCheckIn = () => {
    onCheckIn();
    setJustCheckedIn(true);
    setTimeout(() => setJustCheckedIn(false), 2000);
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
      ) : (
        <button
          className={`daily-checkin-btn ${justCheckedIn ? 'daily-checkin-btn-success' : ''}`}
          onClick={handleCheckIn}
          aria-label="Mark today as prayed"
        >
          <Flame size={16} />
          I prayed today
        </button>
      )}
    </div>
  );
}

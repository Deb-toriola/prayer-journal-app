import { useState } from 'react';
import { Flame, Trophy, CalendarDays, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function DailyCheckin({
  hasPrayedToday,
  onCheckIn,
  currentStreak,
  longestStreak,
  totalDaysPrayed,
  totalPrayers,
  neglectedPrayers,
}) {
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  const handleCheckIn = () => {
    onCheckIn();
    setJustCheckedIn(true);
    setTimeout(() => setJustCheckedIn(false), 2000);
  };

  return (
    <div className="daily-checkin-card">
      <div className="daily-checkin-top">
        <div className="streak-stats">
          <div className="streak-stat streak-stat-main">
            <Flame
              size={20}
              className={`streak-flame ${currentStreak > 0 ? 'streak-flame-active' : ''}`}
            />
            <div>
              <span className="streak-number">{currentStreak}</span>
              <span className="streak-label">day streak</span>
            </div>
          </div>
          <div className="streak-stat">
            <Trophy size={14} />
            <div>
              <span className="streak-number">{longestStreak}</span>
              <span className="streak-label">best</span>
            </div>
          </div>
          <div className="streak-stat">
            <CalendarDays size={14} />
            <div>
              <span className="streak-number">{totalDaysPrayed}</span>
              <span className="streak-label">days prayed</span>
            </div>
          </div>
        </div>

        <div className="streak-status">
          {hasPrayedToday ? (
            <span className="streak-done-badge">
              <CheckCircle2 size={11} />
              Prayed today
            </span>
          ) : (
            <span className="streak-pending-badge">Keep streak!</span>
          )}
          {neglectedPrayers > 0 && (
            <span className="streak-neglect-badge" title="Prayers not covered in 3+ days">
              <AlertCircle size={11} />
              {neglectedPrayers} need attention
            </span>
          )}
        </div>
      </div>

      {hasPrayedToday ? (
        <div className="daily-checkin-done">
          ✨ You prayed today — your streak is safe!
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

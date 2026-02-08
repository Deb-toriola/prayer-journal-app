import { Flame, Trophy, Heart, AlertCircle, Calendar } from 'lucide-react';

export default function StreakBar({ stats, expanded }) {
  const {
    currentStreak, longestStreak, totalPrayers, totalDaysPrayed,
    hasPrayedToday, neglectedPrayers,
  } = stats;

  if (!expanded) return null;

  return (
    <div className="streak-drawer" role="region" aria-label="Prayer streak statistics">
      <div className="streak-drawer-stats">
        <div className="streak-drawer-stat">
          <div className="streak-drawer-stat-icon">
            <Flame size={16} className={currentStreak > 0 ? 'streak-flame-active' : ''} />
          </div>
          <span className="streak-drawer-stat-number" aria-live="polite">{currentStreak}</span>
          <span className="streak-drawer-stat-label">Current Streak</span>
        </div>
        <div className="streak-drawer-stat">
          <div className="streak-drawer-stat-icon">
            <Trophy size={16} />
          </div>
          <span className="streak-drawer-stat-number">{longestStreak}</span>
          <span className="streak-drawer-stat-label">Best Streak</span>
        </div>
        <div className="streak-drawer-stat">
          <div className="streak-drawer-stat-icon">
            <Heart size={16} />
          </div>
          <span className="streak-drawer-stat-number">{totalPrayers}</span>
          <span className="streak-drawer-stat-label">Total Prayers</span>
        </div>
        <div className="streak-drawer-stat">
          <div className="streak-drawer-stat-icon">
            <Calendar size={16} />
          </div>
          <span className="streak-drawer-stat-number">{totalDaysPrayed}</span>
          <span className="streak-drawer-stat-label">Days Prayed</span>
        </div>
      </div>

      <div className="streak-drawer-badges">
        {hasPrayedToday ? (
          <span className="streak-done-badge">Prayed today</span>
        ) : (
          <span className="streak-pending-badge">Pray to keep streak</span>
        )}
        {neglectedPrayers.length > 0 && (
          <span className="streak-neglect-badge" title="Prayers not covered in 3+ days">
            <AlertCircle size={11} />
            {neglectedPrayers.length} need attention
          </span>
        )}
      </div>
    </div>
  );
}

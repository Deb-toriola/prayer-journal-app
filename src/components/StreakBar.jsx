import { Flame, Trophy, Heart, AlertCircle } from 'lucide-react';

export default function StreakBar({ stats }) {
  const { currentStreak, longestStreak, totalPrayers, hasPrayedToday, neglectedPrayers } = stats;

  return (
    <div className="streak-bar">
      <div className="streak-stats">
        <div className="streak-stat streak-stat-main">
          <Flame size={20} className={`streak-flame ${currentStreak > 0 ? 'streak-flame-active' : ''}`} />
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
          <Heart size={14} />
          <div>
            <span className="streak-number">{totalPrayers}</span>
            <span className="streak-label">prayers</span>
          </div>
        </div>
      </div>
      <div className="streak-status">
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

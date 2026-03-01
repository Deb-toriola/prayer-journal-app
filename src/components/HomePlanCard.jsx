import { CalendarCheck, Check } from 'lucide-react';

export default function HomePlanCard({ plan, today, onCheckIn, onClick }) {
  const start = new Date(plan.startDate);
  const now = new Date(today);
  const currentDay = Math.min(Math.floor((now - start) / 86400000) + 1, plan.totalDays);
  const hasPrayedToday = plan.checkedDays.includes(today);
  const isComplete = plan.checkedDays.length >= plan.totalDays;
  const progress = plan.totalDays > 0
    ? Math.round((plan.checkedDays.length / plan.totalDays) * 100)
    : 0;

  return (
    <div className="home-plan-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="home-plan-card-header">
        <div className="home-plan-card-label">
          <CalendarCheck size={13} />
          <span>Prayer Plan</span>
        </div>
        <span className={`home-plan-badge ${
          isComplete         ? 'home-plan-badge-complete' :
          hasPrayedToday     ? 'home-plan-badge-on-track' :
                               'home-plan-badge-todo'
        }`}>
          {isComplete ? '🎉 Complete' : hasPrayedToday ? '✓ On Track' : 'Pray Today'}
        </span>
      </div>

      <div className="home-plan-card-name">{plan.name}</div>

      <div className="home-plan-progress-row">
        <div className="home-plan-progress-bar">
          <div className="home-plan-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="home-plan-progress-text">Day {currentDay}/{plan.totalDays}</span>
      </div>

      {!isComplete && !hasPrayedToday && (
        <button
          className="home-plan-checkin-btn"
          onClick={(e) => { e.stopPropagation(); onCheckIn(plan.id); }}
        >
          <Check size={13} />
          I prayed today
        </button>
      )}
    </div>
  );
}

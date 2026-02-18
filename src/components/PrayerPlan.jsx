import { useState } from 'react';
import { CalendarCheck, Plus, X, Check, Trash2, ChevronRight } from 'lucide-react';
import { PLAN_TEMPLATES } from '../hooks/usePrayerPlan';
import { getTodayString } from '../utils/constants';

export default function PrayerPlan({
  plan,
  onStart,
  onCheckIn,
  onDelete,
  hasPrayedToday,
  currentDayNumber,
  isComplete,
  completedPlansCount,
}) {
  const [showCreator, setShowCreator] = useState(false);
  const [customName, setCustomName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customDays, setCustomDays] = useState('');
  const QUICK_DAYS = [7, 14, 21, 30, 40];

  const handleStart = () => {
    onStart(selectedTemplate, customName, customDays || (selectedTemplate ? null : '7'));
    setShowCreator(false);
    setCustomName('');
    setSelectedTemplate(null);
    setCustomDays('');
  };

  const canStart = selectedTemplate || (customDays && parseInt(customDays) > 0);

  // No plan — show CTA
  if (!plan) {
    return (
      <div className="prayer-plan-card">
        <div className="prayer-plan-label">
          <CalendarCheck size={15} />
          <span>Prayer Plan</span>
        </div>

        {!showCreator ? (
          <>
            <button className="prayer-plan-empty-btn" onClick={() => setShowCreator(true)}>
              <Plus size={15} />
              Start a Prayer Plan
            </button>
            {completedPlansCount > 0 && (
              <div className="prayer-plan-completed-count">
                🏆 {completedPlansCount} plan{completedPlansCount > 1 ? 's' : ''} completed
              </div>
            )}
          </>
        ) : (
          <div className="prayer-plan-creator">
            <div className="prayer-plan-creator-header">
              <span className="prayer-plan-creator-title">Choose a Plan</span>
              <button className="btn-icon" onClick={() => setShowCreator(false)}>
                <X size={16} />
              </button>
            </div>

            {PLAN_TEMPLATES.map((t) => (
              <button
                key={t.id}
                className={`prayer-plan-template ${selectedTemplate === t.id ? 'prayer-plan-template-active' : ''}`}
                onClick={() => { setSelectedTemplate(t.id); setCustomDays(''); }}
              >
                <span className="prayer-plan-template-icon">{t.icon}</span>
                <span className="prayer-plan-template-info">
                  <span className="prayer-plan-template-name">{t.name}</span>
                  <span className="prayer-plan-template-desc">{t.desc}</span>
                </span>
                <ChevronRight size={16} className="prayer-plan-template-chevron" />
              </button>
            ))}

            <hr className="prayer-plan-divider" />

            <p className="prayer-plan-custom-label">Or create your own:</p>
            <input
              className="prayer-plan-input"
              type="text"
              placeholder="Plan name (optional)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
            <div className="prayer-plan-day-pills">
              {QUICK_DAYS.map((d) => (
                <button
                  key={d}
                  className={`prayer-plan-day-pill ${!selectedTemplate && customDays === String(d) ? 'prayer-plan-day-pill-active' : ''}`}
                  onClick={() => { setCustomDays(String(d)); setSelectedTemplate(null); }}
                >
                  {d}
                </button>
              ))}
            </div>
            <input
              className="prayer-plan-input"
              type="number"
              min="1"
              max="365"
              placeholder="Or type days..."
              value={customDays}
              onChange={(e) => { setCustomDays(e.target.value); setSelectedTemplate(null); }}
            />
            <button
              className="btn btn-primary prayer-plan-start-btn"
              onClick={handleStart}
              disabled={!canStart}
            >
              Start Plan
            </button>
          </div>
        )}
      </div>
    );
  }

  // Active plan
  const today = getTodayString();
  const startDate = new Date(plan.startDate);

  return (
    <div className="prayer-plan-card">
      <div className="prayer-plan-active-header">
        <div className="prayer-plan-label">
          <CalendarCheck size={15} />
          <span>Prayer Plan</span>
        </div>
        <div className="prayer-plan-header-right">
          {isComplete ? (
            <span className="prayer-plan-badge prayer-plan-badge-complete">Complete! 🎉</span>
          ) : hasPrayedToday ? (
            <span className="prayer-plan-badge prayer-plan-badge-success">On Track!</span>
          ) : (
            <span className="prayer-plan-badge prayer-plan-badge-warning">Pray Today!</span>
          )}
          <button className="btn-icon prayer-plan-delete-btn" onClick={onDelete} title="Delete plan">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="prayer-plan-summary">
        <span className="prayer-plan-name">{plan.name}</span>
        <span className="prayer-plan-progress-text">Day {currentDayNumber} of {plan.totalDays}</span>
      </div>

      <div className="prayer-plan-progress-bar">
        <div
          className="prayer-plan-progress-fill"
          style={{ width: `${Math.round((plan.checkedDays.length / plan.totalDays) * 100)}%` }}
        />
      </div>

      <div className="prayer-plan-days-scroller">
        {Array.from({ length: plan.totalDays }, (_, i) => {
          const dayNum = i + 1;
          const dayDate = new Date(startDate);
          dayDate.setDate(startDate.getDate() + i);
          const dateStr = dayDate.toISOString().split('T')[0];
          const isChecked = plan.checkedDays.includes(dateStr);
          const isCurrent = dateStr === today && !isComplete;
          const isPast = dateStr < today && !isChecked;
          const isFuture = dateStr > today;

          let cls = 'prayer-plan-day';
          if (isChecked) cls += ' prayer-plan-day-checked';
          else if (isCurrent) cls += ' prayer-plan-day-current';
          else if (isFuture) cls += ' prayer-plan-day-future';
          else if (isPast) cls += ' prayer-plan-day-past';

          return (
            <div key={dayNum} className={cls} title={`Day ${dayNum}`}>
              {isChecked ? (
                <Check size={14} strokeWidth={3} />
              ) : (
                <>
                  <span className="prayer-plan-day-number">{dayNum}</span>
                  {isCurrent && <span className="prayer-plan-day-label">Today</span>}
                </>
              )}
            </div>
          );
        })}
      </div>

      {isComplete ? (
        <div className="prayer-plan-complete-msg">
          ✨ You completed the {plan.name}! Amazing faithfulness.
        </div>
      ) : hasPrayedToday ? (
        <div className="prayer-plan-checked-today">
          ✨ You prayed today — keep it up!
        </div>
      ) : (
        <button className="prayer-plan-checkin-btn" onClick={onCheckIn}>
          <CalendarCheck size={15} />
          I prayed today
        </button>
      )}
    </div>
  );
}

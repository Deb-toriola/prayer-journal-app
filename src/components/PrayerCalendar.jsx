import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Pencil, X, Check } from 'lucide-react';
import { getCategoryByValue, getTodayString } from '../utils/constants';

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDayName(d) {
  return DAY_NAMES[d.getDay()];
}

function daysAgo(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today - d) / 86400000);
}

// ─── DAY POPOVER ───────────────────────────────────────────────
function DayPopover({ date, hasPrayed, scheduled, allCategories, onLogDate, onRemoveDate, onClose }) {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const todayStr = getTodayString();
  const dateStr = getDateStr(date);
  const isToday = dateStr === todayStr;
  const isFuture = date > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const age = daysAgo(dateStr);
  const canLog = !isFuture && age <= 7 && !hasPrayed;
  const canRemove = hasPrayed && !isFuture;

  const dateLabel = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const handleLog = () => {
    onLogDate?.(dateStr);
    onClose();
  };

  const handleRemove = () => {
    onRemoveDate?.(dateStr);
    setShowRemoveConfirm(false);
    onClose();
  };

  return (
    <div className="prayer-cal-popover">
      <div className="prayer-cal-popover-header">
        <span className="prayer-cal-popover-date">{dateLabel}</span>
        <button className="prayer-cal-popover-close" onClick={onClose}><X size={16} /></button>
      </div>

      {/* Status */}
      {hasPrayed ? (
        <p className="prayer-cal-popover-status prayer-cal-popover-status--prayed">
          <Check size={14} /> Prayed this day
        </p>
      ) : isToday ? (
        <p className="prayer-cal-popover-status prayer-cal-popover-status--today">
          Today — not yet prayed
        </p>
      ) : isFuture ? (
        <p className="prayer-cal-popover-status prayer-cal-popover-status--future">
          Come back on {date.toLocaleDateString('en-US', { weekday: 'long' })} to pray
        </p>
      ) : (
        <p className="prayer-cal-popover-status prayer-cal-popover-status--missed">
          No prayer logged this day
        </p>
      )}

      {/* Scheduled prayers */}
      {scheduled.length > 0 && (
        <div className="prayer-cal-popover-scheduled">
          <span className="prayer-cal-popover-sched-label">Scheduled:</span>
          {scheduled.map(cat => {
            const c = getCategoryByValue(cat, allCategories);
            return <span key={cat} className="prayer-cal-focus-pill" style={{ borderColor: c.color, color: c.color }}>{c.label}</span>;
          })}
        </div>
      )}

      {/* Log button for today or recent past */}
      {canLog && (
        <div className="prayer-cal-popover-actions">
          <button className="btn btn-primary prayer-cal-popover-log-btn" onClick={handleLog}>
            {isToday ? 'Mark today as prayed' : 'Mark this day as prayed'}
          </button>
          {!isToday && (
            <p className="prayer-cal-popover-note">You can log prayer up to 7 days after the fact</p>
          )}
          {isToday && (
            <p className="prayer-cal-popover-note">Or tap 'I prayed today' on the home screen</p>
          )}
        </div>
      )}

      {/* Past day older than 7 days, not prayed */}
      {!isFuture && !hasPrayed && age > 7 && (
        <p className="prayer-cal-popover-note">Prayer logging is available for up to 7 days</p>
      )}

      {/* Remove option */}
      {canRemove && !showRemoveConfirm && (
        <button className="prayer-cal-popover-remove" onClick={() => setShowRemoveConfirm(true)}>
          Remove prayer log
        </button>
      )}

      {/* Remove confirmation */}
      {showRemoveConfirm && (
        <div className="prayer-cal-popover-confirm">
          <p className="prayer-cal-popover-confirm-text">Remove prayer log for {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}? This may affect your streak.</p>
          <div className="prayer-cal-popover-confirm-btns">
            <button className="btn btn-destructive-outline prayer-cal-popover-confirm-remove" onClick={handleRemove}>Remove</button>
            <button className="btn btn-primary prayer-cal-popover-confirm-keep" onClick={() => setShowRemoveConfirm(false)}>Keep</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COMPACT MODE ──────────────────────────────────────────────
function CompactStrip({ prayerLogDates, schedule, allCategories, onNavigateToFull, onLogDate, onRemoveDate }) {
  const scrollRef = useRef(null);
  const todayRef = useRef(null);
  const todayStr = getTodayString();
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(null);

  // Generate 21 days: 14 past + today + 6 future
  const days = useMemo(() => {
    const result = [];
    for (let i = -14; i <= 6; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      result.push(d);
    }
    return result;
  }, [todayStr]);

  // Count days prayed this month
  const daysPrayedThisMonth = useMemo(() => {
    const year = today.getFullYear();
    const month = today.getMonth();
    let count = 0;
    prayerLogDates.forEach(dateStr => {
      const [y, m] = dateStr.split('-').map(Number);
      if (y === year && m - 1 === month) count++;
    });
    return count;
  }, [prayerLogDates, todayStr]);

  // Auto-scroll to center on today
  useEffect(() => {
    if (todayRef.current && scrollRef.current) {
      requestAnimationFrame(() => {
        const container = scrollRef.current;
        const el = todayRef.current;
        if (container && el) {
          container.scrollLeft = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
        }
      });
    }
  }, []);

  const todaySchedule = schedule[getDayName(today)] || [];

  return (
    <div className="prayer-cal-strip">
      <div className="prayer-cal-strip-scroll" ref={scrollRef}>
        {days.map((d) => {
          const dateStr = getDateStr(d);
          const isToday = dateStr === todayStr;
          const isFuture = d > today;
          const isPast = dateStr < todayStr;
          const hasPrayed = prayerLogDates.has(dateStr);
          const dayName = getDayName(d);
          const hasScheduled = (schedule[dayName] || []).length > 0;

          let cls = 'prayer-cal-day';
          if (hasPrayed) cls += ' prayer-cal-day--prayed';
          if (isToday && !hasPrayed) cls += ' prayer-cal-day--today';
          if (isToday && hasPrayed) cls += ' prayer-cal-day--today-prayed';
          if (isFuture && !hasPrayed) cls += ' prayer-cal-day--future';
          if (isPast && !hasPrayed) cls += ' prayer-cal-day--missed';

          return (
            <div
              key={dateStr}
              className={cls}
              ref={isToday ? todayRef : undefined}
              onClick={() => setSelectedDay(dateStr === (selectedDay && getDateStr(selectedDay)) ? null : d)}
            >
              <span className="prayer-cal-day-abbr">{DAY_LETTERS[d.getDay()]}</span>
              <span className="prayer-cal-day-num">{d.getDate()}</span>
              {(hasPrayed || (isFuture && hasScheduled) || (isToday && hasScheduled)) && (
                <span className={`prayer-cal-day-dot ${hasPrayed ? 'prayer-cal-day-dot--filled' : ''}`} />
              )}
            </div>
          );
        })}
      </div>
      {todaySchedule.length > 0 && !selectedDay && (
        <div className="prayer-cal-focus-line">
          Today's focus:{' '}
          {todaySchedule.map(cat => {
            const c = getCategoryByValue(cat, allCategories);
            return <span key={cat} className="prayer-cal-focus-pill" style={{ borderColor: c.color, color: c.color }}>{c.label}</span>;
          })}
        </div>
      )}
      {selectedDay && (
        <DayPopover
          date={selectedDay}
          hasPrayed={prayerLogDates.has(getDateStr(selectedDay))}
          scheduled={schedule[getDayName(selectedDay)] || []}
          allCategories={allCategories}
          onLogDate={onLogDate}
          onRemoveDate={onRemoveDate}
          onClose={() => setSelectedDay(null)}
        />
      )}
      <button className="prayer-cal-month-link" onClick={onNavigateToFull}>
        {daysPrayedThisMonth} day{daysPrayedThisMonth !== 1 ? 's' : ''} prayed this month
      </button>
    </div>
  );
}

// ─── FULL MODE ─────────────────────────────────────────────────
function FullCalendar({ prayerLogDates, schedule, onUpdateDay, allCategories, onClose, onLogDate, onRemoveDate }) {
  const now = new Date();
  const todayStr = getTodayString();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDate(null);
  };

  const monthName = new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Build calendar grid
  const gridCells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(viewYear, viewMonth, d));
    }
    return cells;
  }, [viewYear, viewMonth]);

  // Stats for the month
  const monthStats = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    let prayedDays = 0;
    const monthDates = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d);
      const dateStr = getDateStr(date);
      monthDates.push(dateStr);
      if (prayerLogDates.has(dateStr)) prayedDays++;
    }
    let bestStreak = 0, currentStreak = 0;
    monthDates.forEach(dateStr => {
      if (prayerLogDates.has(dateStr)) { currentStreak++; bestStreak = Math.max(bestStreak, currentStreak); }
      else { currentStreak = 0; }
    });
    const daysPassed = monthDates.filter(ds => ds <= todayStr).length;
    const consistency = daysPassed > 0 ? Math.round((prayedDays / daysPassed) * 100) : 0;
    return { prayedDays, bestStreak, consistency };
  }, [prayerLogDates, viewYear, viewMonth, todayStr]);

  return (
    <div className="prayer-cal-full">
      <div className="prayer-cal-full-header">
        <button className="prayer-cal-back" onClick={onClose} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h2 className="prayer-cal-full-title">Prayer Calendar</h2>
      </div>

      <div className="prayer-cal-month-nav">
        <button className="prayer-cal-nav-btn" onClick={prevMonth}><ChevronLeft size={20} /></button>
        <span className="prayer-cal-month-name">{monthName}</span>
        <button className="prayer-cal-nav-btn" onClick={nextMonth}><ChevronRight size={20} /></button>
      </div>

      <div className="prayer-cal-grid" key={`${viewYear}-${viewMonth}`}>
        {DAY_LETTERS.map((l, i) => (
          <div key={`h-${i}`} className="prayer-cal-grid-head">{l}</div>
        ))}
        {gridCells.map((date, i) => {
          if (!date) return <div key={`e-${i}`} className="prayer-cal-cell prayer-cal-cell--empty" />;
          const dateStr = getDateStr(date);
          const isToday = dateStr === todayStr;
          const hasPrayed = prayerLogDates.has(dateStr);
          const isSelected = selectedDate && getDateStr(selectedDate) === dateStr;
          const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const isFuture = date > todayDate;

          let cls = 'prayer-cal-cell';
          if (hasPrayed) cls += ' prayer-cal-cell--prayed';
          else if (isToday) cls += ' prayer-cal-cell--today';
          else if (isFuture) cls += ' prayer-cal-cell--future';
          if (isSelected) cls += ' prayer-cal-cell--selected';

          return (
            <div
              key={dateStr}
              className={cls}
              style={{ '--stagger': i }}
              onClick={() => setSelectedDate(prev => prev && getDateStr(prev) === dateStr ? null : date)}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      <div className="prayer-cal-stats">
        <div className="prayer-cal-stat">
          <span className="prayer-cal-stat-num">{monthStats.prayedDays}</span>
          <span className="prayer-cal-stat-label">days prayed</span>
        </div>
        <div className="prayer-cal-stat">
          <span className="prayer-cal-stat-num">{monthStats.bestStreak}</span>
          <span className="prayer-cal-stat-label">best streak</span>
        </div>
        <div className="prayer-cal-stat">
          <span className="prayer-cal-stat-num">{monthStats.consistency}%</span>
          <span className="prayer-cal-stat-label">consistency</span>
        </div>
      </div>

      {selectedDate && (
        <DayPopover
          date={selectedDate}
          hasPrayed={prayerLogDates.has(getDateStr(selectedDate))}
          scheduled={schedule[getDayName(selectedDate)] || []}
          allCategories={allCategories}
          onLogDate={onLogDate}
          onRemoveDate={onRemoveDate}
          onClose={() => setSelectedDate(null)}
        />
      )}

      {/* Weekly schedule section */}
      <div className="prayer-cal-schedule-section">
        <div className="prayer-cal-schedule-header">
          <h3 className="prayer-cal-schedule-title">My Prayer Schedule</h3>
          <button className="prayer-cal-edit-btn" onClick={() => setShowEditor(!showEditor)}>
            {showEditor ? <X size={16} /> : <Pencil size={16} />}
          </button>
        </div>

        {showEditor ? (
          <ScheduleEditor
            schedule={schedule}
            onUpdateDay={onUpdateDay}
            allCategories={allCategories}
            onClose={() => setShowEditor(false)}
          />
        ) : (
          <div className="prayer-cal-schedule-list">
            {DAY_NAMES.map((dayName, i) => {
              const cats = schedule[dayName] || [];
              return (
                <div key={dayName} className="prayer-cal-schedule-row" onClick={() => setShowEditor(true)}>
                  <span className="prayer-cal-schedule-day">{DAY_LABELS[i]}</span>
                  <div className="prayer-cal-schedule-cats">
                    {cats.length > 0 ? cats.map(cat => {
                      const c = getCategoryByValue(cat, allCategories);
                      return <span key={cat} className="prayer-cal-pill prayer-cal-pill--active" style={{ background: c.color }}>{c.label}</span>;
                    }) : (
                      <span className="prayer-cal-schedule-empty">No prayers set</span>
                    )}
                  </div>
                  <Pencil size={14} className="prayer-cal-schedule-edit-icon" />
                </div>
              );
            })}
          </div>
        )}

        <p className="prayer-cal-schedule-note">
          Your schedule helps you pray with intention every day of the week
        </p>
      </div>

      {monthStats.prayedDays === 0 && viewYear === now.getFullYear() && viewMonth === now.getMonth() && (
        <div className="prayer-cal-empty">
          <span className="prayer-cal-empty-icon">🕯️</span>
          <p>Your prayer history will appear here as you pray each day.</p>
          <p className="prayer-cal-empty-sub">Start today — tap 'I prayed' on the home screen.</p>
        </div>
      )}
    </div>
  );
}

// ─── SCHEDULE EDITOR ───────────────────────────────────────────
function ScheduleEditor({ schedule, onUpdateDay, allCategories, onClose }) {
  return (
    <div className="prayer-cal-editor">
      {DAY_NAMES.map((dayName, i) => {
        const selected = schedule[dayName] || [];
        return (
          <div key={dayName} className="prayer-cal-editor-row">
            <span className="prayer-cal-editor-day">{DAY_LABELS[i]}</span>
            <div className="prayer-cal-pills">
              {allCategories.map(cat => {
                const isActive = selected.includes(cat.value);
                return (
                  <button
                    key={cat.value}
                    className={`prayer-cal-pill ${isActive ? 'prayer-cal-pill--active' : 'prayer-cal-pill--inactive'}`}
                    style={isActive ? { background: cat.color } : { borderColor: cat.color, color: cat.color }}
                    onClick={() => {
                      const next = isActive ? selected.filter(v => v !== cat.value) : [...selected, cat.value];
                      onUpdateDay(dayName, next);
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <button className="btn btn-primary prayer-cal-editor-done" onClick={onClose}>Done</button>
    </div>
  );
}

// ─── MAIN EXPORT ───────────────────────────────────────────────
export default function PrayerCalendar({ mode, prayerLogDates, schedule, onUpdateDay, allCategories, onClose, onNavigateToFull, onLogDate, onRemoveDate }) {
  if (mode === 'compact') {
    return (
      <CompactStrip
        prayerLogDates={prayerLogDates}
        schedule={schedule}
        allCategories={allCategories}
        onNavigateToFull={onNavigateToFull}
        onLogDate={onLogDate}
        onRemoveDate={onRemoveDate}
      />
    );
  }

  return (
    <FullCalendar
      prayerLogDates={prayerLogDates}
      schedule={schedule}
      onUpdateDay={onUpdateDay}
      allCategories={allCategories}
      onClose={onClose}
      onLogDate={onLogDate}
      onRemoveDate={onRemoveDate}
    />
  );
}

import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CalendarDays, Pencil, X } from 'lucide-react';
import { getCategoryByValue } from '../utils/constants';

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getDateStr(d) {
  return d.toISOString().split('T')[0];
}

function getDayName(d) {
  return DAY_NAMES[d.getDay()];
}

// ─── COMPACT MODE ──────────────────────────────────────────────
function CompactStrip({ prayerLogDates, schedule, allCategories, onNavigateToFull }) {
  const scrollRef = useRef(null);
  const todayRef = useRef(null);
  const today = new Date();
  const todayStr = getDateStr(today);

  // Generate 21 days: 14 past + today + 6 future
  const days = useMemo(() => {
    const result = [];
    for (let i = -14; i <= 6; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
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

  // Today's scheduled categories
  const todaySchedule = schedule[getDayName(today)] || [];

  return (
    <div className="prayer-cal-strip">
      <div className="prayer-cal-strip-scroll" ref={scrollRef}>
        {days.map((d, i) => {
          const dateStr = getDateStr(d);
          const isToday = dateStr === todayStr;
          const isPast = d < today && !isToday;
          const isFuture = d > today;
          const hasPrayed = prayerLogDates.has(dateStr);
          const dayName = getDayName(d);
          const hasScheduled = (schedule[dayName] || []).length > 0;

          let cls = 'prayer-cal-day';
          if (isToday) cls += ' prayer-cal-day--today';
          if (hasPrayed) cls += ' prayer-cal-day--prayed';
          if (isFuture) cls += ' prayer-cal-day--future';
          if (isPast && !hasPrayed) cls += ' prayer-cal-day--missed';

          return (
            <div
              key={dateStr}
              className={cls}
              ref={isToday ? todayRef : undefined}
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
      {todaySchedule.length > 0 && (
        <div className="prayer-cal-focus-line">
          Today's focus:{' '}
          {todaySchedule.map(cat => {
            const c = getCategoryByValue(cat, allCategories);
            return (
              <span key={cat} className="prayer-cal-focus-pill" style={{ borderColor: c.color, color: c.color }}>
                {c.label}
              </span>
            );
          })}
        </div>
      )}
      <button className="prayer-cal-month-link" onClick={onNavigateToFull}>
        {daysPrayedThisMonth} day{daysPrayedThisMonth !== 1 ? 's' : ''} prayed this month
      </button>
    </div>
  );
}

// ─── FULL MODE ─────────────────────────────────────────────────
function FullCalendar({ prayerLogDates, schedule, onUpdateDay, allCategories, onClose }) {
  const today = new Date();
  const todayStr = getDateStr(today);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingDay, setEditingDay] = useState(null);
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
    // Padding for days before month start
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d);
      cells.push(date);
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

    // Best streak in month
    let bestStreak = 0, currentStreak = 0;
    monthDates.forEach(dateStr => {
      if (prayerLogDates.has(dateStr)) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    // Days passed so far (for consistency calc)
    const daysPassed = monthDates.filter(ds => ds <= todayStr).length;
    const consistency = daysPassed > 0 ? Math.round((prayedDays / daysPassed) * 100) : 0;

    return { prayedDays, bestStreak, consistency };
  }, [prayerLogDates, viewYear, viewMonth, todayStr]);

  // Selected date details
  const selectedDetails = useMemo(() => {
    if (!selectedDate) return null;
    const dateStr = getDateStr(selectedDate);
    const hasPrayed = prayerLogDates.has(dateStr);
    const dayName = getDayName(selectedDate);
    const scheduled = schedule[dayName] || [];
    const isPast = selectedDate <= today;
    return { dateStr, hasPrayed, dayName, scheduled, isPast };
  }, [selectedDate, prayerLogDates, schedule, todayStr]);

  return (
    <div className="prayer-cal-full">
      {/* Header */}
      <div className="prayer-cal-full-header">
        <button className="prayer-cal-back" onClick={onClose} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h2 className="prayer-cal-full-title">Prayer Calendar</h2>
      </div>

      {/* Month navigation */}
      <div className="prayer-cal-month-nav">
        <button className="prayer-cal-nav-btn" onClick={prevMonth}><ChevronLeft size={20} /></button>
        <span className="prayer-cal-month-name">{monthName}</span>
        <button className="prayer-cal-nav-btn" onClick={nextMonth}><ChevronRight size={20} /></button>
      </div>

      {/* Month grid */}
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
          const isFuture = date > today;

          let cls = 'prayer-cal-cell';
          if (hasPrayed) cls += ' prayer-cal-cell--prayed';
          if (isToday) cls += ' prayer-cal-cell--today';
          if (isSelected) cls += ' prayer-cal-cell--selected';
          if (isFuture) cls += ' prayer-cal-cell--future';

          return (
            <div
              key={dateStr}
              className={cls}
              style={{ '--stagger': i }}
              onClick={() => setSelectedDate(date)}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      {/* Stats */}
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

      {/* Selected day detail */}
      {selectedDetails && (
        <div className="prayer-cal-detail">
          <div className="prayer-cal-detail-header">
            <span className="prayer-cal-detail-date">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
            <button className="prayer-cal-detail-close" onClick={() => setSelectedDate(null)}>
              <X size={16} />
            </button>
          </div>
          {selectedDetails.hasPrayed ? (
            <p className="prayer-cal-detail-status prayer-cal-detail-status--prayed">
              ✓ You prayed on this day
            </p>
          ) : selectedDetails.isPast ? (
            <p className="prayer-cal-detail-status prayer-cal-detail-status--missed">
              A quiet day. Every rest is sacred.
            </p>
          ) : (
            <p className="prayer-cal-detail-status prayer-cal-detail-status--future">
              Come back on {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })} to pray
            </p>
          )}
          {selectedDetails.scheduled.length > 0 && (
            <div className="prayer-cal-detail-scheduled">
              <span className="prayer-cal-detail-scheduled-label">Scheduled:</span>
              {selectedDetails.scheduled.map(cat => {
                const c = getCategoryByValue(cat, allCategories);
                return (
                  <span key={cat} className="prayer-cal-focus-pill" style={{ borderColor: c.color, color: c.color }}>
                    {c.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
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
                <div key={dayName} className="prayer-cal-schedule-row" onClick={() => { setEditingDay(dayName); setShowEditor(true); }}>
                  <span className="prayer-cal-schedule-day">{DAY_LABELS[i]}</span>
                  <div className="prayer-cal-schedule-cats">
                    {cats.length > 0 ? cats.map(cat => {
                      const c = getCategoryByValue(cat, allCategories);
                      return (
                        <span key={cat} className="prayer-cal-pill prayer-cal-pill--active" style={{ background: c.color }}>
                          {c.label}
                        </span>
                      );
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

      {/* Empty state for no history */}
      {monthStats.prayedDays === 0 && viewYear === today.getFullYear() && viewMonth === today.getMonth() && (
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
                      const next = isActive
                        ? selected.filter(v => v !== cat.value)
                        : [...selected, cat.value];
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
      <button className="btn btn-primary prayer-cal-editor-done" onClick={onClose}>
        Done
      </button>
    </div>
  );
}

// ─── MAIN EXPORT ───────────────────────────────────────────────
export default function PrayerCalendar({ mode, prayerLogDates, schedule, onUpdateDay, allCategories, onClose, onNavigateToFull }) {
  if (mode === 'compact') {
    return (
      <CompactStrip
        prayerLogDates={prayerLogDates}
        schedule={schedule}
        allCategories={allCategories}
        onNavigateToFull={onNavigateToFull}
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
    />
  );
}

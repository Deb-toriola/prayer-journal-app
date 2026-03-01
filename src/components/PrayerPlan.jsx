import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CalendarCheck, Plus, X, Check, Trash2, ChevronRight, Timer, RotateCcw, Play, Square,
  MessageSquarePlus, ChevronDown, ChevronUp, BookMarked, Ear, Sparkles, Eye, BookOpen,
} from 'lucide-react';
import { PLAN_TEMPLATES, PLAN_CATEGORIES } from '../hooks/usePrayerPlan';
import { formatRelativeDate } from '../utils/constants';
import { getScriptureUrl } from '../utils/bibleBooks';
import ScripturePicker from './ScripturePicker';
import PrayerPartners from './PrayerPartners';

const PLAN_NOTE_TYPES = [
  { value: 'update',       label: 'Update',         icon: MessageSquarePlus, color: '#7C3AED', placeholder: 'What\'s happening in this journey...' },
  { value: 'word',         label: 'Word from God',  icon: Ear,               color: '#D97706', placeholder: 'What is the Lord saying...' },
  { value: 'scripture',    label: 'Scripture',      icon: BookMarked,        color: '#059669', placeholder: 'A scripture He laid on your heart...' },
  { value: 'confirmation', label: 'Confirmation',   icon: Sparkles,          color: '#2563EB', placeholder: 'A sign, confirmation, or witness...' },
  { value: 'vision',       label: 'Vision / Dream', icon: Eye,               color: '#9333EA', placeholder: 'What did you see...' },
];

function getPlanNoteType(type) {
  return PLAN_NOTE_TYPES.find(t => t.value === type) || PLAN_NOTE_TYPES[0];
}

/* ─── Inline plan timer (stopwatch + countdown) ─── */
function PlanTimer() {
  const [mode, setMode] = useState('stopwatch');
  const [countdownMins, setCountdownMins] = useState(20);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const baseElapsedRef = useRef(0);

  const totalCountdownSecs = countdownMins * 60;

  const tick = useCallback(() => {
    const delta = Math.floor((Date.now() - startTimeRef.current) / 1000) + baseElapsedRef.current;
    if (mode === 'countdown') {
      const remaining = totalCountdownSecs - delta;
      if (remaining <= 0) {
        setElapsed(0);
        setRunning(false);
        setFinished(true);
        clearInterval(intervalRef.current);
      } else {
        setElapsed(remaining);
      }
    } else {
      setElapsed(delta);
    }
  }, [mode, totalCountdownSecs]);

  useEffect(() => {
    if (running) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(tick, 500);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, tick]);

  const handleStart = () => {
    setFinished(false);
    baseElapsedRef.current = elapsed;
    startTimeRef.current = Date.now();
    setRunning(true);
  };

  const handleStop = () => {
    baseElapsedRef.current = elapsed;
    setRunning(false);
  };

  const handleReset = () => {
    setRunning(false);
    setFinished(false);
    baseElapsedRef.current = 0;
    setElapsed(0);
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setRunning(false);
    setFinished(false);
    baseElapsedRef.current = 0;
    setElapsed(0);
  };

  const fmt = (secs) => {
    const m = Math.floor(Math.abs(secs) / 60);
    const s = Math.abs(secs) % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const displaySecs = mode === 'countdown'
    ? (running || elapsed > 0 ? elapsed : totalCountdownSecs)
    : elapsed;

  return (
    <div className="plan-timer">
      <div className="plan-timer-mode-row">
        <Timer size={13} />
        <button
          className={`plan-timer-mode-btn ${mode === 'stopwatch' ? 'plan-timer-mode-active' : ''}`}
          onClick={() => handleModeSwitch('stopwatch')}
        >Stopwatch</button>
        <span className="plan-timer-divider">|</span>
        <button
          className={`plan-timer-mode-btn ${mode === 'countdown' ? 'plan-timer-mode-active' : ''}`}
          onClick={() => handleModeSwitch('countdown')}
        >Countdown</button>
      </div>

      {mode === 'countdown' && !running && elapsed === 0 && (
        <div className="plan-timer-countdown-setup">
          <input
            className="plan-timer-mins-input"
            type="number"
            min="1"
            max="120"
            value={countdownMins}
            onChange={(e) => setCountdownMins(Math.max(1, parseInt(e.target.value) || 1))}
          />
          <span className="plan-timer-mins-label">min</span>
        </div>
      )}

      {finished ? (
        <div className="plan-timer-finished">Time&apos;s up — well done! 🙏</div>
      ) : (
        <div className={`plan-timer-display ${running ? 'plan-timer-display-running' : ''}`}>
          {fmt(displaySecs)}
        </div>
      )}

      <div className="plan-timer-controls">
        {!running ? (
          <button className="plan-timer-btn plan-timer-btn-start" onClick={handleStart}>
            <Play size={13} /> {elapsed > 0 ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button className="plan-timer-btn plan-timer-btn-stop" onClick={handleStop}>
            <Square size={13} /> Stop
          </button>
        )}
        <button className="plan-timer-btn plan-timer-btn-reset" onClick={handleReset} title="Reset">
          <RotateCcw size={13} />
        </button>
      </div>
    </div>
  );
}

/* ─── Single active plan card ─── */
function PlanCard({ plan, onCheckIn, onDelete, today, onAddNote, onDeleteNote, bibleTranslation, onAddPartner, onRemovePartner, onLogPartnerPrayed, onUndoPartnerPrayed }) {
  const [showTimer, setShowTimer] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('update');

  // Local partner timer state (isolated per plan card)
  const [partnerTimerId, setPartnerTimerId] = useState(null);
  const [partnerTimerElapsed, setPartnerTimerElapsed] = useState(0);
  const partnerTimerRef = useRef(null);
  const partnerStartRef = useRef(null);
  const partnerBaseRef = useRef(0);

  const handleStartPartnerTimer = useCallback((partnerId) => {
    clearInterval(partnerTimerRef.current);
    partnerBaseRef.current = 0;
    partnerStartRef.current = Date.now();
    setPartnerTimerId(partnerId);
    setPartnerTimerElapsed(0);
    partnerTimerRef.current = setInterval(() => {
      setPartnerTimerElapsed(Math.floor((Date.now() - partnerStartRef.current) / 1000));
    }, 500);
  }, []);

  const handleStopPartnerTimer = useCallback(() => {
    clearInterval(partnerTimerRef.current);
    setPartnerTimerId(null);
    setPartnerTimerElapsed(0);
    partnerBaseRef.current = 0;
  }, []);

  // Clean up timer on unmount
  useEffect(() => () => clearInterval(partnerTimerRef.current), []);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    onAddNote(plan.id, newNote.trim(), noteType);
    setNewNote('');
  };
  const startDate = new Date(plan.startDate);
  const start = new Date(plan.startDate);
  const now = new Date(today);
  const currentDayNumber = Math.min(Math.floor((now - start) / 86400000) + 1, plan.totalDays);
  const hasPrayedToday = plan.checkedDays.includes(today);
  const isComplete = plan.checkedDays.length >= plan.totalDays;

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
          <button className="btn-icon prayer-plan-delete-btn" onClick={() => onDelete(plan.id)} title="Delete plan">
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

          let cls = 'prayer-plan-day';
          if (isChecked) cls += ' prayer-plan-day-checked';
          else if (isCurrent) cls += ' prayer-plan-day-current';
          else if (dateStr > today) cls += ' prayer-plan-day-future';
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

      {/* Timer toggle */}
      <button className="plan-timer-toggle" onClick={() => setShowTimer(v => !v)}>
        <Timer size={13} />
        {showTimer ? 'Hide timer' : 'Start prayer timer'}
      </button>

      {showTimer && <PlanTimer />}

      {isComplete ? (
        <div className="prayer-plan-complete-msg">
          ✨ You completed the {plan.name}! Amazing faithfulness.
        </div>
      ) : hasPrayedToday ? (
        <div className="prayer-plan-checked-today">
          ✨ You prayed today — keep it up!
        </div>
      ) : (
        <button className="prayer-plan-checkin-btn" onClick={() => onCheckIn(plan.id)}>
          <CalendarCheck size={15} />
          I prayed today
        </button>
      )}

      {/* Journey & Updates */}
      <div className="prayer-notes-section">
        <button className="prayer-notes-toggle" onClick={() => setShowNotes(!showNotes)}>
          <MessageSquarePlus size={13} />
          <span>Journey & Updates {(plan.notes || []).length > 0 ? `(${plan.notes.length})` : ''}</span>
          {showNotes ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        {showNotes && (
          <div className="prayer-notes-body">
            {(plan.notes || []).length > 0 && (
              <div className="prayer-notes-list">
                {(plan.notes || []).map((note) => {
                  const nt = getPlanNoteType(note.type);
                  const NoteIcon = nt.icon;
                  return (
                    <div key={note.id} className="prayer-note" style={{ borderLeftColor: nt.color }}>
                      <div className="prayer-note-type-icon" style={{ color: nt.color }}>
                        <NoteIcon size={12} />
                      </div>
                      <div className="prayer-note-content">
                        <span className="prayer-note-type-label" style={{ color: nt.color }}>{nt.label}</span>
                        {note.type === 'scripture' ? (() => {
                          const translation = bibleTranslation || 'NKJV';
                          const browserUrl = getScriptureUrl(note.text, translation);
                          return browserUrl
                            ? <a href={browserUrl} target="_blank" rel="noopener noreferrer" className="prayer-note-scripture-link" onClick={(e) => e.stopPropagation()}><BookOpen size={11} /><span>{note.text}</span><span className="scripture-open-hint">↗</span></a>
                            : <p>{note.text}</p>;
                        })() : <p>{note.text}</p>}
                        <span className="prayer-note-date">{formatRelativeDate(note.createdAt)}</span>
                      </div>
                      <button className="prayer-note-delete" onClick={() => onDeleteNote(plan.id, note.id)} aria-label="Delete note">
                        <X size={11} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="prayer-note-add-section">
              <div className="note-type-chips">
                {PLAN_NOTE_TYPES.map((nt) => {
                  const ChipIcon = nt.icon;
                  return (
                    <button
                      key={nt.value}
                      className={`note-type-chip ${noteType === nt.value ? 'note-type-chip-active' : ''}`}
                      style={noteType === nt.value ? { background: nt.color, borderColor: nt.color } : { borderColor: nt.color + '44', color: nt.color }}
                      onClick={() => setNoteType(nt.value)}
                    >
                      <ChipIcon size={10} /> {nt.label}
                    </button>
                  );
                })}
              </div>
              <div className={`prayer-note-add${noteType === 'scripture' ? ' prayer-note-add-scripture' : ''}`}>
                {noteType === 'scripture' ? (
                  <ScripturePicker value={newNote} onChange={setNewNote} />
                ) : (
                  <input
                    type="text" className="prayer-note-input"
                    placeholder={getPlanNoteType(noteType).placeholder}
                    value={newNote} onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                    maxLength={500}
                  />
                )}
                <button className="btn-note-add" onClick={handleAddNote} disabled={!newNote.trim()}>Add</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Prayer Partners */}
      <PrayerPartners
        prayer={{ id: plan.id, title: plan.name, content: '', scripture: '', answered: false, partners: plan.partners || [] }}
        onAddPartner={(name) => onAddPartner(plan.id, name)}
        onRemovePartner={(partnerId) => onRemovePartner(plan.id, partnerId)}
        onLogPartnerPrayed={(partnerId) => onLogPartnerPrayed(plan.id, partnerId)}
        onUndoPartnerPrayed={(partnerId) => onUndoPartnerPrayed(plan.id, partnerId)}
        timerPrayerId={plan.id}
        timerPartnerId={partnerTimerId}
        timerElapsed={partnerTimerElapsed}
        onStartPartnerTimer={handleStartPartnerTimer}
        onStopPartnerTimer={handleStopPartnerTimer}
      />
    </div>
  );
}

/* ─── Featured category section (Thanksgiving / Intercession) ─── */
function FeaturedPlanSection({ categoryId, label, onStart }) {
  const templates = PLAN_TEMPLATES.filter(t => t.category === categoryId);
  return (
    <div className="plan-featured-section">
      <div className="plan-featured-header">{label}</div>
      <div className="plan-featured-cards">
        {templates.map(t => (
          <div key={t.id} className="plan-featured-card">
            <div className="plan-featured-card-top">
              <span className="plan-featured-card-icon">{t.icon}</span>
              <span className="plan-featured-card-days">{t.days} days</span>
            </div>
            <div className="plan-featured-card-name">{t.name}</div>
            <div className="plan-featured-card-desc">{t.desc}</div>
            <button
              className="plan-featured-card-btn"
              onClick={() => onStart(t.id, '', null)}
            >
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main PrayerPlan component ─── */
export default function PrayerPlan({
  plans,
  onStart,
  onCheckIn,
  onDelete,
  onAddNote,
  onDeleteNote,
  onAddPartner,
  onRemovePartner,
  onLogPartnerPrayed,
  onUndoPartnerPrayed,
  completedPlansCount,
  today,
  bibleTranslation,
}) {
  const [showCreator, setShowCreator] = useState(false);
  const [customName, setCustomName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customDays, setCustomDays] = useState('');
  const QUICK_DAYS = [7, 14, 21, 30, 40];
  const habitsTemplates = PLAN_TEMPLATES.filter(t => t.category === 'habits');

  const handleStart = () => {
    onStart(selectedTemplate, customName, customDays || (selectedTemplate ? null : '7'));
    setShowCreator(false);
    setCustomName('');
    setSelectedTemplate(null);
    setCustomDays('');
  };

  const canStart = selectedTemplate || (customDays && parseInt(customDays) > 0);

  return (
    <>
      {/* Active plan cards */}
      {plans.map(plan => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onCheckIn={onCheckIn}
          onDelete={onDelete}
          today={today}
          onAddNote={onAddNote}
          onDeleteNote={onDeleteNote}
          bibleTranslation={bibleTranslation}
          onAddPartner={onAddPartner}
          onRemovePartner={onRemovePartner}
          onLogPartnerPrayed={onLogPartnerPrayed}
          onUndoPartnerPrayed={onUndoPartnerPrayed}
        />
      ))}

      {/* Thanksgiving & Praise — always visible top-level section */}
      <FeaturedPlanSection
        categoryId="thanksgiving"
        label="🙌 Thanksgiving & Praise"
        onStart={onStart}
      />

      {/* Personal Intercession — always visible top-level section */}
      <FeaturedPlanSection
        categoryId="intercession"
        label="🛡️ Personal Intercession"
        onStart={onStart}
      />

      {/* Prayer Habits — collapsible picker, habits templates only */}
      <div className="prayer-plan-card">
        <div className="prayer-plan-label">
          <CalendarCheck size={15} />
          <span>Prayer Habits</span>
          {completedPlansCount > 0 && (
            <span className="prayer-plan-completed-count">🏆 {completedPlansCount} completed</span>
          )}
        </div>

        {!showCreator ? (
          <button className="prayer-plan-empty-btn" onClick={() => setShowCreator(true)}>
            <Plus size={15} />
            {plans.length > 0 ? 'Add a habits plan' : 'Start a Prayer Plan'}
          </button>
        ) : (
          <div className="prayer-plan-creator">
            <div className="prayer-plan-creator-header">
              <span className="prayer-plan-creator-title">Prayer Habits</span>
              <button className="btn-icon" onClick={() => setShowCreator(false)}>
                <X size={16} />
              </button>
            </div>

            {habitsTemplates.map((t) => (
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
    </>
  );
}

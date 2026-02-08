import { useState } from 'react';
import {
  MoreVertical, Pencil, Trash2, CheckCircle2, RotateCcw, BookOpen,
  Calendar, Heart, Undo2, AlertTriangle, MessageSquarePlus,
  ChevronDown, ChevronUp, X, Ear, Sparkles, Users2, BookMarked, Eye,
  Timer, Square, Clock,
} from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import PrayerPartners from './PrayerPartners';
import { formatRelativeDate, getCategoryByValue } from '../utils/constants';
import { formatDuration, formatDurationReadable } from '../hooks/usePrayerTimer';

const NOTE_TYPES = [
  { value: 'update', label: 'Update', icon: MessageSquarePlus, color: '#7C3AED', placeholder: 'What\u2019s happening with this prayer...' },
  { value: 'word', label: 'Word from God', icon: Ear, color: '#D97706', placeholder: 'What is the Lord saying...' },
  { value: 'scripture', label: 'Scripture', icon: BookMarked, color: '#059669', placeholder: 'A scripture He laid on your heart...' },
  { value: 'confirmation', label: 'Confirmation', icon: Sparkles, color: '#2563EB', placeholder: 'A sign, confirmation, or witness...' },
  { value: 'vision', label: 'Vision / Dream', icon: Eye, color: '#9333EA', placeholder: 'What did you see...' },
];

function getNoteType(type) {
  return NOTE_TYPES.find((t) => t.value === type) || NOTE_TYPES[0];
}

function getLastPrayedText(prayerLog) {
  if (!prayerLog || prayerLog.length === 0) return null;
  return formatRelativeDate(prayerLog[prayerLog.length - 1]);
}

export default function PrayerCard({
  prayer, onEdit, onDelete, onMarkAnswered, onRestore,
  onLogPrayed, onUndoLog, onToggleUrgent, onAddNote, onDeleteNote,
  onAddPartner, onRemovePartner, onLogPartnerPrayed, onUndoPartnerPrayed,
  allCategories,
  isTimerRunning, timerElapsed, onStartTimer, onStopTimer,
  timerPrayerId, timerPartnerId, onStartPartnerTimer, onStopPartnerTimer,
}) {
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [justLogged, setJustLogged] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('update');
  const [showTestimonyPrompt, setShowTestimonyPrompt] = useState(false);
  const [testimonyNote, setTestimonyNote] = useState('');
  const [celebrating, setCelebrating] = useState(false);

  const handleAction = (action) => { setMenuOpen(false); action(); };

  const handleLogPrayed = (e) => {
    e.stopPropagation();
    onLogPrayed();
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 2000);
  };

  const handleMarkAnswered = () => {
    setMenuOpen(false);
    setShowTestimonyPrompt(true);
    setExpanded(true);
  };

  const handleConfirmAnswered = () => {
    onMarkAnswered(testimonyNote.trim());
    setShowTestimonyPrompt(false);
    setTestimonyNote('');
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 2000);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    onAddNote(newNote.trim(), noteType);
    setNewNote('');
  };

  const handleCardClick = (e) => {
    // Don't toggle if clicking interactive elements
    if (e.target.closest('button, input, textarea, a, .prayer-card-menu, .menu-backdrop')) return;
    setExpanded(!expanded);
  };

  const prayerCount = (prayer.prayerLog || []).length;
  const lastPrayed = getLastPrayedText(prayer.prayerLog);
  const notes = prayer.notes || [];
  const sessions = prayer.prayerSessions || [];
  const totalPrayerTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const cat = getCategoryByValue(prayer.category, allCategories);

  const cardClasses = [
    'prayer-card',
    expanded ? 'prayer-card-expanded' : '',
    prayer.answered ? 'prayer-card-answered' : '',
    prayer.urgent && !prayer.answered ? 'prayer-card-urgent' : '',
    celebrating ? 'prayer-card-celebrating' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={handleCardClick} aria-expanded={expanded}>
      {/* === COLLAPSED VIEW (always visible) === */}
      <div className="prayer-card-collapsed">
        <div className="prayer-card-collapsed-left">
          <span
            className="prayer-card-category-dot"
            style={{ backgroundColor: cat.color }}
            title={cat.label}
          />
          <div className="prayer-card-collapsed-text">
            <h3 className="prayer-card-title">{prayer.title}</h3>
            <p className="prayer-card-content">{prayer.content}</p>
          </div>
        </div>
        <div className="prayer-card-collapsed-right">
          <div className="prayer-card-compact-stats">
            {prayerCount > 0 && (
              <span className="prayer-card-stat">
                <Heart size={10} fill="#EC4899" color="#EC4899" /> {prayerCount}
              </span>
            )}
            {totalPrayerTime > 0 && (
              <span className="prayer-card-stat">
                <Clock size={10} /> {formatDurationReadable(totalPrayerTime)}
              </span>
            )}
          </div>
          {!prayer.answered && (
            <button
              className={`btn-log-pray btn-log-pray-compact ${justLogged ? 'btn-log-pray-active' : ''}`}
              onClick={handleLogPrayed}
              title="I prayed"
              aria-label="I prayed"
            >
              <Heart size={14} fill={justLogged ? 'currentColor' : 'none'} />
            </button>
          )}
          {prayer.answered && (
            <CheckCircle2 size={16} className="prayer-card-answered-icon" />
          )}
        </div>
      </div>

      {/* === EXPANDED VIEW (progressive disclosure) === */}
      <div className="prayer-card-expandable">
        <div className="prayer-card-expandable-inner">
          {/* Top bar: category badge + menu */}
          <div className="prayer-card-top">
            <div className="prayer-card-top-left">
              <CategoryBadge category={prayer.category} allCategories={allCategories} />
              {prayer.urgent && !prayer.answered && <span className="urgent-badge">Urgent</span>}
            </div>
            <div className="prayer-card-menu-wrapper">
              <button className="btn-icon" onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); setConfirmDelete(false); }} aria-label="More options">
                <MoreVertical size={16} />
              </button>
              {menuOpen && (
                <>
                  <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />
                  <div className="prayer-card-menu" role="menu">
                    {!prayer.answered ? (
                      <>
                        <button className="menu-item" role="menuitem" onClick={() => handleAction(onEdit)}><Pencil size={14} /> Edit</button>
                        <button className="menu-item" role="menuitem" onClick={() => handleAction(onToggleUrgent)}>
                          <AlertTriangle size={14} /> {prayer.urgent ? 'Remove Urgent' : 'Mark Urgent'}
                        </button>
                        <button className="menu-item menu-item-gold" role="menuitem" onClick={handleMarkAnswered}>
                          <CheckCircle2 size={14} /> Mark Answered
                        </button>
                      </>
                    ) : (
                      <button className="menu-item" role="menuitem" onClick={() => handleAction(onRestore)}>
                        <RotateCcw size={14} /> Restore to Active
                      </button>
                    )}
                    {!confirmDelete ? (
                      <button className="menu-item menu-item-danger" role="menuitem" onClick={() => setConfirmDelete(true)}>
                        <Trash2 size={14} /> Delete
                      </button>
                    ) : (
                      <button className="menu-item menu-item-danger" role="menuitem" onClick={() => handleAction(onDelete)}>
                        <Trash2 size={14} /> Confirm Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Full content */}
          <p className="prayer-card-content-full">{prayer.content}</p>

          {prayer.scripture && (
            <div className="prayer-card-scripture"><BookOpen size={13} /><span>{prayer.scripture}</span></div>
          )}

          {prayer.answered && prayer.testimonyNote && (
            <div className="testimony-note"><CheckCircle2 size={13} /><p>{prayer.testimonyNote}</p></div>
          )}

          {showTestimonyPrompt && (
            <div className="testimony-prompt">
              <p className="testimony-prompt-title">God answered this prayer!</p>
              <textarea
                className="testimony-prompt-input"
                placeholder="Share your testimony... How did God answer? (optional)"
                value={testimonyNote}
                onChange={(e) => setTestimonyNote(e.target.value)}
                rows={2}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="testimony-prompt-actions">
                <button className="btn btn-sm btn-secondary" onClick={(e) => { e.stopPropagation(); setShowTestimonyPrompt(false); }}>Cancel</button>
                <button className="btn btn-sm btn-primary" onClick={(e) => { e.stopPropagation(); handleConfirmAnswered(); }}>
                  <CheckCircle2 size={13} /> Confirm Answered
                </button>
              </div>
            </div>
          )}

          {/* Prayer log bar */}
          {!prayer.answered && (
            <div className="prayer-log-bar">
              <div className="prayer-log-info">
                <Heart size={12} fill={prayerCount > 1 ? '#EC4899' : 'none'} color="#EC4899" />
                <span className="prayer-log-count" aria-live="polite">Prayed {prayerCount}x</span>
                {lastPrayed && <span className="prayer-log-last">&middot; Last: {lastPrayed}</span>}
              </div>
              <div className="prayer-log-actions">
                {prayerCount > 1 && (
                  <button className="btn-log-undo" onClick={(e) => { e.stopPropagation(); onUndoLog(); }} title="Undo last">
                    <Undo2 size={12} />
                  </button>
                )}
                <button className={`btn-log-pray ${justLogged ? 'btn-log-pray-active' : ''}`} onClick={handleLogPrayed}>
                  <Heart size={13} fill={justLogged ? 'currentColor' : 'none'} /> I prayed
                </button>
              </div>
            </div>
          )}

          {prayer.answered && prayerCount > 0 && (
            <div className="prayer-log-bar prayer-log-bar-answered">
              <div className="prayer-log-info">
                <Heart size={12} fill="#EC4899" color="#EC4899" />
                <span className="prayer-log-count">Covered in prayer {prayerCount} time{prayerCount !== 1 ? 's' : ''} while awaiting manifestation</span>
              </div>
            </div>
          )}

          {/* Prayer Timer */}
          {!prayer.answered && (
            <div className={`prayer-timer-bar ${isTimerRunning ? 'prayer-timer-bar-active' : ''}`}>
              {isTimerRunning ? (
                <>
                  <div className="prayer-timer-info">
                    <Timer size={14} className="prayer-timer-icon-pulse" />
                    <span className="prayer-timer-elapsed" aria-live="polite">{formatDuration(timerElapsed)}</span>
                    <span className="prayer-timer-label">in prayer</span>
                  </div>
                  <button className="btn-timer-stop" onClick={(e) => { e.stopPropagation(); onStopTimer(); }}>
                    <Square size={11} /> Stop
                  </button>
                </>
              ) : (
                <>
                  <div className="prayer-timer-info">
                    <Clock size={13} />
                    {totalPrayerTime > 0 ? (
                      <span className="prayer-timer-total">
                        {formatDurationReadable(totalPrayerTime)} total &middot; {sessions.length} session{sessions.length !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="prayer-timer-total">Time your prayer</span>
                    )}
                  </div>
                  <button className="btn-timer-start" onClick={(e) => { e.stopPropagation(); onStartTimer(); }}>
                    <Timer size={13} /> Start
                  </button>
                </>
              )}
            </div>
          )}

          {prayer.answered && totalPrayerTime > 0 && (
            <div className="prayer-timer-bar prayer-timer-bar-answered">
              <div className="prayer-timer-info">
                <Clock size={13} />
                <span className="prayer-timer-total">
                  {formatDurationReadable(totalPrayerTime)} spent in prayer across {sessions.length} session{sessions.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Journey / Updates */}
          <div className="prayer-notes-section">
            <button className="prayer-notes-toggle" onClick={(e) => { e.stopPropagation(); setShowNotes(!showNotes); }} aria-expanded={showNotes}>
              <MessageSquarePlus size={13} />
              <span>{prayer.answered ? 'Prayer Journey' : 'Journey & Updates'} {notes.length > 0 ? `(${notes.length})` : ''}</span>
              {showNotes ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {showNotes && (
              <div className="prayer-notes-body">
                {notes.length > 0 && (
                  <div className="prayer-notes-list">
                    {notes.map((note) => {
                      const nt = getNoteType(note.type);
                      const NoteIcon = nt.icon;
                      return (
                        <div key={note.id} className="prayer-note" style={{ borderLeftColor: nt.color }}>
                          <div className="prayer-note-type-icon" style={{ color: nt.color }}>
                            <NoteIcon size={12} />
                          </div>
                          <div className="prayer-note-content">
                            <span className="prayer-note-type-label" style={{ color: nt.color }}>{nt.label}</span>
                            <p>{note.text}</p>
                            <span className="prayer-note-date">{formatRelativeDate(note.createdAt)}</span>
                          </div>
                          {!prayer.answered && (
                            <button className="prayer-note-delete" onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }} aria-label="Delete note">
                              <X size={11} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {!prayer.answered && (
                  <div className="prayer-note-add-section">
                    <div className="note-type-chips">
                      {NOTE_TYPES.map((nt) => {
                        const ChipIcon = nt.icon;
                        return (
                          <button
                            key={nt.value}
                            className={`note-type-chip ${noteType === nt.value ? 'note-type-chip-active' : ''}`}
                            style={noteType === nt.value ? { background: nt.color, borderColor: nt.color } : { borderColor: nt.color + '44', color: nt.color }}
                            onClick={(e) => { e.stopPropagation(); setNoteType(nt.value); }}
                          >
                            <ChipIcon size={10} /> {nt.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="prayer-note-add">
                      <input
                        type="text" className="prayer-note-input"
                        placeholder={getNoteType(noteType).placeholder}
                        value={newNote} onChange={(e) => setNewNote(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button className="btn-note-add" onClick={(e) => { e.stopPropagation(); handleAddNote(); }} disabled={!newNote.trim()}>Add</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <PrayerPartners
            prayer={prayer}
            onAddPartner={onAddPartner}
            onRemovePartner={onRemovePartner}
            onLogPartnerPrayed={onLogPartnerPrayed}
            onUndoPartnerPrayed={onUndoPartnerPrayed}
            timerPartnerId={timerPartnerId}
            timerPrayerId={timerPrayerId}
            timerElapsed={timerPrayerId === prayer.id ? timerElapsed : 0}
            onStartPartnerTimer={onStartPartnerTimer}
            onStopPartnerTimer={onStopPartnerTimer}
          />

          <div className="prayer-card-footer">
            <span className="prayer-card-date">
              <Calendar size={12} />
              {prayer.answered ? `Answered ${formatRelativeDate(prayer.answeredAt)}` : `Started ${formatRelativeDate(prayer.createdAt)}`}
            </span>
            {!prayer.answered && !showTestimonyPrompt && (
              <button className="btn-answered" onClick={(e) => { e.stopPropagation(); handleMarkAnswered(); }} title="Mark as answered">
                <CheckCircle2 size={14} /> Answered
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

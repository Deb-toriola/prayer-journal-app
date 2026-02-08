import { useState, useMemo, useEffect } from 'react';
import { Plus, FileDown, X, Bell, BellOff, Settings as SettingsIcon } from 'lucide-react';
import Header from './components/Header';
import DailyVerse from './components/DailyVerse';
import TabBar from './components/TabBar';
import WeeklyProject from './components/WeeklyProject';
import StreakBar from './components/StreakBar';
import NotificationSettings from './components/NotificationSettings';
import SearchAndFilter from './components/SearchAndFilter';
import PrayerCard from './components/PrayerCard';
import PrayerForm from './components/PrayerForm';
import EmptyState from './components/EmptyState';
import ExportPDF from './components/ExportPDF';
import { usePrayers } from './hooks/usePrayers';
import { usePrayerTimer } from './hooks/usePrayerTimer';
import { useWeeklyProject } from './hooks/useWeeklyProject';
import { useCategories } from './hooks/useCategories';
import { useStreakStats } from './hooks/useStreak';
import { useNotifications } from './hooks/useNotifications';

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'dusk';
  return 'night';
}

export default function App() {
  const {
    prayers,
    activePrayers,
    testimonies,
    addPrayer,
    updatePrayer,
    deletePrayer,
    markAnswered,
    restorePrayer,
    logPrayed,
    undoLogPrayed,
    toggleUrgent,
    addNote,
    deleteNote,
    addPrayerSession,
    addPartner,
    removePartner,
    logPartnerPrayed,
    addPartnerSession,
    undoPartnerPrayed,
  } = usePrayers();

  const {
    activeTimer,
    elapsed,
    startTimer,
    stopTimer,
    cancelTimer,
    isTimerRunning,
    timerPrayerId,
    timerPartnerId,
  } = usePrayerTimer();

  const { project, updateProject } = useWeeklyProject();
  const { allCategories, addCategory, deleteCategory } = useCategories();
  const streakStats = useStreakStats(prayers);
  const { settings: notifSettings, toggleEnabled, addTime, removeTime, updateTime, notificationSupported } = useNotifications();

  const [activeTab, setActiveTab] = useState('active');
  const [showForm, setShowForm] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showExport, setShowExport] = useState(false);
  const [streakExpanded, setStreakExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay);

  // Update time-of-day theme every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const currentList = activeTab === 'active' ? activePrayers : testimonies;

  const filteredPrayers = useMemo(() => {
    let result = currentList;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          (p.scripture && p.scripture.toLowerCase().includes(q))
      );
    }
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    return result;
  }, [currentList, searchQuery, selectedCategory]);

  const hasFilters = searchQuery.trim() !== '' || selectedCategory !== '';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
  };

  const handleSave = (prayerData) => {
    if (editingPrayer) {
      updatePrayer(editingPrayer.id, prayerData);
    } else {
      addPrayer(prayerData);
    }
    setEditingPrayer(null);
  };

  const handleEdit = (prayer) => {
    setEditingPrayer(prayer);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPrayer(null);
  };

  // Save a completed timer session (personal or partner)
  const saveSession = (session) => {
    if (!session || session.duration < 2) return;
    if (session.partnerId) {
      addPartnerSession(session.prayerId, session.partnerId, {
        startedAt: session.startedAt,
        duration: session.duration,
      });
      logPartnerPrayed(session.prayerId, session.partnerId);
    } else {
      addPrayerSession(session.prayerId, {
        startedAt: session.startedAt,
        duration: session.duration,
      });
      logPrayed(session.prayerId);
    }
  };

  const handleStartTimer = (prayerId) => {
    if (isTimerRunning) {
      const session = stopTimer();
      saveSession(session);
    }
    startTimer(prayerId, null);
  };

  const handleStopTimer = () => {
    const session = stopTimer();
    saveSession(session);
  };

  const handleStartPartnerTimer = (prayerId, partnerId) => {
    if (isTimerRunning) {
      const session = stopTimer();
      saveSession(session);
    }
    startTimer(prayerId, partnerId);
  };

  const handleStopPartnerTimer = (prayerId, partnerId) => {
    const session = stopTimer();
    saveSession(session);
  };

  return (
    <div className={`app app-${timeOfDay}`}>
      <Header
        streakCount={streakStats.currentStreak}
        hasPrayedToday={streakStats.hasPrayedToday}
        onToggleStreak={() => setStreakExpanded(!streakExpanded)}
        onOpenSettings={() => setShowSettings(true)}
      />

      <StreakBar stats={streakStats} expanded={streakExpanded} />

      <main className="main">
        <DailyVerse />

        <WeeklyProject project={project} onUpdate={updateProject} />

        <TabBar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSearchQuery('');
            setSelectedCategory('');
          }}
          activePrayerCount={activePrayers.length}
          testimonyCount={testimonies.length}
        />

        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          allCategories={allCategories}
        />

        <div className="prayer-list" id="prayer-list" role="tabpanel">
          {filteredPrayers.length > 0 ? (
            filteredPrayers.map((prayer) => (
              <PrayerCard
                key={prayer.id}
                prayer={prayer}
                onEdit={() => handleEdit(prayer)}
                onDelete={() => deletePrayer(prayer.id)}
                onMarkAnswered={(note) => markAnswered(prayer.id, note)}
                onRestore={() => restorePrayer(prayer.id)}
                onLogPrayed={() => logPrayed(prayer.id)}
                onUndoLog={() => undoLogPrayed(prayer.id)}
                onToggleUrgent={() => toggleUrgent(prayer.id)}
                onAddNote={(text, type) => addNote(prayer.id, text, type)}
                onDeleteNote={(noteId) => deleteNote(prayer.id, noteId)}
                onAddPartner={(name) => addPartner(prayer.id, name)}
                onRemovePartner={(partnerId) => removePartner(prayer.id, partnerId)}
                onLogPartnerPrayed={(partnerId) => logPartnerPrayed(prayer.id, partnerId)}
                onUndoPartnerPrayed={(partnerId) => undoPartnerPrayed(prayer.id, partnerId)}
                allCategories={allCategories}
                isTimerRunning={timerPrayerId === prayer.id && !timerPartnerId}
                timerElapsed={timerPrayerId === prayer.id ? elapsed : 0}
                onStartTimer={() => handleStartTimer(prayer.id)}
                onStopTimer={handleStopTimer}
                timerPrayerId={timerPrayerId}
                timerPartnerId={timerPartnerId}
                onStartPartnerTimer={(partnerId) => handleStartPartnerTimer(prayer.id, partnerId)}
                onStopPartnerTimer={(partnerId) => handleStopPartnerTimer(prayer.id, partnerId)}
              />
            ))
          ) : (
            <EmptyState
              type={activeTab}
              hasFilters={hasFilters}
              onClearFilters={hasFilters ? handleClearFilters : undefined}
            />
          )}
        </div>
      </main>

      {activeTab === 'active' && (
        <button className="fab" onClick={() => setShowForm(true)} aria-label="Add new prayer">
          <Plus size={24} />
        </button>
      )}

      {showForm && (
        <PrayerForm
          prayer={editingPrayer}
          onSave={handleSave}
          onClose={handleCloseForm}
          allCategories={allCategories}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
        />
      )}

      {showExport && (
        <ExportPDF
          prayers={prayers}
          allCategories={allCategories}
          onClose={() => setShowExport(false)}
        />
      )}

      {/* Settings Bottom Sheet */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal settings-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <div className="modal-drag-handle" />
            <div className="modal-header">
              <h2 className="modal-title" id="settings-title">Settings</h2>
              <button className="btn-icon" onClick={() => setShowSettings(false)} aria-label="Close settings">
                <X size={20} />
              </button>
            </div>
            <div className="settings-body">
              <NotificationSettings
                settings={notifSettings}
                onToggle={toggleEnabled}
                onAddTime={addTime}
                onRemoveTime={removeTime}
                onUpdateTime={updateTime}
                notificationSupported={notificationSupported}
              />

              {prayers.length > 0 && (
                <button className="btn-export settings-export-btn" onClick={() => { setShowSettings(false); setShowExport(true); }}>
                  <FileDown size={14} />
                  <span>Export Prayer Journey</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

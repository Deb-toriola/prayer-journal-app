import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import DoveIcon from './components/DoveIcon';
import ErrorBoundary from './components/ErrorBoundary';
import BottomNav from './components/BottomNav';
import DailyVerse from './components/DailyVerse';
import DailyCheckin from './components/DailyCheckin';
import PrayerPlan from './components/PrayerPlan';
import CommunityPrayer from './components/CommunityPrayer';
import WeeklyProject from './components/WeeklyProject';
import HomePlanCard from './components/HomePlanCard';
import HomePrayerBrief from './components/HomePrayerBrief';
import MoreTab from './components/MoreTab';
import SearchAndFilter from './components/SearchAndFilter';
import PrayerCard from './components/PrayerCard';
import PrayerForm from './components/PrayerForm';
import EmptyState from './components/EmptyState';
import ExportPDF from './components/ExportPDF';
import AuthScreen from './components/AuthScreen';
import { usePrayers } from './hooks/usePrayers';
import { usePrayerTimer } from './hooks/usePrayerTimer';
import { useWeeklyProject } from './hooks/useWeeklyProject';
import { useCategories } from './hooks/useCategories';
import { useNotifications } from './hooks/useNotifications';
import { usePrayerPlan } from './hooks/usePrayerPlan';
import { useDailyCheckin } from './hooks/useDailyCheckin';
import { useCommunity } from './hooks/useCommunity';
import { useGroups } from './hooks/useGroups';
import { useIntercede } from './hooks/useIntercede';
import { useStreakStats } from './hooks/useStreak';
import { useSettings } from './hooks/useSettings';
import { useAuth } from './hooks/useAuth';

const TAB_TITLES = {
  home:      'My Prayer App',
  prayers:   'My Prayers',
  plan:      'Prayer Plan',
  community: 'Community',
  more:      'More',
};

export default function App() {
  const { user, loading: authLoading, error: authError, signIn, signUp, signOut, resetPassword, clearError, deleteAccount } = useAuth();
  const [authModal, setAuthModal] = useState(null); // null | 'login' | 'signup'

  const openAuthModal = (view = 'login') => { clearError(); setAuthModal(view); };
  const closeAuthModal = () => { clearError(); setAuthModal(null); };

  const handleSignIn = async (email, pw) => {
    const ok = await signIn(email, pw);
    if (ok) closeAuthModal();
    return ok;
  };
  const handleSignUp = async (email, pw) => {
    return await signUp(email, pw); // stays open to show confirmation
  };

  if (authLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner" />
      </div>
    );
  }

  return (
    <>
      <AppInner user={user} signOut={signOut} onOpenAuth={openAuthModal} deleteAccount={deleteAccount} />
      {authModal && (
        <AuthScreen
          isModal
          initialView={authModal}
          onClose={closeAuthModal}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onResetPassword={resetPassword}
          error={authError}
          clearError={clearError}
        />
      )}
    </>
  );
}

function AppInner({ user, signOut, onOpenAuth, deleteAccount }) {
  const [activeTab, setActiveTab] = useState('home');
  const [prayerSubTab, setPrayerSubTab] = useState('active'); // 'active' | 'testimonies'
  const [showForm, setShowForm] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showExport, setShowExport] = useState(false);

  // ── Hooks ──────────────────────────────────────────────
  const {
    prayers, activePrayers, testimonies,
    addPrayer, updatePrayer, deletePrayer,
    markAnswered, restorePrayer,
    logPrayed, undoLogPrayed,
    toggleUrgent, addNote, deleteNote,
    addPrayerSession, addPartner, removePartner,
    logPartnerPrayed, addPartnerSession, undoPartnerPrayed,
  } = usePrayers(user?.id);

  const {
    elapsed, startTimer, stopTimer,
    isTimerRunning, timerPrayerId, timerPartnerId,
  } = usePrayerTimer();

  const { project, updateProject } = useWeeklyProject(user?.id);
  const { allCategories, addCategory, deleteCategory } = useCategories(user?.id);
  const { settings: notifSettings, toggleEnabled, addTime, removeTime, updateTime, notificationSupported, permissionState: notifPermission, isNative: notifIsNative } = useNotifications();
  const streakStats = useStreakStats(prayers);

  const prayerLogDates = useMemo(() =>
    new Set(prayers.flatMap((p) => (p.prayerLog || []).map((ts) => ts.split('T')[0])))
  , [prayers]);

  const { hasPrayedToday, hasManualCheckinToday, checkInToday, uncheckToday, currentStreak, longestStreak, totalDaysPrayed } = useDailyCheckin(user?.id, prayerLogDates);

  const {
    plans, startPlan, checkInPlan, deletePlan,
    addPlanNote, deletePlanNote,
    addPlanPartner, removePlanPartner, logPlanPartnerPrayed, undoPlanPartnerPrayed,
    completedPlansCount, today: planToday,
  } = usePrayerPlan(user?.id);

  const { memberStats, totalGroupMinutes: legacyGroupMinutes, todayGroupMinutes: legacyTodayMinutes, addMember, removeMember, logSession } = useCommunity(user?.id);
  const {
    groups, activeGroupId, setActiveGroupId, activeGroup,
    members: groupMembers, posts: groupPosts,
    totalGroupMinutes, todayGroupMinutes,
    isAdmin, isPending, myMember,
    createGroup, joinGroup, leaveGroup, deleteGroup,
    updateGroupFocus, logTime, addPost, deletePost,
    approveMember, rejectMember, fetchPosts: refreshGroupFeed,
  } = useGroups(user?.id);
  const { requests: intercedeRequests, addRequest: addIntercede, prayForRequest: prayIntercede, deleteRequest: deleteIntercede } = useIntercede(user?.id);
  const { settings: appSettings, update: updateAppSettings } = useSettings(user?.id);

  // ── Prayer list filtering ──────────────────────────────
  const currentList = prayerSubTab === 'active' ? activePrayers : testimonies;

  const filteredPrayers = useMemo(() => {
    let result = currentList;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        (p.scripture && p.scripture.toLowerCase().includes(q))
      );
    }
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    return result;
  }, [currentList, searchQuery, selectedCategory]);

  const hasFilters = searchQuery.trim() !== '' || selectedCategory !== '';

  // ── Handlers ──────────────────────────────────────────
  const handleSave = (prayerData) => {
    if (editingPrayer) updatePrayer(editingPrayer.id, prayerData);
    else addPrayer(prayerData);
    setEditingPrayer(null);
  };

  const handleEdit = (prayer) => { setEditingPrayer(prayer); setShowForm(true); };
  const handleCloseForm = () => { setShowForm(false); setEditingPrayer(null); };

  const saveSession = (session) => {
    if (!session || session.duration < 2) return;
    if (session.partnerId) {
      addPartnerSession(session.prayerId, session.partnerId, { startedAt: session.startedAt, duration: session.duration });
      logPartnerPrayed(session.prayerId, session.partnerId);
    } else {
      addPrayerSession(session.prayerId, { startedAt: session.startedAt, duration: session.duration });
      logPrayed(session.prayerId);
    }
  };

  const handleStartTimer = (prayerId) => {
    if (isTimerRunning) saveSession(stopTimer());
    startTimer(prayerId, null);
  };

  const handleStopTimer = () => saveSession(stopTimer());

  const handleStartPartnerTimer = (prayerId, partnerId) => {
    if (isTimerRunning) saveSession(stopTimer());
    startTimer(prayerId, partnerId);
  };

  const handleStopPartnerTimer = () => saveSession(stopTimer());

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== 'prayers') { setSearchQuery(''); setSelectedCategory(''); }
  };

  // ── Render tab content ────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {

      case 'home': {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
        const urgentCount = activePrayers.filter(p => p.urgent).length;
        const neglectedCount = streakStats.neglectedPrayers.length;

        // Community snapshot helpers
        const latestPost = groupPosts && groupPosts.length > 0
          ? [...groupPosts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
          : null;
        const snapshotGroupName = latestPost && groups.length > 0
          ? (groups.find(g => g.id === (activeGroup?.id)) || groups[0])?.name
          : null;
        const formatSnapshotTime = (ts) => {
          if (!ts) return '';
          const diff = Math.floor((Date.now() - new Date(ts)) / 60000);
          if (diff < 1) return 'just now';
          if (diff < 60) return `${diff}m ago`;
          if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
          return `${Math.floor(diff / 1440)}d ago`;
        };
        const initials = (name) => name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

        return (
          <div className="tab-content">
            {/* Greeting */}
            <div className="home-greeting">
              <p className="home-greeting-text">{greeting} 🙏</p>
              <p className="home-greeting-sub">
                {hasPrayedToday
                  ? 'You\'ve prayed today — well done.'
                  : 'Your prayers are waiting for you.'}
              </p>
            </div>

            <DailyVerse />

            {/* At-a-glance summary */}
            <div className="home-glance">
              <button className="home-glance-item" onClick={() => handleTabChange('prayers')}>
                <span className="home-glance-number">{activePrayers.length}</span>
                <span className="home-glance-label">Active prayers</span>
              </button>
              <button className="home-glance-item" onClick={() => handleTabChange('prayers')}>
                <span className="home-glance-number">{testimonies.length}</span>
                <span className="home-glance-label">Testimonies</span>
              </button>
              <button className="home-glance-item" onClick={() => handleTabChange('plan')}>
                <span className="home-glance-number">{plans.length > 0 ? `${plans.length} active` : '—'}</span>
                <span className="home-glance-label">{plans.length > 0 ? 'Plans' : 'No plan'}</span>
              </button>
              {urgentCount > 0 && (
                <button className="home-glance-item home-glance-urgent" onClick={() => handleTabChange('prayers')}>
                  <span className="home-glance-number">{urgentCount}</span>
                  <span className="home-glance-label">Urgent</span>
                </button>
              )}
            </div>

            {/* Prayer brief — shows active prayers (urgent first) */}
            {activePrayers.length > 0 && (
              <HomePrayerBrief
                prayers={activePrayers}
                onNavigate={() => handleTabChange('prayers')}
              />
            )}

            {/* Plan cards — one compact card per active plan */}
            {plans.map(plan => (
              <HomePlanCard
                key={plan.id}
                plan={plan}
                today={planToday}
                onCheckIn={checkInPlan}
                onClick={() => handleTabChange('plan')}
              />
            ))}

            {/* Community snapshot — only shown when user has groups */}
            {groups.length > 0 && (
              <button className="home-community-snapshot" onClick={() => handleTabChange('community')}>
                <div className="home-community-snapshot-header">
                  <span className="home-community-snapshot-title">
                    🤝 {groups.length === 1 ? groups[0].name : `${groups.length} Prayer Groups`}
                  </span>
                  {todayGroupMinutes > 0 && (
                    <span className="home-community-snapshot-mins">
                      {todayGroupMinutes} min today
                    </span>
                  )}
                </div>
                {latestPost ? (
                  <div className="home-community-snapshot-post">
                    <div className="home-community-snapshot-avatar">
                      {initials(latestPost.display_name)}
                    </div>
                    <div className="home-community-snapshot-text">
                      <div className="home-community-snapshot-name">{latestPost.display_name}</div>
                      <div className="home-community-snapshot-content">
                        {latestPost.type === 'scripture' ? '📖 ' : latestPost.type === 'focus_update' ? '🎯 ' : '💬 '}
                        {latestPost.content}
                      </div>
                      <div className="home-community-snapshot-time">{formatSnapshotTime(latestPost.created_at)}</div>
                    </div>
                  </div>
                ) : (
                  <div className="home-community-snapshot-empty">
                    No posts yet — be the first to share what God is saying 🕊️
                  </div>
                )}
                {groups.length > 1 && snapshotGroupName && (
                  <div className="home-community-snapshot-groups">in {snapshotGroupName}</div>
                )}
              </button>
            )}

            {appSettings.showStreak !== false && (
              <DailyCheckin
                hasPrayedToday={hasPrayedToday}
                hasManualCheckinToday={hasManualCheckinToday}
                onCheckIn={checkInToday}
                onUncheck={uncheckToday}
                currentStreak={currentStreak}
                longestStreak={longestStreak}
                totalDaysPrayed={totalDaysPrayed}
                totalPrayers={streakStats.totalPrayers}
                neglectedPrayers={neglectedCount}
              />
            )}

            {appSettings.showNeglected !== false && neglectedCount > 0 && (
              <button className="home-neglected-prompt" onClick={() => handleTabChange('prayers')}>
                ⚠️ {neglectedCount} prayer{neglectedCount > 1 ? 's' : ''} haven't been covered in 3+ days — tap to pray
              </button>
            )}

            {appSettings.showWeeklyFocusOnHome === true && (
              <WeeklyProject project={project} onUpdate={updateProject} />
            )}
          </div>
        );
      }

      case 'prayers':
        return (
          <div className="tab-content">
            {/* Sub-tab toggle: Active / Testimonies */}
            <div className="prayers-subtab-bar">
              <button
                className={`prayers-subtab ${prayerSubTab === 'active' ? 'prayers-subtab-active' : ''}`}
                onClick={() => { setPrayerSubTab('active'); setSearchQuery(''); setSelectedCategory(''); }}
              >
                Prayers
                {activePrayers.length > 0 && (
                  <span className="prayers-subtab-count">{activePrayers.length}</span>
                )}
              </button>
              <button
                className={`prayers-subtab ${prayerSubTab === 'testimonies' ? 'prayers-subtab-active' : ''}`}
                onClick={() => { setPrayerSubTab('testimonies'); setSearchQuery(''); setSelectedCategory(''); }}
              >
                Testimonies
                {testimonies.length > 0 && (
                  <span className="prayers-subtab-count prayers-subtab-count-gold">{testimonies.length}</span>
                )}
              </button>
            </div>

            <SearchAndFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              allCategories={allCategories}
            />

            <div className="prayer-list">
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
                    onStopPartnerTimer={handleStopPartnerTimer}
                    bibleTranslation={appSettings.bibleTranslation}
                  />
                ))
              ) : (
                <EmptyState type={prayerSubTab} hasFilters={hasFilters} />
              )}
            </div>
          </div>
        );

      case 'plan':
        return (
          <div className="tab-content">
            <WeeklyProject project={project} onUpdate={updateProject} />
            <PrayerPlan
              plans={plans}
              onStart={startPlan}
              onCheckIn={checkInPlan}
              onDelete={deletePlan}
              onAddNote={addPlanNote}
              onDeleteNote={deletePlanNote}
              onAddPartner={addPlanPartner}
              onRemovePartner={removePlanPartner}
              onLogPartnerPrayed={logPlanPartnerPrayed}
              onUndoPartnerPrayed={undoPlanPartnerPrayed}
              completedPlansCount={completedPlansCount}
              today={planToday}
              bibleTranslation={appSettings.bibleTranslation}
            />
          </div>
        );

      case 'community':
        return (
          <div className="tab-content">
            <CommunityPrayer
              groups={groups}
              activeGroupId={activeGroupId}
              onSetActiveGroup={setActiveGroupId}
              activeGroup={activeGroup}
              groupMembers={groupMembers}
              groupPosts={groupPosts}
              totalGroupMinutes={totalGroupMinutes}
              todayGroupMinutes={todayGroupMinutes}
              isAdmin={isAdmin}
              isPending={isPending}
              myMember={myMember}
              onCreateGroup={createGroup}
              onJoinGroup={joinGroup}
              onLogTime={logTime}
              onAddPost={addPost}
              onDeletePost={deletePost}
              onUpdateGroupFocus={updateGroupFocus}
              onLeaveGroup={leaveGroup}
              onDeleteGroup={deleteGroup}
              onApproveMember={approveMember}
              onRejectMember={rejectMember}
              onRefreshFeed={refreshGroupFeed}
              intercedeRequests={intercedeRequests}
              onAddIntercede={addIntercede}
              onPrayIntercede={prayIntercede}
              onDeleteIntercede={deleteIntercede}
              user={user}
              onRequireAuth={() => onOpenAuth('login')}
            />
          </div>
        );

      case 'more':
        return (
          <div className="tab-content">
            <MoreTab
              project={project}
              onUpdateProject={updateProject}
              notifSettings={notifSettings}
              onToggleNotif={toggleEnabled}
              onAddTime={addTime}
              onRemoveTime={removeTime}
              onUpdateTime={updateTime}
              notificationSupported={notificationSupported}
              notifPermission={notifPermission}
              notifIsNative={notifIsNative}
              prayers={prayers}
              onShowExport={() => setShowExport(true)}
              appSettings={appSettings}
              onUpdateSettings={updateAppSettings}
              user={user}
              onSignOut={signOut}
              onSignIn={() => onOpenAuth('login')}
              onSignUp={() => onOpenAuth('signup')}
              onDeleteAccount={deleteAccount}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app">
      {/* Top header — compact, shows current tab title */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-header-icon">
            <DoveIcon size={28} color="currentColor" />
          </div>
          <h1 className="app-header-title">{TAB_TITLES[activeTab]}</h1>
        </div>
      </header>

      <main className="main">
        <ErrorBoundary key={activeTab}>
          {renderContent()}
        </ErrorBoundary>
      </main>

      {/* FAB — only on Prayers tab, active sub-tab */}
      {activeTab === 'prayers' && prayerSubTab === 'active' && (
        <button className="fab" onClick={() => setShowForm(true)} aria-label="Add new prayer">
          <Plus size={24} />
        </button>
      )}

      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        prayerCount={activePrayers.length}
        testimonyCount={testimonies.length}
        planActive={plans.length > 0}
        communityCount={groups.length}
      />

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
    </div>
  );
}

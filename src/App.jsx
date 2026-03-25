import { useState, useMemo, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { Plus } from 'lucide-react';
import DoveIcon from './components/DoveIcon';
import ErrorBoundary from './components/ErrorBoundary';
import BottomNav from './components/BottomNav';
import DailyVerse from './components/DailyVerse';
import DailyCheckin from './components/DailyCheckin';
import WeeklyProject from './components/WeeklyProject';
import HomePlanCard from './components/HomePlanCard';
import HomePrayerBrief from './components/HomePrayerBrief';
import MoreTab from './components/MoreTab';
import SearchAndFilter from './components/SearchAndFilter';
import PrayerCard from './components/PrayerCard';
import PrayerForm from './components/PrayerForm';
import EmptyState from './components/EmptyState';
import PrayingHands from './components/PrayingHands';

// ── Lazy-loaded: only fetched when the user navigates to that tab/action ──
const PrayerPlan      = lazy(() => import('./components/PrayerPlan'));
const CommunityPrayer = lazy(() => import('./components/CommunityPrayer'));
const ExportPDF       = lazy(() => import('./components/ExportPDF'));
const AuthScreen      = lazy(() => import('./components/AuthScreen'));
const Onboarding      = lazy(() => import('./components/Onboarding'));
import { migrateGuestData } from './utils/migrateGuestData';
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
import { useInAppNotifications } from './hooks/useInAppNotifications';
import { usePrayerPartners } from './hooks/usePrayerPartners';
import { sendNotification } from './utils/sendNotification';
import NotificationPanel from './components/NotificationPanel';
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

const TAB_ORDER = ['home', 'prayers', 'plan', 'community', 'more'];

const ONBOARDING_KEY = 'hasSeenOnboarding';

export default function App() {
  const { user, loading: authLoading, error: authError, signIn, signUp, signOut, resetPassword, updatePassword, clearError, deleteAccount, passwordRecovery } = useAuth();
  const [authModal, setAuthModal] = useState(null); // null | 'login' | 'signup' | 'newPassword'

  // Show onboarding only if not seen before AND user isn't already signed in
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem(ONBOARDING_KEY)
  );

  const finishOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    setShowOnboarding(false);
  };

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
  const handleUpdatePassword = async (pw) => {
    const ok = await updatePassword(pw);
    if (ok) closeAuthModal();
    return ok;
  };

  // Auto-open "Set new password" modal when a recovery link is followed
  useEffect(() => {
    if (passwordRecovery) openAuthModal('newPassword');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordRecovery]);

  // Migrate guest data the first time a user's auth session becomes active
  const prevUserRef = useRef(null);
  useEffect(() => {
    if (user && !prevUserRef.current) {
      migrateGuestData(user.id);
    }
    prevUserRef.current = user;
  }, [user]);

  // Onboarding CTA handlers
  const handleOnboardingSignUp = () => {
    finishOnboarding();
    openAuthModal('signup');
  };
  const handleOnboardingGuest = () => {
    finishOnboarding();
  };
  const handleOnboardingSignIn = () => {
    finishOnboarding();
    openAuthModal('login');
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
      {/* Show onboarding for brand-new users who aren't signed in yet */}
      {showOnboarding && !user && (
        <Suspense fallback={<div className="tab-loading" />}>
          <Onboarding
            onSignUp={handleOnboardingSignUp}
            onGuest={handleOnboardingGuest}
            onSignIn={handleOnboardingSignIn}
          />
        </Suspense>
      )}

      <AppInner user={user} signOut={signOut} onOpenAuth={openAuthModal} deleteAccount={deleteAccount} />

      {authModal && (
        <Suspense fallback={<div className="tab-loading" />}>
          <AuthScreen
            isModal
            initialView={authModal}
            onClose={closeAuthModal}
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            onResetPassword={resetPassword}
            onUpdatePassword={handleUpdatePassword}
            error={authError}
            clearError={clearError}
          />
        </Suspense>
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
    resetAllPrayerLogs,
  } = usePrayers(user?.id);

  const {
    elapsed, startTimer, stopTimer,
    isTimerRunning, timerPrayerId, timerPartnerId,
  } = usePrayerTimer();

  const { project, updateProject } = useWeeklyProject(user?.id);
  const { allCategories, addCategory, deleteCategory } = useCategories(user?.id);
  const { settings: notifSettings, toggleEnabled, addTime, removeTime, updateTime, updateStreakReminder, updateNeglectedReminder, notificationSupported, permissionState: notifPermission, isNative: notifIsNative } = useNotifications();
  const streakStats = useStreakStats(prayers);

  const prayerLogDates = useMemo(() =>
    new Set(prayers.flatMap((p) => (p.prayerLog || []).map((ts) => ts.split('T')[0])))
  , [prayers]);

  const {
    plans, startPlan, checkInPlan, deletePlan,
    addPlanNote, deletePlanNote,
    addPlanPartner, removePlanPartner, logPlanPartnerPrayed, undoPlanPartnerPrayed,
    completedPlansCount, today: planToday,
    allPlanCheckinDates,
  } = usePrayerPlan(user?.id);

  // Merge prayer logs + plan check-ins so ALL engagement counts toward the streak
  const { hasPrayedToday, hasManualCheckinToday, checkInToday, uncheckToday, resetCheckins, currentStreak, longestStreak, totalDaysPrayed } = useDailyCheckin(user?.id, prayerLogDates, allPlanCheckinDates);

  const { memberStats, totalGroupMinutes: legacyGroupMinutes, todayGroupMinutes: legacyTodayMinutes, addMember, removeMember, logSession } = useCommunity(user?.id);
  const {
    groups, activeGroupId, setActiveGroupId, activeGroup,
    members: groupMembers, posts: groupPosts,
    totalGroupMinutes, todayGroupMinutes,
    isAdmin, isPending, myMember,
    pendingCount,
    createGroup, joinGroup, leaveGroup, deleteGroup,
    updateGroupFocus, logTime, addPost, deletePost,
    approveMember, rejectMember, addMemberDirect,
    promoteToAdmin, demoteToMember,
    fetchPosts: refreshGroupFeed,
  } = useGroups(user?.id);

  // Display name: prefer group member name, fallback to email prefix
  const userDisplayName = myMember?.display_name || user?.email?.split('@')[0] || 'A friend';

  // In-app notifications
  const {
    notifications, unreadCount, markAllRead, dismissNotification,
  } = useInAppNotifications(user?.id, {
    onPartnerAccepted: (prayerId, partnerName, partnerUserId) => {
      // Auto-add accepted partner to the prayer locally
      addPartner(prayerId, partnerName, partnerUserId);
    },
  });

  // Cross-user prayer partner invites
  const {
    pendingInvites, invitePartner, acceptInvite, declineInvite,
  } = usePrayerPartners(user?.id, user?.email, userDisplayName);
  const { requests: intercedeRequests, addRequest: addIntercede, prayForRequest: prayIntercede, deleteRequest: deleteIntercede } = useIntercede(user?.id);
  const { settings: appSettings, update: updateAppSettings } = useSettings(user?.id);

  // ── Schedule/cancel streak reminder when setting changes ─────────────
  useEffect(() => {
    updateStreakReminder(appSettings.streakReminder === true);
  }, [appSettings.streakReminder, updateStreakReminder]);

  // ── Schedule/cancel neglected prayer reminder when setting or data changes ─
  useEffect(() => {
    updateNeglectedReminder(
      appSettings.showNeglected !== false,
      streakStats.neglectedPrayers
    );
  }, [appSettings.showNeglected, streakStats.neglectedPrayers, updateNeglectedReminder]);

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

  // ── Auto-streak: fire when any meaningful prayer action happens ──────────
  const [showStreakToast, setShowStreakToast] = useState(false);
  const [milestoneData, setMilestoneData] = useState(null);
  const streakToastTimerRef = useRef(null);
  const hasPrayedTodayRef = useRef(hasPrayedToday);
  const toastShownRef = useRef(hasPrayedToday); // don't toast at startup if already counted
  useEffect(() => { hasPrayedTodayRef.current = hasPrayedToday; }, [hasPrayedToday]);

  // Milestone definitions
  const MILESTONES = [
    { days: 3, title: '3 days of prayer', message: "You're building something beautiful.", icon: '✨' },
    { days: 7, title: 'One week of faithful prayer', message: 'A full week. God sees your faithfulness.', icon: '🙏' },
    { days: 14, title: 'Two weeks strong', message: "Prayer is becoming part of who you are.", icon: '🕯️' },
    { days: 21, title: "You've built a habit", message: '21 days — science says this is when habits form. Keep going.', icon: '💪' },
    { days: 30, title: '30 days. Prayer warrior.', message: "A full month of faithful prayer. That's extraordinary.", icon: '🔥' },
    { days: 50, title: '50 days of devotion', message: 'Like the disciples at Pentecost. The Spirit is with you.', icon: '🕊️' },
    { days: 100, title: '100 days!', message: "A century of prayer. You're an inspiration.", icon: '👑' },
    { days: 365, title: 'One full year', message: "365 days of prayer. What a testimony.", icon: '🌟' },
  ];

  // Show toast exactly once when hasPrayedToday transitions false → true
  const prevPrayedRef = useRef(hasPrayedToday);
  useEffect(() => {
    if (!prevPrayedRef.current && hasPrayedToday && !toastShownRef.current) {
      toastShownRef.current = true;

      // Check if current streak hits a milestone
      const milestone = MILESTONES.find(m => m.days === currentStreak);
      if (milestone) {
        setMilestoneData(milestone);
      } else {
        setShowStreakToast(true);
        if (streakToastTimerRef.current) clearTimeout(streakToastTimerRef.current);
        streakToastTimerRef.current = setTimeout(() => setShowStreakToast(false), 3000);
      }
    }
    prevPrayedRef.current = hasPrayedToday;
  }, [hasPrayedToday, currentStreak]);

  // Explicit auto-streak trigger for actions that don't auto-update prayerLogDates
  const handleAutoStreak = useCallback(() => {
    checkInToday(); // idempotent — writes to daily_checkins, triggers hasPrayedToday → toast
  }, [checkInToday]);

  // Dwell-time trigger: user stays on Prayers tab with prayers visible for 20+ seconds
  const dwellTimerRef = useRef(null);
  useEffect(() => {
    if (activeTab === 'prayers' && activePrayers.length > 0 && !hasPrayedTodayRef.current) {
      dwellTimerRef.current = setTimeout(() => handleAutoStreak(), 20000);
    } else {
      clearTimeout(dwellTimerRef.current);
    }
    return () => clearTimeout(dwellTimerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, activePrayers.length]);

  // ── Handlers ──────────────────────────────────────────
  const handleSave = (prayerData) => {
    if (editingPrayer) updatePrayer(editingPrayer.id, prayerData);
    else { addPrayer(prayerData); handleAutoStreak(); } // adding a new prayer = prayer engagement
    setEditingPrayer(null);
  };

  const handleEdit = (prayer) => { setEditingPrayer(prayer); setShowForm(true); };
  const handleCloseForm = () => { setShowForm(false); setEditingPrayer(null); };

  // Notify cross-user partner when prayed (if they have a userId stored)
  const notifyPartnerIfLinked = (prayerId, partnerId) => {
    const prayer = prayers.find(p => p.id === prayerId);
    const partner = prayer?.partners?.find(pt => pt.id === partnerId);
    if (partner?.userId && user?.id && appSettings?.communityAlerts !== false) {
      sendNotification(
        partner.userId,
        'partner_prayed',
        `${userDisplayName} prayed 🙏`,
        `They prayed for "${prayer.title}" today`,
        { prayerId }
      );
    }
  };

  const saveSession = (session) => {
    if (!session || session.duration < 2) return;
    if (session.partnerId) {
      addPartnerSession(session.prayerId, session.partnerId, { startedAt: session.startedAt, duration: session.duration });
      logPartnerPrayed(session.prayerId, session.partnerId);
      notifyPartnerIfLinked(session.prayerId, session.partnerId);
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

  const swipeTouchStartX = useRef(null);
  const swipeTouchStartY = useRef(null);
  const handleSwipeTouchStart = (e) => {
    swipeTouchStartX.current = e.touches[0].clientX;
    swipeTouchStartY.current = e.touches[0].clientY;
  };
  const handleSwipeTouchEnd = (e) => {
    if (swipeTouchStartX.current === null) return;
    const diffX = swipeTouchStartX.current - e.changedTouches[0].clientX;
    const diffY = swipeTouchStartY.current - e.changedTouches[0].clientY;
    // Only trigger if movement is more horizontal than vertical (swipe, not scroll)
    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      const currentIndex = TAB_ORDER.indexOf(activeTab);
      if (diffX > 0 && currentIndex < TAB_ORDER.length - 1) handleTabChange(TAB_ORDER[currentIndex + 1]);
      else if (diffX < 0 && currentIndex > 0) handleTabChange(TAB_ORDER[currentIndex - 1]);
    }
    swipeTouchStartX.current = null;
    swipeTouchStartY.current = null;
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
              <p className="home-greeting-text">{greeting}</p>
              <p className="home-greeting-sub">
                {hasPrayedToday
                  ? 'You\'ve prayed today — well done.'
                  : 'Your prayers are waiting for you.'}
              </p>
            </div>

            <DailyVerse />

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
                animatedFire={appSettings.animatedFire !== false}
              />
            )}

            {/* Prayer preview card — surfaces one prayer to pray from home */}
            {activePrayers.length > 0 && (() => {
              const featured = activePrayers.find(p => p.urgent) || activePrayers[0];
              const preview = featured.content ? featured.content.slice(0, 80) + (featured.content.length > 80 ? '…' : '') : '';
              return (
                <button className="home-prayer-preview" onClick={() => handleTabChange('prayers')}>
                  <div className="home-prayer-preview-title">{featured.title}</div>
                  {preview && <div className="home-prayer-preview-body">{preview}</div>}
                  <div className="home-prayer-preview-cta">Pray now →</div>
                </button>
              );
            })()}

            {/* At-a-glance summary */}
            <div className="home-glance">
              {/* Active prayers — invite if zero */}
              {activePrayers.length > 0 ? (
                <button className="home-glance-item" onClick={() => handleTabChange('prayers')}>
                  <span className="home-glance-number">{activePrayers.length}</span>
                  <span className="home-glance-label">Active prayers</span>
                </button>
              ) : (
                <button className="home-glance-item home-glance-empty-cta" onClick={() => { handleTabChange('prayers'); setShowForm(true); }}>
                  <span className="home-glance-cta-plus">+</span>
                  <span className="home-glance-label">Add first prayer</span>
                </button>
              )}

              <button className="home-glance-item" onClick={() => handleTabChange('prayers')}>
                <span className="home-glance-number">{testimonies.length}</span>
                <span className="home-glance-label">Testimonies</span>
              </button>

              {/* Plan — invite if none */}
              {plans.length > 0 ? (
                <button className="home-glance-item" onClick={() => handleTabChange('plan')}>
                  <span className="home-glance-number">{plans.length} active</span>
                  <span className="home-glance-label">Plans</span>
                </button>
              ) : (
                <button className="home-glance-item home-glance-empty-cta" onClick={() => handleTabChange('plan')}>
                  <span className="home-glance-cta-arrow">→</span>
                  <span className="home-glance-label">Start a plan</span>
                </button>
              )}

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
                    onMarkAnswered={(note) => { markAnswered(prayer.id, note); handleAutoStreak(); }}
                    onRestore={() => restorePrayer(prayer.id)}
                    onLogPrayed={() => logPrayed(prayer.id)}
                    onUndoLog={() => undoLogPrayed(prayer.id)}
                    onToggleUrgent={() => toggleUrgent(prayer.id)}
                    onAddNote={(text, type) => addNote(prayer.id, text, type)}
                    onDeleteNote={(noteId) => deleteNote(prayer.id, noteId)}
                    onAddPartner={(name) => addPartner(prayer.id, name)}
                    onRemovePartner={(partnerId) => removePartner(prayer.id, partnerId)}
                    userId={user?.id}
                    onInvitePartner={invitePartner}
                    onLogPartnerPrayed={(partnerId) => {
                      logPartnerPrayed(prayer.id, partnerId);
                      notifyPartnerIfLinked(prayer.id, partnerId);
                    }}
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
            {appSettings.showWeeklyFocusOnHome !== true && (
              <WeeklyProject project={project} onUpdate={updateProject} />
            )}
            <Suspense fallback={<div className="tab-loading" />}>
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
                onAutoStreak={handleAutoStreak}
              />
            </Suspense>
          </div>
        );

      case 'community':
        return (
          <div className="tab-content">
            <Suspense fallback={<div className="tab-loading" />}>
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
              onAddMemberDirect={addMemberDirect}
              onPromoteToAdmin={promoteToAdmin}
              onDemoteToMember={demoteToMember}
              onRefreshFeed={refreshGroupFeed}
              intercedeRequests={intercedeRequests}
              onAddIntercede={addIntercede}
              onPrayIntercede={prayIntercede}
              onDeleteIntercede={deleteIntercede}
              user={user}
              onRequireAuth={() => onOpenAuth('login')}
            />
            </Suspense>
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
              onResetStreak={async () => { await resetAllPrayerLogs(); await resetCheckins(); }}
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
          {user && (
            <NotificationPanel
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAllRead={markAllRead}
              onDismiss={dismissNotification}
              pendingInvites={pendingInvites}
              onAcceptInvite={acceptInvite}
              onDeclineInvite={declineInvite}
            />
          )}
        </div>
      </header>

      <main className="main" onTouchStart={handleSwipeTouchStart} onTouchEnd={handleSwipeTouchEnd}>
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
        pendingCount={pendingCount}
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
        <Suspense fallback={<div className="tab-loading" />}>
          <ExportPDF
            prayers={prayers}
            allCategories={allCategories}
            onClose={() => setShowExport(false)}
          />
        </Suspense>
      )}

      {/* Auto-streak toast */}
      {showStreakToast && (
        <div className="streak-toast" role="status" aria-live="polite">
          🔥 Streak recorded for today
        </div>
      )}

      {/* Milestone celebration modal */}
      {milestoneData && (
        <div className="milestone-overlay" onClick={() => setMilestoneData(null)}>
          <div className="milestone-modal" onClick={e => e.stopPropagation()}>
            <div className="milestone-icon">{milestoneData.icon}</div>
            <div className="milestone-streak-count">{milestoneData.days}</div>
            <h2 className="milestone-title">{milestoneData.title}</h2>
            <p className="milestone-message">{milestoneData.message}</p>
            <div className="milestone-flame-row">
              {Array.from({ length: Math.min(milestoneData.days, 7) }, (_, i) => (
                <span key={i} className="milestone-flame" style={{ animationDelay: `${i * 0.1}s` }}>🔥</span>
              ))}
            </div>
            <button className="btn btn-primary milestone-btn" onClick={() => setMilestoneData(null)}>
              Keep going
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

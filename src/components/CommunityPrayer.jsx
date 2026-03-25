import { useState } from 'react';
import { Users, Plus, HandHeart, HeartHandshake, ChevronDown } from 'lucide-react';
import GroupView from './GroupView';
import CreateGroupModal from './CreateGroupModal';
import JoinGroupModal from './JoinGroupModal';
import PartnersTab from './PartnersTab';

/* ─── Shared Prayer Groups Section ─── */
function SharedGroups({ groups, activeGroupId, onSetActive, activeGroup, members, posts,
  totalGroupMinutes, todayGroupMinutes, userId, isAdmin, isPending, myMember,
  onCreateGroup, onJoinGroup, onLogTime, onAddPost, onDeletePost,
  onUpdateFocus, onLeave, onDelete, onApproveMember, onRejectMember, onRefreshFeed,
  onAddMemberDirect, onPromoteToAdmin, onDemoteToMember, isGuest, onRequireAuth,
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showGroupPicker, setShowGroupPicker] = useState(false);

  if (groups.length === 0) {
    return (
      <>
        <div className="community-section">
          <div className="community-section-title">
            <Users size={15} />
            <span>Prayer Groups</span>
          </div>
          <p className="community-empty">
            Create a group and invite friends to pray together — see each other's prayer time, share what God is saying, and set a shared prayer focus.
          </p>
          <div className="group-action-buttons">
            <button className="btn btn-primary" onClick={() => { if (isGuest) { onRequireAuth(); return; } setShowCreate(true); }}>
              <Plus size={15} />
              Create Group
            </button>
            <button className="btn btn-secondary" onClick={() => { if (isGuest) { onRequireAuth(); return; } setShowJoin(true); }}>
              Join Group
            </button>
          </div>
        </div>

        {showCreate && (
          <CreateGroupModal
            onClose={() => setShowCreate(false)}
            onCreate={onCreateGroup}
          />
        )}
        {showJoin && (
          <JoinGroupModal
            onClose={() => setShowJoin(false)}
            onJoin={onJoinGroup}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="community-section">
        {/* Group selector header */}
        <div className="group-selector-row">
          {groups.length > 1 ? (
            <button
              className="group-selector-btn"
              onClick={() => setShowGroupPicker(!showGroupPicker)}
            >
              <Users size={14} />
              <span>{activeGroup?.name || 'Select group'}</span>
              <ChevronDown size={14} style={{ marginLeft: 'auto', transition: 'transform 0.2s', transform: showGroupPicker ? 'rotate(180deg)' : 'none' }} />
            </button>
          ) : (
            <div className="community-section-title" style={{ marginBottom: 0 }}>
              <Users size={15} />
              <span>{activeGroup?.name || 'Prayer Groups'}</span>
            </div>
          )}
          <div className="group-header-actions">
            <button className="btn btn-secondary btn-xs" onClick={() => { if (isGuest) { onRequireAuth(); return; } setShowJoin(true); }}>
              Join
            </button>
            <button className="btn btn-primary btn-xs" onClick={() => { if (isGuest) { onRequireAuth(); return; } setShowCreate(true); }}>
              <Plus size={13} /> New
            </button>
          </div>
        </div>

        {/* Inline group picker — replaces GroupView when open */}
        {showGroupPicker ? (
          <div className="group-picker-list">
            {groups.map(g => (
              <button
                key={g.id}
                className={`group-picker-list-item ${g.id === activeGroupId ? 'group-picker-list-item-active' : ''}`}
                onClick={() => { onSetActive(g.id); setShowGroupPicker(false); }}
              >
                <div className="group-picker-list-icon">
                  <Users size={15} />
                </div>
                <span className="group-picker-list-name">{g.name}</span>
                {g.id === activeGroupId && <span className="group-picker-list-check">✓</span>}
              </button>
            ))}
          </div>
        ) : activeGroup && (
          <GroupView
            group={activeGroup}
            members={members}
            posts={posts}
            totalGroupMinutes={totalGroupMinutes}
            todayGroupMinutes={todayGroupMinutes}
            userId={userId}
            isAdmin={isAdmin}
            isPending={isPending}
            myMember={myMember}
            onLogTime={onLogTime}
            onAddPost={onAddPost}
            onDeletePost={onDeletePost}
            onRefreshFeed={onRefreshFeed}
            onUpdateFocus={onUpdateFocus}
            onLeave={onLeave}
            onDelete={onDelete}
            onApproveMember={onApproveMember}
            onRejectMember={onRejectMember}
            onAddMemberDirect={onAddMemberDirect}
            onPromoteToAdmin={onPromoteToAdmin}
            onDemoteToMember={onDemoteToMember}
          />
        )}
      </div>

      {showCreate && (
        <CreateGroupModal
          onClose={() => setShowCreate(false)}
          onCreate={onCreateGroup}
        />
      )}
      {showJoin && (
        <JoinGroupModal
          onClose={() => setShowJoin(false)}
          onJoin={onJoinGroup}
        />
      )}
    </>
  );
}

/* ─── Intercede With Me Section ─── */
function IntercedeWithMe() {
  return (
    <div className="community-section intercede-section">
      <div className="community-section-title">
        <HandHeart size={15} />
        <span>Intercede With Me</span>
      </div>
      <div className="coming-soon-card">
        <div className="coming-soon-icon">🕊️</div>
        <div className="coming-soon-label">Coming Soon</div>
        <p className="coming-soon-desc">
          Stand with others in prayer. Post anonymous prayer burdens and let the community intercede with you.
        </p>
      </div>
    </div>
  );
}

/* ─── Main Export ─── */
export default function CommunityPrayer({
  // shared groups props
  groups, activeGroupId, onSetActiveGroup, activeGroup,
  groupMembers, groupPosts, totalGroupMinutes, todayGroupMinutes,
  isAdmin, isPending, myMember,
  onCreateGroup, onJoinGroup, onLogTime, onAddPost, onDeletePost,
  onUpdateGroupFocus, onLeaveGroup, onDeleteGroup,
  onApproveMember, onRejectMember, onRefreshFeed, onAddMemberDirect,
  onPromoteToAdmin, onDemoteToMember,
  // intercede props
  intercedeRequests, onAddIntercede, onPrayIntercede, onDeleteIntercede,
  // partner props
  partnerships, pendingPartnerInvites, getPartnershipData,
  onInvitePartnerAccount, onAcceptPartnership, onDeclinePartnership,
  onCancelPartnerInvite, onEndPartnership,
  onLogPartnershipPrayer, onSendEncouragement,
  onAddSharedRequest, onMarkRequestAnswered,
  // auth
  user, onRequireAuth,
}) {
  const [activeSection, setActiveSection] = useState('circle');
  const isGuest = !user;

  return (
    <div className="community-tab">
      {/* Section toggle */}
      <div className="community-tabs">
        <button
          className={`community-tab-btn ${activeSection === 'circle' ? 'community-tab-active' : ''}`}
          onClick={() => setActiveSection('circle')}
        >
          <HeartHandshake size={14} />
          Circle
          {(partnerships?.length > 0 || pendingPartnerInvites?.length > 0) && (
            <span className="community-tab-badge">{(partnerships?.length || 0) + (pendingPartnerInvites?.length || 0)}</span>
          )}
        </button>
        <button
          className={`community-tab-btn ${activeSection === 'groups' ? 'community-tab-active' : ''}`}
          onClick={() => setActiveSection('groups')}
        >
          <Users size={14} />
          Prayer Groups
          {groups.length > 0 && <span className="community-tab-badge">{groups.length}</span>}
        </button>
        <button
          className={`community-tab-btn ${activeSection === 'intercede' ? 'community-tab-active' : ''}`}
          onClick={() => setActiveSection('intercede')}
        >
          <HandHeart size={14} />
          Intercede
          {intercedeRequests.length > 0 && (
            <span className="community-tab-badge">{intercedeRequests.length}</span>
          )}
        </button>
      </div>

      {activeSection === 'circle' ? (
        <PartnersTab
          partnerships={partnerships || []}
          pendingInvites={pendingPartnerInvites || []}
          getPartnershipData={getPartnershipData}
          onInvite={onInvitePartnerAccount}
          onAccept={onAcceptPartnership}
          onDecline={onDeclinePartnership}
          onCancel={onCancelPartnerInvite}
          onEnd={onEndPartnership}
          onLogPrayer={onLogPartnershipPrayer}
          onEncourage={onSendEncouragement}
          onAddRequest={onAddSharedRequest}
          onMarkAnswered={onMarkRequestAnswered}
          userId={user?.id}
          onRequireAuth={onRequireAuth}
        />
      ) : activeSection === 'groups' ? (
        <SharedGroups
          groups={groups}
          activeGroupId={activeGroupId}
          onSetActive={onSetActiveGroup}
          activeGroup={activeGroup}
          members={groupMembers}
          posts={groupPosts}
          totalGroupMinutes={totalGroupMinutes}
          todayGroupMinutes={todayGroupMinutes}
          userId={user?.id}
          isAdmin={isAdmin}
          isPending={isPending}
          myMember={myMember}
          onCreateGroup={onCreateGroup}
          onJoinGroup={onJoinGroup}
          onLogTime={onLogTime}
          onAddPost={onAddPost}
          onDeletePost={onDeletePost}
          onUpdateFocus={onUpdateGroupFocus}
          onLeave={onLeaveGroup}
          onDelete={onDeleteGroup}
          onApproveMember={onApproveMember}
          onRejectMember={onRejectMember}
          onRefreshFeed={onRefreshFeed}
          onAddMemberDirect={onAddMemberDirect}
          onPromoteToAdmin={onPromoteToAdmin}
          onDemoteToMember={onDemoteToMember}
          isGuest={isGuest}
          onRequireAuth={onRequireAuth}
        />
      ) : (
        <IntercedeWithMe
          requests={intercedeRequests}
          onAdd={onAddIntercede}
          onPray={onPrayIntercede}
          onDelete={onDeleteIntercede}
          isGuest={isGuest}
          onRequireAuth={onRequireAuth}
          userId={user?.id}
        />
      )}
    </div>
  );
}

import { useState } from 'react';
import { Users, Plus, HandHeart, Send, X, ChevronDown } from 'lucide-react';
import GroupView from './GroupView';
import CreateGroupModal from './CreateGroupModal';
import JoinGroupModal from './JoinGroupModal';

/* ─── Shared Prayer Groups Section ─── */
function SharedGroups({ groups, activeGroupId, onSetActive, activeGroup, members, posts,
  totalGroupMinutes, todayGroupMinutes, userId, isAdmin, isPending, myMember,
  onCreateGroup, onJoinGroup, onLogTime, onAddPost, onDeletePost,
  onUpdateFocus, onLeave, onDelete, onApproveMember, onRejectMember, onRefreshFeed,
  isGuest, onRequireAuth,
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
function IntercedeWithMe({ requests, onAdd, onPray, onDelete, isGuest, onRequireAuth }) {
  const [showForm, setShowForm] = useState(false);
  const [burden, setBurden] = useState('');

  const handleSubmit = () => {
    if (!burden.trim()) return;
    onAdd(burden);
    setBurden('');
    setShowForm(false);
  };

  const handlePostClick = () => {
    if (isGuest) { onRequireAuth(); return; }
    setShowForm(true);
  };

  const handlePray = (id) => {
    if (isGuest) { onRequireAuth(); return; }
    onPray(id);
  };

  return (
    <div className="community-section intercede-section intercede-coming-soon">
      <div className="intercede-coming-soon-badge">Coming Soon</div>
      <div className="community-section-title">
        <HandHeart size={15} />
        <span>Intercede With Me</span>
      </div>
      <p className="intercede-intro">
        Community prayer requests — coming soon 🕊️
      </p>

      <button className="intercede-post-btn" disabled>
        <HandHeart size={14} />
        Post a prayer request
      </button>
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
  onApproveMember, onRejectMember, onRefreshFeed,
  // intercede props
  intercedeRequests, onAddIntercede, onPrayIntercede, onDeleteIntercede,
  // auth
  user, onRequireAuth,
}) {
  const [activeSection, setActiveSection] = useState('groups');
  const isGuest = !user;

  return (
    <div className="community-tab">
      {/* Section toggle */}
      <div className="community-tabs">
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

      {activeSection === 'groups' ? (
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
        />
      )}
    </div>
  );
}

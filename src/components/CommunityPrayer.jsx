import { useState } from 'react';
import { Users, Plus, HandHeart, Send, X, Heart, ChevronDown } from 'lucide-react';
import GroupView from './GroupView';
import CreateGroupModal from './CreateGroupModal';
import JoinGroupModal from './JoinGroupModal';

function formatRelative(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/* ─── Shared Prayer Groups Section ─── */
function SharedGroups({ groups, activeGroupId, onSetActive, activeGroup, members, posts,
  totalGroupMinutes, todayGroupMinutes, userId, isAdmin, myMember,
  onCreateGroup, onJoinGroup, onLogTime, onAddPost, onDeletePost,
  onUpdateFocus, onLeave, onDelete, isGuest, onRequireAuth,
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showGroupPicker, setShowGroupPicker] = useState(false);

  if (isGuest) {
    return (
      <div className="community-section">
        <div className="community-section-title">
          <Users size={15} />
          <span>Prayer Groups</span>
        </div>
        <div className="intercede-guest-banner">
          <span>Sign in to create or join a prayer group</span>
          <button className="intercede-guest-signin" onClick={onRequireAuth}>Sign in</button>
        </div>
      </div>
    );
  }

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
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={15} />
              Create Group
            </button>
            <button className="btn btn-secondary" onClick={() => setShowJoin(true)}>
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
        {/* Group selector (if multiple groups) */}
        <div className="group-selector-row">
          {groups.length > 1 ? (
            <div className="group-selector">
              <button
                className="group-selector-btn"
                onClick={() => setShowGroupPicker(!showGroupPicker)}
              >
                <Users size={14} />
                <span>{activeGroup?.name || 'Select group'}</span>
                <ChevronDown size={14} className={showGroupPicker ? 'icon-rotate' : ''} />
              </button>
              {showGroupPicker && (
                <div className="group-picker-dropdown">
                  {groups.map(g => (
                    <button
                      key={g.id}
                      className={`group-picker-item ${g.id === activeGroupId ? 'group-picker-item-active' : ''}`}
                      onClick={() => { onSetActive(g.id); setShowGroupPicker(false); }}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="community-section-title" style={{ marginBottom: 0 }}>
              <Users size={15} />
              <span>Prayer Groups</span>
            </div>
          )}
          <div className="group-header-actions">
            <button className="btn btn-secondary btn-xs" onClick={() => setShowJoin(true)}>
              Join
            </button>
            <button className="btn btn-primary btn-xs" onClick={() => setShowCreate(true)}>
              <Plus size={13} /> New
            </button>
          </div>
        </div>

        {activeGroup && (
          <GroupView
            group={activeGroup}
            members={members}
            posts={posts}
            totalGroupMinutes={totalGroupMinutes}
            todayGroupMinutes={todayGroupMinutes}
            userId={userId}
            isAdmin={isAdmin}
            myMember={myMember}
            onLogTime={onLogTime}
            onAddPost={onAddPost}
            onDeletePost={onDeletePost}
            onUpdateFocus={onUpdateFocus}
            onLeave={onLeave}
            onDelete={onDelete}
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
    <div className="community-section intercede-section">
      <div className="community-section-title">
        <HandHeart size={15} />
        <span>Intercede With Me</span>
        {requests.length > 0 && <span className="community-member-count">{requests.length}</span>}
      </div>
      <p className="intercede-intro">
        Share an anonymous prayer burden. Others can stand with you in prayer.
      </p>

      {isGuest && (
        <div className="intercede-guest-banner">
          <span>Sign in to post requests and pray for others</span>
          <button className="intercede-guest-signin" onClick={onRequireAuth}>Sign in</button>
        </div>
      )}

      {!isGuest && showForm ? (
        <div className="intercede-form">
          <textarea
            className="intercede-textarea"
            placeholder="Share what you'd like the community to pray for... (posted anonymously)"
            value={burden}
            onChange={(e) => setBurden(e.target.value)}
            rows={3}
            autoFocus
          />
          <div className="intercede-form-actions">
            <button className="btn btn-sm btn-secondary" onClick={() => { setShowForm(false); setBurden(''); }}>
              <X size={14} /> Cancel
            </button>
            <button className="btn btn-sm btn-primary" onClick={handleSubmit} disabled={!burden.trim()}>
              <Send size={14} /> Post
            </button>
          </div>
        </div>
      ) : (
        <button className="intercede-post-btn" onClick={handlePostClick}>
          <HandHeart size={14} />
          Post a prayer request
        </button>
      )}

      {requests.length > 0 && (
        <div className="intercede-feed">
          {requests.map(req => (
            <div key={req.id} className="intercede-card">
              <div className="intercede-card-top">
                <div className="intercede-anon-avatar">🙏</div>
                <span className="intercede-timestamp">{formatRelative(req.createdAt)}</span>
                {!isGuest && (
                  <button className="intercede-delete-btn" onClick={() => onDelete(req.id)}>
                    <X size={12} />
                  </button>
                )}
              </div>
              <p className="intercede-burden">{req.burden}</p>
              <div className="intercede-card-bottom">
                <button
                  className={`intercede-pray-btn ${req.hasPrayed ? 'intercede-pray-btn-done' : ''}`}
                  onClick={() => handlePray(req.id)}
                  disabled={req.hasPrayed}
                >
                  <Heart size={13} strokeWidth={req.hasPrayed ? 0 : 2} fill={req.hasPrayed ? '#FBBF24' : 'none'} />
                  {req.hasPrayed ? 'You prayed for this' : 'I\'m praying for this'}
                </button>
                {req.prayerCount > 0 && (
                  <span className="intercede-count">
                    {req.prayerCount} {req.prayerCount === 1 ? 'person' : 'people'} praying
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {requests.length === 0 && (
        <p className="intercede-empty">No prayer requests yet — be the first to share.</p>
      )}
    </div>
  );
}

/* ─── Main Export ─── */
export default function CommunityPrayer({
  // shared groups props
  groups, activeGroupId, onSetActiveGroup, activeGroup,
  groupMembers, groupPosts, totalGroupMinutes, todayGroupMinutes,
  isAdmin, myMember,
  onCreateGroup, onJoinGroup, onLogTime, onAddPost, onDeletePost,
  onUpdateGroupFocus, onLeaveGroup, onDeleteGroup,
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
          myMember={myMember}
          onCreateGroup={onCreateGroup}
          onJoinGroup={onJoinGroup}
          onLogTime={onLogTime}
          onAddPost={onAddPost}
          onDeletePost={onDeletePost}
          onUpdateFocus={onUpdateGroupFocus}
          onLeave={onLeaveGroup}
          onDelete={onDeleteGroup}
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

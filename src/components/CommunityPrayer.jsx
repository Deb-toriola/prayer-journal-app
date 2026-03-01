import { useState } from 'react';
import { Users, Plus, HandHeart, Send, X, ChevronDown, Heart, Trash2, Flag } from 'lucide-react';
import { formatRelativeDate } from '../utils/constants';
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
function IntercedeWithMe({ requests, onAdd, onPray, onDelete, isGuest, onRequireAuth, userId }) {
  const [showForm, setShowForm] = useState(false);
  const [burden, setBurden] = useState('');
  const [reportedIds, setReportedIds] = useState(new Set());
  const [reportingId, setReportingId] = useState(null);

  const handleSubmit = () => {
    if (!burden.trim()) return;
    onAdd(burden.trim());
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

  const handleReport = (id) => {
    setReportedIds(prev => new Set([...prev, id]));
    setReportingId(null);
  };

  return (
    <div className="community-section intercede-section">
      <div className="community-section-title">
        <HandHeart size={15} />
        <span>Intercede With Me</span>
      </div>
      <p className="intercede-intro">
        Stand with others in prayer. Requests are anonymous — your name is never shown.
      </p>

      <button className="intercede-post-btn" onClick={handlePostClick}>
        <HandHeart size={14} />
        Post a prayer request
      </button>

      {showForm && (
        <div className="intercede-form">
          <textarea
            className="intercede-textarea"
            placeholder="Share your prayer burden anonymously... (your name will not be shown)"
            value={burden}
            onChange={e => setBurden(e.target.value)}
            rows={3}
            maxLength={400}
            autoFocus
          />
          <div className="intercede-form-actions">
            <button className="btn btn-sm btn-secondary" onClick={() => { setShowForm(false); setBurden(''); }}>
              <X size={13} /> Cancel
            </button>
            <button className="btn btn-sm btn-primary" onClick={handleSubmit} disabled={!burden.trim()}>
              <Send size={13} /> Post
            </button>
          </div>
        </div>
      )}

      <div className="intercede-feed">
        {requests.length === 0 ? (
          <p className="intercede-empty">No prayer requests yet — be the first to post one 🕊️</p>
        ) : (
          requests.map(req => (
            <div key={req.id} className={`intercede-card ${reportedIds.has(req.id) ? 'intercede-card-reported' : ''}`}>
              {reportedIds.has(req.id) ? (
                <p className="intercede-reported-msg">This post has been reported and is under review.</p>
              ) : (
                <>
                  <p className="intercede-burden">{req.burden}</p>
                  <div className="intercede-card-bottom">
                    <span className="intercede-timestamp">{formatRelativeDate(req.createdAt)}</span>
                    <div className="intercede-card-actions">
                      <button
                        className={`intercede-pray-btn ${req.hasPrayed ? 'intercede-pray-btn-done' : ''}`}
                        onClick={() => handlePray(req.id)}
                        disabled={req.hasPrayed}
                        title={req.hasPrayed ? 'You prayed for this' : 'I prayed for this'}
                      >
                        <Heart size={12} fill={req.hasPrayed ? 'currentColor' : 'none'} />
                        {req.prayerCount > 0 && <span>{req.prayerCount}</span>}
                        {req.hasPrayed ? 'Prayed' : 'Pray'}
                      </button>
                      {req.userId === userId ? (
                        <button className="intercede-delete-btn" onClick={() => onDelete(req.id)} title="Delete">
                          <Trash2 size={12} />
                        </button>
                      ) : reportingId === req.id ? (
                        <div className="intercede-report-confirm">
                          <span>Report this?</span>
                          <button className="intercede-report-yes" onClick={() => handleReport(req.id)}>Yes</button>
                          <button className="intercede-report-no" onClick={() => setReportingId(null)}>No</button>
                        </div>
                      ) : (
                        <button className="intercede-report-btn" onClick={() => setReportingId(req.id)} title="Report post">
                          <Flag size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
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
          userId={user?.id}
        />
      )}
    </div>
  );
}

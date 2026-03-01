import { useState } from 'react';
import {
  MessageSquare, Clock, Settings, Timer, Send, X, Copy, Check,
  BookOpen, Trash2, Crown, LogOut, Users, RefreshCw, CheckCircle2,
} from 'lucide-react';
import { formatRelativeDate } from '../utils/constants';

function formatMinutes(mins) {
  if (!mins) return '0m';
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const POST_TYPE_LABELS = { note: 'Note', scripture: 'Scripture', focus_update: 'Focus Update' };

/* ─── Feed Tab ─── */
function FeedTab({ posts, userId, onAddPost, onDeletePost, onRefresh, groupId }) {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('note');
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    await onAddPost(groupId, content.trim(), postType);
    setContent('');
    setSubmitting(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <div className="group-feed">
      {/* Feed header with refresh */}
      <div className="group-feed-header">
        <span className="group-feed-title">Group Feed</span>
        <button className={`group-refresh-btn ${refreshing ? 'group-refresh-spinning' : ''}`} onClick={handleRefresh} title="Refresh feed">
          <RefreshCw size={14} />
        </button>
      </div>
      {/* Composer */}
      <div className="group-composer">
        <div className="group-composer-types">
          {['note', 'scripture'].map(type => (
            <button
              key={type}
              className={`group-type-btn ${postType === type ? 'group-type-btn-active' : ''}`}
              onClick={() => setPostType(type)}
            >
              {type === 'note' ? <MessageSquare size={13} /> : <BookOpen size={13} />}
              {type === 'note' ? 'Note' : 'Scripture'}
            </button>
          ))}
        </div>
        <textarea
          className="group-composer-input"
          placeholder={
            postType === 'scripture'
              ? 'Share a scripture that spoke to you…'
              : 'What is God saying to you?'
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          maxLength={500}
        />
        <button
          className="btn btn-primary btn-sm group-post-btn"
          onClick={handlePost}
          disabled={!content.trim() || submitting}
        >
          <Send size={14} />
          {submitting ? 'Posting…' : 'Post'}
        </button>
      </div>

      {/* Posts feed */}
      {posts.length === 0 ? (
        <p className="group-empty">No posts yet. Share what God is saying to you!</p>
      ) : (
        <div className="group-posts-list">
          {posts.map(post => (
            <div key={post.id} className={`group-post group-post-${post.type}`}>
              <div className="group-post-header">
                <div className="group-post-avatar">{initials(post.display_name)}</div>
                <div className="group-post-meta">
                  <span className="group-post-name">{post.display_name}</span>
                  <span className="group-post-time">{formatRelativeDate(post.created_at)}</span>
                </div>
                <span className={`group-post-type-badge group-post-type-${post.type}`}>
                  {POST_TYPE_LABELS[post.type] || post.type}
                </span>
                {post.user_id === userId && (
                  <button className="group-post-delete" onClick={() => onDeletePost(post.id)}>
                    <X size={13} />
                  </button>
                )}
              </div>
              <p className="group-post-content">{post.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Prayer Time Tab ─── */
function PrayerTimeTab({ members, totalGroupMinutes, todayGroupMinutes, userId, onLogTime, groupId }) {
  const [logMinutes, setLogMinutes] = useState('');
  const [logging, setLogging] = useState(false);

  const handleLog = async () => {
    const mins = parseInt(logMinutes) || 0;
    if (mins < 1) return;
    setLogging(true);
    await onLogTime(groupId, mins);
    setLogMinutes('');
    setLogging(false);
  };

  return (
    <div className="group-time-tab">
      {/* Group totals */}
      {totalGroupMinutes > 0 && (
        <div className="group-time-totals">
          <div className="group-time-total-item">
            <span className="group-time-total-num">{formatMinutes(totalGroupMinutes)}</span>
            <span className="group-time-total-label">Total prayer</span>
          </div>
          {todayGroupMinutes > 0 && (
            <div className="group-time-total-item">
              <span className="group-time-total-num">{formatMinutes(todayGroupMinutes)}</span>
              <span className="group-time-total-label">Today</span>
            </div>
          )}
        </div>
      )}

      {/* Log my time */}
      <div className="group-log-form">
        <label className="form-label">Log my prayer time</label>
        <div className="group-log-row">
          <input
            type="number"
            min="1"
            max="999"
            className="form-input"
            placeholder="minutes"
            value={logMinutes}
            onChange={(e) => setLogMinutes(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLog()}
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={handleLog}
            disabled={!logMinutes || parseInt(logMinutes) < 1 || logging}
          >
            <Timer size={14} />
            {logging ? 'Saving…' : 'Log'}
          </button>
        </div>
      </div>

      {/* Leaderboard */}
      {members.length === 0 ? (
        <p className="group-empty">No prayer time logged yet.</p>
      ) : (
        <div className="group-leaderboard">
          {members.map((m, i) => (
            <div key={m.id} className={`group-member-row ${m.user_id === userId ? 'group-member-row-me' : ''}`}>
              <div className="group-member-rank">
                {i === 0 && m.totalMinutes > 0 ? '🥇'
                  : i === 1 && m.totalMinutes > 0 ? '🥈'
                  : i === 2 && m.totalMinutes > 0 ? '🥉'
                  : <span className="group-rank-num">{i + 1}</span>}
              </div>
              <div className="group-member-avatar">{initials(m.display_name)}</div>
              <div className="group-member-info">
                <span className="group-member-name">
                  {m.display_name}
                  {m.user_id === userId && <span className="group-me-badge">you</span>}
                  {m.role === 'admin' && <Crown size={11} className="group-admin-icon" />}
                </span>
                <span className="group-member-stats">
                  {formatMinutes(m.totalMinutes)} total
                  {m.todayMinutes > 0 && ` · ${formatMinutes(m.todayMinutes)} today`}
                  {m.lastLog && ` · ${formatRelativeDate(m.lastLog.logged_at)}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Group Settings Tab ─── */
function GroupSettingsTab({
  group, members, userId, isAdmin,
  onUpdateFocus, onLeave, onDelete, onApproveMember, onRejectMember,
}) {
  const [focus, setFocus] = useState(group.focus || '');
  const [scripture, setScripture] = useState(group.scripture || '');
  const [editingFocus, setEditingFocus] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveFocus = async () => {
    setSaving(true);
    await onUpdateFocus(group.id, focus, scripture);
    setSaving(false);
    setEditingFocus(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(group.invite_code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = () => {
    const text = `Join my prayer group on My Prayer App!\n\nGroup: ${group.name}\nInvite code: ${group.invite_code}`;
    if (navigator.share) {
      navigator.share({ title: 'Join my prayer group', text });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="group-settings-tab">
      {/* Group info */}
      <div className="group-settings-section">
        <h3 className="group-settings-heading">{group.name}</h3>
        {group.description && <p className="group-settings-desc">{group.description}</p>}
      </div>

      {/* Prayer focus */}
      <div className="group-settings-section">
        <div className="group-settings-label">
          <BookOpen size={14} />
          Prayer Focus
          {isAdmin && !editingFocus && (
            <button className="group-edit-btn" onClick={() => setEditingFocus(true)}>Edit</button>
          )}
        </div>
        {editingFocus ? (
          <div className="group-focus-form">
            <textarea
              className="form-input"
              placeholder="Current prayer focus for the group…"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              rows={3}
              maxLength={300}
            />
            <input
              className="form-input"
              placeholder="Scripture reference (e.g. Philippians 4:6-7)"
              value={scripture}
              onChange={(e) => setScripture(e.target.value)}
              maxLength={100}
            />
            <div className="group-focus-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => setEditingFocus(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={handleSaveFocus} disabled={saving}>
                {saving ? 'Saving…' : 'Save Focus'}
              </button>
            </div>
          </div>
        ) : (
          <div className="group-focus-display">
            {group.focus
              ? <>
                  <p className="group-focus-text">{group.focus}</p>
                  {group.scripture && <p className="group-focus-scripture">— {group.scripture}</p>}
                </>
              : <p className="group-empty">{isAdmin ? 'Tap Edit to set a prayer focus for the group.' : 'No prayer focus set yet.'}</p>
            }
          </div>
        )}
      </div>

      {/* Invite code */}
      <div className="group-settings-section">
        <div className="group-settings-label">
          <Users size={14} />
          Invite Friends
        </div>
        <p className="group-settings-hint">Share this code to invite people to the group</p>
        <div className="invite-code-box">
          <span className="invite-code-text">{group.invite_code}</span>
          <button className="invite-code-copy" onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <button className="btn btn-primary btn-sm invite-share-btn" onClick={handleShare}>
          Share Invite
        </button>
      </div>

      {/* Pending members — admin only */}
      {isAdmin && members.filter(m => m.status === 'pending').length > 0 && (
        <div className="group-settings-section">
          <div className="group-settings-label group-pending-label">
            <Users size={14} />
            Pending Approval ({members.filter(m => m.status === 'pending').length})
          </div>
          <div className="group-members-list">
            {members.filter(m => m.status === 'pending').map(m => (
              <div key={m.id} className="group-member-item group-member-pending">
                <div className="group-member-avatar">{initials(m.display_name)}</div>
                <div className="group-member-item-info">
                  <span className="group-member-name">{m.display_name}</span>
                  <span className="group-member-joined">Requested {formatDate(m.joined_at)}</span>
                </div>
                <div className="group-approval-actions">
                  <button className="group-approve-btn" onClick={() => onApproveMember(m.id)} title="Approve">
                    <CheckCircle2 size={16} />
                  </button>
                  <button className="group-reject-btn" onClick={() => onRejectMember(m.id)} title="Reject">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members list */}
      <div className="group-settings-section">
        <div className="group-settings-label">
          <Users size={14} />
          Members ({members.filter(m => m.status !== 'pending').length})
        </div>
        <div className="group-members-list">
          {members.filter(m => m.status !== 'pending').map(m => (
            <div key={m.id} className="group-member-item">
              <div className="group-member-avatar">{initials(m.display_name)}</div>
              <div className="group-member-item-info">
                <span className="group-member-name">
                  {m.display_name}
                  {m.user_id === userId && <span className="group-me-badge">you</span>}
                </span>
                <span className="group-member-joined">Joined {formatDate(m.joined_at)}</span>
              </div>
              {m.role === 'admin' && (
                <span className="group-admin-badge">
                  <Crown size={11} /> admin
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="group-settings-section group-danger-zone">
        <button className="btn btn-danger-outline btn-sm" onClick={() => onLeave(group.id)}>
          <LogOut size={14} />
          Leave Group
        </button>
        {isAdmin && (
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(group.id)}>
            <Trash2 size={14} />
            Delete Group
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Main GroupView ─── */
export default function GroupView({
  group, members, posts, totalGroupMinutes, todayGroupMinutes,
  userId, isAdmin, myMember, isPending,
  onLogTime, onAddPost, onDeletePost, onRefreshFeed,
  onUpdateFocus, onLeave, onDelete, onApproveMember, onRejectMember,
}) {
  const [activeTab, setActiveTab] = useState('feed');

  const tabs = [
    { id: 'feed', label: 'Feed', icon: <MessageSquare size={14} /> },
    { id: 'time', label: 'Prayer Time', icon: <Clock size={14} /> },
    { id: 'group', label: 'Group', icon: <Settings size={14} /> },
  ];

  const approvedMemberCount = members.filter(m => m.status !== 'pending').length;
  const pendingCount = members.filter(m => m.status === 'pending').length;

  return (
    <div className="group-view">
      {/* Group header */}
      <div className="group-view-header">
        <div className="group-view-icon"><Users size={18} /></div>
        <div>
          <p className="group-view-name">{group.name}</p>
          <p className="group-view-members">{approvedMemberCount} member{approvedMemberCount !== 1 ? 's' : ''}
            {isAdmin && pendingCount > 0 && <span className="group-pending-badge">{pendingCount} pending</span>}
          </p>
        </div>
      </div>

      {/* Pending approval banner for current user */}
      {isPending && (
        <div className="group-pending-banner">
          ⏳ Your request to join is waiting for admin approval
        </div>
      )}

      {/* Sub-tabs */}
      <div className="group-subtabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`group-subtab ${activeTab === tab.id ? 'group-subtab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="group-tab-content">
        {activeTab === 'feed' && (
          <FeedTab
            posts={posts}
            userId={userId}
            onAddPost={onAddPost}
            onDeletePost={onDeletePost}
            onRefresh={onRefreshFeed}
            groupId={group.id}
          />
        )}
        {activeTab === 'time' && (
          <PrayerTimeTab
            members={members.filter(m => m.status !== 'pending')}
            totalGroupMinutes={totalGroupMinutes}
            todayGroupMinutes={todayGroupMinutes}
            userId={userId}
            onLogTime={onLogTime}
            groupId={group.id}
          />
        )}
        {activeTab === 'group' && (
          <GroupSettingsTab
            group={group}
            members={members}
            userId={userId}
            isAdmin={isAdmin}
            onUpdateFocus={onUpdateFocus}
            onLeave={onLeave}
            onDelete={onDelete}
            onApproveMember={onApproveMember}
            onRejectMember={onRejectMember}
          />
        )}
      </div>
    </div>
  );
}

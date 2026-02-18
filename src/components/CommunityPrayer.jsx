import { useState } from 'react';
import { Users, Plus, Clock, Trash2, Timer, HandHeart, Send, X, Heart } from 'lucide-react';

function formatMinutes(mins) {
  if (!mins) return '0m';
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

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

/* ─── Prayer Group Section ─── */
function PrayerGroup({ memberStats, totalGroupMinutes, todayGroupMinutes, onAddMember, onRemoveMember, onLogSession }) {
  const [newName, setNewName] = useState('');
  const [logMinutes, setLogMinutes] = useState({});
  const [showAddMember, setShowAddMember] = useState(false);

  const handleAddMember = () => {
    if (!newName.trim()) return;
    onAddMember(newName.trim());
    setNewName('');
    setShowAddMember(false);
  };

  const handleLog = (memberId) => {
    const mins = parseInt(logMinutes[memberId]) || 0;
    if (mins < 1) return;
    onLogSession(memberId, mins);
    setLogMinutes(prev => ({ ...prev, [memberId]: '' }));
  };

  return (
    <div className="community-section">
      <div className="community-section-title">
        <Users size={15} />
        <span>Prayer Group</span>
        {memberStats.length > 0 && <span className="community-member-count">{memberStats.length}</span>}
        {todayGroupMinutes > 0 && <span className="community-today-badge">{formatMinutes(todayGroupMinutes)} today</span>}
      </div>

      {totalGroupMinutes > 0 && (
        <div className="community-totals">
          <Clock size={13} />
          <span><strong>{formatMinutes(totalGroupMinutes)}</strong> total group prayer</span>
        </div>
      )}

      {memberStats.length === 0 ? (
        <p className="community-empty">Add your prayer group members to track time praying together.</p>
      ) : (
        <div className="community-members">
          {memberStats.map((member, index) => (
            <div key={member.id} className="community-member-row">
              <div className="community-member-rank">
                {index === 0 && member.totalMinutes > 0 ? '🥇'
                  : index === 1 && member.totalMinutes > 0 ? '🥈'
                  : index === 2 && member.totalMinutes > 0 ? '🥉'
                  : <span className="community-rank-num">{index + 1}</span>}
              </div>
              <div className="community-member-info">
                <span className="community-member-name">{member.name}</span>
                <span className="community-member-stats">
                  {formatMinutes(member.totalMinutes)} total
                  {member.todayMinutes > 0 && ` · ${formatMinutes(member.todayMinutes)} today`}
                  {member.lastSession && ` · ${formatRelative(member.lastSession.loggedAt)}`}
                </span>
              </div>
              <div className="community-log-row">
                <input
                  type="number" min="1" max="999"
                  className="community-minutes-input"
                  placeholder="min"
                  value={logMinutes[member.id] || ''}
                  onChange={(e) => setLogMinutes(prev => ({ ...prev, [member.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleLog(member.id)}
                />
                <button
                  className="btn-log-community"
                  onClick={() => handleLog(member.id)}
                  disabled={!logMinutes[member.id] || parseInt(logMinutes[member.id]) < 1}
                >
                  <Timer size={13} />
                </button>
              </div>
              <button className="community-remove-btn" onClick={() => onRemoveMember(member.id)}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddMember ? (
        <div className="community-add-form">
          <input
            type="text" className="community-name-input" placeholder="Member name..."
            value={newName} onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddMember()} autoFocus
          />
          <div className="community-add-actions">
            <button className="btn btn-sm btn-secondary" onClick={() => { setShowAddMember(false); setNewName(''); }}>Cancel</button>
            <button className="btn btn-sm btn-primary" onClick={handleAddMember} disabled={!newName.trim()}>Add</button>
          </div>
        </div>
      ) : (
        <button className="community-add-btn" onClick={() => setShowAddMember(true)}>
          <Plus size={14} /> Add member
        </button>
      )}
    </div>
  );
}

/* ─── Intercede With Me Section ─── */
function IntercedeWithMe({ requests, onAdd, onPray, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [burden, setBurden] = useState('');

  const handleSubmit = () => {
    if (!burden.trim()) return;
    onAdd(burden);
    setBurden('');
    setShowForm(false);
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

      {showForm ? (
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
        <button className="intercede-post-btn" onClick={() => setShowForm(true)}>
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
                <button className="intercede-delete-btn" onClick={() => onDelete(req.id)}>
                  <X size={12} />
                </button>
              </div>
              <p className="intercede-burden">{req.burden}</p>
              <div className="intercede-card-bottom">
                <button
                  className={`intercede-pray-btn ${req.hasPrayed ? 'intercede-pray-btn-done' : ''}`}
                  onClick={() => onPray(req.id)}
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
  memberStats, totalGroupMinutes, todayGroupMinutes,
  onAddMember, onRemoveMember, onLogSession,
  intercedeRequests, onAddIntercede, onPrayIntercede, onDeleteIntercede,
}) {
  const [activeSection, setActiveSection] = useState('group'); // 'group' | 'intercede'

  return (
    <div className="community-tab">
      {/* Section toggle */}
      <div className="community-tabs">
        <button
          className={`community-tab-btn ${activeSection === 'group' ? 'community-tab-active' : ''}`}
          onClick={() => setActiveSection('group')}
        >
          <Users size={14} />
          Prayer Group
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

      {activeSection === 'group' ? (
        <PrayerGroup
          memberStats={memberStats}
          totalGroupMinutes={totalGroupMinutes}
          todayGroupMinutes={todayGroupMinutes}
          onAddMember={onAddMember}
          onRemoveMember={onRemoveMember}
          onLogSession={onLogSession}
        />
      ) : (
        <IntercedeWithMe
          requests={intercedeRequests}
          onAdd={onAddIntercede}
          onPray={onPrayIntercede}
          onDelete={onDeleteIntercede}
        />
      )}
    </div>
  );
}

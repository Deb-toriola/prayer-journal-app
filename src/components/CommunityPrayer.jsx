import { useState } from 'react';
import { Users, Plus, Clock, Trash2, ChevronDown, ChevronUp, Timer } from 'lucide-react';

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

export default function CommunityPrayer({
  memberStats,
  totalGroupMinutes,
  todayGroupMinutes,
  onAddMember,
  onRemoveMember,
  onLogSession,
}) {
  const [expanded, setExpanded] = useState(false);
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
    setLogMinutes((prev) => ({ ...prev, [memberId]: '' }));
  };

  return (
    <div className="community-card">
      <button className="community-header" onClick={() => setExpanded((v) => !v)}>
        <div className="community-label">
          <Users size={15} />
          <span>Community Prayer</span>
          {memberStats.length > 0 && (
            <span className="community-member-count">{memberStats.length}</span>
          )}
        </div>
        <div className="community-header-right">
          {todayGroupMinutes > 0 && (
            <span className="community-today-badge">{formatMinutes(todayGroupMinutes)} today</span>
          )}
          {expanded ? <ChevronUp size={16} className="community-chevron" /> : <ChevronDown size={16} className="community-chevron" />}
        </div>
      </button>

      {expanded && (
        <div className="community-body">
          {totalGroupMinutes > 0 && (
            <div className="community-totals">
              <div className="community-total-stat">
                <Clock size={13} />
                <span><strong>{formatMinutes(totalGroupMinutes)}</strong> total group prayer</span>
              </div>
            </div>
          )}

          {memberStats.length === 0 ? (
            <p className="community-empty">
              Add your prayer group members to track time praying together.
            </p>
          ) : (
            <div className="community-members">
              {memberStats.map((member, index) => (
                <div key={member.id} className="community-member-row">
                  <div className="community-member-rank">
                    {index === 0 && member.totalMinutes > 0 ? '🥇' : index === 1 && member.totalMinutes > 0 ? '🥈' : index === 2 && member.totalMinutes > 0 ? '🥉' : <span className="community-rank-num">{index + 1}</span>}
                  </div>
                  <div className="community-member-info">
                    <span className="community-member-name">{member.name}</span>
                    <span className="community-member-stats">
                      {formatMinutes(member.totalMinutes)} total
                      {member.todayMinutes > 0 && ` · ${formatMinutes(member.todayMinutes)} today`}
                      {member.lastSession && ` · last ${formatRelative(member.lastSession.loggedAt)}`}
                    </span>
                  </div>
                  <div className="community-member-log">
                    <div className="community-log-row">
                      <input
                        type="number"
                        min="1"
                        max="999"
                        className="community-minutes-input"
                        placeholder="min"
                        value={logMinutes[member.id] || ''}
                        onChange={(e) => setLogMinutes((prev) => ({ ...prev, [member.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleLog(member.id)}
                      />
                      <button
                        className="btn-log-community"
                        onClick={() => handleLog(member.id)}
                        disabled={!logMinutes[member.id] || parseInt(logMinutes[member.id]) < 1}
                        title="Log prayer time"
                      >
                        <Timer size={13} />
                      </button>
                    </div>
                  </div>
                  <button
                    className="community-remove-btn"
                    onClick={() => onRemoveMember(member.id)}
                    title="Remove member"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {showAddMember ? (
            <div className="community-add-form">
              <input
                type="text"
                className="community-name-input"
                placeholder="Member name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                autoFocus
              />
              <div className="community-add-actions">
                <button className="btn btn-sm btn-secondary" onClick={() => { setShowAddMember(false); setNewName(''); }}>
                  Cancel
                </button>
                <button className="btn btn-sm btn-primary" onClick={handleAddMember} disabled={!newName.trim()}>
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button className="community-add-btn" onClick={() => setShowAddMember(true)}>
              <Plus size={14} />
              Add member
            </button>
          )}
        </div>
      )}
    </div>
  );
}

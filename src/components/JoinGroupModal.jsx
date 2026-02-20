import { useState } from 'react';
import { X } from 'lucide-react';

export default function JoinGroupModal({ onClose, onJoin }) {
  const [inviteCode, setInviteCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (!inviteCode.trim() || !displayName.trim()) return;
    setJoining(true);
    setError('');
    const result = await onJoin(inviteCode.trim(), displayName.trim());
    setJoining(false);
    if (result.error) { setError(result.error); return; }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-header">
          <h2 className="modal-title">Join Prayer Group</h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          <div className="form-field">
            <label className="form-label">Invite code *</label>
            <input
              className="form-input"
              placeholder="Enter 8-character code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              autoFocus
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Your name in this group *</label>
            <input
              className="form-input"
              placeholder="e.g. Deborah"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <p className="form-hint">This is how group members will see you</p>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={handleJoin}
              disabled={!inviteCode.trim() || !displayName.trim() || joining}
            >
              {joining ? 'Joining…' : 'Join Group'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

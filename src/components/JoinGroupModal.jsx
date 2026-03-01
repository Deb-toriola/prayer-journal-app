import { useState } from 'react';
import { X } from 'lucide-react';

export default function JoinGroupModal({ onClose, onJoin }) {
  const [inviteCode, setInviteCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleJoin = async () => {
    if (!inviteCode.trim() || !displayName.trim()) return;
    setJoining(true);
    setError('');
    const result = await onJoin(inviteCode.trim(), displayName.trim());
    setJoining(false);
    if (result.error) { setError(result.error); return; }
    if (result.pending) { setPending(true); return; }
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
          {pending ? (
            <>
              <div className="join-pending-msg">
                <div className="join-pending-icon">🙏</div>
                <div className="join-pending-title">Request sent!</div>
                <p className="join-pending-sub">
                  Your request has been sent — waiting for admin approval. You&apos;ll appear in the group once approved.
                </p>
              </div>
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={onClose}>Done</button>
              </div>
            </>
          ) : (
            <>
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
                  maxLength={10}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Your name in this group *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Deborah"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={30}
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
                  {joining ? 'Sending request…' : 'Join Group'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

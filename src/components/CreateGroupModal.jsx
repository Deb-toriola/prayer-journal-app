import { useState } from 'react';
import { X, Copy, Check, Users } from 'lucide-react';

export default function CreateGroupModal({ onClose, onCreate }) {
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [group, setGroup] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !displayName.trim()) return;
    setCreating(true);
    setError('');
    const result = await onCreate(name.trim(), description.trim(), displayName.trim());
    setCreating(false);
    if (!result) { setError('Failed to create group. Please try again.'); return; }
    setGroup(result);
    setStep(2);
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
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-header">
          <h2 className="modal-title">
            {step === 1 ? 'Create Prayer Group' : 'Group Created!'}
          </h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {step === 1 ? (
          <div className="modal-body">
            <div className="form-field">
              <label className="form-label">Group name *</label>
              <input
                className="form-input"
                placeholder="e.g. Morning Prayer Warriors"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-field">
              <label className="form-label">Description (optional)</label>
              <input
                className="form-input"
                placeholder="What's this group about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                onClick={handleCreate}
                disabled={!name.trim() || !displayName.trim() || creating}
              >
                {creating ? 'Creating…' : 'Create Group'}
              </button>
            </div>
          </div>
        ) : (
          <div className="modal-body">
            <div className="create-group-success">
              <div className="create-group-icon">
                <Users size={32} />
              </div>
              <p className="create-group-name">{group.name}</p>
              <p className="create-group-desc">Share this code with friends so they can join</p>

              <div className="invite-code-box">
                <span className="invite-code-text">{group.invite_code}</span>
                <button className="invite-code-copy" onClick={handleCopy}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>

              <button className="btn btn-primary invite-share-btn" onClick={handleShare}>
                Share Invite
              </button>

              <p className="create-group-hint">
                Friends open the app → Community → Join Group → enter the code above
              </p>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={onClose}>Open Group</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

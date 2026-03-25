import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Heart, Send, X, Check, Clock, Plus, ChevronDown, ChevronUp, Flame } from 'lucide-react';

function PartnerCard({ partnership, data, onLogPrayer, onEncourage, onEnd, onAddRequest, onMarkAnswered, userId }) {
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [newRequest, setNewRequest] = useState('');
  const [showAddRequest, setShowAddRequest] = useState(false);

  const partnerSinceDate = data.partnerSince
    ? new Date(data.partnerSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';
  const firstName = data.partnerName.split(' ')[0] || data.partnerName;

  return (
    <div className="partner-card">
      {/* Section 1 — Amber header */}
      <div className="partner-card-amber-header">
        <div className="partner-card-amber-left">
          <div className="partner-avatar">{data.partnerName.charAt(0).toUpperCase()}</div>
          <div>
            <span className="partner-name">{data.partnerName}</span>
            {partnerSinceDate && <span className="partner-since">Prayer partner since {partnerSinceDate}</span>}
          </div>
        </div>
        <div className="partner-card-amber-right">
          <span className="partner-streak-num">🔥 {data.streak}</span>
          <span className="partner-streak-label">DAYS TOGETHER</span>
        </div>
      </div>

      {/* Section 2 — Prayer status cards */}
      <div className="partner-status-row">
        <div className="partner-status-card">
          <span className="partner-status-label">{firstName.toUpperCase()}</span>
          {data.partnerPrayedToday ? (
            <span className="partner-status-prayed"><Check size={13} /> Prayed today</span>
          ) : (
            <span className="partner-status-waiting">Not yet today</span>
          )}
        </div>
        <div className="partner-status-card">
          <span className="partner-status-label">YOU</span>
          {data.myPrayedToday ? (
            <span className="partner-status-prayed"><Check size={13} /> Prayed today</span>
          ) : (
            <span className="partner-status-waiting">Not yet today</span>
          )}
        </div>
      </div>

      {/* Milestone badge */}
      {data.milestone && (
        <div className="partner-milestone-badge">{data.milestone.label}</div>
      )}

      {/* Section 3 — Shared requests */}
      <div className="partner-requests-section">
        <span className="partner-requests-label">Shared prayer requests</span>
        {data.requests.length === 0 ? (
          <p className="partner-requests-empty">No shared requests yet</p>
        ) : (
          data.requests.map(req => (
            <div key={req.id} className={`partner-request ${req.status === 'answered' ? 'partner-request--answered' : ''}`}>
              <span className="partner-request-content">{req.content}</span>
              {req.status === 'answered' ? (
                <span className="partner-request-answered-badge">✓ Answered</span>
              ) : (
                <button className="partner-request-pray-pill" onClick={() => onMarkAnswered(req.id)}>
                  I prayed for this
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Section 4 — Actions */}
      <div className="partner-actions">
        <button className="btn btn-primary partner-action-btn" onClick={() => onEncourage(partnership.id)}>
          🙏 Pray for {firstName}
        </button>
        {showAddRequest ? (
          <div className="partner-add-request">
            <textarea
              className="partner-request-input"
              placeholder="What would you like them to pray for?"
              value={newRequest}
              onChange={e => setNewRequest(e.target.value)}
              maxLength={200}
              rows={2}
            />
            <div className="partner-add-request-btns">
              <button className="btn btn-sm btn-secondary" onClick={() => { setShowAddRequest(false); setNewRequest(''); }}>Cancel</button>
              <button className="btn btn-sm btn-primary" disabled={!newRequest.trim()} onClick={() => {
                onAddRequest(partnership.id, newRequest.trim());
                setNewRequest('');
                setShowAddRequest(false);
              }}>Share</button>
            </div>
          </div>
        ) : (
          <button className="btn btn-secondary partner-action-btn" onClick={() => setShowAddRequest(true)}>
            + Add shared prayer request
          </button>
        )}
      </div>

      {/* Section 5 — End partnership */}
      {!showEndConfirm ? (
        <button className="partner-end-btn" onClick={() => setShowEndConfirm(true)}>End partnership</button>
      ) : (
        <div className="partner-end-confirm">
          <p>End partnership with {data.partnerName}? You will both be notified.</p>
          <div className="partner-end-confirm-btns">
            <button className="btn btn-destructive-outline partner-end-confirm-remove" onClick={() => { onEnd(partnership.id); setShowEndConfirm(false); }}>End partnership</button>
            <button className="btn btn-primary partner-end-confirm-keep" onClick={() => setShowEndConfirm(false)}>Keep</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PartnersTab({
  partnerships, pendingInvites, getPartnershipData,
  onInvite, onAccept, onDecline, onCancel, onEnd,
  onLogPrayer, onEncourage, onAddRequest, onMarkAnswered,
  userId, onRequireAuth,
}) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviting, setInviting] = useState(false);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteError('');
    const result = await onInvite(inviteEmail.trim(), inviteMessage.trim());
    if (result?.error) {
      setInviteError(result.error);
    } else {
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteMessage('');
    }
    setInviting(false);
  };

  if (!userId) {
    return (
      <div className="partners-empty">
        <span className="partners-empty-icon">🕯️</span>
        <h3 className="partners-empty-title">Prayer Partners</h3>
        <p className="partners-empty-body">Sign in to find a prayer partner and pray together daily.</p>
        <button className="btn btn-primary" onClick={onRequireAuth}>Sign in</button>
      </div>
    );
  }

  const incomingInvites = pendingInvites.filter(p => p.invited_by !== userId);
  const outgoingInvites = pendingInvites.filter(p => p.invited_by === userId);

  return (
    <div className="partners-tab">
      {/* Incoming invites */}
      {incomingInvites.length > 0 && (
        <div className="partners-section">
          <h3 className="partners-section-title">Partner Invitations</h3>
          {incomingInvites.map(invite => (
            <div key={invite.id} className="partner-invite-card">
              <div className="partner-invite-header">
                <div className="partner-avatar">{(invite.inviter_name || '?').charAt(0).toUpperCase()}</div>
                <div>
                  <span className="partner-invite-name">{invite.inviter_name || 'Someone'}</span>
                  <span className="partner-invite-msg">wants to be your prayer partner</span>
                </div>
              </div>
              {invite.message && <p className="partner-invite-message">"{invite.message}"</p>}
              <div className="partner-invite-actions">
                <button className="btn btn-primary partner-invite-accept" onClick={() => onAccept(invite.id)}>Accept</button>
                <button className="btn btn-secondary partner-invite-decline" onClick={() => onDecline(invite.id)}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active partners */}
      <div className="partners-section">
        {partnerships.length > 0 ? (
          partnerships.map(p => (
            <PartnerCard
              key={p.id}
              partnership={p}
              data={getPartnershipData(p)}
              onLogPrayer={onLogPrayer}
              onEncourage={onEncourage}
              onEnd={onEnd}
              onAddRequest={onAddRequest}
              onMarkAnswered={onMarkAnswered}
              userId={userId}
            />
          ))
        ) : incomingInvites.length === 0 ? (
          <div className="partners-empty">
            <span className="partners-empty-icon">🤝</span>
            <h3 className="partners-empty-title">No prayer partners yet</h3>
            <p className="partners-empty-body">Invite someone to be your prayer partner. You'll pray for each other daily and celebrate answered prayers together.</p>
          </div>
        ) : null}

        {partnerships.length > 0 && partnerships.length < MAX_PARTNERS && (
          <div className="partner-invite-second-card">
            <span className="partner-invite-second-title">Invite a second partner</span>
            <span className="partner-invite-second-sub">You have {MAX_PARTNERS - partnerships.length} slot remaining</span>
            <button className="btn btn-secondary partner-invite-second-btn" onClick={() => setShowInviteModal(true)}>
              Invite partner
            </button>
          </div>
        )}
        {partnerships.length === 0 && (
          <button className="btn btn-primary partners-invite-btn" onClick={() => setShowInviteModal(true)}>
            Invite a Prayer Partner
          </button>
        )}
        {partnerships.length === 0 && <p className="partners-max-note">You can have up to 2 prayer partners</p>}
      </div>

      {/* Outgoing invites */}
      {outgoingInvites.length > 0 && (
        <div className="partners-section">
          <h3 className="partners-section-title">Sent Invitations</h3>
          {outgoingInvites.map(invite => (
            <div key={invite.id} className="partner-invite-card partner-invite-card--outgoing">
              <div className="partner-invite-header">
                <Clock size={14} />
                <span className="partner-invite-pending">Pending — waiting for response</span>
              </div>
              <button className="partner-cancel-btn" onClick={() => onCancel(invite.id)}>Cancel invite</button>
            </div>
          ))}
        </div>
      )}

      {/* Invite modal — portaled to body to escape stacking context */}
      {showInviteModal && createPortal(
        <div className="partner-modal-overlay" onClick={() => !inviting && setShowInviteModal(false)}>
          <div className="partner-modal" onClick={e => e.stopPropagation()}>
            <h3 className="partner-modal-title">Invite a Prayer Partner</h3>
            <input
              className="partner-modal-input"
              type="email"
              placeholder="Enter their email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
            />
            <textarea
              className="partner-modal-textarea"
              placeholder="Add a message (optional)"
              value={inviteMessage}
              onChange={e => setInviteMessage(e.target.value)}
              maxLength={140}
              rows={2}
            />
            {inviteError && <p className="partner-modal-error">{inviteError}</p>}
            <div className="partner-modal-btns">
              <button className="btn btn-secondary" onClick={() => setShowInviteModal(false)} disabled={inviting}>Cancel</button>
              <button className="btn btn-primary" onClick={handleInvite} disabled={inviting || !inviteEmail.trim()}>
                {inviting ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

const MAX_PARTNERS = 2;

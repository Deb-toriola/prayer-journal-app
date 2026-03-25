import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Check, Clock, Plus, ChevronDown, ChevronUp, Bell, MessageSquare, Star } from 'lucide-react';

const MAX_MEMBERS = 2;
const ENCOURAGE_COOLDOWN = 3600000; // 1 hour in ms

function CircleMemberCard({ partnership, data, onEncourage, onEnd, onAddRequest, onMarkAnswered, userId }) {
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [newRequest, setNewRequest] = useState('');
  const [showAddRequest, setShowAddRequest] = useState(false);
  const [encourageSent, setEncourageSent] = useState(false);
  const lastEncourageRef = useRef(0);

  const partnerSinceDate = data.partnerSince
    ? new Date(data.partnerSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';
  const firstName = data.partnerName.split(' ')[0] || data.partnerName;

  const handleEncourage = () => {
    const now = Date.now();
    if (now - lastEncourageRef.current < ENCOURAGE_COOLDOWN) return;
    lastEncourageRef.current = now;
    onEncourage(partnership.id);
    setEncourageSent(true);
    setTimeout(() => setEncourageSent(false), 2000);
  };

  return (
    <div className="partner-card">
      {/* Section 1 — Amber header */}
      <div className="partner-card-amber-header">
        <div className="partner-card-amber-left">
          <div className="partner-avatar">{data.partnerName.charAt(0).toUpperCase()}</div>
          <div>
            <span className="partner-name">{data.partnerName}</span>
            {partnerSinceDate && <span className="partner-since">Circle member since {partnerSinceDate}</span>}
          </div>
        </div>
        <div className="partner-card-amber-right">
          <span className="partner-streak-num">{data.streak}</span>
          <span className="partner-streak-label">DAYS TOGETHER</span>
        </div>
      </div>

      {/* Section 2 — Prayer status cards */}
      <div className="partner-status-row">
        <div className="partner-status-card">
          <span className="partner-status-label">{firstName.toUpperCase()}</span>
          {data.partnerPrayedToday ? (
            <span className="partner-status-prayed"><Check size={12} /> Prayed today</span>
          ) : (
            <span className="partner-status-waiting">Not yet today</span>
          )}
        </div>
        <div className="partner-status-card">
          <span className="partner-status-label">YOU</span>
          {data.myPrayedToday ? (
            <span className="partner-status-prayed"><Check size={12} /> Prayed today</span>
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
        <button
          className={`btn btn-primary partner-action-btn ${encourageSent ? 'partner-action-btn--sent' : ''}`}
          onClick={handleEncourage}
          disabled={encourageSent}
        >
          {encourageSent ? `Prayed for ${firstName} ✓` : `Pray for ${firstName}`}
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

      {/* Section 5 — End */}
      {!showEndConfirm ? (
        <button className="partner-end-btn" onClick={() => setShowEndConfirm(true)}>End circle</button>
      ) : (
        <div className="partner-end-confirm">
          <p>End circle with {data.partnerName}? You will both be notified.</p>
          <div className="partner-end-confirm-btns">
            <button className="btn btn-destructive-outline partner-end-confirm-remove" onClick={() => { onEnd(partnership.id); setShowEndConfirm(false); }}>End circle</button>
            <button className="btn btn-primary partner-end-confirm-keep" onClick={() => setShowEndConfirm(false)}>Keep</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LOGGED OUT STATE ──────────────────────────────────────────
function CircleLoggedOut({ onRequireAuth }) {
  return (
    <div className="circle-logged-out">
      {/* Blurred preview behind */}
      <div className="circle-blur-preview">
        <div className="partner-card" aria-hidden="true">
          <div className="partner-card-amber-header">
            <div className="partner-card-amber-left">
              <div className="partner-avatar">S</div>
              <div>
                <span className="partner-name">Sarah</span>
                <span className="partner-since">Circle member since Mar 2026</span>
              </div>
            </div>
            <div className="partner-card-amber-right">
              <span className="partner-streak-num">7</span>
              <span className="partner-streak-label">DAYS TOGETHER</span>
            </div>
          </div>
          <div className="partner-status-row">
            <div className="partner-status-card">
              <span className="partner-status-label">SARAH</span>
              <span className="partner-status-prayed"><Check size={12} /> Prayed today</span>
            </div>
            <div className="partner-status-card">
              <span className="partner-status-label">YOU</span>
              <span className="partner-status-prayed"><Check size={12} /> Prayed today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className="circle-overlay" />

      {/* Modal card */}
      <div className="circle-modal-card">
        <h2 className="circle-modal-title">Your Prayer Circle</h2>
        <p className="circle-modal-body">
          A private circle of up to 3 people who commit to pray daily and hold each other accountable.
        </p>

        <div className="circle-benefit-row">
          <div className="circle-benefit-icon"><Bell size={15} color="#fff" /></div>
          <span className="circle-benefit-text">See when each person in your circle prays — every single day</span>
        </div>
        <div className="circle-benefit-row">
          <div className="circle-benefit-icon"><MessageSquare size={15} color="#fff" /></div>
          <span className="circle-benefit-text">Share prayer requests only your circle can see — private and safe</span>
        </div>
        <div className="circle-benefit-row">
          <div className="circle-benefit-icon"><Star size={15} color="#fff" /></div>
          <span className="circle-benefit-text">Celebrate together when God answers your prayers</span>
        </div>

        <button className="btn btn-primary circle-cta-btn" onClick={onRequireAuth}>
          Sign in to start your circle
        </button>
        <p className="circle-footer-text">Free. Private. Just your circle.</p>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ───────────────────────────────────────────────
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
    return <CircleLoggedOut onRequireAuth={onRequireAuth} />;
  }

  const incomingInvites = pendingInvites.filter(p => p.invited_by !== userId);
  const outgoingInvites = pendingInvites.filter(p => p.invited_by === userId);

  return (
    <div className="partners-tab">
      {/* Incoming invites */}
      {incomingInvites.length > 0 && (
        <div className="partners-section">
          <h3 className="partners-section-title">Circle Invitations</h3>
          {incomingInvites.map(invite => (
            <div key={invite.id} className="partner-invite-card">
              <div className="partner-invite-header">
                <div className="partner-avatar">{(invite.inviter_name || '?').charAt(0).toUpperCase()}</div>
                <div>
                  <span className="partner-invite-name">{invite.inviter_name || 'Someone'}</span>
                  <span className="partner-invite-msg">wants to join your prayer circle</span>
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

      {/* Active members */}
      <div className="partners-section">
        {partnerships.length > 0 ? (
          partnerships.map(p => (
            <CircleMemberCard
              key={p.id}
              partnership={p}
              data={getPartnershipData(p)}
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
            <h3 className="partners-empty-title">Your Koinonia</h3>
            <p className="partners-empty-body">Invite up to 2 people into your prayer circle. Together you'll pray daily, share requests, and watch God move.</p>
          </div>
        ) : null}

        {partnerships.length > 0 && partnerships.length < MAX_MEMBERS && (
          <div className="partner-invite-second-card">
            <span className="partner-invite-second-title">+ Invite to your circle</span>
            <span className="partner-invite-second-sub">{MAX_MEMBERS - partnerships.length} slot remaining</span>
            <button className="btn btn-secondary partner-invite-second-btn" onClick={() => setShowInviteModal(true)}>
              Invite
            </button>
          </div>
        )}
        {partnerships.length === 0 && (
          <button className="btn btn-primary partners-invite-btn" onClick={() => setShowInviteModal(true)}>
            Invite someone
          </button>
        )}
        {partnerships.length === 0 && <p className="partners-max-note">You can have up to 2 circle members</p>}
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

      {/* Invite modal */}
      {showInviteModal && createPortal(
        <div className="partner-modal-overlay" onClick={() => !inviting && setShowInviteModal(false)}>
          <div className="partner-modal" onClick={e => e.stopPropagation()}>
            <h3 className="partner-modal-title">Invite to your circle</h3>
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

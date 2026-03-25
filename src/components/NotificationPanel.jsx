import { useState } from 'react';
import { Bell, X, Check } from 'lucide-react';

const TYPE_ICON = {
  group_approved: '✅',
  group_rejected: '❌',
  partner_accepted: '🤝',
  partner_declined: '😔',
  partner_prayed: '🙏',
  partner_invite: '🤝',
  partner_invite_new: '🤝',
  partnership_created: '🔥',
  partnership_ended: '💔',
  partner_prayed_today: '🙏',
  both_prayed: '🔥',
  partner_encouraged: '🙏',
  shared_request_new: '📝',
  shared_prayer_answered: '✨',
  partnership_milestone: '🏆',
};

export default function NotificationPanel({
  notifications,
  unreadCount,
  onMarkAllRead,
  onDismiss,
  pendingInvites,
  onAcceptInvite,
  onDeclineInvite,
}) {
  const [open, setOpen] = useState(false);

  const totalBadge = unreadCount + (pendingInvites?.length || 0);

  const handleOpen = () => {
    setOpen(true);
    if (unreadCount > 0) onMarkAllRead();
  };

  const isEmpty = notifications.length === 0 && (!pendingInvites || pendingInvites.length === 0);

  return (
    <div className="notif-wrapper">
      <button
        className="notif-bell"
        onClick={() => (open ? setOpen(false) : handleOpen())}
        aria-label={`Notifications${totalBadge > 0 ? ` (${totalBadge} new)` : ''}`}
      >
        <Bell size={20} />
        {totalBadge > 0 && (
          <span className="notif-badge">{totalBadge > 9 ? '9+' : totalBadge}</span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="notif-backdrop" onClick={() => setOpen(false)} />

          <div className="notif-panel">
            <div className="notif-panel-head">
              <span className="notif-panel-title">Notifications</span>
              <button className="notif-close" onClick={() => setOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="notif-list">
              {/* Pending partner invites — need Accept / Decline */}
              {(pendingInvites || []).map(invite => (
                <div key={invite.id} className="notif-item notif-item-invite">
                  <div className="notif-icon">🤝</div>
                  <div className="notif-body">
                    <div className="notif-title">Prayer partner invite</div>
                    <div className="notif-text">
                      <strong>{invite.inviter_name}</strong> invited you to pray for{' '}
                      <em>"{invite.prayer_title}"</em>
                    </div>
                    <div className="notif-actions">
                      <button
                        className="btn btn-primary btn-xs"
                        onClick={() => onAcceptInvite(invite)}
                      >
                        <Check size={12} /> Accept
                      </button>
                      <button
                        className="btn btn-secondary btn-xs"
                        onClick={() => onDeclineInvite(invite)}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Regular notifications */}
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`notif-item ${notif.read ? 'notif-item-read' : 'notif-item-unread'}`}
                >
                  <div className="notif-icon">
                    {TYPE_ICON[notif.type] || '🔔'}
                  </div>
                  <div className="notif-body">
                    <div className="notif-title">{notif.title}</div>
                    <div className="notif-text">{notif.body}</div>
                  </div>
                  <button
                    className="notif-dismiss"
                    onClick={() => onDismiss(notif.id)}
                    aria-label="Dismiss"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {isEmpty && (
                <div className="notif-empty">
                  <Bell size={28} style={{ opacity: 0.3 }} />
                  <span>All caught up 🙏</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { useState } from 'react';
import {
  Users, UserPlus, X, Heart, Undo2, Share2, Timer, Square, Clock,
} from 'lucide-react';
import { formatRelativeDate } from '../utils/constants';
import { formatDuration, formatDurationReadable } from '../hooks/usePrayerTimer';

export default function PrayerPartners({
  prayer,
  onAddPartner,
  onRemovePartner,
  onLogPartnerPrayed,
  onUndoPartnerPrayed,
  timerPartnerId,
  timerPrayerId,
  timerElapsed,
  onStartPartnerTimer,
  onStopPartnerTimer,
}) {
  const [expanded, setExpanded] = useState(false);
  const [newName, setNewName] = useState('');
  const [justLoggedId, setJustLoggedId] = useState(null);

  const partners = prayer.partners || [];
  const isAnswered = prayer.answered;

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddPartner(newName.trim());
    setNewName('');
  };

  const handleLogPrayed = (partnerId) => {
    onLogPartnerPrayed(partnerId);
    setJustLoggedId(partnerId);
    setTimeout(() => setJustLoggedId(null), 2000);
  };

  const handleShare = async () => {
    const text = [
      `Prayer Request: ${prayer.title}`,
      '',
      prayer.content,
      prayer.scripture ? `\nScripture: ${prayer.scripture}` : '',
      '\nPlease join me in praying about this.',
    ].filter(Boolean).join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ title: `Prayer: ${prayer.title}`, text });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      alert('Prayer request copied to clipboard!');
    }
  };

  const totalPartnerPrayers = partners.reduce((sum, p) => sum + p.prayerLog.length, 0);

  // Check if the active timer is for this prayer (any partner)
  const isTimerForThisPrayer = timerPrayerId === prayer.id;

  return (
    <div className="prayer-partners-section">
      <button className="prayer-partners-toggle" onClick={() => setExpanded(!expanded)}>
        <Users size={13} />
        <span>
          Prayer Partners
          {partners.length > 0 && ` (${partners.length})`}
          {totalPartnerPrayers > 0 && ` \u00B7 ${totalPartnerPrayers} prayers`}
        </span>
        <button
          className="btn-share-prayer"
          onClick={(e) => { e.stopPropagation(); handleShare(); }}
          title="Share prayer request"
        >
          <Share2 size={12} />
        </button>
      </button>

      {expanded && (
        <div className="prayer-partners-body">
          {partners.length > 0 && (
            <div className="prayer-partners-list">
              {partners.map((partner) => {
                const count = partner.prayerLog.length;
                const lastPrayed = count > 0
                  ? formatRelativeDate(partner.prayerLog[partner.prayerLog.length - 1])
                  : null;
                const justLogged = justLoggedId === partner.id;
                const partnerSessions = partner.prayerSessions || [];
                const partnerTotalTime = partnerSessions.reduce((s, sess) => s + (sess.duration || 0), 0);

                // Is the timer running for this specific partner?
                const isPartnerTimerActive = isTimerForThisPrayer && timerPartnerId === partner.id;

                return (
                  <div key={partner.id} className="prayer-partner-row">
                    <div className="prayer-partner-info">
                      <span className="prayer-partner-name">{partner.name}</span>
                      <span className="prayer-partner-stats">
                        {count > 0 ? `${count}x` : 'Not yet'}
                        {lastPrayed && ` \u00B7 ${lastPrayed}`}
                        {partnerTotalTime > 0 && ` \u00B7 ${formatDurationReadable(partnerTotalTime)}`}
                      </span>
                    </div>
                    <div className="prayer-partner-actions">
                      {!isAnswered && (
                        <>
                          {/* Partner timer */}
                          {isPartnerTimerActive ? (
                            <button
                              className="btn-partner-timer btn-partner-timer-active"
                              onClick={() => onStopPartnerTimer(partner.id)}
                              title="Stop timer"
                            >
                              <Timer size={11} className="partner-timer-icon-pulse" />
                              <span className="partner-timer-elapsed">{formatDuration(timerElapsed)}</span>
                              <Square size={9} />
                            </button>
                          ) : (
                            <button
                              className="btn-partner-timer"
                              onClick={() => onStartPartnerTimer(partner.id)}
                              title="Start prayer timer"
                            >
                              <Timer size={11} />
                            </button>
                          )}
                          {count > 0 && (
                            <button
                              className="btn-partner-undo"
                              onClick={() => onUndoPartnerPrayed(partner.id)}
                              title="Undo"
                            >
                              <Undo2 size={11} />
                            </button>
                          )}
                          <button
                            className={`btn-partner-pray ${justLogged ? 'btn-partner-pray-active' : ''}`}
                            onClick={() => handleLogPrayed(partner.id)}
                          >
                            <Heart size={11} fill={justLogged ? 'currentColor' : 'none'} />
                          </button>
                        </>
                      )}
                      {!isAnswered && (
                        <button
                          className="prayer-partner-remove"
                          onClick={() => onRemovePartner(partner.id)}
                          aria-label={`Remove ${partner.name}`}
                        >
                          <X size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isAnswered && (
            <div className="prayer-partner-add">
              <UserPlus size={13} className="partner-add-icon" />
              <input
                type="text"
                className="prayer-partner-input"
                placeholder="Add partner name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                maxLength={30}
              />
              <button className="btn-partner-add" onClick={handleAdd} disabled={!newName.trim()}>
                Add
              </button>
            </div>
          )}

          {partners.length === 0 && isAnswered && (
            <p className="prayer-partners-empty">No prayer partners were added</p>
          )}
        </div>
      )}
    </div>
  );
}

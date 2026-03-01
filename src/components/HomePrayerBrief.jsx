import { AlertTriangle } from 'lucide-react';

export default function HomePrayerBrief({ prayers, onNavigate }) {
  if (!prayers || prayers.length === 0) return null;

  // Urgent prayers first, then by most recently added
  const urgent = prayers.filter(p => p.urgent);
  const nonUrgent = prayers.filter(p => !p.urgent);
  const shown = [...urgent, ...nonUrgent].slice(0, 3);
  const remaining = prayers.length - shown.length;

  return (
    <button className="home-prayer-brief" onClick={onNavigate}>
      <div className="home-prayer-brief-header">
        🙏 <span>Active Prayers</span>
        {remaining > 0 && (
          <span className="home-prayer-brief-more">+{remaining} more →</span>
        )}
      </div>
      <div className="home-prayer-brief-list">
        {shown.map(p => (
          <div key={p.id} className="home-prayer-brief-item">
            {p.urgent && <AlertTriangle size={11} className="home-prayer-brief-urgent-icon" />}
            <span className="home-prayer-brief-title">{p.title}</span>
          </div>
        ))}
      </div>
    </button>
  );
}

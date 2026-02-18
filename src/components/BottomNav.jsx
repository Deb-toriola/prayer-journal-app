import { Home, HandHeart, CalendarCheck, Users, MoreHorizontal } from 'lucide-react';

const TABS = [
  { id: 'home',      label: 'Home',      Icon: Home },
  { id: 'prayers',   label: 'Prayers',   Icon: HandHeart },
  { id: 'plan',      label: 'Plan',      Icon: CalendarCheck },
  { id: 'community', label: 'Community', Icon: Users },
  { id: 'more',      label: 'More',      Icon: MoreHorizontal },
];

export default function BottomNav({ activeTab, onTabChange, prayerCount, testimonyCount, planActive, communityCount }) {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;

        // Badge values
        let badge = null;
        if (id === 'prayers' && (prayerCount + testimonyCount) > 0) badge = prayerCount;
        if (id === 'community' && communityCount > 0) badge = communityCount;
        if (id === 'plan' && planActive) badge = '●';

        return (
          <button
            key={id}
            className={`bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`}
            onClick={() => onTabChange(id)}
            aria-label={label}
          >
            <div className="bottom-nav-icon-wrap">
              <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              {badge !== null && (
                <span className={`bottom-nav-badge ${badge === '●' ? 'bottom-nav-badge-dot' : ''}`}>
                  {badge === '●' ? '' : badge}
                </span>
              )}
            </div>
            <span className="bottom-nav-label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

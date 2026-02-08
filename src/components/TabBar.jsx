import { HandHeart, Trophy } from 'lucide-react';

export default function TabBar({ activeTab, onTabChange, activePrayerCount, testimonyCount }) {
  return (
    <div className="tab-bar">
      <button
        className={`tab-button ${activeTab === 'active' ? 'tab-active' : ''}`}
        onClick={() => onTabChange('active')}
      >
        <HandHeart size={18} />
        <span>Active Prayers</span>
        {activePrayerCount > 0 && (
          <span className="tab-count">{activePrayerCount}</span>
        )}
      </button>
      <button
        className={`tab-button ${activeTab === 'testimonies' ? 'tab-active' : ''}`}
        onClick={() => onTabChange('testimonies')}
      >
        <Trophy size={18} />
        <span>Testimonies</span>
        {testimonyCount > 0 && (
          <span className="tab-count tab-count-gold">{testimonyCount}</span>
        )}
      </button>
    </div>
  );
}

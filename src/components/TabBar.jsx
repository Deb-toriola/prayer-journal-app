import { HandHeart, Trophy } from 'lucide-react';

export default function TabBar({ activeTab, onTabChange, activePrayerCount, testimonyCount }) {
  return (
    <div
      className="tab-bar"
      role="tablist"
      aria-label="Prayer views"
      data-active={activeTab === 'active' ? 'left' : 'right'}
    >
      <button
        className={`tab-button ${activeTab === 'active' ? 'tab-active' : ''}`}
        onClick={() => onTabChange('active')}
        role="tab"
        aria-selected={activeTab === 'active'}
        aria-controls="prayer-list"
      >
        <HandHeart size={16} />
        <span>Active Prayers</span>
        {activePrayerCount > 0 && (
          <span className="tab-count" aria-label={`${activePrayerCount} prayers`}>{activePrayerCount}</span>
        )}
      </button>
      <button
        className={`tab-button ${activeTab === 'testimonies' ? 'tab-active' : ''}`}
        onClick={() => onTabChange('testimonies')}
        role="tab"
        aria-selected={activeTab === 'testimonies'}
        aria-controls="prayer-list"
      >
        <Trophy size={16} />
        <span>Testimonies</span>
        {testimonyCount > 0 && (
          <span className="tab-count tab-count-gold" aria-label={`${testimonyCount} testimonies`}>{testimonyCount}</span>
        )}
      </button>
    </div>
  );
}

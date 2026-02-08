import { HandHeart, Trophy, Search } from 'lucide-react';

export default function EmptyState({ type, hasFilters }) {
  if (hasFilters) {
    return (
      <div className="empty-state">
        <Search size={48} strokeWidth={1} />
        <h3>No prayers found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  if (type === 'testimonies') {
    return (
      <div className="empty-state">
        <Trophy size={48} strokeWidth={1} />
        <h3>No testimonies yet</h3>
        <p>When God answers your prayers, mark them as answered and they will appear here as testimonies of faith</p>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <HandHeart size={48} strokeWidth={1} />
      <h3>Start your prayer journey</h3>
      <p>Tap the button below to add your first prayer</p>
    </div>
  );
}

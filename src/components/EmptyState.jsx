import { Search } from 'lucide-react';

function PrayingHandsSVG() {
  return (
    <svg className="empty-state-illustration" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="var(--purple-surface-subtle)" stroke="var(--purple-surface)" strokeWidth="2" />
      <path d="M60 28c-2 0-3.5 1-4.5 2.5L44 52c-1.5 2.5-.5 5 2 6l8 3v20c0 3 2 5 5 5h2c3 0 5-2 5-5V61l8-3c2.5-1 3.5-3.5 2-6L65.5 30.5C64.5 29 63 28 60 28z" fill="var(--purple-lighter)" opacity="0.3" />
      <path d="M52 50l6-14c.5-1 1.5-2 3-2s2.5 1 3 2l6 14" stroke="var(--purple-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M52 50c0 0-1 3 0 5s3 3 5 4l3 1l3-1c2-1 4-2 5-4s0-5 0-5" stroke="var(--purple-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M56 60v18c0 2 1.5 3.5 3.5 3.5h1c2 0 3.5-1.5 3.5-3.5V60" stroke="var(--purple-light)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="16" x2="60" y2="22" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="42" y1="22" x2="45" y2="27" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="78" y1="22" x2="75" y2="27" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="34" y1="34" x2="38" y2="37" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <line x1="86" y1="34" x2="82" y2="37" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

function TrophySVG() {
  return (
    <svg className="empty-state-illustration" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="var(--gold-light)" stroke="var(--gold)" strokeWidth="1.5" opacity="0.5" />
      <path d="M42 38h36v8c0 10-8 18-18 18S42 56 42 46v-8z" fill="var(--gold)" opacity="0.2" stroke="var(--gold-dark)" strokeWidth="2" />
      <path d="M42 42h-6c-2 0-4 2-4 4v2c0 6 4 10 10 10" stroke="var(--gold-dark)" strokeWidth="2" strokeLinecap="round" />
      <path d="M78 42h6c2 0 4 2 4 4v2c0 6-4 10-10 10" stroke="var(--gold-dark)" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="64" x2="60" y2="74" stroke="var(--gold-dark)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 74h20v4c0 1-1 2-2 2H52c-1 0-2-1-2-2v-4z" fill="var(--gold)" opacity="0.3" stroke="var(--gold-dark)" strokeWidth="2" />
      <path d="M60 44l2 4 4.5.7-3.3 3.2.8 4.5L60 54l-4 2.4.8-4.5L53.5 48.7l4.5-.7z" fill="var(--gold-dark)" opacity="0.6" />
      <circle cx="38" cy="32" r="1.5" fill="var(--gold)" opacity="0.5" />
      <circle cx="82" cy="32" r="1.5" fill="var(--gold)" opacity="0.5" />
      <circle cx="32" cy="54" r="1" fill="var(--gold)" opacity="0.3" />
      <circle cx="88" cy="54" r="1" fill="var(--gold)" opacity="0.3" />
    </svg>
  );
}

function SearchSVG() {
  return (
    <svg className="empty-state-illustration" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="var(--purple-surface-subtle)" stroke="var(--purple-surface)" strokeWidth="2" />
      <circle cx="54" cy="52" r="18" stroke="var(--purple-lighter)" strokeWidth="3" fill="none" />
      <line x1="67" y1="65" x2="82" y2="80" stroke="var(--purple-lighter)" strokeWidth="3" strokeLinecap="round" />
      <path d="M48 48c0-3.3 2.7-6 6-6" stroke="var(--purple-light)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export default function EmptyState({ type, hasFilters, onClearFilters }) {
  if (hasFilters) {
    return (
      <div className="empty-state">
        <SearchSVG />
        <h3>No prayers found</h3>
        <p>Try adjusting your search or filters</p>
        {onClearFilters && (
          <button className="btn btn-sm btn-secondary empty-state-action" onClick={onClearFilters}>
            <Search size={14} /> Clear filters
          </button>
        )}
      </div>
    );
  }

  if (type === 'testimonies') {
    return (
      <div className="empty-state">
        <TrophySVG />
        <h3>No testimonies yet</h3>
        <p>When God answers your prayers, mark them as answered and they will appear here as testimonies of faith</p>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <PrayingHandsSVG />
      <h3>Start your prayer journey</h3>
      <p>Tap the button below to add your first prayer</p>
    </div>
  );
}

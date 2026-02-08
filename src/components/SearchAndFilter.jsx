import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  allCategories,
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const hasActiveFilter = selectedCategory !== '';

  const handleToggleSearch = () => {
    if (searchOpen) {
      onSearchChange('');
      setSearchOpen(false);
    } else {
      setSearchOpen(true);
    }
  };

  return (
    <div className="search-filter">
      <div className="search-filter-top">
        <button
          className={`search-toggle-btn ${searchOpen || searchQuery ? 'search-toggle-btn-active' : ''}`}
          onClick={handleToggleSearch}
          aria-label={searchOpen ? 'Close search' : 'Open search'}
          aria-expanded={searchOpen}
        >
          {searchOpen ? <X size={16} /> : <Search size={16} />}
          {!searchOpen && hasActiveFilter && <span className="search-filter-dot" />}
        </button>

        {searchOpen && (
          <div className="search-input-wrapper">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search prayers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {(searchOpen || hasActiveFilter) && (
        <div className="category-filter">
          <button
            className={`filter-chip ${selectedCategory === '' ? 'filter-chip-active' : ''}`}
            onClick={() => onCategoryChange('')}
          >
            All
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat.value}
              className={`filter-chip ${selectedCategory === cat.value ? 'filter-chip-active' : ''}`}
              style={
                selectedCategory === cat.value
                  ? { backgroundColor: cat.color, borderColor: cat.color }
                  : {}
              }
              onClick={() =>
                onCategoryChange(selectedCategory === cat.value ? '' : cat.value)
              }
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

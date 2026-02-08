import { Search, X } from 'lucide-react';

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  allCategories,
}) {
  return (
    <div className="search-filter">
      <div className="search-input-wrapper">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search prayers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
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
    </div>
  );
}

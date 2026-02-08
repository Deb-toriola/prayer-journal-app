import { getCategoryByValue } from '../utils/constants';

export default function CategoryBadge({ category, allCategories }) {
  const cat = getCategoryByValue(category, allCategories);
  return (
    <span
      className="category-badge"
      style={{ backgroundColor: cat.color + '22', color: cat.color, borderColor: cat.color + '44' }}
    >
      {cat.label}
    </span>
  );
}

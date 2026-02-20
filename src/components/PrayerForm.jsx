import { useState, useEffect } from 'react';
import { X, BookOpen, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { CATEGORY_COLORS } from '../utils/constants';
import ScripturePicker from './ScripturePicker';

export default function PrayerForm({
  prayer,
  onSave,
  onClose,
  allCategories,
  onAddCategory,
  onDeleteCategory,
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('personal');
  const [scripture, setScripture] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(CATEGORY_COLORS[6]);

  useEffect(() => {
    if (prayer) {
      setTitle(prayer.title || '');
      setContent(prayer.content || '');
      setCategory(prayer.category || 'personal');
      setScripture(prayer.scripture || '');
      setUrgent(prayer.urgent || false);
    }
  }, [prayer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({
      title: title.trim(),
      content: content.trim(),
      category,
      scripture: scripture.trim(),
      urgent,
    });
    onClose();
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const result = onAddCategory(newCatName.trim(), newCatColor);
    if (result) {
      setCategory(result.value);
      setNewCatName('');
      setShowNewCategory(false);
    }
  };

  const isEditing = !!prayer;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Edit Prayer' : 'New Prayer'}
          </h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="prayer-form">
          <div className="form-group">
            <label className="form-label" htmlFor="prayer-title">
              Title
            </label>
            <input
              id="prayer-title"
              type="text"
              className="form-input"
              placeholder="Prayer title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prayer-content">
              Prayer
            </label>
            <textarea
              id="prayer-content"
              className="form-textarea"
              placeholder="Write your prayer..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <div className="category-grid">
              {allCategories.map((cat) => (
                <div key={cat.value} className="category-option-wrapper">
                  <button
                    type="button"
                    className={`category-option ${category === cat.value ? 'category-option-active' : ''}`}
                    style={
                      category === cat.value
                        ? { backgroundColor: cat.color, borderColor: cat.color, color: '#fff' }
                        : { borderColor: cat.color + '66', color: cat.color }
                    }
                    onClick={() => setCategory(cat.value)}
                  >
                    {cat.label}
                  </button>
                  {!cat.isDefault && (
                    <button
                      type="button"
                      className="category-delete-btn"
                      onClick={() => onDeleteCategory(cat.value)}
                      aria-label={`Delete ${cat.label}`}
                    >
                      <Trash2 size={10} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="category-option category-add-btn"
                onClick={() => setShowNewCategory(!showNewCategory)}
              >
                <Plus size={14} />
                New
              </button>
            </div>

            {showNewCategory && (
              <div className="new-category-form">
                <input
                  type="text"
                  className="form-input form-input-sm"
                  placeholder="Category name..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  maxLength={20}
                />
                <div className="color-palette">
                  {CATEGORY_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`color-swatch ${newCatColor === color ? 'color-swatch-active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewCatColor(color)}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
                <div className="new-category-actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => setShowNewCategory(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={handleAddCategory}
                    disabled={!newCatName.trim()}
                  >
                    Add Category
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <button
              type="button"
              className={`urgent-toggle ${urgent ? 'urgent-toggle-active' : ''}`}
              onClick={() => setUrgent(!urgent)}
            >
              <AlertTriangle size={14} />
              {urgent ? 'Urgent \u2014 This matter needs pressing prayer' : 'Mark as urgent prayer need'}
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">
              <BookOpen size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              Scripture Reference (optional)
            </label>
            <ScripturePicker value={scripture} onChange={setScripture} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!title.trim() || !content.trim()}
            >
              {isEditing ? 'Update Prayer' : 'Add Prayer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

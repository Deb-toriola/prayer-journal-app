import { useState } from 'react';
import { Target, Pencil, Check, X } from 'lucide-react';
import { formatRelativeDate } from '../utils/constants';

export default function WeeklyProject({ project, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [content, setContent] = useState(project.content);

  const handleSave = () => {
    onUpdate({ title: title.trim(), content: content.trim() });
    setEditing(false);
  };

  const handleCancel = () => {
    setTitle(project.title);
    setContent(project.content);
    setEditing(false);
  };

  const isEmpty = !project.title && !project.content;

  return (
    <div className="weekly-project">
      <div className="weekly-project-header">
        <div className="weekly-project-label">
          <Target size={16} />
          <span>Weekly Prayer Focus</span>
        </div>
        {!editing && (
          <button
            className="btn-icon"
            onClick={() => setEditing(true)}
            aria-label="Edit weekly project"
          >
            <Pencil size={14} />
          </button>
        )}
      </div>

      {editing ? (
        <div className="weekly-project-edit">
          <input
            type="text"
            className="weekly-project-title-input"
            placeholder="Focus area title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <textarea
            className="weekly-project-content-input"
            placeholder="Describe your prayer focus for this week..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <div className="weekly-project-actions">
            <button className="btn btn-sm btn-secondary" onClick={handleCancel}>
              <X size={14} />
              Cancel
            </button>
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <Check size={14} />
              Save
            </button>
          </div>
        </div>
      ) : isEmpty ? (
        <button className="weekly-project-empty" onClick={() => setEditing(true)}>
          Tap to set your prayer focus for this week
        </button>
      ) : (
        <div className="weekly-project-display">
          {project.title && (
            <h3 className="weekly-project-title">{project.title}</h3>
          )}
          {project.content && (
            <p className="weekly-project-content">{project.content}</p>
          )}
          {project.lastUpdated && (
            <span className="weekly-project-date">
              Updated {formatRelativeDate(project.lastUpdated)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

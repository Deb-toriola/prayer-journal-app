import { useState } from 'react';
import { Target, Pencil, Check, X, ChevronDown } from 'lucide-react';
import { formatRelativeDate } from '../utils/constants';

export default function WeeklyProject({ project, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
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
    <div className={`weekly-project ${expanded ? 'weekly-project-expanded' : ''}`}>
      <button
        className="weekly-project-header"
        onClick={() => {
          if (isEmpty) {
            setEditing(true);
            setExpanded(true);
          } else {
            setExpanded(!expanded);
          }
        }}
        aria-expanded={expanded}
      >
        <div className="weekly-project-label">
          <Target size={14} />
          <span>
            {isEmpty ? 'Set Weekly Prayer Focus' : `This week: ${project.title || 'Prayer Focus'}`}
          </span>
        </div>
        <ChevronDown size={14} className={`weekly-project-chevron ${expanded ? 'weekly-project-chevron-open' : ''}`} />
      </button>

      <div className="weekly-project-body">
        <div className="weekly-project-body-inner">
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
          ) : (
            <div className="weekly-project-display">
              {project.content && (
                <p className="weekly-project-content">{project.content}</p>
              )}
              {project.lastUpdated && (
                <span className="weekly-project-date">
                  Updated {formatRelativeDate(project.lastUpdated)}
                </span>
              )}
              <button
                className="btn-icon weekly-project-edit-btn"
                onClick={(e) => { e.stopPropagation(); setEditing(true); }}
                aria-label="Edit weekly project"
              >
                <Pencil size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

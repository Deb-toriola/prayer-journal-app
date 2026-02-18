import { FileDown, Target, Bell } from 'lucide-react';
import WeeklyProject from './WeeklyProject';
import NotificationSettings from './NotificationSettings';

export default function MoreTab({
  project,
  onUpdateProject,
  notifSettings,
  onToggleNotif,
  onAddTime,
  onRemoveTime,
  onUpdateTime,
  notificationSupported,
  prayers,
  allCategories,
  onShowExport,
}) {
  return (
    <div className="more-tab">
      <div className="more-section">
        <div className="more-section-label">
          <Target size={14} />
          Weekly Prayer Focus
        </div>
        <WeeklyProject project={project} onUpdate={onUpdateProject} />
      </div>

      <div className="more-section">
        <div className="more-section-label">
          <Bell size={14} />
          Prayer Reminders
        </div>
        <NotificationSettings
          settings={notifSettings}
          onToggle={onToggleNotif}
          onAddTime={onAddTime}
          onRemoveTime={onRemoveTime}
          onUpdateTime={onUpdateTime}
          notificationSupported={notificationSupported}
        />
      </div>

      {prayers.length > 0 && (
        <div className="more-section">
          <button className="btn-export" onClick={onShowExport}>
            <FileDown size={14} />
            <span>Export Prayer Journey</span>
          </button>
        </div>
      )}

      <div className="more-app-info">
        <p className="more-app-name">Prayer Journal</p>
        <p className="more-app-sub">A sacred space for your conversations with God</p>
      </div>
    </div>
  );
}

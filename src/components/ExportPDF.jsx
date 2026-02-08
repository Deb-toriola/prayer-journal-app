import { useState } from 'react';
import { FileDown, X } from 'lucide-react';
import { formatDate } from '../utils/constants';
import { formatDurationReadable } from '../hooks/usePrayerTimer';

const NOTE_TYPE_LABELS = {
  update: 'Update',
  word: 'Word from God',
  scripture: 'Scripture',
  confirmation: 'Confirmation',
  vision: 'Vision / Dream',
};

function getTotalPrayerTime(sessions) {
  if (!sessions || sessions.length === 0) return 0;
  return sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
}

export default function ExportPDF({ prayers, allCategories, onClose }) {
  const [exportType, setExportType] = useState('all'); // 'all', 'active', 'answered'
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includePartners, setIncludePartners] = useState(true);
  const [includeSessions, setIncludeSessions] = useState(true);

  const filteredPrayers = prayers.filter((p) => {
    if (exportType === 'active') return !p.answered;
    if (exportType === 'answered') return p.answered;
    return true;
  });

  const handleExport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for this site to export as PDF.');
      return;
    }

    const html = generateHTML(filteredPrayers, {
      includeNotes,
      includePartners,
      includeSessions,
      allCategories,
      exportType,
    });

    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for content to render then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 300);
    };
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Export Prayer Journey</h2>
          <button className="btn-icon prayer-card-btn-icon" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="export-form">
          <div className="form-group">
            <label className="form-label">What to export</label>
            <div className="export-type-options">
              {[
                { value: 'all', label: 'All Prayers' },
                { value: 'active', label: 'Active Prayers' },
                { value: 'answered', label: 'Testimonies' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  className={`export-type-btn ${exportType === opt.value ? 'export-type-btn-active' : ''}`}
                  onClick={() => setExportType(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Include</label>
            <div className="export-checkboxes">
              <label className="export-checkbox">
                <input type="checkbox" checked={includeNotes} onChange={(e) => setIncludeNotes(e.target.checked)} />
                <span>Journey Notes & Updates</span>
              </label>
              <label className="export-checkbox">
                <input type="checkbox" checked={includePartners} onChange={(e) => setIncludePartners(e.target.checked)} />
                <span>Prayer Partners</span>
              </label>
              <label className="export-checkbox">
                <input type="checkbox" checked={includeSessions} onChange={(e) => setIncludeSessions(e.target.checked)} />
                <span>Prayer Sessions & Times</span>
              </label>
            </div>
          </div>

          <div className="export-preview-count">
            {filteredPrayers.length} prayer{filteredPrayers.length !== 1 ? 's' : ''} will be exported
          </div>

          <div className="form-actions">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={handleExport}
              disabled={filteredPrayers.length === 0}
            >
              <FileDown size={16} /> Export as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCatLabel(value, allCategories) {
  const cat = (allCategories || []).find((c) => c.value === value);
  return cat ? cat.label : value || 'Uncategorized';
}

function generateHTML(prayers, options) {
  const { includeNotes, includePartners, includeSessions, allCategories, exportType } = options;
  const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const titleMap = { all: 'Complete Prayer Journey', active: 'Active Prayers', answered: 'Testimonies' };

  const prayerCards = prayers.map((prayer) => {
    const notes = (prayer.notes || []);
    const partners = (prayer.partners || []);
    const sessions = (prayer.prayerSessions || []);
    const prayerCount = (prayer.prayerLog || []).length;
    const totalTime = getTotalPrayerTime(sessions);

    let notesHtml = '';
    if (includeNotes && notes.length > 0) {
      notesHtml = `
        <div class="section">
          <div class="section-title">Prayer Journey</div>
          ${notes.map((n) => `
            <div class="note">
              <span class="note-type">${NOTE_TYPE_LABELS[n.type] || 'Update'}</span>
              <span class="note-text">${escapeHtml(n.text)}</span>
              <span class="note-date">${formatDate(n.createdAt)}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    let partnersHtml = '';
    if (includePartners && partners.length > 0) {
      partnersHtml = `
        <div class="section">
          <div class="section-title">Prayer Partners</div>
          ${partners.map((pt) => {
            const ptSessions = pt.prayerSessions || [];
            const ptTime = getTotalPrayerTime(ptSessions);
            return `
            <div class="partner">
              <span class="partner-name">${escapeHtml(pt.name)}</span>
              <span class="partner-count">Prayed ${pt.prayerLog.length} time${pt.prayerLog.length !== 1 ? 's' : ''}${ptTime > 0 ? ` \u00B7 ${formatDurationReadable(ptTime)}` : ''}</span>
            </div>
          `;}).join('')}
        </div>
      `;
    }

    let sessionsHtml = '';
    if (includeSessions && sessions.length > 0) {
      sessionsHtml = `
        <div class="section">
          <div class="section-title">Prayer Sessions</div>
          ${sessions.map((s) => `
            <div class="session">
              <span>${formatDate(s.startedAt)}</span>
              <span class="session-dur">${formatDurationReadable(s.duration)}</span>
            </div>
          `).join('')}
          <div class="session-total">Total time in prayer: ${formatDurationReadable(totalTime)}</div>
        </div>
      `;
    }

    return `
      <div class="prayer ${prayer.answered ? 'prayer-answered' : ''} ${prayer.urgent && !prayer.answered ? 'prayer-urgent' : ''}">
        <div class="prayer-header">
          <span class="category">${escapeHtml(getCatLabel(prayer.category, allCategories))}</span>
          ${prayer.urgent && !prayer.answered ? '<span class="urgent">Urgent</span>' : ''}
          ${prayer.answered ? '<span class="answered-badge">Answered</span>' : ''}
        </div>
        <h3 class="prayer-title">${escapeHtml(prayer.title)}</h3>
        <p class="prayer-content">${escapeHtml(prayer.content)}</p>
        ${prayer.scripture ? `<div class="scripture">${escapeHtml(prayer.scripture)}</div>` : ''}
        <div class="meta">
          <span>Started: ${formatDate(prayer.createdAt)}</span>
          ${prayer.answered ? `<span>Answered: ${formatDate(prayer.answeredAt)}</span>` : ''}
          <span>Covered in prayer ${prayerCount} time${prayerCount !== 1 ? 's' : ''}</span>
          ${totalTime > 0 ? `<span>Total prayer time: ${formatDurationReadable(totalTime)}</span>` : ''}
        </div>
        ${prayer.answered && prayer.testimonyNote ? `
          <div class="testimony">
            <div class="testimony-title">Testimony</div>
            <p>${escapeHtml(prayer.testimonyNote)}</p>
          </div>
        ` : ''}
        ${notesHtml}
        ${partnersHtml}
        ${sessionsHtml}
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${titleMap[exportType]} - Prayer Journal</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Lora', Georgia, serif;
      color: #1F2937;
      line-height: 1.6;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }

    .doc-header {
      text-align: center;
      padding-bottom: 30px;
      border-bottom: 2px solid #FBBF24;
      margin-bottom: 30px;
    }

    .doc-title {
      font-family: 'Crimson Pro', Georgia, serif;
      font-size: 2rem;
      font-weight: 700;
      color: #4C1D95;
      margin-bottom: 4px;
    }

    .doc-subtitle {
      font-size: 0.9rem;
      color: #6B7280;
      font-style: italic;
    }

    .doc-date {
      font-size: 0.8rem;
      color: #9CA3AF;
      margin-top: 4px;
    }

    .prayer {
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }

    .prayer-answered {
      border-color: #FBBF24;
      background: #FFFBEB;
    }

    .prayer-urgent {
      border-left: 4px solid #EF4444;
    }

    .prayer-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }

    .category {
      display: inline-block;
      padding: 2px 10px;
      background: #F5F3FF;
      color: #7C3AED;
      font-size: 0.7rem;
      font-weight: 600;
      font-family: 'Crimson Pro', serif;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .urgent {
      display: inline-block;
      padding: 2px 8px;
      background: #FEF2F2;
      color: #DC2626;
      font-size: 0.65rem;
      font-weight: 700;
      border-radius: 20px;
      text-transform: uppercase;
    }

    .answered-badge {
      display: inline-block;
      padding: 2px 10px;
      background: #FBBF24;
      color: #4C1D95;
      font-size: 0.65rem;
      font-weight: 700;
      border-radius: 20px;
      text-transform: uppercase;
    }

    .prayer-title {
      font-family: 'Crimson Pro', serif;
      font-size: 1.15rem;
      font-weight: 600;
      color: #1F2937;
      margin-bottom: 6px;
    }

    .prayer-content {
      font-size: 0.9rem;
      color: #4B5563;
      margin-bottom: 8px;
      white-space: pre-wrap;
    }

    .scripture {
      display: inline-block;
      padding: 4px 12px;
      background: #F5F3FF;
      color: #7C3AED;
      font-size: 0.8rem;
      font-style: italic;
      border-radius: 20px;
      margin-bottom: 8px;
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 0.75rem;
      color: #9CA3AF;
      padding-top: 8px;
      border-top: 1px solid #F3F4F6;
      margin-bottom: 8px;
    }

    .testimony {
      background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
      border: 1px solid rgba(251, 191, 36, 0.3);
      border-radius: 8px;
      padding: 12px;
      margin-top: 8px;
    }

    .testimony-title {
      font-family: 'Crimson Pro', serif;
      font-size: 0.8rem;
      font-weight: 700;
      color: #D97706;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .testimony p {
      font-size: 0.85rem;
      font-style: italic;
      color: #92400E;
    }

    .section {
      margin-top: 12px;
      padding-top: 8px;
      border-top: 1px solid #F3F4F6;
    }

    .section-title {
      font-family: 'Crimson Pro', serif;
      font-size: 0.75rem;
      font-weight: 700;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }

    .note {
      padding: 6px 0;
      border-bottom: 1px solid #F9FAFB;
      font-size: 0.82rem;
    }

    .note-type {
      font-weight: 600;
      color: #7C3AED;
      font-size: 0.7rem;
      text-transform: uppercase;
      margin-right: 6px;
    }

    .note-text {
      color: #374151;
    }

    .note-date {
      display: block;
      font-size: 0.68rem;
      color: #9CA3AF;
      margin-top: 2px;
    }

    .partner {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 0.82rem;
    }

    .partner-name {
      font-weight: 600;
      color: #374151;
    }

    .partner-count {
      color: #9CA3AF;
      font-size: 0.75rem;
    }

    .session {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 0.8rem;
      color: #4B5563;
    }

    .session-dur {
      font-weight: 600;
      color: #7C3AED;
    }

    .session-total {
      padding-top: 6px;
      margin-top: 6px;
      border-top: 1px solid #E5E7EB;
      font-weight: 600;
      font-size: 0.82rem;
      color: #4C1D95;
    }

    .doc-footer {
      text-align: center;
      padding-top: 30px;
      border-top: 2px solid #FBBF24;
      margin-top: 30px;
      font-size: 0.75rem;
      color: #9CA3AF;
      font-style: italic;
    }

    @media print {
      body { padding: 20px; }
      .prayer { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="doc-header">
    <h1 class="doc-title">My Prayer Journal</h1>
    <p class="doc-subtitle">${titleMap[exportType]}</p>
    <p class="doc-date">Exported on ${now}</p>
  </div>

  ${prayerCards}

  <div class="doc-footer">
    A sacred space for your conversations with God
  </div>
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

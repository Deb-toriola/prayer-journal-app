import DoveIcon from './DoveIcon';
import { getDailyScripture } from '../utils/scriptures';

export default function DailyVerse() {
  const verse = getDailyScripture();

  return (
    <div className="daily-verse">
      <div className="daily-verse-icon">
        <DoveIcon size={18} color="currentColor" />
      </div>
      <div className="daily-verse-content">
        <p className="daily-verse-text">&ldquo;{verse.text}&rdquo;</p>
        <span className="daily-verse-ref">&mdash; {verse.ref}</span>
      </div>
    </div>
  );
}

import { BookOpen } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-icon">
          <BookOpen size={28} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="header-title">Prayer Journal</h1>
          <p className="header-subtitle">A sacred space for your conversations with God</p>
        </div>
      </div>
    </header>
  );
}

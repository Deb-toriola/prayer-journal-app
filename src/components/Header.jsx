import AppIcon from './AppIcon';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-icon">
          <AppIcon size={32} />
        </div>
        <div>
          <h1 className="header-title">My Prayer App</h1>
          <p className="header-subtitle">A sacred space for your conversations with God</p>
        </div>
      </div>
    </header>
  );
}

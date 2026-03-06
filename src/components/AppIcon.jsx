// Auburn flame + wings icon — matches the app's Google Play / App Store icon
export default function AppIcon({ size = 24 }) {
  const uid = `ai-${size}`;
  const rx = size >= 48 ? Math.round(size * 0.22) : Math.round(size * 0.18);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Auburn background */}
        <radialGradient id={`${uid}-bg`} cx="55%" cy="38%" r="68%">
          <stop offset="0%"   stopColor="#9B4200" />
          <stop offset="48%"  stopColor="#6B2800" />
          <stop offset="100%" stopColor="#310C00" />
        </radialGradient>

        {/* Ambient glow behind flame */}
        <radialGradient id={`${uid}-glow`} cx="50%" cy="52%" r="45%">
          <stop offset="0%"   stopColor="#FFD060" stopOpacity="0.6" />
          <stop offset="55%"  stopColor="#FF8C00" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FF4400" stopOpacity="0" />
        </radialGradient>

        {/* Flame gradient */}
        <linearGradient id={`${uid}-fl`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%"   stopColor="#FFFFFF" />
          <stop offset="22%"  stopColor="#FFF8DC" />
          <stop offset="62%"  stopColor="#FFC020" />
          <stop offset="100%" stopColor="#FF8800" />
        </linearGradient>

        {/* Left wing */}
        <linearGradient id={`${uid}-wL`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%"   stopColor="#B8864E" stopOpacity="0.45" />
          <stop offset="38%"  stopColor="#F5E8C0" stopOpacity="0.9" />
          <stop offset="65%"  stopColor="#FFFDF5" stopOpacity="0.97" />
          <stop offset="100%" stopColor="#FFFDF5" stopOpacity="0.25" />
        </linearGradient>

        {/* Right wing */}
        <linearGradient id={`${uid}-wR`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%"   stopColor="#FFFDF5" stopOpacity="0.25" />
          <stop offset="35%"  stopColor="#FFFDF5" stopOpacity="0.97" />
          <stop offset="62%"  stopColor="#F5E8C0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#B8864E" stopOpacity="0.45" />
        </linearGradient>

        {/* Gold crossbar / stem */}
        <linearGradient id={`${uid}-gold`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#D4A830" />
          <stop offset="50%"  stopColor="#F0CC50" />
          <stop offset="100%" stopColor="#A07820" />
        </linearGradient>

        <clipPath id={`${uid}-clip`}><rect width="100" height="100" rx={rx} /></clipPath>
      </defs>

      {/* Background */}
      <rect width="100" height="100" rx={rx} fill={`url(#${uid}-bg)`} />

      <g clipPath={`url(#${uid}-clip)`}>
        {/* Ambient flame glow */}
        <ellipse cx="50" cy="43" rx="27" ry="33" fill={`url(#${uid}-glow)`} />

        {/* Left wing */}
        <path d="M50,53.5 C44,46.5 26,45.5 13,52 C26,58.5 44,60 50,56.5 Z" fill={`url(#${uid}-wL)`} />
        <line x1="48" y1="53"   x2="22" y2="49"   stroke="#D4A830" strokeWidth="0.55" strokeOpacity="0.32" />
        <line x1="47" y1="54.8" x2="19" y2="52.5" stroke="#D4A830" strokeWidth="0.45" strokeOpacity="0.22" />
        <line x1="47" y1="56.2" x2="19" y2="56"   stroke="#D4A830" strokeWidth="0.4"  strokeOpacity="0.16" />

        {/* Right wing */}
        <path d="M50,53.5 C56,46.5 74,45.5 87,52 C74,58.5 56,60 50,56.5 Z" fill={`url(#${uid}-wR)`} />
        <line x1="52" y1="53"   x2="78" y2="49"   stroke="#D4A830" strokeWidth="0.55" strokeOpacity="0.32" />
        <line x1="53" y1="54.8" x2="81" y2="52.5" stroke="#D4A830" strokeWidth="0.45" strokeOpacity="0.22" />
        <line x1="53" y1="56.2" x2="81" y2="56"   stroke="#D4A830" strokeWidth="0.4"  strokeOpacity="0.16" />

        {/* Horizontal gold bar */}
        <rect x="13" y="53.5" width="74" height="2.6" rx="1.3" fill={`url(#${uid}-gold)`} />

        {/* Vertical stem */}
        <rect x="48.7" y="53" width="2.6" height="25" rx="1.3" fill={`url(#${uid}-gold)`} />

        {/* Outer flame */}
        <path d="M50,18 C51.8,23 57,29 57,37 C57,44 54.5,47.5 52.5,51 C54,46.5 53.5,42.5 51.5,40.5 C51,46 50,50 50,54 C50,50 49,46 48.5,40.5 C46.5,42.5 46,46.5 47.5,51 C45.5,47.5 43,44 43,37 C43,29 48.2,23 50,18 Z" fill={`url(#${uid}-fl)`} />

        {/* Inner flame highlight */}
        <path d="M50,25 C51.2,29 54,34 53.5,39 C53,43 51.5,47.5 51,50.5 C51.5,47 51,43.5 50,41.5 C49,43.5 48.5,47 49,50.5 C48.5,47.5 47,43 47.5,39 C47,34 48.8,29 50,25 Z" fill="#FFFAEE" opacity="0.78" />

        {/* Flame tip sparkle */}
        <circle cx="50" cy="17.5" r="3.2" fill="#FFFFFF" opacity="0.85" />
        <circle cx="50" cy="17.5" r="1.6" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

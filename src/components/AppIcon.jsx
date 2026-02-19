// Book + Flame icon — open bible with rising flame and star spark
export default function AppIcon({ size = 24 }) {
  const uid = `icon-${size}`;
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
        {/* Dark green background gradient */}
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#1B4332" />
          <stop offset="100%" stopColor="#0F2D1F" />
        </linearGradient>

        {/* Left page — outer edge darker, spine edge bright */}
        <linearGradient id={`${uid}-lpage`} x1="14" y1="0" x2="50" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#B45309" />
          <stop offset="40%"  stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#FEF9EE" />
        </linearGradient>

        {/* Right page — spine edge bright, outer edge darker */}
        <linearGradient id={`${uid}-rpage`} x1="50" y1="0" x2="86" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#FEF9EE" />
          <stop offset="60%"  stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        {/* Flame — bright yellow base rising to red tip */}
        <linearGradient id={`${uid}-flame`} x1="50" y1="22" x2="50" y2="66" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#EF4444" />
          <stop offset="45%"  stopColor="#F97316" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>

        {/* Inner flame — bright yellow-white core */}
        <linearGradient id={`${uid}-inner`} x1="50" y1="30" x2="50" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#FEF9C3" />
          <stop offset="60%"  stopColor="#FDE047" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>

        {/* Warm glow behind flame */}
        <radialGradient id={`${uid}-glow`} cx="50%" cy="58%" r="28%">
          <stop offset="0%"   stopColor="#F97316" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F97316" stopOpacity="0"   />
        </radialGradient>

        {/* Clip to rounded square */}
        <clipPath id={`${uid}-clip`}>
          <rect width="100" height="100" rx="22" />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width="100" height="100" rx="22" fill={`url(#${uid}-bg)`} />

      <g clipPath={`url(#${uid}-clip)`}>

        {/* ── OPEN BOOK ── */}

        {/* Book base shadow */}
        <ellipse cx="50" cy="79" rx="36" ry="3" fill="#000000" opacity="0.25" />

        {/* Left page — sweeps up from spine, curves out to left */}
        <path
          d="M50,74 C44,72 30,67 14,63 L14,57 C30,61 44,66 50,68 Z"
          fill={`url(#${uid}-lpage)`}
        />
        {/* Left page lower band (cover thickness) */}
        <path
          d="M50,76 C44,74 28,72 14,71 L14,63 C30,67 44,72 50,74 Z"
          fill="#D97706"
          opacity="0.55"
        />

        {/* Right page — sweeps up from spine, curves out to right */}
        <path
          d="M50,74 C56,72 70,67 86,63 L86,57 C70,61 56,66 50,68 Z"
          fill={`url(#${uid}-rpage)`}
        />
        {/* Right page lower band */}
        <path
          d="M50,76 C56,74 72,72 86,71 L86,63 C70,67 56,72 50,74 Z"
          fill="#D97706"
          opacity="0.55"
        />

        {/* Book spine */}
        <rect x="48.5" y="57" width="3" height="21" rx="1.5" fill="#78350F" />

        {/* Ruled lines — left page */}
        <line x1="22" y1="60" x2="46" y2="63.5" stroke="#B45309" strokeWidth="0.7" strokeOpacity="0.5" />
        <line x1="20" y1="64" x2="46" y2="67"   stroke="#B45309" strokeWidth="0.7" strokeOpacity="0.4" />
        <line x1="18" y1="68" x2="46" y2="70.5" stroke="#B45309" strokeWidth="0.7" strokeOpacity="0.3" />

        {/* Ruled lines — right page */}
        <line x1="78" y1="60" x2="54" y2="63.5" stroke="#B45309" strokeWidth="0.7" strokeOpacity="0.5" />
        <line x1="80" y1="64" x2="54" y2="67"   stroke="#B45309" strokeWidth="0.7" strokeOpacity="0.4" />
        <line x1="82" y1="68" x2="54" y2="70.5" stroke="#B45309" strokeWidth="0.7" strokeOpacity="0.3" />

        {/* ── FLAME ── */}

        {/* Orange glow halo */}
        <ellipse cx="50" cy="52" rx="14" ry="20" fill={`url(#${uid}-glow)`} />

        {/* Outer flame */}
        <path
          d="
            M50,22
            C52,27 58,32 58,40
            C58,46 56,49 54,52
            C56,47 55,43 53,41
            C52,47 50,51 50,55
            C50,51 48,47 47,41
            C45,43 44,47 46,52
            C44,49 42,46 42,40
            C42,32 48,27 50,22 Z
          "
          fill={`url(#${uid}-flame)`}
        />

        {/* Inner flame — bright core */}
        <path
          d="
            M50,30
            C51.5,34 55,38 54,43
            C54,47 52.5,50 51.5,52
            C52.5,49 52,46 50.5,44
            C50,48 50,51 50,55
            C50,51 50,48 49.5,44
            C48,46 47.5,49 48.5,52
            C47.5,50 46,47 46,43
            C45,38 48.5,34 50,30 Z
          "
          fill={`url(#${uid}-inner)`}
          opacity="0.88"
        />

        {/* ── 4-POINTED STAR SPARK at flame tip ── */}
        {/* Vertical diamond */}
        <path d="M50,13 L51.2,18.5 L50,20 L48.8,18.5 Z" fill="#FFFFFF" opacity="0.98" />
        <path d="M50,20 L51.2,21.5 L50,27 L48.8,21.5 Z" fill="#FFFDE7" opacity="0.85" />
        {/* Horizontal diamond */}
        <path d="M44,19 L48.5,18 L50,19 L48.5,20 Z" fill="#FFFFFF" opacity="0.95" />
        <path d="M56,19 L51.5,18 L50,19 L51.5,20 Z" fill="#FFFFFF" opacity="0.95" />
        {/* Bright centre */}
        <circle cx="50" cy="19.5" r="1.6" fill="#FFFFFF" />

      </g>
    </svg>
  );
}

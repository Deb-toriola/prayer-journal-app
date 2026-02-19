// World-class prayer hands icon — gold gradient on navy, divine light rays
export default function AppIcon({ size = 24 }) {
  const uid = `ph-${size}`;
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
        {/* Navy background gradient */}
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0F2044" />
          <stop offset="100%" stopColor="#0A1628" />
        </linearGradient>

        {/* Gold hand gradient — top bright, bottom rich */}
        <linearGradient id={`${uid}-gold`} x1="50" y1="20" x2="50" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#FFF7AE" />
          <stop offset="30%"  stopColor="#FBBF24" />
          <stop offset="75%"  stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        {/* Subtle gold glow behind hands */}
        <radialGradient id={`${uid}-glow`} cx="50%" cy="55%" r="38%">
          <stop offset="0%"   stopColor="#FBBF24" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FBBF24" stopOpacity="0"    />
        </radialGradient>

        {/* Light ray gradient — fades out upward */}
        <linearGradient id={`${uid}-ray`} x1="0" y1="1" x2="0" y2="0" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="#FFF7AE" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FFF7AE" stopOpacity="0"    />
        </linearGradient>

        {/* Clip to rounded square */}
        <clipPath id={`${uid}-clip`}>
          <rect width="100" height="100" rx="22" />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width="100" height="100" rx="22" fill={`url(#${uid}-bg)`} />

      {/* Clipping group */}
      <g clipPath={`url(#${uid}-clip)`}>

        {/* Glow behind hands */}
        <ellipse cx="50" cy="60" rx="30" ry="28" fill={`url(#${uid}-glow)`} />

        {/* ── Light rays emanating upward from fingertips ── */}
        {/* Centre ray */}
        <polygon
          points="50,22  47.5,6  52.5,6"
          fill={`url(#${uid}-ray)`}
          opacity="0.8"
        />
        {/* Left ray */}
        <polygon
          points="43,26  38,10  41,11"
          fill={`url(#${uid}-ray)`}
          opacity="0.5"
        />
        {/* Right ray */}
        <polygon
          points="57,26  59,10  62,11"
          fill={`url(#${uid}-ray)`}
          opacity="0.5"
        />

        {/* ══ PRAYER HANDS ══
            Two hands pressed together, fingers up.
            Left hand occupies x: 28–50, right hand: 50–72.
            Wrists meet at the bottom (~y 85), fingertips peak ~y 22.
        */}

        {/* Left hand (fingers + palm, right edge = centre line at x=50) */}
        <path
          d="
            M50,85
            C46,85 40,83 37,80
            C34,77 32,72 32,68
            L32,58
            C32,55 33,53 35,53
            C35,53 35,48 35,44
            C35,41 36.5,40 38,40
            C38,37 38,33 38,30
            C38,27 39.5,26 41,26
            C41,23 41.5,22 43,22
            C44.5,22 45,23 45,26
            L45,40
            C46,40 47,41 47,44
            L47,40
            C47,37 48,36 49.5,36
            C51,36 51.5,37 51.5,40
            L51.5,44
            C51.5,41 52.5,40 54,40
            C54,40 54,40 54,40
            L50,85
            Z
          "
          fill={`url(#${uid}-gold)`}
        />

        {/* Right hand (mirror, left edge = centre line at x=50) */}
        <path
          d="
            M50,85
            C54,85 60,83 63,80
            C66,77 68,72 68,68
            L68,58
            C68,55 67,53 65,53
            C65,53 65,48 65,44
            C65,41 63.5,40 62,40
            C62,37 62,33 62,30
            C62,27 60.5,26 59,26
            C59,23 58.5,22 57,22
            C55.5,22 55,23 55,26
            L55,40
            C54,40 53,41 53,44
            L53,40
            C53,37 52,36 50.5,36
            C49,36 48.5,37 48.5,40
            L48.5,44
            C48.5,41 47.5,40 46,40
            C46,40 46,40 46,40
            L50,85
            Z
          "
          fill={`url(#${uid}-gold)`}
        />

        {/* Finger separation lines — left hand, subtle */}
        <line x1="41" y1="26" x2="41" y2="53" stroke="#92400E" strokeWidth="0.8" strokeOpacity="0.35" />
        <line x1="45" y1="26" x2="45" y2="53" stroke="#92400E" strokeWidth="0.8" strokeOpacity="0.35" />

        {/* Finger separation lines — right hand */}
        <line x1="59" y1="26" x2="59" y2="53" stroke="#92400E" strokeWidth="0.8" strokeOpacity="0.35" />
        <line x1="55" y1="26" x2="55" y2="53" stroke="#92400E" strokeWidth="0.8" strokeOpacity="0.35" />

        {/* Centre join line (seam between hands) */}
        <line x1="50" y1="22" x2="50" y2="85" stroke="#92400E" strokeWidth="0.6" strokeOpacity="0.25" />

        {/* Wrist cuff — warm highlight arc at base */}
        <path
          d="M37,82 Q50,88 63,82"
          stroke="#FFF7AE"
          strokeWidth="1.2"
          strokeOpacity="0.18"
          fill="none"
          strokeLinecap="round"
        />

      </g>
    </svg>
  );
}

// Custom dove SVG — clean, elegant, recognisable
export default function DoveIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Main body */}
      <path
        d="M32 38 C24 38 14 34 10 26 C14 20 22 18 28 20 L32 22 L36 18 C42 14 52 16 54 24 C50 32 40 38 32 38 Z"
        fill={color}
      />
      {/* Upper wing sweep */}
      <path
        d="M28 20 C26 14 30 8 38 8 C44 8 50 12 50 18 C44 16 36 16 28 20 Z"
        fill={color}
        opacity="0.75"
      />
      {/* Lower wing / tail feathers */}
      <path
        d="M10 26 C6 30 4 36 8 40 C10 36 12 34 16 32 Z"
        fill={color}
        opacity="0.65"
      />
      {/* Tail split */}
      <path
        d="M10 26 L4 32 M10 26 L6 38"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Head */}
      <circle cx="36" cy="22" r="5" fill={color} />
      {/* Eye */}
      <circle cx="38" cy="21" r="1.5" fill="rgba(0,0,0,0.35)" />
      {/* Beak */}
      <path
        d="M41 23 L45 22 L41 24 Z"
        fill={color}
        opacity="0.8"
      />
      {/* Olive branch stem */}
      <path
        d="M44 34 C48 30 52 32 54 36"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
        fill="none"
      />
      {/* Olive leaves */}
      <ellipse cx="50" cy="30" rx="3" ry="1.5" transform="rotate(-30 50 30)" fill={color} opacity="0.55" />
      <ellipse cx="53" cy="33" rx="3" ry="1.5" transform="rotate(20 53 33)" fill={color} opacity="0.45" />
      <ellipse cx="52" cy="36" rx="2.5" ry="1.2" transform="rotate(-10 52 36)" fill={color} opacity="0.4" />
    </svg>
  );
}

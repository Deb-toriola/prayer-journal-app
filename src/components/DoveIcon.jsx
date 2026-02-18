// Custom dove SVG — clean, minimal, symbolic
export default function DoveIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Body */}
      <path
        d="M6 18c0 0 2-6 8-7s10 1 12-3c0 0-1 5-5 6s-5 0-5 0l4 4c0 0-4 1-7-1s-4-4-4-4L6 18z"
        fill={color}
        opacity="0.9"
      />
      {/* Wing */}
      <path
        d="M14 11c0 0 4-4 9-3c0 0-2 4-6 5L14 11z"
        fill={color}
        opacity="0.7"
      />
      {/* Tail */}
      <path
        d="M6 18l-3 4l3-1l1 3l2-4"
        fill={color}
        opacity="0.8"
      />
      {/* Olive branch — small dots suggesting leaves */}
      <circle cx="22" cy="22" r="1.2" fill={color} opacity="0.6" />
      <circle cx="24" cy="20" r="1" fill={color} opacity="0.5" />
      <circle cx="25.5" cy="22.5" r="0.8" fill={color} opacity="0.4" />
      <line x1="19" y1="22" x2="25" y2="21" stroke={color} strokeWidth="1" opacity="0.6" />
      {/* Eye */}
      <circle cx="20" cy="13" r="1" fill={color} opacity="0.5" />
    </svg>
  );
}

// World-class flame icon — gradient gold/amber, used in header and daily verse
export default function AppIcon({ size = 24 }) {
  const id = `flame-grad-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF7AE" />
          <stop offset="35%" stopColor="#FBBF24" />
          <stop offset="70%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
      </defs>
      {/* Outer flame */}
      <path
        d="M12 2C12 2 7 8 7 13a5 5 0 0010 0c0-3-2-5-2-5s-1 2-2 2c0-2-1-4-1-8z"
        fill={`url(#${id})`}
      />
      {/* Inner bright core */}
      <path
        d="M12 10c0 0 1.5 2 1.5 4a2.5 2.5 0 01-5 0c0-1.5 1-3 1-3s.5 1 1 1c0-1 .5-2 1.5-2z"
        fill="#FFF7AE"
        opacity="0.7"
      />
    </svg>
  );
}

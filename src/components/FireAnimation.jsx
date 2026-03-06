/**
 * FireAnimation — multi-layer CSS animated fire.
 * Each layer uses a different animation duration (prime-ish ratios)
 * so they never fully sync, producing organic-looking flames.
 *
 * Props:
 *  size   — total height in px (width is 68% of that)
 *  style  — extra inline styles (e.g. filter glow from streakTheme)
 */
export default function FireAnimation({ size = 48, style }) {
  const w = Math.round(size * 0.68);

  return (
    <div
      className="fire-anim"
      style={{ width: w, height: size, ...style }}
      aria-hidden="true"
    >
      {/* Ember glow — blurred base, pulsing */}
      <div className="fla fla-glow" />

      {/* Back/outer flame — widest, darkest, slowest */}
      <div className="fla fla-back" />

      {/* Mid flame */}
      <div className="fla fla-mid" />

      {/* Inner flame — orange → yellow */}
      <div className="fla fla-inner" />

      {/* Core — yellow → near-white hot zone */}
      <div className="fla fla-core" />

      {/* Wispy tip */}
      <div className="fla fla-tip" />
    </div>
  );
}

/**
 * FireAnimation — Doom-style particle fire on <canvas>.
 *
 * Algorithm (from id Software, ~1993):
 *  • 2-D grid of heat values 0–255. Bottom row = constant source (255).
 *  • Each frame, for every cell: read heat from the row below, subtract a
 *    random 0–1 base cooling amount PLUS a height-proportional bonus
 *    (0 near the source, up to ~10 near the tip), write the cooled value
 *    one row above (with a small random horizontal drift).
 *  • A 256-entry RGBA palette maps heat → colour (transparent → deep
 *    crimson → red-orange → amber → yellow → near-white).
 *  • A pre-computed SHAPE mask (Float32Array, built once at module load)
 *    gives the flame a pointed silhouette: full-width at the base, narrowing
 *    to a soft tip at the top. It is applied as a multiplier on the palette
 *    alpha at render time — the heat grid itself stays fully rectangular so
 *    the turbulent Doom physics are completely unaffected.
 *  • The canvas is rendered at ~½ display size; browser bilinear upscaling
 *    smooths the pixels into a soft, realistic flame.
 */

import { useEffect, useRef } from 'react';

// ── Logical canvas dimensions ─────────────────────────────────────────────
const W = 22;
const H = 36;

// ── Flame-shape mask (built once at module load) ───────────────────────────
// Each entry is 0.0–1.0 and gets multiplied by the palette alpha at paint time.
// Formula: halfWidth(y) = (W/2) × (0.12 + 0.88 × (y/(H−1))^0.65)
//   y=0 (canvas top = flame tip)  → halfWidth ≈ 1.3px  (narrow point)
//   y=H−1 (canvas bottom = base) → halfWidth = W/2    (full width)
// Edge softness: 1.5-pixel cosine feather so the silhouette is anti-aliased
// rather than a hard-edged cutout.
const SHAPE = (() => {
  const s  = new Float32Array(W * H);
  const cx = (W - 1) / 2;          // horizontal centre
  for (let y = 0; y < H; y++) {
    const yNorm = y / (H - 1);                           // 0 at tip, 1 at base
    const halfW = (W / 2) * (0.12 + 0.88 * Math.pow(yNorm, 0.65));
    for (let x = 0; x < W; x++) {
      const dist = Math.abs(x - cx);
      // Smooth step over a 1.5-pixel feather zone at each edge
      const raw  = (halfW + 0.75 - dist) / 1.5;
      s[y * W + x] = raw <= 0 ? 0 : raw >= 1 ? 1 : raw * raw * (3 - 2 * raw);
    }
  }
  return s;
})();

// ── Colour palette (built once at module load) ────────────────────────────
// 256 RGBA entries. Heat < 80 → alpha 0 (transparent into card background).
// Hues: transparent → deep crimson → red-orange → amber → yellow-white
const PALETTE = (() => {
  const p = new Uint8ClampedArray(256 * 4);

  for (let i = 0; i < 256; i++) {
    let r, g, b, a;

    // ── Colour ──
    if (i < 80) {
      r = 0; g = 0; b = 0;
    } else if (i < 130) {
      const t = (i - 80) / 50;
      r = (t * 155)          | 0;   // 0   → 155  (dark crimson)
      g = 0;
      b = 0;
    } else if (i < 190) {
      const t = (i - 130) / 60;
      r = (155 + t * 100)    | 0;   // 155 → 255  (crimson → orange)
      g = (t * 110)          | 0;   // 0   → 110
      b = 0;
    } else if (i < 230) {
      const t = (i - 190) / 40;
      r = 255;
      g = (110 + t * 125)    | 0;   // 110 → 235  (orange → amber)
      b = (t * 12)           | 0;   // 0   → 12
    } else {
      const t = (i - 230) / 25;
      r = 255;
      g = (235 + t * 20)     | 0;   // 235 → 255
      b = (12  + t * 200)    | 0;   // 12  → 212  (white-hot tip)
    }

    // ── Alpha: transparent for cold cells, opaque for hot ──
    if (i < 80) {
      a = 0;
    } else if (i < 140) {
      a = ((i - 80) / 60 * 180) | 0;   // 0   → 180
    } else if (i < 210) {
      a = (180 + (i - 140) / 70 * 65) | 0; // 180 → 245
    } else {
      a = Math.min(255, (245 + (i - 210) / 45 * 10) | 0); // 245 → 255
    }

    p[i * 4]     = r;
    p[i * 4 + 1] = g;
    p[i * 4 + 2] = b;
    p[i * 4 + 3] = a;
  }
  return p;
})();

// ── Component ─────────────────────────────────────────────────────────────
export default function FireAnimation({ size = 48, style }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef(null); // { fire, img, raf }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx  = canvas.getContext('2d');
    const fire = new Uint8Array(W * H);
    const img  = ctx.createImageData(W, H); // pre-allocated — no GC per frame

    // Seed the bottom row (heat source)
    for (let x = 0; x < W; x++) fire[(H - 1) * W + x] = 255;

    stateRef.current = { fire, img, raf: null };

    function tick() {
      const f = stateRef.current.fire;

      // ── Occasionally vary the heat source ───────────────────────────────
      // Creates natural "holes" at the flame base — dark spots that travel
      // upward and make the flame look genuinely alive.
      for (let x = 0; x < W; x++) {
        f[(H - 1) * W + x] = Math.random() < 0.07
          ? ((160 + Math.random() * 90) | 0)   // brief cool spot
          : 255;
      }

      // ── Doom spread: rise + cool + drift ────────────────────────────────
      // y iterates bottom→top so each cell is read BEFORE it is overwritten.
      for (let y = 1; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const heat = f[y * W + x];
          if (heat === 0) {
            f[(y - 1) * W + x] = 0;
            continue;
          }
          // rand 0–3: drift = x − rand + 1, base cool = rand & 1 (0 or 1)
          const rand       = (Math.random() * 4) | 0;
          const dstX       = Math.max(0, Math.min(W - 1, x - rand + 1));
          // Height-proportional extra cooling: 0 at source, up to ~10 at tip
          const heightFade = ((H - y + 1) / H * 10) | 0;
          const cool       = (rand & 1) + heightFade;
          f[(y - 1) * W + dstX] = heat > cool ? heat - cool : 0;
        }
      }

      // ── Paint heat grid → RGBA via palette + shape mask ─────────────────
      // SHAPE[i] narrows the visible flame from full-width at the base to a
      // pointed tip at the top — multiply into alpha, leave RGB untouched.
      const data = stateRef.current.img.data;
      for (let i = 0; i < W * H; i++) {
        const pi = fire[i] << 2;                            // palette offset
        const di = i       << 2;                            // image-data offset
        data[di]     = PALETTE[pi];
        data[di + 1] = PALETTE[pi + 1];
        data[di + 2] = PALETTE[pi + 2];
        data[di + 3] = (PALETTE[pi + 3] * SHAPE[i]) | 0;  // shape mask on alpha
      }
      ctx.putImageData(stateRef.current.img, 0, 0);

      stateRef.current.raf = requestAnimationFrame(tick);
    }

    stateRef.current.raf = requestAnimationFrame(tick);

    return () => {
      if (stateRef.current?.raf) cancelAnimationFrame(stateRef.current.raf);
    };
  }, []);

  // CSS display size — taller than wide, like a real flame
  const displayW = Math.round(size * 0.72);

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      aria-hidden="true"
      style={{
        width: displayW,
        height: size,
        display: 'block',
        imageRendering: 'auto',   // bilinear — soft, not blocky
        ...style,
      }}
    />
  );
}

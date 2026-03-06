/**
 * FireAnimation — Doom-style particle fire on <canvas>.
 *
 * Algorithm (from id Software, ~1993):
 *  • 2-D grid of heat values 0–255. Bottom row = constant source (255).
 *  • Each frame, for every cell: read heat from the row below, subtract a
 *    random 0–1 cooling amount, write the cooled value one row above (with
 *    a small random horizontal drift).
 *  • A 256-entry RGBA palette maps heat → colour (black → crimson → orange
 *    → amber → yellow → near-white). Low heat entries are transparent so
 *    the flame fades naturally into the card background.
 *  • The canvas is rendered at ~½ display size; browser bilinear upscaling
 *    smooths the pixels into a soft, realistic flame.
 *
 * The randomness means frames never repeat — it is genuinely organic.
 */

import { useEffect, useRef } from 'react';

// ── Logical canvas dimensions ─────────────────────────────────────────────
// Deliberately small. Bilinear CSS upscaling blurs the pixels into soft fire.
const W = 22;
const H = 36;

// ── Colour palette (built once at module load) ────────────────────────────
// 256 RGBA entries. Alpha is 0 for cold cells so the card shows through.
// Hues: transparent black → deep crimson → red-orange → amber → yellow-white
const PALETTE = (() => {
  const p = new Uint8ClampedArray(256 * 4);

  for (let i = 0; i < 256; i++) {
    let r, g, b, a;

    // ── Colour ──
    if (i < 24) {
      r = 0; g = 0; b = 0;
    } else if (i < 80) {
      const t = (i - 24) / 55;
      r = (t * 185)          | 0;   // 0  → 185
      g = 0;
      b = 0;
    } else if (i < 148) {
      const t = (i - 80) / 67;
      r = (185 + t * 70)     | 0;   // 185 → 255
      g = (t * 130)          | 0;   // 0   → 130
      b = 0;
    } else if (i < 208) {
      const t = (i - 148) / 59;
      r = 255;
      g = (130 + t * 110)    | 0;   // 130 → 240
      b = (t * 18)           | 0;   // 0   → 18
    } else {
      const t = (i - 208) / 47;
      r = 255;
      g = (240 + t * 15)     | 0;   // 240 → 255
      b = (18  + t * 210)    | 0;   // 18  → 228  (white-hot tip)
    }

    // ── Alpha: transparent for cold, opaque for hot ──
    if (i < 22) {
      a = 0;
    } else if (i < 75) {
      a = ((i - 22) / 52 * 160) | 0;   // 0   → 160
    } else if (i < 145) {
      a = (160 + (i - 75) / 69 * 70)| 0; // 160 → 230
    } else {
      a = Math.min(255, (230 + (i - 145) / 110 * 25) | 0); // 230 → 255
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
        f[(H - 1) * W + x] = Math.random() < 0.06
          ? ((185 + Math.random() * 70) | 0)   // brief cool spot
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
          // rand: 0-3 → drift = -rand+1 (-2..+1), cool = rand & 1 (0 or 1)
          const rand = (Math.random() * 4) | 0;
          const dstX = Math.max(0, Math.min(W - 1, x - rand + 1));
          f[(y - 1) * W + dstX] = heat - (rand & 1);
        }
      }

      // ── Paint heat grid → RGBA via palette ─────────────────────────────
      const data = stateRef.current.img.data;
      for (let i = 0; i < W * H; i++) {
        const pi = fire[i] << 2; // × 4
        const di = i       << 2;
        data[di]     = PALETTE[pi];
        data[di + 1] = PALETTE[pi + 1];
        data[di + 2] = PALETTE[pi + 2];
        data[di + 3] = PALETTE[pi + 3];
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
        // 'auto' = bilinear upscaling — blurs the pixel grid into
        // smooth, soft flame rather than a blocky pixelated look
        imageRendering: 'auto',
        ...style,
      }}
    />
  );
}

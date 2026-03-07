/**
 * CardFireAnimation — full-card Doom particle fire background.
 *
 * Same algorithm as FireAnimation but sized for the streak card
 * (W=80 × H=50 logical pixels, CSS-stretched to fill the card).
 * Designed to be rendered as an absolutely-positioned background
 * layer; text content sits on top at z-index 2.
 *
 * Props
 *  seedHeat  0–255   Base temperature of the fire source row.
 *                    Controls how high the flames rise:
 *                      195 → fire fills lower ~60 % of card (streak 3–6)
 *                      220 → lower ~85 %                   (streak 7–13)
 *                      240 → nearly full card              (streak 14–29)
 *                      255 → full card, tips barely visible (streak 30+)
 */

import { useEffect, useRef } from 'react';

const W = 80;
const H = 50;

// ── Palette: transparent → crimson → orange → amber → white-hot ──────────
const PALETTE = (() => {
  const p = new Uint8ClampedArray(256 * 4);
  for (let i = 0; i < 256; i++) {
    let r, g, b, a;

    if (i < 80) {
      r = 0; g = 0; b = 0; a = 0;
    } else if (i < 130) {
      const t = (i - 80) / 50;
      r = (t * 155) | 0; g = 0; b = 0;
      a = (t * 160) | 0;
    } else if (i < 190) {
      const t = (i - 130) / 60;
      r = (155 + t * 100) | 0;
      g = (t * 110)        | 0;
      b = 0;
      a = (160 + t * 70)   | 0;
    } else if (i < 230) {
      const t = (i - 190) / 40;
      r = 255;
      g = (110 + t * 125) | 0;
      b = (t * 12)         | 0;
      a = (230 + t * 25)   | 0;
    } else {
      const t = (i - 230) / 25;
      r = 255;
      g = (235 + t * 20)   | 0;
      b = (12  + t * 200)  | 0;
      a = 255;
    }

    p[i * 4] = r; p[i * 4 + 1] = g; p[i * 4 + 2] = b; p[i * 4 + 3] = a;
  }
  return p;
})();

export default function CardFireAnimation({ seedHeat = 255 }) {
  const canvasRef  = useRef(null);
  const stateRef   = useRef(null);
  const seedRef    = useRef(seedHeat);

  // Keep seedRef current so the animation tick always sees the latest value
  useEffect(() => { seedRef.current = seedHeat; }, [seedHeat]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx  = canvas.getContext('2d');
    const fire = new Uint8Array(W * H);
    const img  = ctx.createImageData(W, H);

    // Seed the bottom row
    for (let x = 0; x < W; x++) fire[(H - 1) * W + x] = seedRef.current;

    stateRef.current = { fire, img, raf: null, frame: 0 };

    function tick() {
      const s = stateRef.current;
      s.frame++;

      // ── Throttle to ~15 fps (every 4th RAF tick) ─────────────────────
      // At 60 fps the card fire is frantic. Updating every 4th frame gives
      // slow, meditative flames — warm and alive, not hellfire.
      if (s.frame % 4 !== 0) {
        s.raf = requestAnimationFrame(tick);
        return;
      }

      const f  = s.fire;
      const sh = seedRef.current;

      // ── Vary heat source ─────────────────────────────────────────────
      // 4 % cool-spot chance (down from 7 %) keeps the base steadier.
      for (let x = 0; x < W; x++) {
        f[(H - 1) * W + x] = Math.random() < 0.04
          ? ((sh * 0.70 + Math.random() * sh * 0.20) | 0)  // cool spot
          : sh;
      }

      // ── Doom spread: rise + cool + drift ─────────────────────────────
      for (let y = 1; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const heat = f[y * W + x];
          if (heat === 0) { f[(y - 1) * W + x] = 0; continue; }
          const rand       = (Math.random() * 4) | 0;
          const dstX       = Math.max(0, Math.min(W - 1, x - rand + 1));
          const heightFade = ((H - y + 1) / H * 6) | 0;
          const cool       = (rand & 1) + heightFade;
          f[(y - 1) * W + dstX] = heat > cool ? heat - cool : 0;
        }
      }

      // ── Paint ────────────────────────────────────────────────────────
      const data = s.img.data;
      for (let i = 0; i < W * H; i++) {
        const pi = fire[i] << 2;
        const di = i       << 2;
        data[di]     = PALETTE[pi];
        data[di + 1] = PALETTE[pi + 1];
        data[di + 2] = PALETTE[pi + 2];
        data[di + 3] = PALETTE[pi + 3];
      }
      ctx.putImageData(s.img, 0, 0);

      s.raf = requestAnimationFrame(tick);
    }

    stateRef.current.raf = requestAnimationFrame(tick);
    return () => { if (stateRef.current?.raf) cancelAnimationFrame(stateRef.current.raf); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      aria-hidden="true"
      className="card-fire-canvas"
    />
  );
}

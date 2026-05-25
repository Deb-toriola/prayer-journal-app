// A deliberately styled placeholder that tells the client EXACTLY what real
// photography to commission. Never just an empty grey box — the label is the
// brief. Per CLAUDE.md: never use stock or fabricated imagery.

import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  label: string;
  aspect?: 'video' | 'square' | 'portrait' | 'landscape' | 'hero';
  tone?: 'forest' | 'bone';
}

const aspectMap = {
  video:     'aspect-[16/9]',
  square:    'aspect-square',
  portrait:  'aspect-[4/5]',
  landscape: 'aspect-[3/2]',
  hero:      'aspect-[16/10] md:aspect-[21/9]',
};

export function ImagePlaceholder({
  label,
  aspect = 'landscape',
  tone = 'forest',
  className = '',
  ...rest
}: Props) {
  const base =
    tone === 'bone'
      ? 'bg-bone-100 text-forest border-forest/15'
      : 'bg-forest-700 text-bone border-bone/15';
  return (
    <div
      className={`relative overflow-hidden border ${aspectMap[aspect]} ${base} ${className}`}
      {...rest}
    >
      {/* Topographic contour motif — ties to the "land" concept */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'repeating-radial-gradient(circle at 30% 40%, currentColor 0 1px, transparent 1px 26px)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-noise opacity-[0.06] mix-blend-overlay"
      />
      <div className="absolute inset-0 flex flex-col items-start justify-end p-5 md:p-7">
        <span className="eyebrow opacity-80">Image to supply</span>
        <span className="mt-2 max-w-[28ch] text-small leading-snug opacity-95">
          {label}
        </span>
      </div>
    </div>
  );
}

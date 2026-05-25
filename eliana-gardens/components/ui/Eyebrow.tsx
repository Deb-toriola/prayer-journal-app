import type { HTMLAttributes } from 'react';

export function Eyebrow({
  children,
  className = '',
  tone = 'gold',
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { tone?: 'gold' | 'bone' | 'forest' }) {
  const colour =
    tone === 'bone' ? 'text-bone/80'
    : tone === 'forest' ? 'text-forest'
    : 'text-gold';
  return (
    <span
      className={`eyebrow inline-flex items-center gap-3 ${colour} ${className}`}
      {...rest}
    >
      <span aria-hidden className="h-px w-8 bg-current opacity-60" />
      {children}
    </span>
  );
}

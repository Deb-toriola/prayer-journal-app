import type { HTMLAttributes } from 'react';

export function Container({
  className = '',
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`shell ${className}`} {...rest}>
      {children}
    </div>
  );
}

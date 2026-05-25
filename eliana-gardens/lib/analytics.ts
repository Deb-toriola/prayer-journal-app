// Analytics IDs are read at build/runtime from env. If absent we render no
// script tags — the rest of the site is unaffected. See <Analytics /> in
// app/layout.tsx for the actual script injection.

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', name, params);
  window.fbq?.('trackCustom', name, params);
}

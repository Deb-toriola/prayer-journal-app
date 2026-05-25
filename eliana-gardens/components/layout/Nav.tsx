'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NAV_LINKS, SITE } from '@/lib/constants';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-400 ease-out-expo',
        scrolled
          ? 'bg-bone-50/85 backdrop-blur-md border-b border-forest/10 py-3'
          : 'bg-transparent py-5',
      ].join(' ')}
    >
      <div className="shell flex items-center justify-between gap-6">
        <Link href="#top" className="group flex items-baseline gap-3" aria-label="Eliana Gardens — home">
          <span className={`font-display text-h5 leading-none transition-colors ${scrolled ? 'text-forest' : 'text-bone'}`}>
            Eliana <span className="italic">Gardens</span>
          </span>
          <span className={`hidden sm:inline text-micro tracking-[0.18em] uppercase ${scrolled ? 'text-ink-muted' : 'text-bone/70'}`}>
            by {SITE.developer}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`link-underline text-small tracking-wide ${scrolled ? 'text-ink' : 'text-bone'}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="#inspection" className="btn-primary hidden sm:inline-flex">
            Book a Site Inspection
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className={`lg:hidden inline-flex h-11 w-11 items-center justify-center border ${scrolled ? 'border-forest/30 text-forest' : 'border-bone/40 text-bone'}`}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300 ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
              <span className={`absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300 ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={[
          'lg:hidden fixed inset-x-0 top-[64px] bottom-0 bg-forest text-bone transition-all duration-400 ease-out-expo',
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-3 pointer-events-none',
        ].join(' ')}
      >
        <div className="shell flex flex-col gap-1 pt-10">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-bone/15 py-5 font-display text-h4"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#inspection"
            onClick={() => setOpen(false)}
            className="btn-primary mt-8 w-full justify-center"
          >
            Book a Site Inspection
          </a>
          <p className="mt-6 text-micro tracking-[0.18em] uppercase text-bone/60">
            A development by {SITE.developer}
          </p>
        </div>
      </div>
    </header>
  );
}

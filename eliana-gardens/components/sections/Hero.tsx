import Link from 'next/link';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { buildWhatsAppUrl, SITE } from '@/lib/constants';

// Editorial split hero: image takes 7/12, copy takes the other 5/12, both
// extend to the viewport edges with intentional asymmetry.
// On mobile the image becomes a full-bleed top, copy stacks beneath it.
export function Hero() {
  const trust = [
    'Registered Survey',
    'C of O in Process',
    'Flexible Payment Plans',
    'Guided Site Inspections',
  ];

  return (
    <section className="relative bg-forest text-bone">
      {/* Subtle topographic backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'repeating-radial-gradient(circle at 80% 20%, #B08D2E 0 1px, transparent 1px 38px)',
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay" />

      <div className="relative grid min-h-[100svh] grid-cols-1 lg:grid-cols-12">
        {/* Image — full-bleed right column on desktop, top on mobile */}
        <div className="relative lg:col-span-7 lg:order-2">
          <div className="relative h-[58svh] w-full lg:h-full">
            <ImagePlaceholder
              label="Hero — drone shot of the estate at golden hour. Treeline, graded roads, surrounding landscape visible. The single most important image on the site."
              aspect="hero"
              className="absolute inset-0 h-full w-full border-0"
            />
            {/* Dark gradient for legibility of any overlapping mobile copy */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-forest/60 via-transparent to-forest/40 lg:bg-gradient-to-r lg:from-forest lg:via-forest/30 lg:to-transparent"
            />
            {/* Vertical estate name on right edge — desktop only, editorial flourish */}
            <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-90 origin-center lg:block">
              <span className="eyebrow text-bone/55">{SITE.city} · {SITE.state}</span>
            </div>
          </div>
        </div>

        {/* Copy — 5/12 column on desktop */}
        <div className="relative z-10 flex items-center lg:col-span-5 lg:order-1">
          <div className="shell w-full pt-16 pb-14 lg:pt-0 lg:pb-0">
            <div className="max-w-[34rem] lg:max-w-none lg:pr-6">
              <Reveal>
                <Eyebrow tone="bone">Own Premium Land · Itori, Ogun State</Eyebrow>
              </Reveal>

              <Reveal delay={120}>
                <h1 className="mt-6 font-display text-h1 text-bone">
                  Secure Land in Abeokuta&rsquo;s{' '}
                  <span className="italic text-gold-200">Fastest-Growing</span>{' '}
                  Corridor.
                </h1>
              </Reveal>

              <Reveal delay={220}>
                <p className="mt-7 max-w-[36ch] text-body-lg text-bone/85">
                  Eliana Gardens is a premium estate at Itori, off the Lagos–Abeokuta
                  Expressway — verified, well-planned, and offered at pre-launch
                  prices before the official market launch.
                </p>
              </Reveal>

              <Reveal delay={320}>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href="#inspection" className="btn-primary">
                    Book a Free Site Inspection
                  </Link>
                  <a
                    href={buildWhatsAppUrl('Hi Eliana Gardens — please send me the price list.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost-light"
                  >
                    Price List on WhatsApp
                  </a>
                </div>
              </Reveal>

              <Reveal delay={420}>
                <div className="mt-12 lg:mt-16">
                  <span className="block h-px w-12 bg-gold" />
                  <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-micro tracking-[0.06em] text-bone/75 sm:flex sm:flex-wrap sm:gap-x-6">
                    {trust.map((t) => (
                      <li key={t} className="flex items-center gap-2">
                        <span aria-hidden className="text-gold">+</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom marker: developer credit + scroll cue */}
      <div className="relative border-t border-bone/10">
        <div className="shell flex items-center justify-between py-5 text-micro tracking-[0.18em] uppercase text-bone/60">
          <span>A development by {SITE.developer}</span>
          <span className="hidden items-center gap-3 sm:inline-flex">
            Scroll
            <span aria-hidden className="block h-px w-10 bg-gold/70" />
          </span>
        </div>
      </div>
    </section>
  );
}

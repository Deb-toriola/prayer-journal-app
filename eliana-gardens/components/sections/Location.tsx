import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { FactPlaceholder } from '@/components/ui/FactPlaceholder';
import { LANDMARKS } from '@/lib/constants';

// Custom map composition — landmarks arranged around a central estate marker
// in a deliberately designed schematic, not a clone of generic feature cards.
// Each landmark is a typographic entry, not an iconified box, so the section
// reads as editorial cartography.
export function Location() {
  return (
    <section id="location" className="relative bg-bone-50 py-section-y-lg topo">
      <Container>
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow tone="forest">02 · Location</Eyebrow>
              <h2 className="mt-5 font-display text-h2 text-forest">
                A location backed by{' '}
                <span className="italic">real development</span>, not adjectives.
              </h2>
            </div>
            <p className="lg:col-span-5 max-w-reading text-body-lg text-ink-soft">
              Eliana Gardens sits at Itori, off the Lagos–Abeokuta Expressway —
              within an active industrial and infrastructure corridor. Land value
              here is driven by visible, ongoing development, not speculation.
            </p>
          </div>
        </Reveal>

        <div className="hairline mt-12" />

        {/* The map composition */}
        <div className="mt-12 grid gap-x-10 gap-y-12 lg:mt-16 lg:grid-cols-12">
          {/* Schematic map — custom design, no clone cards */}
          <Reveal delay={120} className="lg:col-span-7">
            <div className="relative aspect-[5/4] w-full overflow-hidden border border-forest/15 bg-forest text-bone md:aspect-[5/3]">
              {/* Compass rose corner */}
              <div className="absolute right-5 top-5 z-10 text-right text-micro tracking-[0.18em] text-bone/60">
                <p>N ↑</p>
                <p className="mt-1">Itori · Ogun</p>
              </div>

              {/* Topo lines */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    'repeating-radial-gradient(circle at 50% 55%, #B08D2E 0 1px, transparent 1px 32px)',
                }}
              />
              <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.06] mix-blend-overlay" />

              {/* Central estate marker */}
              <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="relative mx-auto h-3 w-3 rounded-full bg-gold ring-8 ring-gold/15">
                  <span className="absolute inset-0 animate-ping rounded-full bg-gold/60" />
                </div>
                <p className="mt-3 font-display text-h6 text-bone">Eliana Gardens</p>
                <p className="mt-1 text-micro tracking-[0.18em] text-gold-200/80">YOU ARE HERE</p>
              </div>

              {/* Connector lines + landmark labels arranged around centre */}
              {LANDMARKS.map((lm, i) => {
                // Hand-placed positions around the centre marker — intentional asymmetry
                const positions = [
                  { top: '12%',  left: '8%',   align: 'left'  },
                  { top: '20%',  left: '70%',  align: 'right' },
                  { top: '46%',  left: '4%',   align: 'left'  },
                  { top: '52%',  left: '78%',  align: 'right' },
                  { top: '74%',  left: '12%',  align: 'left'  },
                  { top: '80%',  left: '62%',  align: 'right' },
                  { top: '88%',  left: '38%',  align: 'left'  },
                ];
                const p = positions[i % positions.length];
                return (
                  <div
                    key={lm.name}
                    className="absolute max-w-[16ch]"
                    style={{ top: p.top, left: p.left }}
                  >
                    <div className={`flex items-center gap-2 ${p.align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                      <span className="h-px w-8 bg-gold/40" />
                    </div>
                    <p className="mt-1 text-micro leading-tight text-bone">
                      {lm.name}
                      {lm.proposed && (
                        <span className="ml-1.5 rounded-sm border border-gold/50 px-1 py-[1px] text-[9px] uppercase tracking-wider text-gold-200">
                          Proposed
                        </span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-micro tracking-[0.06em] text-ink-muted">
              Schematic — proposed government projects clearly labelled.
              An interactive map will replace this on launch.
            </p>
          </Reveal>

          {/* Landmark list — editorial, not card grid */}
          <Reveal delay={200} className="lg:col-span-5">
            <Eyebrow tone="forest">Nearby</Eyebrow>
            <ul className="mt-5 divide-y divide-forest/10 border-y border-forest/10">
              {LANDMARKS.map((lm) => (
                <li
                  key={lm.name}
                  className="group grid grid-cols-[1fr_auto] gap-4 py-4 transition-colors hover:bg-bone-100"
                >
                  <div>
                    <p className="font-display text-h6 text-forest">
                      {lm.name}
                      {lm.proposed && (
                        <span className="ml-2 rounded-sm border border-gold/60 px-1.5 py-px text-[10px] uppercase tracking-wider text-gold-700">
                          Proposed
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-small text-ink-muted">{lm.kind}</p>
                  </div>
                  <div className="self-end text-right">
                    <FactPlaceholder inline label="__ min drive" />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-reading text-small text-ink-muted">
              Drive times will be added once verified on-ground. Specific numbers
              persuade far better than &ldquo;close to.&rdquo;
            </p>
          </Reveal>
        </div>

        <Reveal delay={300}>
          <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-reading text-body text-ink-soft">
              The fastest way to understand the location is to stand on it.
            </p>
            <a href="#inspection" className="btn-primary self-start sm:self-auto">
              Book a Guided Inspection
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

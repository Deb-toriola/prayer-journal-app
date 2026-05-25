import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

// A quiet, full-bleed moment that varies the page rhythm. Type-led, asymmetric
// pull-quote, single image with breathing room — the "acropolis" concept made
// visible through restraint, not slogans.
export function Vision() {
  return (
    <section className="relative bg-bone-50 py-section-y-lg overflow-hidden">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-5 lg:col-start-1">
            <Eyebrow tone="forest">03 · The Vision</Eyebrow>
            <h2 className="mt-5 font-display text-h2 text-forest">
              More than land — a foundation for{' '}
              <span className="italic">elevated living.</span>
            </h2>
            <p className="mt-7 max-w-reading text-body-lg text-ink-soft">
              Most estates sell plots. Eliana Gardens was planned with a
              different intent. Inspired by the idea of an acropolis — a place
              of elevation and purpose — the estate is designed so greenery,
              space, and structure are deliberate, not decorative.
            </p>
            <p className="mt-5 max-w-reading text-body text-ink-soft">
              Every layout integrates nature into daily living to support peace,
              wellness, privacy, and long-term value. It is built for buyers who
              understand a simple truth: where you live shapes how you live, and
              how you invest today defines tomorrow.
            </p>
          </Reveal>

          <Reveal delay={140} className="lg:col-span-7">
            <ImagePlaceholder
              label="Lifestyle — greenery, families walking, open space at the estate. Aspirational but real, not stock-style."
              aspect="landscape"
              className="border-0"
            />
          </Reveal>
        </div>

        {/* Pull quote — typography as the design */}
        <Reveal delay={240}>
          <figure className="mt-24 grid grid-cols-12 items-start gap-6">
            <span aria-hidden className="col-span-1 mt-6 hidden h-px bg-gold md:block" />
            <blockquote className="col-span-12 md:col-span-10">
              <p className="font-display text-display leading-[0.95] tracking-[-0.035em] text-forest">
                <span className="text-gold-400">&ldquo;</span>
                Where you live shapes how you live.
                <span className="text-gold-400">&rdquo;</span>
              </p>
            </blockquote>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}

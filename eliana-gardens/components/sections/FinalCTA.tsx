import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { buildWhatsAppUrl } from '@/lib/constants';

export function FinalCTA() {
  return (
    <section className="relative bg-forest text-bone py-section-y-lg overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            'repeating-radial-gradient(circle at 70% 30%, #B08D2E 0 1px, transparent 1px 42px)',
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay" />
      <Container className="relative">
        <Reveal>
          <p className="eyebrow text-gold-200">The next step</p>
          <h2 className="mt-5 max-w-[18ch] font-display text-display leading-[0.95] text-bone">
            Your future starts at <span className="italic text-gold-200">Eliana Gardens.</span>
          </h2>
          <p className="mt-8 max-w-reading text-body-lg text-bone/85">
            Whether you are buying to invest, to build, or to secure long-term
            family wealth, now is the moment to own land in one of Ogun
            State&rsquo;s most promising corridors — at pre-launch prices.
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href="#inspection" className="btn-primary">
              Book Your Free Site Inspection
            </a>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-light"
            >
              Chat with Us on WhatsApp
            </a>
          </div>

          <p className="mt-16 font-display text-h5 italic text-bone/70">
            Invest today. Grow tomorrow. Build the future at Eliana Gardens.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

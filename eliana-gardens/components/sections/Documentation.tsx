import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { FactPlaceholder } from '@/components/ui/FactPlaceholder';
import { PLACEHOLDERS } from '@/lib/constants';

// The highest-stakes section. Calm, precise, neutral colours. Confidence
// communicated through restraint and exactness — not exclamation marks.
export function Documentation() {
  const buyerReceives = [
    'Payment Receipt',
    'Contract of Sale',
    'Deed of Assignment',
    'Registered Survey',
    'Allocation Letter',
    'C of O (where applicable)',
  ];

  return (
    <section id="documentation" className="bg-bone-50 py-section-y-lg">
      <Container>
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow tone="forest">07 · Documentation</Eyebrow>
              <h2 className="mt-5 font-display text-h2 text-forest">
                Verified, documented,{' '}
                <span className="italic">legally secure.</span>
              </h2>
            </div>
            <p className="lg:col-span-5 max-w-reading text-body-lg text-ink-soft">
              We believe documentation should be transparent, not vague. Below
              is exactly what the title status is — and exactly what you
              receive when you buy.
            </p>
          </div>
        </Reveal>

        <div className="hairline mt-12" />

        <div className="mt-12 grid gap-x-12 gap-y-14 lg:grid-cols-12">
          {/* Title status */}
          <Reveal delay={120} className="lg:col-span-6">
            <Eyebrow tone="forest">A · Title status</Eyebrow>
            <h3 className="mt-4 font-display text-h4 text-forest">
              The exact legal position of the land
            </h3>
            <ul className="mt-6 space-y-4">
              <li>
                <p className="text-small uppercase tracking-[0.14em] text-ink-muted">Current title</p>
                <div className="mt-1.5">
                  <FactPlaceholder
                    label={PLACEHOLDERS.titleStatus}
                    hint="Use precise legal terms: Registered Survey / Deed of Assignment / Excision in progress / Gazette / Governor's Consent / C of O."
                  />
                </div>
              </li>
              <li>
                <p className="text-small uppercase tracking-[0.14em] text-ink-muted">Government acquisition status</p>
                <div className="mt-1.5">
                  <FactPlaceholder
                    label={PLACEHOLDERS.acquisitionStatus}
                    hint="The first question every informed Nigerian buyer asks."
                  />
                </div>
              </li>
              <li>
                <p className="text-small uppercase tracking-[0.14em] text-ink-muted">If C of O is in progress</p>
                <div className="mt-1.5">
                  <FactPlaceholder
                    label="State honestly with expected timeline"
                    hint='"C of O in view" is too vague — replace with a concrete expectation.'
                  />
                </div>
              </li>
              <li>
                <p className="text-small uppercase tracking-[0.14em] text-ink-muted">Development status</p>
                <div className="mt-1.5">
                  <FactPlaceholder
                    label="Fenced? Gated? Roads graded? Title samples viewable on inspection?"
                  />
                </div>
              </li>
            </ul>
          </Reveal>

          {/* What buyer receives */}
          <Reveal delay={200} className="lg:col-span-6">
            <Eyebrow tone="forest">B · What you receive</Eyebrow>
            <h3 className="mt-4 font-display text-h4 text-forest">
              Document by document, stage by stage
            </h3>
            <ol className="mt-6 space-y-0 border-l border-forest/15 pl-6">
              {buyerReceives.map((doc, i) => (
                <li key={doc} className="relative pb-7 last:pb-0">
                  <span className="absolute -left-[34px] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-forest bg-bone-50 font-display text-micro text-forest">
                    {i + 1}
                  </span>
                  <p className="font-display text-h6 text-forest">{doc}</p>
                  <p className="mt-1 text-small text-ink-muted">
                    <FactPlaceholder inline label="When issued" />
                  </p>
                </li>
              ))}
            </ol>
            <div className="mt-8">
              <FactPlaceholder
                label="Confirm the exact sequence and timing"
                hint="Order and naming above are conventional — client to ratify."
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

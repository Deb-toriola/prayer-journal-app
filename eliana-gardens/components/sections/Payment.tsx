import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { FactPlaceholder } from '@/components/ui/FactPlaceholder';
import { PAYMENT_PLANS } from '@/lib/constants';

export function Payment() {
  return (
    <section className="bg-bone-50 py-section-y">
      <Container>
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow tone="forest">06 · Payment Plans</Eyebrow>
              <h2 className="mt-5 font-display text-h2 text-forest">
                Buy the way that fits your cash flow.
              </h2>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="hairline mt-12" />
          <div className="grid gap-0 md:grid-cols-3 md:divide-x md:divide-forest/10">
            {PAYMENT_PLANS.map((plan, i) => (
              <article
                key={plan.name}
                className="group relative px-2 py-10 transition-colors hover:bg-bone-100 md:px-8"
              >
                <p className="font-display text-h6 text-ink-muted">
                  0{i + 1}
                </p>
                <h3 className="mt-3 font-display text-h4 text-forest">{plan.name}</h3>
                <p className="mt-1 text-small uppercase tracking-[0.18em] text-gold">{plan.badge}</p>
                <p className="mt-6 max-w-[28ch] font-display text-h5 text-ink">{plan.headline}</p>
                <p className="mt-3 max-w-[34ch] text-body text-ink-soft">{plan.detail}</p>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-10">
            <FactPlaceholder
              label="Allocation timing relative to payment"
              hint="e.g. 'Allocation is processed once full payment and documentation are complete.'"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

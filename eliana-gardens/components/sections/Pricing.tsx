import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { FactPlaceholder } from '@/components/ui/FactPlaceholder';
import { PRICING, PLACEHOLDERS, formatNaira, buildWhatsAppUrl } from '@/lib/constants';

// Pricing as a considered comparison table, not clone cards. Each row shows
// price-per-sqm where calculable for transparency.
export function Pricing() {
  return (
    <section id="pricing" className="bg-bone-100 py-section-y-lg">
      <Container>
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow tone="forest">05 · Pricing</Eyebrow>
              <h2 className="mt-5 font-display text-h2 text-forest">
                Pre-launch pricing, plainly stated.
              </h2>
            </div>
            <p className="lg:col-span-5 max-w-reading text-body-lg text-ink-soft">
              Prices are offered ahead of the official market launch. They will
              rise on{' '}
              <FactPlaceholder inline label={PLACEHOLDERS.preLaunchEndDate} />
              {' '}— honest urgency, no fake counters.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="hairline mt-12" />
          {/* Table on md+; stacked on mobile */}
          <div className="hidden md:block">
            <div className="grid grid-cols-12 gap-4 px-2 py-5 text-eyebrow text-ink-muted">
              <div className="col-span-4">Plot</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-3 text-right">Pre-launch price</div>
              <div className="col-span-2 text-right">Initial deposit</div>
              <div className="col-span-1 text-right">Per sqm</div>
            </div>
            {PRICING.map((row, i) => (
              <div
                key={i}
                className="group grid grid-cols-12 items-baseline gap-4 border-t border-forest/10 px-2 py-7 transition-colors hover:bg-bone-50"
              >
                <div className="col-span-4">
                  <p className="font-display text-h5 text-forest">{row.label}</p>
                  <p className="mt-1 text-micro tracking-wide text-ink-muted">{row.note}</p>
                </div>
                <div className="col-span-2 text-body text-ink">{row.size}</div>
                <div className="col-span-3 text-right font-display text-h4 text-forest">
                  {formatNaira(row.price)}
                </div>
                <div className="col-span-2 text-right text-body text-ink-soft">
                  {formatNaira(row.deposit)}
                </div>
                <div className="col-span-1 text-right text-small text-ink-muted">
                  {row.perSqm ? `${formatNaira(row.perSqm)}` : '—'}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile stack */}
          <div className="md:hidden">
            {PRICING.map((row, i) => (
              <div key={i} className="border-t border-forest/10 px-2 py-7">
                <p className="font-display text-h5 text-forest">{row.label}</p>
                <p className="mt-1 text-micro tracking-wide text-ink-muted">{row.size} · {row.note}</p>
                <p className="mt-4 font-display text-h3 text-forest">{formatNaira(row.price)}</p>
                <p className="mt-1 text-small text-ink-soft">
                  Deposit {formatNaira(row.deposit)}
                  {row.perSqm && <> · {formatNaira(row.perSqm)} / sqm</>}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <FactPlaceholder
              label="Plots per acre package"
              hint="Acre ≈ 4,047 sqm — confirm how many 300/600 sqm plots that breaks into."
            />
            <FactPlaceholder
              label="Reconcile per-sqm pricing"
              hint="300 sqm at ₦1.5M = ₦5,000/sqm vs 600 sqm acre at ₦7,500/sqm — client to confirm."
            />
          </div>
        </Reveal>

        <Reveal delay={280}>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-reading text-body text-ink-soft">
              Need the full price breakdown and brochure?
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={buildWhatsAppUrl('Hi — please send me the Eliana Gardens price list and brochure.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-dark"
              >
                Price List on WhatsApp
              </a>
              <a href="#inspection" className="btn-primary">Book Inspection</a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { FactPlaceholder } from '@/components/ui/FactPlaceholder';

const features = [
  { name: 'Perimeter Fencing',   status: 'planned' as const },
  { name: 'Gatehouse & Security', status: 'planned' as const },
  { name: 'Graded Roads',         status: 'planned' as const },
  { name: 'Drainage Network',     status: 'planned' as const },
  { name: 'Green / Recreation',   status: 'planned' as const },
  { name: 'Electricity',          status: 'planned' as const },
  { name: 'Water Supply',         status: 'planned' as const },
];

export function Amenities() {
  return (
    <section className="bg-forest text-bone py-section-y-lg">
      <Container>
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow tone="bone">08 · Estate Features</Eyebrow>
              <h2 className="mt-5 font-display text-h2 text-bone">
                Built for daily living,{' '}
                <span className="italic text-gold-200">not just for plots.</span>
              </h2>
            </div>
            <p className="lg:col-span-5 max-w-reading text-body-lg text-bone/85">
              Each feature below is clearly marked as planned or delivered.
              Nothing is implied to exist that does not.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="hairline mt-12 bg-gold/40" />
          <ul className="grid grid-cols-1 divide-y divide-bone/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
            {features.map((f, i) => (
              <li
                key={f.name}
                className="group flex items-baseline justify-between gap-4 px-2 py-6 transition-colors hover:bg-forest-700"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-micro text-bone/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="font-display text-h5 text-bone">{f.name}</p>
                </div>
                <span className="text-micro uppercase tracking-[0.18em] text-gold-200">
                  {f.status}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-10">
            <FactPlaceholder
              label="Confirm list — keep only genuinely planned/delivered features"
              hint="Mark each as 'planned' or 'delivered'. Do not list anything aspirational without that label."
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

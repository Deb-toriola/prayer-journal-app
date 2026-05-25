import { Container } from '@/components/ui/Container';
import { FactPlaceholder } from '@/components/ui/FactPlaceholder';

const items = [
  { label: 'Verified Survey Plan',     detail: 'Registered with the Surveyor-General' },
  { label: 'Flexible Payment',         detail: 'Up to 6 months instalment plans' },
  { label: 'Guided Site Inspections',  detail: 'Free, no-pressure tours' },
] as const;

export function TrustBar() {
  return (
    <section aria-label="Trust signals" className="border-y border-forest/10 bg-bone-50">
      <Container className="grid grid-cols-2 divide-y divide-forest/10 md:grid-cols-4 md:divide-y-0 md:divide-x">
        {items.map((it) => (
          <div key={it.label} className="px-2 py-7 md:px-6">
            <p className="font-display text-h6 text-forest">{it.label}</p>
            <p className="mt-1 text-micro tracking-wide text-ink-muted">{it.detail}</p>
          </div>
        ))}
        <div className="px-2 py-7 md:px-6">
          <FactPlaceholder
            label="Fourth credential — e.g. CAC-Registered (RC ____) or __ Estates Delivered"
            hint="Add one verifiable credential here"
          />
        </div>
      </Container>
    </section>
  );
}

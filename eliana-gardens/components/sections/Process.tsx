import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';

const steps = [
  { title: 'Inspect & confirm',  body: 'Visit the estate, walk your preferred plot, and reserve it on the spot.' },
  { title: 'Make payment',       body: 'Pay in full or via a flexible plan that fits your cash flow.' },
  { title: 'Complete documents', body: 'Sign and receive your purchase documents at each stage.' },
  { title: 'Receive allocation', body: 'Your specific plot is allocated and formally handed over.' },
];

export function Process() {
  return (
    <section className="bg-bone-50 py-section-y">
      <Container>
        <Reveal>
          <Eyebrow tone="forest">10 · The Process</Eyebrow>
          <h2 className="mt-5 max-w-[22ch] font-display text-h2 text-forest">
            Four clear steps to ownership.
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <div className="hairline mt-12" />
          <ol className="relative mt-2 grid grid-cols-1 md:grid-cols-4">
            {/* Horizontal connector — desktop only */}
            <span aria-hidden className="absolute left-0 right-0 top-12 hidden h-px bg-forest/15 md:block" />
            {steps.map((s, i) => (
              <li key={s.title} className="relative px-2 pb-6 pt-10 md:px-6 md:pt-12">
                <span className="absolute left-2 top-7 flex h-6 w-6 items-center justify-center rounded-full bg-bone-50 ring-1 ring-forest/30 font-display text-micro text-forest md:left-6">
                  {i + 1}
                </span>
                <p className="mt-4 font-display text-h5 text-forest">{s.title}</p>
                <p className="mt-2 max-w-[28ch] text-small text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}

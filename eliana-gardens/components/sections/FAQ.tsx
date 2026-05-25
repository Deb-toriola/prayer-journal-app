'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { FactPlaceholder } from '@/components/ui/FactPlaceholder';
import { FAQS } from '@/lib/constants';

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-bone-50 py-section-y-lg">
      <Container>
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow tone="forest">12 · Questions</Eyebrow>
              <h2 className="mt-5 font-display text-h2 text-forest">
                The hard questions, answered directly.
              </h2>
            </div>
            <p className="lg:col-span-5 max-w-reading text-body-lg text-ink-soft">
              Every answer below is written by the developer from real policy.
              No vague reassurance — only specifics buyers can act on.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <ul className="mt-12 border-t border-forest/15">
            {FAQS.map((q, i) => {
              const isOpen = open === i;
              return (
                <li key={q} className="border-b border-forest/15">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-baseline justify-between gap-6 py-6 text-left transition-colors hover:bg-bone-100"
                  >
                    <span className="flex items-baseline gap-5">
                      <span className="font-display text-micro text-ink-muted">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-h5 text-forest">{q}</span>
                    </span>
                    <span
                      aria-hidden
                      className={[
                        'shrink-0 text-h4 leading-none text-gold transition-transform duration-300 ease-out-expo',
                        isOpen ? 'rotate-45' : 'rotate-0',
                      ].join(' ')}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={[
                      'grid overflow-hidden transition-all duration-400 ease-out-expo',
                      isOpen ? 'grid-rows-[1fr] opacity-100 pb-7' : 'grid-rows-[0fr] opacity-0 pb-0',
                    ].join(' ')}
                  >
                    <div className="min-h-0">
                      <div className="ml-12 max-w-reading">
                        <FactPlaceholder
                          label="Client to write the real answer"
                          hint="Be specific. Vague answers lose trust faster than no answer."
                        />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}

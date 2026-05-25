import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { FactPlaceholder } from '@/components/ui/FactPlaceholder';

// Per the brief: do not invent testimonials. If no genuine material exists,
// omit the section at launch. This component renders an advisory block so the
// client sees the slot and the rule until they supply real material.
export function SocialProof() {
  return (
    <section className="bg-bone-100 py-section-y">
      <Container>
        <Reveal>
          <Eyebrow tone="forest">11 · Social Proof</Eyebrow>
          <h2 className="mt-5 max-w-[22ch] font-display text-h2 text-forest">
            Voices from people who have walked the land.
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <article
                key={i}
                className="relative border border-forest/15 bg-bone-50 p-7"
              >
                <p className="font-display text-h4 leading-none text-gold-400">&ldquo;</p>
                <div className="mt-4">
                  <FactPlaceholder
                    label="Real customer testimonial"
                    hint="One sentence, with the buyer's name and a real photo."
                  />
                </div>
                <p className="mt-6 text-micro tracking-[0.18em] uppercase text-ink-muted">
                  &mdash; [Customer name, role / city]
                </p>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <FactPlaceholder
              label="Inspection / allocation day photos"
              hint="Real attendees, daylight, branded backdrop. Build a small library."
            />
            <FactPlaceholder
              label="Short testimonial video (60–90s)"
              hint="One satisfied buyer to camera, ideally on the estate."
            />
          </div>
          <p className="mt-6 max-w-reading text-small text-ink-muted">
            This section should be omitted at launch if no genuine material
            exists yet — invented testimonials damage trust irreversibly.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

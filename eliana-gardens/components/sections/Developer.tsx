import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { FactPlaceholder } from '@/components/ui/FactPlaceholder';
import { PLACEHOLDERS, SITE } from '@/lib/constants';

// The single most important section — answers "will this company still exist
// after I pay?" Heavy use of FactPlaceholder so the client sees every fact
// they need to supply before launch.
export function Developer() {
  return (
    <section id="about" className="bg-forest text-bone py-section-y-lg">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Eyebrow tone="bone">01 · The Developer</Eyebrow>
            <h2 className="mt-5 font-display text-h2 text-bone">
              A real estate brand{' '}
              <span className="italic text-gold-200">you can stand on.</span>
            </h2>
            <p className="mt-7 max-w-reading text-body-lg text-bone/85">
              Eliana Gardens is developed by {SITE.developer}, a real estate
              company committed to verified land, transparent transactions, and
              well-planned estates across {SITE.state}.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7">
              <Stat label="Years in operation" value={PLACEHOLDERS.yearsInOperation} suffix="years" />
              <Stat label="Estates delivered"  value={PLACEHOLDERS.estatesDelivered} />
              <Stat label="CAC registration"   value={PLACEHOLDERS.rcNumber} />
              <Stat label="Office"             value="Verifiable address" placeholder />
            </div>
          </Reveal>

          <Reveal delay={140} className="lg:col-span-7">
            {/* Asymmetric image composition — large lead + offset secondary */}
            <div className="relative grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-9">
                <ImagePlaceholder
                  label="Founder / MD welcome video — 30–60s direct-to-camera. Office or estate backdrop, daylight."
                  aspect="video"
                  className="border-0"
                />
              </div>
              <div className="col-span-7 sm:col-span-5 -mt-12 sm:mt-12 sm:-ml-16 z-10 sm:col-start-8">
                <ImagePlaceholder
                  label="Team photo at the office or on-site — real people, daylight, no stock."
                  aspect="square"
                  tone="bone"
                  className="border-0"
                />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-8 border-t border-bone/15 pt-12 lg:grid-cols-3">
          <div>
            <Eyebrow tone="bone">Track record</Eyebrow>
            <p className="mt-4 text-body text-bone/85">
              Past and ongoing estates, total plots allocated to date, and
              independently verifiable references.
            </p>
            <div className="mt-4">
              <FactPlaceholder label="Names, photos, and plot counts of past/ongoing estates" />
            </div>
          </div>
          <div>
            <Eyebrow tone="bone">Leadership</Eyebrow>
            <p className="mt-4 text-body text-bone/85">
              Founder profile and key staff with photos — buyers trust faces, not logos.
            </p>
            <div className="mt-4">
              <FactPlaceholder label={`${PLACEHOLDERS.founderName} — short bio and photo`} />
            </div>
          </div>
          <div>
            <Eyebrow tone="bone">Find us</Eyebrow>
            <p className="mt-4 text-body text-bone/85">
              A physical office buyers can walk into matters more than any
              testimonial.
            </p>
            <div className="mt-4">
              <FactPlaceholder label={PLACEHOLDERS.officeAddress} hint="Embed Google Maps once supplied" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Stat({
  label,
  value,
  suffix,
  placeholder,
}: { label: string; value: string; suffix?: string; placeholder?: boolean }) {
  return (
    <div>
      <p className="font-display text-h3 leading-none text-gold-200">
        {value}
        {suffix && <span className="ml-1 text-h6 text-bone/70 font-sans tracking-normal"> {suffix}</span>}
      </p>
      <p className="mt-2 text-micro tracking-[0.18em] uppercase text-bone/60">{label}</p>
      {placeholder && <p className="mt-1 text-micro text-gold/80">(to supply)</p>}
    </div>
  );
}

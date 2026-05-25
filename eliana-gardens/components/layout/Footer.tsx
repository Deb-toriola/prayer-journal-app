import { Container } from '@/components/ui/Container';
import { FactPlaceholder } from '@/components/ui/FactPlaceholder';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { CONTACT, NAV_LINKS, PLACEHOLDERS, SITE, buildWhatsAppUrl } from '@/lib/constants';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-forest text-bone">
      <Container className="grid gap-14 py-section-y lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-display text-h3 leading-none">Eliana <span className="italic">Gardens</span></p>
          <p className="mt-3 text-small tracking-[0.18em] uppercase text-bone/60">
            A development by {SITE.developer}
          </p>
          <p className="mt-8 max-w-reading text-body-lg text-bone/85">
            A premium land estate in Itori, Ogun State — verified, well-planned, and offered
            at pre-launch prices ahead of the official market launch.
          </p>
        </div>

        <div className="lg:col-span-3">
          <Eyebrow tone="bone">Visit & contact</Eyebrow>
          <ul className="mt-5 space-y-3 text-small text-bone/85">
            <li>{SITE.estateAddress}</li>
            <li>
              <a href={`tel:${CONTACT.phoneTel}`} className="link-underline !text-bone">
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline !text-bone"
              >
                WhatsApp
              </a>
            </li>
            <li><FactPlaceholder inline label={PLACEHOLDERS.companyEmail} /></li>
            <li className="pt-2 text-bone/60">
              Office: <FactPlaceholder inline label={PLACEHOLDERS.officeAddress} />
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <Eyebrow tone="bone">Site</Eyebrow>
          <ul className="mt-5 space-y-3 text-small">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-underline !text-bone">{l.label}</a>
              </li>
            ))}
            <li><a href="#inspection" className="link-underline !text-bone">Book inspection</a></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <Eyebrow tone="bone">Follow</Eyebrow>
          <ul className="mt-5 space-y-3 text-small text-bone/85">
            <li>Instagram</li>
            <li>Facebook</li>
            <li>TikTok</li>
            <li>YouTube</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-bone/15">
        <Container className="flex flex-col gap-3 py-6 text-micro text-bone/60 md:flex-row md:items-center md:justify-between">
          <p>© {year} {SITE.developer}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <FactPlaceholder inline label={PLACEHOLDERS.rcNumber} />
            <span>· Prices and availability subject to change. No guaranteed returns.</span>
          </p>
        </Container>
      </div>
    </footer>
  );
}

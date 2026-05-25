import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { Analytics } from '@/components/layout/Analytics';
import { SITE, CONTACT } from '@/lib/constants';

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const display = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Premium Land in Itori, Ogun State`,
    template: `%s · ${SITE.name}`,
  },
  description:
    'Verified, well-planned land for sale at Itori, off the Lagos–Abeokuta Expressway. Pre-launch prices, flexible payment plans, guided site inspections.',
  keywords: [
    'land for sale in Itori',
    'estate in Abeokuta',
    'Ogun State land',
    'Eliana Gardens',
    'Dynamic Homes & Properties',
    'pre-launch land Ogun',
  ],
  alternates: { canonical: SITE.url },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Premium Land in Itori, Ogun State`,
    description:
      'A premium land estate at Itori, off the Lagos–Abeokuta Expressway. Verified, well-planned, pre-launch pricing.',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Premium Land in Itori`,
    description:
      'Verified land at Itori, Ogun State. Book a free guided site inspection.',
    images: ['/og.jpg'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#1B3A2F',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: SITE.developer,
  description: `Developer of ${SITE.name}, a premium land estate at Itori, Ogun State.`,
  url: SITE.url,
  telephone: CONTACT.phoneTel,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Dry Port, Itori, off Lagos–Abeokuta Expressway',
    addressLocality: SITE.city,
    addressRegion: SITE.state,
    addressCountry: 'NG',
  },
  areaServed: { '@type': 'AdministrativeArea', name: 'Ogun State, Nigeria' },
  makesOffer: {
    '@type': 'Offer',
    name: 'Pre-launch land plots',
    priceCurrency: 'NGN',
    availability: 'https://schema.org/InStock',
  },
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} scroll-smooth`}>
      <body className="antialiased">
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-forest focus:text-bone focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Nav />
        <main id="top">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}

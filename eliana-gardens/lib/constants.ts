// Single source of truth for client-supplied facts.
// Anything that should be a [PLACEHOLDER] in the UI is exported from here
// so the client can find every editable string in one file.

export const SITE = {
  name: 'Eliana Gardens',
  developer: 'Dynamic Homes & Properties',
  tagline: 'Love at First Site',
  url: 'https://elianagardens.ng', // update when domain confirmed
  estateAddress: 'Dry Port, Itori, off Lagos–Abeokuta Expressway, Ogun State, Nigeria',
  city: 'Itori',
  state: 'Ogun State',
  country: 'Nigeria',
};

export const CONTACT = {
  phoneDisplay: '0903 170 2175',
  phoneTel: '+2349031702175',
  whatsappNumber: '2349031702175',
  // Pre-filled WhatsApp message for the floating button / generic CTA
  whatsappMessage:
    "Hello Eliana Gardens — I'd like to receive the price list and book a site inspection.",
};

export const PLACEHOLDERS = {
  rcNumber: 'RC __________',
  yearsInOperation: '__',
  estatesDelivered: '__',
  officeAddress: '[Verified office address — to be supplied]',
  founderName: '[Founder / MD name]',
  preLaunchEndDate: '[Pre-launch end date]',
  titleStatus: '[Exact title status — to be confirmed by client]',
  acquisitionStatus: '[Confirmation that land is free from government acquisition]',
  companyEmail: '[official@elianagardens.ng]',
} as const;

export const PRICING = [
  {
    label: 'Residential Plot',
    size: '300 sqm',
    price: 1_500_000,
    deposit: 500_000,
    perSqm: 5_000,
    note: 'Pre-launch price',
  },
  {
    label: 'Residential Plot',
    size: '600 sqm',
    price: 3_000_000,
    deposit: 500_000,
    perSqm: 5_000,
    note: 'Pre-launch price',
  },
  {
    label: 'Acre Package (300 sqm plots)',
    size: 'Full acre',
    price: 9_000_000,
    deposit: 3_000_000,
    perSqm: null,
    note: 'Bulk allocation',
  },
  {
    label: 'Acre Package (600 sqm plots)',
    size: 'Full acre',
    price: 18_000_000,
    deposit: 3_000_000,
    perSqm: null,
    note: 'Bulk allocation',
  },
] as const;

export const PAYMENT_PLANS = [
  {
    name: 'Outright Payment',
    headline: 'Pay in full',
    detail: 'Fastest route to allocation and documentation.',
    badge: 'Recommended',
  },
  {
    name: '3-Month Plan',
    headline: 'Spread over 3 months',
    detail: 'Interest-free instalments after initial deposit.',
    badge: 'Interest-free',
  },
  {
    name: '6-Month Plan',
    headline: 'Spread over 6 months',
    detail: 'Interest-free initial period, 10% interest thereafter.',
    badge: 'Flexible',
  },
] as const;

export interface Landmark {
  name: string;
  kind: string;
  proposed?: boolean;
}

export const LANDMARKS: readonly Landmark[] = [
  { name: 'Lagos–Abeokuta Expressway',      kind: 'Direct access route' },
  { name: 'Itori Train Station / Dry Port', kind: 'Freight & transport hub' },
  { name: 'Dangote Cement Plant, Ibese',    kind: 'Major employer' },
  { name: 'Lafarge Cement Plant, Ewekoro',  kind: 'Major employer' },
  { name: 'Adegbenro ICT Polytechnic',      kind: 'Institutional presence' },
  { name: 'Wasimi Passenger Airport',       kind: 'Proposed', proposed: true },
  { name: 'Papalanto–Mowe Interchange',     kind: 'Connectivity' },
];

export const FAQS = [
  'Is the land free from government acquisition or any dispute?',
  'What title document do I get, and when?',
  'Is the estate fenced and gated?',
  'Can I buy from abroad without visiting? How does that work?',
  'How soon after payment is my plot allocated?',
  'Can I resell my plot later? Do you assist with resale?',
  'Are there extra charges beyond the plot price (survey, deed, development levy)?',
  'What happens if I miss an instalment payment?',
] as const;

export const NAV_LINKS = [
  { href: '#about',         label: 'About' },
  { href: '#location',      label: 'Location' },
  { href: '#pricing',       label: 'Pricing' },
  { href: '#documentation', label: 'Documentation' },
  { href: '#faq',           label: 'FAQ' },
] as const;

export const formatNaira = (n: number) =>
  `₦${n.toLocaleString('en-NG')}`;

export const buildWhatsAppUrl = (message: string = CONTACT.whatsappMessage) =>
  `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;

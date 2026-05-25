# Eliana Gardens — Marketing Site

A premium one-page marketing site for **Eliana Gardens**, a land estate by
Dynamic Homes & Properties in Itori, Ogun State.

Built per `CLAUDE.md` (build rules) and `PROJECT-BRIEF.md` (content spec).

## Stack

- Next.js 14 (App Router) · React 18 · TypeScript
- Tailwind CSS with a locked design system (forest green + antique gold + neutrals)
- Inter (body) + Playfair Display (display) via `next/font`
- API route at `/api/inspection` posts leads via an abstracted notify helper

## Local development

```bash
cd eliana-gardens
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # tsc --noEmit
npm run build        # production build
```

## Environment

Copy `.env.example` to `.env.local`. All variables are optional:

- `NEXT_PUBLIC_GA_ID` — Google Analytics 4
- `NEXT_PUBLIC_META_PIXEL_ID` — Meta Pixel
- `RESEND_API_KEY` + `INSPECTION_NOTIFY_EMAIL` — email delivery for leads
  (leads log to stdout if absent, so nothing is silently dropped)

## Project layout

```
app/
  layout.tsx              # root layout, fonts, metadata, JSON-LD
  page.tsx                # composes the one-pager
  globals.css             # tokens, base styles, button/link components
  api/inspection/route.ts # form endpoint
  not-found.tsx           # custom 404
  sitemap.ts robots.ts    # SEO

components/
  layout/                 # Nav, Footer, WhatsAppFloat, Analytics
  ui/                     # Container, Eyebrow, Reveal, Image/FactPlaceholder
  sections/               # one file per scroll section (Hero, Location, …)

lib/
  constants.ts            # all client-supplied facts and placeholders
  notify.ts               # email helper (swap providers here)
  analytics.ts            # GA / Pixel helpers
```

## Editing copy

Every editable string lives in `lib/constants.ts` or directly in the relevant
`components/sections/*.tsx` file. Each section is self-contained so non-engineers
can edit copy with minimal risk.

## Placeholders to fill before launch

The site renders **visible** placeholders for every fact only the client can
supply (RC number, exact title status, drive times, etc.). Search the codebase
for `FactPlaceholder` and `ImagePlaceholder` to find every slot — these must
all be resolved before the site goes public.

# Aptrive — Website (Next.js + Tailwind CSS)

This is the full source code for the Aptrive marketing site, hand-coded
with Next.js (App Router) + TypeScript + Tailwind CSS v4. No website
builder, no CMS — everything is plain, editable code.

## 1. Prerequisites

Install Node.js (version 20 or later) from https://nodejs.org — this
gives you `node` and `npm`. Verify with:

```bash
node -v
npm -v
```

## 2. Install dependencies

From inside the `aptrive/` folder:

```bash
npm install
```

## 3. Run it locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser. The site hot-reloads as you
edit files.

## 4. Build for production

```bash
npm run build
npm start
```

`npm run build` compiles and type-checks the whole site; fix any errors
it reports before deploying.

## 5. Deploy

The easiest path is **Vercel** (made by the creators of Next.js, free
tier is enough for a site like this):

1. Push this folder to a GitHub repository.
2. Go to https://vercel.com, sign in with GitHub, click "New Project",
   select the repo, click Deploy. No configuration needed.

Alternatively, `npm run build` followed by `npm start` works on any
Node.js host (Render, Railway, a VPS, etc.).

## 6. Project structure

```
app/
  layout.tsx          Root layout — fonts, <Header>/<Footer> wrapper, metadata
  globals.css          Design tokens (colors, fonts) + base styles
  page.tsx              Home page
  courses/page.tsx       Courses listing
  courses/nust-net/page.tsx   NUST NET exam detail page
  calculator/page.tsx     University Aggregate Calculator
  about/page.tsx          About page
  contact/page.tsx         Contact page
components/
  Header.tsx, Footer.tsx     Site-wide nav/footer (icon-only logo)
  StatCounter.tsx              Animated stat used in the hero
  AttributeTicker.tsx           Scrolling brand-attributes strip
  TickDivider.tsx                Calibration-tick section divider
  ContactForm.tsx                  Contact form (client component)
  AggregateCalculator.tsx           University aggregate calculator (client)
lib/
  universities.ts       Aggregate formula data for each university —
                          edit this file to add a university or fix a formula
public/
  logo-mark.png          Icon-only logo (transparent, for header/footer)
  app-icon.png            Icon-only logo (rounded-square version, favicon)
```

Each page is a separate route folder under `app/`, matching how Next.js
maps folders to URLs. To add a new page (e.g. Pricing), create
`app/pricing/page.tsx` — it will automatically be served at `/pricing`.

## 6b. University Aggregate Calculator

`app/calculator/page.tsx` is a real, working feature: pick a university,
enter Matric/FSc/Entry Test marks, and it calculates your aggregate using
that university's own published merit formula (not a generic guess).

- All formulas live in **`lib/universities.ts`** — one array, one object
  per university. To fix a formula or add a university, edit this file
  only; the calculator UI adapts automatically to however many
  components (Matric/FSc/Test) that university's formula has.
- Universities marked `verified: false` (currently UMT and UCP) show a
  "formula not yet confirmed" message instead of a number — this is
  intentional. Don't flip that flag to `true` until you've confirmed the
  real formula on the university's own admissions site; showing a wrong
  aggregate is worse than showing nothing.
- GIKI and PIEAS formulas come from third-party prep sources that don't
  fully agree with each other — double-check those two against
  giki.edu.pk / admissions.pieas.edu.pk before treating them as final.

## 7. Design system (edit these to rebrand)

All colors and fonts live in **`app/globals.css`**, under `:root` and
`@theme inline`. Change a hex value there and it updates everywhere.

- `--graphite` — page background
- `--panel` — card/section background
- `--fg` — main text
- `--muted` — secondary text
- `--teal` — primary accent (links, highlights, buttons)
- `--gold` — reserved accent for achievement/rank moments (used sparingly)

Fonts are loaded in `app/layout.tsx` via `next/font/google`:
- **Space Grotesk** — headings (`font-display` class)
- **Inter** — body text (default)
- **IBM Plex Mono** — stats, labels, data (`font-mono-data` class)

## 8. Wire up the contact form

`components/ContactForm.tsx` currently just shows a "Message sent"
state on submit — it doesn't send anything yet. To make it functional,
pick one:

- **Simplest**: use a form backend like Formspree (https://formspree.io)
  — point the form's `action` at your Formspree endpoint.
- **Full control**: create `app/api/contact/route.ts` as a Next.js API
  route that sends an email (e.g. via Resend or Nodemailer), and call it
  with `fetch("/api/contact", { method: "POST", body: ... })` from
  `handleSubmit` in `ContactForm.tsx`.

## 9. Adding a new exam track (e.g. ECAT)

1. Duplicate `app/courses/nust-net/page.tsx` into `app/courses/ecat/page.tsx`
   and update the copy/syllabus.
2. In `app/courses/page.tsx`, move the `ecat` entry's `active` flag to
   `true` so it links instead of showing "Coming soon".

## 10. What's not included yet (by design)

Pricing, testimonials/results, and a blog were deliberately left out of
v1 — showing empty pricing tiers or fake testimonials would hurt a
premium brand more than not having the page yet. Add them once you have
real numbers and real student results.

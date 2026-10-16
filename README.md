# Ridham Chawala — AI Product Manager portfolio

An immersive, motion-rich portfolio for an AI product leader. It has a 3D hero, a product and impact dashboard, live product-thinking demos, and a Motion controls panel so visitors choose how much movement they want.

**Stack:** Next.js 15 (App Router, static generation) · TypeScript strict · Tailwind CSS v4 · Framer Motion 12 · React Three Fiber 9 + drei 10 · Recharts 3 · Zustand 5 · ESLint 9 · Prettier · Vitest + Testing Library.

## Quick start

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000.

| Script | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build; every route is pre-rendered as static HTML |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript + jsx-a11y rules) |
| `npm run typecheck` | `tsc --noEmit` in strict mode |
| `npm test` | Vitest unit and component tests |
| `npm run check` | lint → typecheck → test → build, in that order |
| `npm run format` | Prettier with the Tailwind class-sorting plugin |

Requires Node 20 or newer (built and tested on Node 24).

## Environment variables

| Name | Required | Default | Used for |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | No | Vercel production URL, else the address in `profile.ts` | Canonical URLs, Open Graph, `sitemap.xml`, `robots.txt`, JSON-LD |

Copy `.env.example` to `.env.local` to override. No secrets are used anywhere, and the site sends no analytics.

## Deploy

**Live site:** https://ridhamkamal.github.io/ridham-portfolio/

**GitHub Pages (current).** `.github/workflows/pages.yml` runs lint, typecheck and tests, builds a static export (`npm run build:pages`) and publishes `out/` on every push to `main`. Nothing else to configure. To check the static build locally, run:

```bash
npm run build:pages
```

The Pages build differs from `npm run build` in three ways: `output: "export"`, images served unoptimized, and the `/ridham-portfolio` base path. Raw paths to files in `public/` go through `asset()` in `src/lib/asset.ts`, so they get the base path.

**Vercel or any Node host.** `npm run build`, then `npm run start`. On Vercel the canonical URL comes from `VERCEL_PROJECT_PRODUCTION_URL` automatically. For a custom domain, set `NEXT_PUBLIC_SITE_URL`.

## Editing content

All copy, numbers and links live in typed files in `src/data/`. Components never hard-code portfolio content.

| File | Holds |
|---|---|
| `profile.ts` | Name, positioning, contact links, bio, education, certifications, skills, testimonial, résumé link |
| `metrics.ts` | Every number, with its owner (`context`) and evidence tier (`provenance`) |
| `projects.ts` | The four projects, their links, and the 11-part case-study content |
| `experience.ts` | Roles with ISO `yyyy-mm` dates; `end: null` means current |
| `wonderword.ts` | Screenshots, the product bet, the six-stage journey, pricing, targets, roadmap |
| `playground.ts` | Guardrail word lists and presets, pricing simulator baseline and ranges, the four decisions |

Rules the types enforce:
- Missing information is a `Todo` (`{ todo: "…" }`), never an invented value. Case-study sections whose value is a `Todo` are hidden.
- Every metric carries a `provenance`: `measured`, `validated`, `partly-validated`, `in-test`, `hypothesis`, `modeled`, `research`, `target` or `demo`. The UI renders a matching badge, and modeled series are dashed.
- Copy prefixed `DRAFT (review):` shows with a Draft badge in development and is compiled out of production builds. Two concept-project hypotheses are drafts today; edit them in `projects.ts` and remove the `PROD ? AWAITING_REVIEW :` guard to publish.

Modeled WonderWord numbers come from `src/lib/projection.ts`. Its assumptions are exported and shown on the dashboard.

## Project structure

```
src/
  app/                      routes, layouts, metadata, robots, sitemap, OG image, icon
    work/[slug]/            statically generated case studies
  components/
    motion/                 motion store, provider, panel, cursor and the primitives
    three/                  R3F hero scene (lazy), WebGL detection, SVG fallback
    dashboard/              ChartCard, lazy Recharts charts, dashboard sections, palette
    case-studies/           case-study layout, sticky TOC, gallery, journey curve, flows
    interactive/            guardrail checker, pricing simulator, decision explorer
    home/ work/ experience/ layout/ ui/
  data/                     typed content model (single source of truth)
  hooks/                    useMotionPrefs, usePointerFine
  lib/                      guardrail + pricing formulas, projection, SEO, dates, view transitions
  styles/globals.css        design tokens and Tailwind v4 theme
public/                     images extracted from portfolio1.html, résumé PDF
tests/                      Vitest suites
docs/                       architecture, content audit, motion & a11y guide, quality checklist
```

More detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/MOTION_AND_ACCESSIBILITY.md](docs/MOTION_AND_ACCESSIBILITY.md), [docs/QUALITY_CHECKLIST.md](docs/QUALITY_CHECKLIST.md), [docs/CONTENT_AUDIT.md](docs/CONTENT_AUDIT.md).

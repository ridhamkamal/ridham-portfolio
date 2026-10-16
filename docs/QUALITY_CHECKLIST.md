# Performance and accessibility checklist

Status as of 2026-10-15. ✅ = verified in this build · ⬜ = needs a manual pass on the deployed site.

## Build gates
- ✅ `npm run lint`: 0 errors, 0 warnings
- ✅ `npm run typecheck`: strict, `noUncheckedIndexedAccess`, 0 errors
- ✅ `npm test`: 24/24 passing (guardrail and pricing parity with portfolio1.html, projection anchors, filters, content integrity, motion store, Motion panel, copy email, decision explorer)
- ✅ `npm run build`: 18 routes, all static (SSG); shared JS 103 kB; largest route first load 191 kB

## Performance
- ✅ Three.js, R3F and drei load in a separate chunk, only in the browser, after first paint
- ✅ Recharts is code-split per chart (`LazyCharts.tsx`); each playground demo is its own chunk
- ✅ Hero headline, copy and CTAs animate with CSS and paint before hydration (no JS-gated LCP)
- ✅ The landing page is never hidden by the page transition
- ✅ Canvas DPR capped at 1.75; render loop stops offscreen and when motion is off
- ✅ Images go through `next/image` (AVIF/WebP, responsive `sizes`), with explicit dimensions so there is no layout shift
- ✅ Only transform/opacity animations in UI primitives; scroll effects bypass React re-renders
- ⬜ Lighthouse on the deployed URL (mobile and desktop); targets: 90+ Performance, 100 Accessibility, Best Practices and SEO

## Accessibility
- ✅ axe-core: 0 violations on 11 routes
- ✅ One `h1` per page; landmarks; skip link
- ✅ Keyboard: nav, mobile menu, filters, tabs, sliders, radio groups, dialogs, chart/table toggles
- ✅ Reduced-motion defaults (unit-tested); motion preferences persist across reloads (verified in the browser)
- ✅ 360px: no horizontal scroll on any route
- ⬜ VoiceOver (Safari) and NVDA (Firefox) pass through home, a case study, the dashboard and the playground
- ⬜ Visual check at 768px and 1024px on a real tablet

## SEO
- ✅ Per-route `title`, `description`, canonical, Open Graph, Twitter card
- ✅ Generated OG image (`/opengraph-image`)
- ✅ JSON-LD: `Person` (all pages), `CreativeWork` + `BreadcrumbList` (case studies)
- ✅ `robots.txt`, `sitemap.xml` (11 URLs); 404 is `noindex`
- ⬜ Confirm `NEXT_PUBLIC_SITE_URL` matches the final domain

## Content
- ✅ No invented metrics, testimonials, employers, dates or URLs (see CONTENT_AUDIT.md)
- ✅ Measured, target, modeled, research and demo values are labelled everywhere they appear
- ✅ Drafted hypotheses are compiled out of production builds
- ✅ External links: 8 of 11 return 200 to an automated check
- ⬜ Click through the Figma file (bot check returned 403) and both LinkedIn profiles (LinkedIn returns 999 to bots) while signed out, to confirm they are public
- ⬜ Confirm the two claude.ai artifact links (prototype, product brief) open for a signed-out visitor

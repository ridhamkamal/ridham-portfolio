# Architecture

As built (2026-10-15). Stack: Next.js 15.5 (App Router, all routes static), TypeScript strict, Tailwind CSS v4, Framer Motion 12, React Three Fiber 9 + drei 10, Recharts 3, Zustand 5, ESLint 9 + Prettier, Vitest + Testing Library. Accessibility was audited with axe-core in the browser; see QUALITY_CHECKLIST.md.

## 1. Sitemap

| Route | Rendering | Purpose | h1 |
|---|---|---|---|
| `/` | SSG | 11-section home | “I build AI products that children, parents, and regulators can all trust.” |
| `/work` | SSG | Filterable grid of 4 projects | Selected work |
| `/work/[slug]` | SSG via `generateStaticParams` (4 slugs) | 11-part case study | Project title |
| `/dashboard` | SSG shell, charts lazy | Product and impact dashboard | Product and impact dashboard |
| `/playground` | SSG shell, demos lazy | Guardrail checker, pricing simulator, decision explorer | Product thinking, running |
| `/experience` | SSG | Concurrent-lane timeline | Experience |
| `/about` | SSG | Bio, principles, education, certifications, skills, testimonial | About Ridham |
| `/contact` | SSG | Email, copy, LinkedIn, GitHub | Get in touch |
| `not-found` | Static | Custom 404 with links back | Page not found |
| `robots.txt`, `sitemap.xml` | `app/robots.ts`, `app/sitemap.ts` | Generated from `projects` | — |

Metadata: `generateMetadata` per route from `src/data`; JSON-LD `Person` (home and about), `CreativeWork` (each case study), `BreadcrumbList` (case studies). The domain is a TODO.

## 2. Component architecture

The full file tree is in the README. Key boundaries:

- `src/data/*`: typed content, no React.
- `src/lib/*`: pure logic (guardrail, pricing, projection, SEO, dates). It is unit-tested.
- `src/components/motion/*`: the motion store, provider, panel, cursor and primitives. Everything animated reads `useMotionPrefs()`.
- `src/components/three/*`: `HeroCanvas` (client wrapper: WebGL probe, visibility, scroll ref, error boundary) dynamically imports `HeroScene` (R3F).
- `src/components/dashboard/*`: `ChartCard` (title, explanation, badge, chart/table toggle). `LazyCharts` wraps every Recharts chart in `next/dynamic`.
- Pages are server components. Interactive islands are client components.

Server components by default. Only motion wrappers, the canvas, charts and the three demos are client components. Each is lazy where the brief asks. Content renders in HTML on the server, so the site reads without JS, WebGL or animation.

## 3. Design tokens

- **Color:** bg `#0B0B0F`, surface `#14141B`, raised `#1C1C26`, text `#F4EFE6` (warm white, ~17:1 on bg), muted `#B4AEA4` (≥7:1), violet `#8B7CF6`, cyan `#5ED3E8`, gradient violet→cyan for accents only (never behind body text). Provenance colours: measured (cyan), validated (green), partly validated/in test (amber), hypothesis (violet), modeled (dashed outline + “Modeled” label, never colour alone), research (grey), demo (striped).
- **Type:** Archivo (display, variable width) and Newsreader (body serif), as in the source. Fluid scale `clamp()` from 14 to 96 px. Body 18 px, 1.6 line height.
- **Space and radius:** 4-pt grid; radius 8/14/22/32; elevation 0–4 as shadow plus border-light pairs.
- **Motion:** durations 150/300/600/900 ms × speed multiplier; easings `out-expo`, `spring-soft` (stiffness 180, damping 22), `spring-snappy`.

## 4. Motion system

```ts
type Intensity = "subtle" | "balanced" | "cinematic";
interface MotionPrefs {
  enabled: boolean; intensity: Intensity; tilt: boolean; parallax: boolean;
  cursor: boolean; speed: 0.5 | 1 | 1.5;
}
```

- **Store:** Zustand with `persist` (localStorage key `rc-motion-v1`, wrapped in try/catch). On first visit with `prefers-reduced-motion: reduce`, defaults are `{enabled:false, intensity:"subtle", tilt:false, parallax:false, cursor:false}`. The user can opt in, and their choice wins after that.
- **Resolved values:** `useMotionPrefs()` returns `scale` (subtle 0.4, balanced 1, cinematic 1.6), so every primitive multiplies its distance, rotation and parallax depth by one number. Tilt max: 6° large / 8° medium / 10° small cards × scale, clamped at 10°.
- **Gating:** when `enabled` is false, primitives render children with no motion wrapper. Tilt, cursor and magnetic effects also need `(pointer: fine)` and `(hover: hover)`.
- **Panel:** button in the nav and footer opens a non-modal dialog (`role="dialog"`, labelled, focus moved in, Escape and outside-click close, focus returned). Uses radio groups for intensity and speed, switches (`role="switch"`) for the toggles, and a Reset button with a live-region confirmation. Bottom sheet on mobile.
- **Cursor:** dot plus spring ring rendered in a `pointer-events:none` fixed layer. State comes from `data-cursor="link|external|drag|3d"` on targets. Hidden over inputs, textareas and selected text. Never takes focus.
- **Performance:** only `transform` and `opacity` animate. Scroll effects use `useScroll` with `useTransform`, so there are no React re-renders. The R3F `frameloop` is `"demand"` while off-screen (IntersectionObserver) or when motion is off. DPR is capped at `[1, 1.75]`.

## 5. 3D hero

The canvas is `aria-hidden`, has `tabIndex=-1`, sits behind the HTML headline and CTAs, and loads with `next/dynamic` after first paint. Skeleton: a gradient blob plus panel outlines in CSS.

Scene: a central glassy torus-knot “product core” (`MeshTransmissionMaterial`, low samples). Three rounded panels labelled visually as Enterprise AI, Consumer AI and Responsible decisions (no readable text in the canvas, so no content lives only in 3D). There are ~400 instanced particles and an environment preset for reflections.

Interaction: pointer drives camera parallax and core rotation. Scroll progress over the hero drives camera dolly and panel spread. Elements enter with staggered springs.

Fallbacks: a WebGL probe failure or context loss swaps in `HeroFallback`, an SVG composition of the same layout. When motion is off, the canvas renders a single frame.

## 6. Dashboard data model

Every chart is a `ChartCard`:

```ts
interface ChartSpec<Row> {
  id: string; title: string; explanation: string;
  provenance: Provenance;            // badge + legend; "modeled" forces dashed series
  rows: readonly Row[];              // same rows drive chart AND <table>
  columns: { key: keyof Row; label: string; format?: (v: unknown) => string }[];
  summary: string;                   // text alternative / aria-describedby
  todo?: string;                     // renders "Data pending confirmation" instead of chart
}
```

| Section | Charts | Rows from | Provenance |
|---|---|---|---|
| Career impact | Gantt-style concurrent-lane timeline; metrics-by-org bars; filters enterprise AI / consumer AI / analytics / delivery | `roles`, `metrics` via `metricIds` | measured |
| WonderWord beta | 100+ families counter; concept-to-beta (4 weeks) marker; roadmap to Mar 2027; tier comparison; paid-mix donut 70/20/10; MRR line; free vs paying; margin band 47–61% | `wonderword.ts` | measured (families), target, **modeled** (all revenue/users) |
| Enterprise delivery | Four separate stat tiles with context lines, not one combined chart, so nothing reads as a sum | `enterpriseMetrics` | measured |
| Product-thinking demos | Guardrail preset results (4 rows); simulator baseline vs current; decision explorer choices in this session only | `playground.ts` + local state | demo |

Charts with unresolved TODOs (MRR months, free vs paying, roadmap dates) render the explanation and a “Data pending confirmation” state until you supply the values. No values are fabricated.

Interactions: keyboard-focusable data points with tooltips that also show on focus, a chart/table toggle, filters announced through `aria-live="polite"`, Tilt3D on cards, and a ParallaxLayer background.

## 7. Testing and quality gates

- Vitest: `tests/logic.test.ts` (guardrail presets 100/25/75/75, pricing baseline and bands, projection anchors, filters), `tests/content.test.ts` (content integrity), `tests/motion.test.tsx` (store defaults, persistence, reset, Motion panel keyboard flow), `tests/components.test.tsx` (copy email, decision explorer).
- Browser checks run against the production build: axe-core on 11 routes, 360px overflow, Motion preference persistence across reloads, console free of errors.
- Remaining manual checks are listed in QUALITY_CHECKLIST.md.

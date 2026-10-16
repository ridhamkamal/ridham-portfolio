# Motion and accessibility

## Motion system

### Global preferences

`src/components/motion/store.ts` (Zustand) holds:

| Setting | Values | Default | Reduced-motion default |
|---|---|---|---|
| `enabled` | on / off | on | **off** |
| `intensity` | subtle (×0.4) / balanced (×1) / cinematic (×1.6) | balanced | subtle |
| `tilt` | on / off | on | off |
| `parallax` | on / off | on | off |
| `cursor` | on / off | on | off |
| `speed` | 0.5× / 1× / 1.5× | 1× | 1× |

- **Persistence.** Settings live in `localStorage` key `rc-motion-v1`. Every read and write is wrapped in try/catch and sanitised, so corrupt or blocked storage falls back to defaults.
- **Reduced motion.** On first visit, `prefers-reduced-motion: reduce` selects the reduced defaults. A saved choice always wins after that. While no choice is saved, the site follows OS setting changes live.
- **Reset to defaults** clears storage and returns to the defaults that match the OS setting.
- **`MotionProvider`** mirrors the state onto `<html data-motion data-cursor>` and the `--motion-speed` CSS variable. It also sets Framer's `MotionConfig reducedMotion`, so even third-party motion components obey the setting.
- **`useMotionPrefs()`** is the only thing primitives read. It resolves `scale` (the intensity multiplier, 0 when off), `dur(s)` (duration ÷ speed), and capability flags. `tilt`, `cursor` and `hover` are true only with a fine, hover-capable pointer.

### Primitives (`src/components/motion`)

| Primitive | Behaviour | Off / reduced |
|---|---|---|
| `FadeIn`, `SlideIn`, `ScaleIn` | Reveal once on entering the viewport | Shown immediately |
| `StaggerChildren` + `StaggerItem` | Staggered group reveal | All shown at once |
| `TextReveal` | Word-by-word headline rise, in **CSS** so it runs before hydration | No animation |
| `ScrollReveal` | Scroll-linked depth reveal (rotateX + rise) | Static |
| `ParallaxLayer` | Moves at a different scroll speed | Static (parallax toggle) |
| `Tilt3D` | Perspective tilt, depth, shadow, glare, spring return. Max 10° small / 8° medium / 6° large; 2.5° on panels with sliders | Plain wrapper |
| `MagneticHover` | Pulls toward the pointer | Plain wrapper |
| `HoverLift` | Lifts on hover or focus | None |
| `GlowHover` | Pointer-tracking radial glow | None |
| `PressFeedback` | Scales on press | None |
| `CursorFollow` | Section glow that follows the pointer | Not rendered |
| `ScrollProgressBar` | `role="progressbar"` with live `aria-valuenow` | Unsmoothed |
| `PageTransition` | Fade/rise on client navigation only; never hides the landing page | None |
| `AnimatedCounter` | Count-up when visible; the final value is server-rendered and read by screen readers | Final value |
| `AnimatedChart` | Reveals a chart and tells it whether to animate | Instant |
| `MotionToggle` | Accessible switch | — |
| `MotionPanel` | Floating settings dialog | — |

Only `transform` and `opacity` animate (plus SVG `pathLength` and chart internals). Scroll effects use Framer motion values, so they do not re-render React.

### 3D hero

- Loaded with `next/dynamic` (`ssr: false`) into its own chunk, behind a shimmering skeleton.
- `aria-hidden`, `tabIndex=-1`, `pointer-events: none`. It holds no readable content; the headline and CTAs are HTML.
- Pointer input comes from `document.body`, so the canvas never intercepts clicks.
- `frameloop`: `always` when visible with motion on, `demand` (one frame) with motion off, `never` when offscreen (IntersectionObserver).
- DPR is capped at 1.75. Lighting uses in-scene `Lightformer`s, so no HDR files are fetched.
- Fallbacks: no WebGL, a render error (error boundary) or context loss all swap in `HeroFallback`, an SVG of the same composition. `<noscript>` renders it too.

### Custom cursor

Shown only with a fine pointer and cursor effects on. Two fixed `aria-hidden` layers (a dot and a spring ring) with `pointer-events: none`. States come from the hovered element: link, external (`↗`), drag (`↔`, sliders), 3D (`data-cursor="3d"`), and text (thin caret). Over inputs and editable text the custom cursor hides and the native cursor returns. Text elements keep the native I-beam for selection.

## Accessibility (WCAG 2.2 AA)

- **Structure.** Skip link, `header`/`nav`/`main`/`footer` landmarks, one `h1` per page (verified), and logical heading levels. Components take a `level` prop so they nest correctly where reused.
- **Keyboard.** Every control is a native button, link or input. Tabs use roving `tabIndex` with arrow keys (gallery, journey, decisions). Radio groups in the Motion panel support arrow keys. The lightbox uses native `<dialog>` with focus trapping and Escape. The Motion panel returns focus to its opener.
- **Focus.** A global `:focus-visible` outline (cyan, 2px, offset 3px) is never removed.
- **Contrast.** Text tokens on the background: primary 17.6:1, muted 8.4:1, faint 5.0:1. Chart series colors pass the dataviz validator against the chart surface: lightness band, chroma, CVD ΔE ≥ 8, normal-vision floor and 3:1 contrast. Text never uses series colors.
- **Not color alone.** Evidence badges always carry a text label. Modeled series are dashed and labelled. Pass/fail states have ✓/✕ icons plus text.
- **Live regions.** Filter result counts, guardrail score and failures, the pricing margin message, the decision reveal, copy-email confirmation and Motion reset.
- **Charts.** Every chart has a title, an explanation, an evidence badge, a screen-reader summary, a Chart/Table toggle over the same rows, and a `<noscript>` table. Recharts' accessibility layer allows arrow-key tooltip navigation.
- **No hover-only content.** Tilt, glow and magnetic effects are decorative. All information is in static text.
- **Without JavaScript.** Content is server-rendered. A `<noscript>` rule forces reveal-animated elements visible, and the hero shows the SVG composition.
- **No flashing.** Nothing flashes or strobes. The only looping animations are the availability dot and the diagram dashes, and both stop when motion is off.

### How this was verified
- axe-core 4 (WCAG 2A/2AA/2.1AA/2.2AA plus best-practice) on `/`, `/work`, all four case studies, `/dashboard`, `/playground`, `/experience`, `/about` and `/contact`: **0 violations**.
- Horizontal overflow check at 360px on every route: none.
- Component tests cover Motion panel keyboard operation, persistence and reset, the copy-email announcement, and decision-explorer gating.
- Still to do by hand: a full screen-reader pass (VoiceOver/NVDA) and a Lighthouse run on the deployed URL. See the checklist.

# Content audit

Sources of truth: `portfolio1.html` (983 lines, 375 KB; six embedded JPEGs) and the résumé `ridham-AI PM.pdf` (2 pages, read 2026-10-15). Every item below maps to a typed field in `src/data/`. Nothing on the site may come from anywhere else.

## 1. Sourced content

| Area | Data file | Source section in portfolio1.html |
|---|---|---|
| Name, title, location, availability, hero copy, SEO and OG meta | `profile.ts` | `<head>`, `#top` |
| Headshot (520×520); WonderWord AI logo (520×616, was the source favicon) | `public/images/headshot.jpg`, `wonderword-logo.jpg` | `#top` img, `<link rel=icon>` |
| Impact strip: 8 yrs · 15+ integrations · 37% · 100+ families | `metrics.ts` | `#top` |
| All other figures: 28%, 22%, 50+ VoC, 30% scope, 8+ AI products, 8 eng + 2.5 FTE | `metrics.ts` | `#experience`, `#work` |
| Four projects: summary, problem, highlights, links, boundaries | `projects.ts` | `#work` |
| Four product screenshots with captions and alt text | `wonderword.ts` + `public/images/wonderword-*.jpg` | `#product` |
| The bet, three findings with evidence status, falsification condition | `wonderword.ts` | `#bet` |
| Six-stage journey with valence, pain, intervention, figures | `wonderword.ts` | `<script>` array `J` |
| Pricing tiers, projected mix 70/20/10, annual prices, “annual billing last” | `wonderword.ts` | `#model` |
| Story guardrail word lists, thresholds, four presets, disclaimer | `playground.ts`, `lib/guardrail.ts` | `#playground`, `<script>` guardrail |
| Pricing simulator baseline, ranges, formulas, assumptions, margin messages | `playground.ts`, `lib/pricing.ts` | `#playground`, `<script>` economics |
| Four decisions with options, answer, evidence, tradeoff, change-mind | `playground.ts` | `<script>` array `DEC` |
| Six roles with dates, locations, bullets | `experience.ts` | `#experience` |
| Three principles (“buyer is not the user” …) | `profile.ts` → `about.principles` | `#experience` footer |
| Bio, bridge narrative, education, certifications, four skill groups | `profile.ts` | `#about` |
| Marcus Hardiman testimonial + LinkedIn | `profile.ts` | `#voices` |
| Email, LinkedIn, GitHub, footer beta note | `profile.ts` | `#contact` |

### External links (all from source; to be link-checked at build)
- https://www.wonderwordai.net/
- https://www.figma.com/design/5qQ23MWvgDfnO5FrM35PNg/Wonder-Word-AI?node-id=0-1&p=f&t=52CQ14lJvkkfFzAY-0
- https://brief-to-play.lovable.app/
- https://miro.com/app/board/uXjVHj5dGTo=/?moveToWidget=3458764684658490400
- https://swift-resolution-bot.lovable.app/
- https://app.notion.com/p/PRD-Instant-Order-Resolution-Uber-Eats-3f65a85a8c16812fa511cf5db7a2db6a?source=copy_link
- https://claude.ai/artifact/6TXc3vHuuKzg7rUPvDqSU2
- https://claude.ai/artifact/AEuqpmpvUZQWPWbeSbAwYL#2355c655-11a9
- https://www.linkedin.com/in/ridham-chawala-7b456212b/
- https://www.linkedin.com/in/marcus-hardiman-414a4441b/
- https://github.com/WonderWord-DEV-Team/WonderWordAI/tree/main

### Removed on purpose
- “Add your other recommendations here” placeholder in `#voices`.
- Light/dark theme toggle: the new design is dark-only per the brief.
- The WonderWord logo is no longer the site favicon; the site uses an “RC” monogram (`src/app/icon.svg`) and shows the logo in the WonderWord sections.

### Added from the résumé
- Site domain `https://ridhamchawala15.netlify.app` (canonical, sitemap, OG, JSON-LD).
- WonderWord targets: 2,000+ users and $4.8K MRR by March 2027, 5+ school pilots in Q4 2026, LTV:CAC 3:1+. Shown as **targets**.
- MVP span September 2026 – March 2027.
- Tools per concept project: Miro, Figma, Lovable / Notion, Lovable / Claude. Alias “Uber Eats Order Resolution”.
- Market research basis for Instant Order Resolution: earnings filings and third-party benchmarks.
- Skills: Python (Pandas), Excel, AI/ML platforms, data governance and privacy, Lovable prototyping, SAFe concepts, cross-functional leadership.
- Education locations (Himachal Pradesh, Noida); certification abbreviation CSPO.

## 2. Resolved decisions (2026-10-15)

| Item | Resolution |
|---|---|
| Revenue, users, margin charts | No real revenue exists. `src/lib/projection.ts` models Sep 2026 → Mar 2027 from the 100-family start to the 2,000-user / $4.8K MRR targets, 2:1 DIY:Family, $6.50 cost to serve. Labelled **Modeled** everywhere, with assumptions shown. The “$4,800 vs $4,000” chart conflict is moot. |
| Concept projects | Role: “Independent concept — discovery, PRD and prototype, built to show product thinking”. Not employer work. |
| Concept hypotheses | Interviewer Prep and Alert Triage hypotheses **drafted from source wording** and marked DRAFT for your review. |
| Architecture | My design, same stack (see ARCHITECTURE.md). |
| Roadmap | Shown as the Sep 2026 – Mar 2027 span with three unlabeled MVP phases. No per-MVP dates are invented. |
| Theme, GitHub label, analytics, empty case-study sections | Defaults from round 1: dark only, “GitHub (WonderWord)”, no analytics, hide empty sections. |
| Cloudera location | Not in either source; left blank. |
| Tutoring bar | Shown as “$200+ / month, typical tutoring” with “published rates” wording from source. |

## 3. Conflicts between résumé and portfolio (resolved 2026-10-15)

| # | Résumé says | Portfolio / brief says | Decision |
|---|---|---|---|
| A | Email `chawalaridham0515@gmail.com` | `ridhambatra15@gmail.com` | `ridhambatra15@gmail.com` |
| B | Summary credits 37% / 28% / 22% to **Juniper Networks** | Both sources list them under **C3.ai** in the role bullets | C3.ai (consider fixing the résumé summary) |
| C | WonderWord: **80%+ activation, 65% free-to-paid, 90% annual retention** | Not in portfolio; projected paid mix is 30%; beta started Aug 2026 | Left off the site. Only 100+ families (measured) plus labelled targets |
| D | Title “AI Product Lead” for WonderWord | “Co-founder and Product Lead” | Co-founder and Product Lead (your brief) |
| E | Résumé PDF includes phone number | Brief: résumé button only if a real file exists | Published as-is at `/resume/Ridham-Chawala-AI-PM-Resume.pdf` |

## 4. Wording added by the build (not from either source)

Only structural UI copy was written: section headings such as “Results, each with its owner”, button labels, chart explanations, empty states, and the 404 message. None of it states a fact about Ridham's work. Diagram labels on concept-project cards use only source terms: Prepare / Align / Close the loop; pre-authorization, abuse guardrails, cost attribution; promotion and demotion thresholds, hard-stop guardrail.

**Drafted for review (hidden in production):** the hypotheses for Interviewer Prep Coach and Alert Triage Copilot in `src/data/projects.ts`. They show with a Draft badge in `npm run dev` only.

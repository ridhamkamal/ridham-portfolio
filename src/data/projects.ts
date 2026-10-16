import type { Maybe, Project } from "./types";
import { bet } from "./wonderword";

/**
 * Copy drafted from source wording that the owner has not reviewed yet.
 * Visible (with a Draft badge) in development; removed from production builds
 * entirely, so it never reaches HTML or client bundles.
 */
const PROD = process.env.NODE_ENV === "production";
const AWAITING_REVIEW: Maybe<string> = { todo: "Drafted hypothesis awaiting review" };

export const workIntro = {
  heading: "Four products, and the artifacts behind each one",
  body: "One shipped product with real families using it, and three taken from discovery through PRD to a working prototype. Every link opens the actual artifact, not a description of one.",
} as const;

export const projects: readonly Project[] = [
  {
    slug: "wonderword-ai",
    title: "WonderWord AI",
    status: "Shipped",
    statusLabel: "Shipped — private beta",
    prototyped: false,
    category: "Consumer AI",
    role: "Co-founder and Product Lead",
    summary:
      "An AI reading coach that turns a child's real school worksheet into a karaoke reading adventure.",
    problem:
      "One in three US kids struggles with reading in early grades, and every existing app works inside its own content library instead of the homework already in the backpack.",
    highlights: [
      "Concept to 100+ beta families in four weeks",
      "PWA and FastAPI",
      "Three-MVP roadmap through March 2027",
      "8 engineers plus 2.5 FTE hires",
      "Amplitude and Mixpanel analytics",
      "Family-first freemium model",
    ],
    claims: [
      { text: "100+ families in private beta", provenance: "measured" },
      { text: "Parents photograph real homework rather than adopt a library", provenance: "validated" },
      { text: "Story-based correction beats a red X", provenance: "partly-validated" },
      { text: "Weekly report plus one physical game sustains engagement", provenance: "in-test" },
      {
        text: "Word-recognition error below 10% drives confidence, lower stress and willingness to pay",
        provenance: "hypothesis",
      },
      { text: "$5–8 cost to serve for 47–61% gross margin", provenance: "modeled" },
      {
        text: "2,000+ users and $4.8K MRR by March 2027; 5+ school pilots in Q4 2026; LTV:CAC 3:1+",
        provenance: "target",
      },
    ],
    links: [
      { label: "Live product", href: "https://www.wonderwordai.net/", kind: "live" },
      {
        label: "Figma file",
        href: "https://www.figma.com/design/5qQ23MWvgDfnO5FrM35PNg/Wonder-Word-AI?node-id=0-1&p=f&t=52CQ14lJvkkfFzAY-0",
        kind: "figma",
      },
      { label: "Full case study", href: "/work/wonderword-ai", kind: "internal" },
    ],
    caseStudy: {
      contextAndUser:
        "K–5 children reading their real school worksheets, and the parents who pay and receive the progress report.",
      problemAndEvidence:
        "One in three US kids struggles with reading in early grades, and every existing app works inside its own content library instead of the homework already in the backpack. Parents were already photographing homework into ChatGPT, a tool never built for children.",
      roleAndCollaborators:
        "Co-founder and product lead. A cross-functional team of 8 engineers plus 2.5 FTE hires.",
      constraints:
        "COPPA and a six-year-old's confidence. Capture to interactive text in 3 seconds; read-along sync under 200 ms; correction stories must score 90+ on four guardrails.",
      hypothesis: bet.hypothesis,
      alternativesAndTradeoffs:
        "Teachers in the MVP versus deferring them: classroom rostering, district procurement and FERPA scope would have consumed the eight-week MVP window before a single family proved the core loop works.",
      keyDecisions:
        "Defer teachers; correction as a two-sentence story rather than an error state; monthly pricing first, annual billing in month three.",
      prototypeOrShipped: "Live PWA in private beta: landing page, sign-in, child home and story worlds.",
      evaluationAndMetrics:
        "North star: Daily Active Scans. Activity Action Rate for off-screen retention. Word-recognition error under 10%. Amplitude and Mixpanel.",
      resultsOrValidation:
        "100+ beta families. One finding validated, one partly validated, one in test. Revenue figures are modeled, not booked.",
      lessonsAndNextSteps:
        "If beta families hit the error target and still churn by week two, the roadmap shifts from speech tuning to onboarding. Recruiting 5+ school pilots for Q4 2026.",
    },
    tools: ["PWA", "FastAPI", "Amplitude", "Mixpanel", "Figma"],
    source: "#work, #product, #bet, #journey, #model",
  },
  {
    slug: "interviewer-prep-coach",
    title: "Interviewer Prep Coach",
    status: "Concept",
    statusLabel: "Concept — prototyped",
    prototyped: true,
    category: "HR Tech",
    role: "Independent concept — discovery, PRD and prototype, built to show product thinking",
    summary:
      "An AI recruiting product connecting interview prep, panel alignment and feedback into one loop.",
    problem:
      "Discovery with recruiter, interviewer and hiring-manager personas found the real gap was coordination, not judgment. No system connected preparation, panel alignment and feedback, so each happened in isolation and the loop never closed.",
    highlights: [
      "Prepare → Align → Close-the-loop workflow",
      "22-section PRD with MoSCoW scope, user stories, acceptance criteria and a V1 to V3 rollout",
      "Role-based prototype",
      "Panel coverage-gap detection",
      "Evidence-required feedback",
    ],
    claims: [
      { text: "Gap is coordination, not judgment", provenance: "validated" },
      {
        text: "North star: 70% of interview loops with complete feedback inside 24 hours",
        provenance: "target",
      },
    ],
    boundary:
      "The AI summarizes approved data and suggests job-related questions. It never scores candidates, recommends hires or writes feedback.",
    links: [
      { label: "Try the prototype", href: "https://brief-to-play.lovable.app/", kind: "prototype" },
      {
        label: "Miro board",
        href: "https://miro.com/app/board/uXjVHj5dGTo=/?moveToWidget=3458764684658490400",
        kind: "board",
      },
      { label: "Case study", href: "/work/interviewer-prep-coach", kind: "internal" },
    ],
    caseStudy: {
      contextAndUser: "Recruiters, interviewers and hiring managers running interview loops.",
      problemAndEvidence:
        "No system connected preparation, panel alignment and feedback, so each happened in isolation and the loop never closed.",
      roleAndCollaborators:
        "Independent concept work, not an employer engagement: discovery, PRD and prototype by Ridham.",
      constraints: "Legal exposure and fairness risk of automated hiring decisions.",
      hypothesis: PROD
        ? AWAITING_REVIEW
        : "DRAFT (review): If preparation, panel alignment and feedback run as one connected loop, 70% of interview loops will close with complete feedback inside 24 hours, without the AI ever judging candidates.",
      alternativesAndTradeoffs:
        "Scoring is the feature buyers ask for in demos and the one that creates legal exposure, fairness risk and a product that makes decisions it cannot defend.",
      keyDecisions: "Summarize approved data and suggest job-related questions. Nothing else.",
      prototypeOrShipped:
        "Working prototype with role-based views, panel coverage-gap detection and evidence-required feedback.",
      evaluationAndMetrics:
        "North star: 70% of interview loops with complete feedback inside 24 hours, with time-to-hire and fairness as counter-metrics.",
      resultsOrValidation: "Concept, prototyped. Not launched.",
      lessonsAndNextSteps:
        "Scoring would be revisited only as an explicitly human-reviewed suggestion if an auditable, jurisdiction-cleared fairness standard existed and a customer required it. V1 to V3 rollout defined in the PRD.",
    },
    tools: ["Miro", "Figma", "Lovable"],
    source: "#work, <script> DEC[1]",
  },
  {
    slug: "instant-order-resolution",
    title: "Instant Order Resolution",
    status: "Concept",
    statusLabel: "Concept — prototyped",
    prototyped: true,
    category: "Marketplace",
    role: "Independent concept — discovery, PRD and prototype, built to show product thinking",
    summary:
      "A competitive teardown of DoorDash against Uber Eats, a full PRD, and an interactive prototype.",
    problem:
      "When a delivery order goes wrong, resolution is slow and the customer has decided how they feel long before support replies.",
    highlights: [
      "DoorDash and Uber Eats teardown",
      "Reframed market hypothesis",
      "Full PRD",
      "Interactive prototype",
      "Pre-authorization mechanics",
      "Abuse guardrails",
      "Cost attribution",
    ],
    claims: [
      {
        text: "Uber Eats as challenger at roughly 24% US share (earnings filings and third-party benchmarks)",
        provenance: "research",
      },
      { text: "Order accuracy: Uber Eats 88% against DoorDash 98%", provenance: "research" },
      { text: "Success metrics gated on operational accuracy rather than CSAT", provenance: "target" },
    ],
    boundary: "Market figures are research cited in the case study, not current market data.",
    links: [
      { label: "Try the prototype", href: "https://swift-resolution-bot.lovable.app/", kind: "prototype" },
      {
        label: "Read the PRD",
        href: "https://app.notion.com/p/PRD-Instant-Order-Resolution-Uber-Eats-3f65a85a8c16812fa511cf5db7a2db6a?source=copy_link",
        kind: "doc",
      },
      { label: "Case study", href: "/work/instant-order-resolution", kind: "internal" },
    ],
    caseStudy: {
      contextAndUser: "Delivery-marketplace customers whose order has gone wrong.",
      problemAndEvidence:
        "When a delivery order goes wrong, resolution is slow and the customer has decided how they feel long before support replies.",
      roleAndCollaborators:
        "Independent concept work, not an employer engagement: discovery, PRD and prototype by Ridham.",
      constraints: "Abuse risk and cost attribution for instant resolution.",
      hypothesis:
        "The analysis overturned its own premise. The widely-repeated claim that DoorDash is losing share is inverted; reframing around Uber Eats as challenger at roughly 24% US share changed which strategies were even available.",
      alternativesAndTradeoffs:
        "Match selection, compete on speed, or undercut on price all require outspending a larger incumbent on its own terms. Selection and speed are won with capital, price is won with margin.",
      keyDecisions: "Own post-failure order resolution, what happens after an order goes wrong.",
      prototypeOrShipped:
        "PRD and interactive prototype covering the pre-authorization mechanic, abuse guardrails and cost attribution.",
      evaluationAndMetrics: "Success metrics gated on operational accuracy rather than CSAT.",
      resultsOrValidation: "Concept, prototyped. Not launched.",
      lessonsAndNextSteps:
        "If Uber Eats closed the accuracy gap the wedge would shrink. The wedge would also be abandoned if the cross-subsidy were regulated away.",
    },
    tools: ["Notion", "Lovable"],
    aka: "Uber Eats Order Resolution",
    source: "#work, <script> DEC[0]",
  },
  {
    slug: "alert-triage-copilot",
    title: "Alert Triage Copilot",
    status: "Concept",
    statusLabel: "Concept — prototyped",
    prototyped: true,
    category: "Enterprise AI",
    role: "Independent concept — discovery, PRD and prototype, built to show product thinking",
    summary:
      "An AI retrieval layer for network operations alert triage, built and evaluated on public system-log data.",
    problem:
      "Ops teams drown in alert volume and re-solve incidents someone already solved last quarter. The scarce resource is attention, not data.",
    highlights: [
      "Product brief",
      "Phase-1 PRD with acceptance criteria",
      "Working prototype on public logs",
      "Automation ladder with promotion and demotion thresholds",
      "Metrics tree with a counter-metric and a hard-stop guardrail",
      "Revised chronological evaluation",
    ],
    claims: [
      { text: "Chronological-split evaluation changed phasing and requirements", provenance: "measured" },
    ],
    boundary: "Built on public system-log data. No employer data anywhere in it.",
    links: [
      { label: "Prototype", href: "https://claude.ai/artifact/6TXc3vHuuKzg7rUPvDqSU2", kind: "prototype" },
      {
        label: "Product brief",
        href: "https://claude.ai/artifact/AEuqpmpvUZQWPWbeSbAwYL#2355c655-11a9",
        kind: "doc",
      },
      { label: "Case study", href: "/work/alert-triage-copilot", kind: "internal" },
    ],
    caseStudy: {
      contextAndUser: "Network operations teams triaging alerts.",
      problemAndEvidence:
        "Ops teams drown in alert volume and re-solve incidents someone already solved last quarter. The scarce resource is attention, not data.",
      roleAndCollaborators:
        "Independent concept work, not an employer engagement: discovery, PRD and prototype by Ridham.",
      constraints: "The cost of a missed critical alert is asymmetric. Public data only; no employer data.",
      hypothesis: PROD
        ? AWAITING_REVIEW
        : "DRAFT (review): If retrieval surfaces how similar past incidents were resolved, operators stop re-solving known incidents, with a hard stop so no critical alert is ever suppressed by automation.",
      alternativesAndTradeoffs:
        "Cumulative accuracy, a chronological split, or a human spot-check. The corrected number was worse, and a good result was knowingly invalidated.",
      keyDecisions:
        "An automation ladder with promotion and demotion thresholds committed in advance; a chronological split for evaluation.",
      prototypeOrShipped: "Working prototype on public logs.",
      evaluationAndMetrics:
        "A metrics tree carrying a counter-metric and a hard-stop guardrail. The cumulative measure let the system retrieve remediations that in production would not have existed yet.",
      resultsOrValidation:
        "The corrected chronological result changed the product's phasing and requirements.",
      lessonsAndNextSteps: "If an offline metric looks strong, check whether the split leaks time.",
    },
    tools: ["Claude"],
    source: "#work, <script> DEC[3]",
  },
];

export const projectFilters = [
  "All",
  "Consumer AI",
  "Enterprise AI",
  "HR Tech",
  "Marketplace",
  "Shipped",
  "Concept",
  "Prototype",
] as const;
export type ProjectFilter = (typeof projectFilters)[number];

export function matchesFilter(p: Project, f: ProjectFilter): boolean {
  if (f === "All") return true;
  if (f === "Shipped" || f === "Concept") return p.status === f;
  if (f === "Prototype") return p.prototyped;
  return p.category === f;
}

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

import type { JourneyStage, PricingTier, Provenance } from "./types";

export const screenshots = [
  {
    id: "landing",
    label: "Landing page",
    url: "wonderwordai.net",
    src: "/images/wonderword-landing.jpg",
    alt: "WonderWord AI, Landing page",
    width: 1000,
    height: 511,
    caption:
      "The public site. The hero states the job in one line and names the three things a parent gets: real-time feedback, biweekly reports, activity recommendations.",
  },
  {
    id: "signin",
    label: "Sign in",
    url: "wonderwordai.net/auth/login",
    src: "/images/wonderword-signin.jpg",
    alt: "WonderWord AI, Sign in",
    width: 1000,
    height: 511,
    caption:
      "Two doors, one screen. Google for parents who want speed, email for parents who do not want another OAuth grant. The mascot appears before the child has done anything, so the first impression is a character rather than a form.",
  },
  {
    id: "child-home",
    label: "Child home",
    url: "wonder-word-ai.vercel.app/child",
    src: "/images/wonderword-child-home.jpg",
    alt: "WonderWord AI, Child home",
    width: 1000,
    height: 511,
    caption:
      "Snap homework is the primary action and sits dead centre. The streak banner and daily goal ring surround it rather than competing with it. Features not yet live are labelled inside the product itself.",
  },
  {
    id: "story-worlds",
    label: "Story worlds",
    url: "wonder-word-ai.vercel.app/child",
    src: "/images/wonderword-story-worlds.jpg",
    alt: "WonderWord AI, Story worlds",
    width: 1000,
    height: 511,
    caption:
      "Daily Refresh and six story worlds. Theme choice is the personalization lever that costs nothing at inference time: the same guardrailed generation, wrapped in whatever the child already likes.",
  },
] as const;

export const bet = {
  hypothesis:
    "If WonderWord AI holds word-recognition error below 10%, then K–5 students read more confidently, parents feel measurably less homework stress, and families pay for it.",
  pillars: [
    { title: "Under 10% error", body: "Word recognition on developing child phonetics" },
    { title: "Less homework stress", body: "The nightly power struggle stops being nightly" },
    { title: "Willingness to pay", body: "Free tier converts to a paid coaching tier" },
  ],
  threshold:
    "Below 10% the correction loop is trustworthy. Above it, the product tells children they are wrong when they are right.",
  loadBearing:
    "The error rate is the load-bearing number. Every architecture decision downstream, from Wav2Vec2 confidence scoring to the four-layer story guardrails, exists to defend that threshold.",
  findings: [
    {
      status: "validated" as Provenance,
      statusLabel: "Validated",
      title: "Real homework beats a library",
      body: "Parents photograph the worksheet the school assigned rather than adopt another content library. Confirmed in discovery — parents were already photographing homework into ChatGPT, a tool never built for children.",
    },
    {
      status: "partly-validated" as Provenance,
      statusLabel: "Partly validated",
      title: "Story beats a red X",
      body: "Children accept correction delivered as a two-sentence story rather than an error state. Strong signal in moderated sessions; needs unmoderated beta data to confirm at scale.",
    },
    {
      status: "in-test" as Provenance,
      statusLabel: "In test",
      title: "Off-screen retention",
      body: "A weekly report plus one physical game sustains parent engagement without adding screen time. Measured in private beta through the Activity Action Rate.",
    },
  ],
  falsification:
    "If beta families hit the error target and still churn by week two, the bet was wrong about the cause. The blocker would be parent habit, not model accuracy, and the roadmap would shift from speech tuning to onboarding. Daily Active Scans is the north star precisely because it separates those two failure modes early.",
  northStar: "Daily Active Scans",
} as const;

export const journeyIntro =
  "The emotional curve matters more than the funnel. A six-year-old who feels stupid does not come back tomorrow.";

export const journey: readonly JourneyStage[] = [
  {
    name: "Trigger",
    what: "Worksheet comes home in the backpack",
    feeling: "Dread",
    emoji: "😩",
    valence: 2,
    pain: "Nightly power struggle. The homework is a thing that happens to the family.",
    intervention: "Reframed as a game, not homework.",
  },
  {
    name: "Capture",
    what: "Child or parent photographs the page",
    feeling: "Skeptical",
    emoji: "😐",
    valence: 3,
    pain: "OCR fails on crumpled, glared, third-generation photocopies.",
    intervention: "Auto-crop, deskew and shadow strip, with capture to text inside the latency budget.",
    figure: { value: 3, label: "seconds, capture to interactive text" },
  },
  {
    name: "Read",
    what: "Reads aloud with karaoke highlighting",
    feeling: "Engaged",
    emoji: "🙂",
    valence: 6,
    pain: "Losing their place in dense text.",
    intervention:
      "Highlighting stays locked to the child's actual position and rewinds rather than jumping ahead when they re-read a line.",
    figure: { value: 200, label: "milliseconds, maximum sync latency" },
  },
  {
    name: "Miscue",
    what: "Says bed instead of bird",
    feeling: "Deflated",
    emoji: "😟",
    valence: 1,
    pain: "Correction feels like failure. This is where the child decides whether to come back tomorrow.",
    intervention:
      "No red X. A two-sentence story starring the missed word, validated by four guardrails before it is ever shown.",
    figure: { value: 90, label: "minimum validation score to show a story" },
  },
  {
    name: "Reinforce",
    what: "Reads the story, hears phonemes, retries",
    feeling: "Proud",
    emoji: "😄",
    valence: 9,
    pain: "Drilling is boring, and a bored six-year-old is a churned six-year-old.",
    intervention:
      "A four-tab modal covering story, phonics, listen and practice, plus badges and a mascot that reacts.",
    figure: { value: 4, label: "tabs in the correction modal" },
  },
  {
    name: "Report",
    what: "Parent opens the progress report",
    feeling: "Relieved",
    emoji: "🙂",
    valence: 7,
    pain: "No idea where the child is actually stuck.",
    intervention: "WCPM trend, a phonics deficit map, and one off-screen game to play tonight.",
    figure: { value: 3, label: "sessions before a trend is shown" },
  },
];

export const miscueCallout = {
  title: "The low point is the whole product",
  body: "Miscue is the make-or-break stage. Every other stage can be merely good. If correction lands as failure, the child disengages and no dashboard saves the account. The four-layer guardrail system exists to protect this one moment, which is why story validation, not OCR accuracy, was the P0 engineering risk.",
} as const;

export const pricingTiers: readonly PricingTier[] = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    annual: null,
    projectedMixPct: 70,
    features:
      "Three readings a week, scan and read, one rotating story theme, Word Explorer, read-aloud, basic parent dashboard.",
  },
  {
    id: "diy",
    name: "DIY Coach",
    monthly: 9.99,
    annual: 99,
    projectedMixPct: 20,
    features:
      "Unlimited readings, all seven story themes, Word Vision illustrations, weekly progress reports, AI activity recommendations.",
  },
  {
    id: "family",
    name: "Family Coach",
    monthly: 17.99,
    annual: 179,
    projectedMixPct: 10,
    features:
      "Everything in DIY Coach, up to three children, Word Beats songs, custom stories, print activity packs, sibling analytics.",
  },
];

export const pricingNotes = {
  headline: "Family-first freemium, priced against tutoring",
  mixCaption: "Projected paid mix. Modelled, not booked.",
  annualLast:
    "Monthly pricing ships first so the $9.99 point is validated against real conversion before a discount is layered on. Annual arrives in month three, once product-market fit is evidenced. An annual cohort bought before fit just locks in churn you have not yet earned the right to prevent.",
  costToServe: { low: 5, high: 8 },
  grossMarginBand: { low: 47, high: 61 },
  annualDiscountPct: 17,
  pricingStrategyDate: "August 2026",
} as const;

/** Monthly cost comparison. Tutoring rate label in source renders as "+200". */
export const tutoringComparison = [
  { label: "Tutoring, typical", monthly: 200, note: "Shown as $200+; source cites “published rates”" },
  { label: "Family Coach", monthly: 17.99 },
  { label: "DIY Coach", monthly: 9.99 },
] as const;

/**
 * Modeled MRR, free vs paying users and gross margin come from
 * `buildProjection()` in src/lib/projection.ts. Owner confirmed no real
 * revenue exists; every chart using it carries the "Modeled" label.
 */
export const projectionCaptions = {
  mrr: "Modeled monthly recurring revenue, Sep 2026 to Mar 2027, ending at the $4.8K MRR target. Not booked revenue.",
  users: "Modeled free against paying users, growing from the 100+ beta families to the 2,000+ user target.",
  margin:
    "Modeled gross margin at a $6.50 blended cost to serve, against the 47–61% band from the August 2026 pricing strategy.",
} as const;

/** Targets from the résumé — goals, not results. */
export const targets = [
  { label: "users by March 2027", value: 2000, suffix: "+" },
  { label: "MRR by March 2027", value: 4.8, prefix: "$", suffix: "K" },
  { label: "school pilots, Q4 2026", value: 5, suffix: "+" },
  { label: "LTV:CAC target", value: 3, suffix: ":1+" },
] as const;

export const roadmap = {
  summary: "Three MVPs, September 2026 to March 2027",
  span: { start: "2026-09", end: "2027-03" },
  conceptToBeta: "Four weeks, concept to 100+ beta families",
  schoolPilots: "Recruiting 5+ school pilots for Q4 2026",
  annualBilling: "Annual billing arrives in month three",
  // Per-MVP names and dates are not in any source; the roadmap shows the span and three unlabeled phases.
} as const;

export const logo = {
  src: "/images/wonderword-logo.jpg",
  alt: "WonderWord AI logo: a child and a friendly robot reading under a tree. Read, learn, grow.",
  width: 520,
  height: 616,
} as const;

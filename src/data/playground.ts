import type { Decision } from "./types";

export const playgroundIntro = {
  heading: "Three decisions you can operate yourself",
  body: "Most portfolios describe the thinking. These run it. Nothing here calls a production service; it is the documented logic, simplified enough to fit in a page.",
} as const;

/** Story guardrail checker — word lists and thresholds verbatim from source. */
export const guardrail = {
  title: "Would this story reach a child?",
  body: "Every AI-generated correction story passes four checks before a child sees it. Edit the story and watch the score move. Under 90, the child gets a pre-written fallback instead.",
  disclaimer:
    "Simplified: a 120-word known-vocabulary list rather than the child's actual learned-word set, and a Flesch-Kincaid estimate rather than the full library. The thresholds and the pass/fail behaviour are the production ones.",
  fallbackNote:
    "A templated story using only core vocabulary. The failure and its score are logged. A child never sees a validation error.",
  passScore: 90,
  maxGrade: 3,
  maxWords: 40,
  minTargetRepeats: 2,
  known:
    "a an and the is was are can go up down in on at it its he she they we you i to of for with big little red blue green tree sky sun day night cat dog bird fish boy girl man mom dad run ran sat sit fly flew saw see look come came get got had has have like likes play plays jump hop top out off back home good new old fast slow help here there this that then them his her my your one two three all some not no yes very so but or if when what who where why how make made take took put want went find scared dark monster hurt sad cry lost alone".split(
      " ",
    ),
  unsafe:
    "scared scary afraid fear monster dark hurt pain cry cried sad died die dead blood kill killed fight war gun weapon lost alone terrified catastrophic devastation".split(
      " ",
    ),
  presets: [
    { label: "Passes", word: "bird", story: "A big red BIRD sat in the tree. The BIRD can fly up and up." },
    {
      label: "Too complex",
      word: "bird",
      story: "The BIRD contemplated its catastrophic predicament amidst devastation. The BIRD persevered.",
    },
    { label: "Bad structure", word: "bird", story: "The BIRD sat." },
    { label: "Unsafe", word: "bird", story: "The BIRD is scared. The dark BIRD is lost and sad." },
  ],
} as const;

/** Pricing simulator baseline and slider ranges. */
export const pricingSim = {
  title: "Break the pricing model",
  body: "The three tiers only work if conversion and cost to serve stay inside a band. Move the sliders and find where margin goes negative.",
  baseline: { users: 500, diyPct: 20, familyPct: 10, costToServe: 6.5 },
  ranges: {
    users: { min: 100, max: 5000, step: 100 },
    diyPct: { min: 0, max: 40, step: 1 },
    familyPct: { min: 0, max: 30, step: 1 },
    costToServe: { min: 1, max: 20, step: 0.5 },
  },
  formulas:
    "Monthly revenue is users times DIY rate times $9.99, plus users times Family rate times $17.99. Gross margin is revenue less paying users times cost to serve, over revenue.",
  assumptions:
    "Monthly billing only: the annual plan and its 17% discount are excluded, so real blended margin would differ. Cost to serve is one blended figure covering inference, speech compute, hosting and storage. It excludes support, payment processing and acquisition. Pricing and the 47–61% margin band come from the August 2026 pricing strategy. These are modelled projections, not booked revenue.",
} as const;

export const decisionsIntro = {
  title: "Four calls I had to make",
  body: "Pick an option before revealing what I chose. Every decision is documented in the artifacts linked above. None were reconstructed for this exercise.",
  tabs: ["Wedge choice", "AI boundary", "MVP scope", "Evaluation method"],
} as const;

export const decisions: readonly Decision[] = [
  {
    project: "Instant Order Resolution",
    question:
      "Uber Eats is the number two player at roughly 24% US share. Which wedge is actually defensible against DoorDash?",
    options: [
      "Match DoorDash on restaurant selection",
      "Compete on delivery speed",
      "Undercut on pricing and fees",
      "Own post-failure order resolution",
    ],
    answerIndex: 3,
    chose: "Own post-failure order resolution, what happens after an order goes wrong.",
    evidence:
      "Uber Eats trails on order accuracy, 88% against DoorDash's 98%. That gap looks like a liability, but it means the failure moment happens more often and is worth more to fix. Uber Eats also holds a cross-subsidy advantage from rides that DoorDash cannot replicate.",
    tradeoff:
      "The three obvious options all require outspending a larger incumbent on its own terms. Selection and speed are won with capital, price is won with margin. None of those are available to the challenger.",
    changeMind:
      "If Uber Eats closed the accuracy gap the wedge would shrink, because the feature's value scales with how often orders fail. I would also abandon it if the cross-subsidy were regulated away.",
  },
  {
    project: "Interviewer Prep Coach",
    question: "The AI has access to candidate data and interview feedback. How far should it go?",
    options: [
      "Score and rank candidates",
      "Draft feedback for interviewers",
      "Summarize approved data and suggest job-related questions only",
      "Recommend hire or no-hire with a confidence level",
    ],
    answerIndex: 2,
    chose: "Summarize approved data and suggest job-related questions. Nothing else.",
    evidence:
      "Discovery across recruiter, interviewer and hiring-manager personas found the real gap was coordination, not judgment. The scoring capability solved a problem nobody named.",
    tradeoff:
      "Scoring is the feature buyers ask for in demos and the one that creates legal exposure, fairness risk and a product that makes decisions it cannot defend. I gave up obvious demo appeal for a product that survives a compliance review.",
    changeMind:
      "Nothing in the current regulatory environment. If an auditable, jurisdiction-cleared fairness standard existed and a customer required scoring, I would revisit it as an explicitly human-reviewed suggestion, never an automated decision.",
  },
  {
    project: "WonderWord AI",
    question: "Teachers are the highest-leverage users. Do they go in the MVP?",
    options: [
      "Build the teacher portal in the MVP",
      "Defer teachers until consumer demand is proven",
      "Build a read-only teacher view as a compromise",
    ],
    answerIndex: 1,
    chose: "Defer. Consumer demand first, institutional distribution second.",
    evidence:
      "Classroom rostering, district procurement and FERPA scope would have consumed the entire eight-week MVP window before a single family proved the core loop works.",
    tradeoff:
      "Teachers are the better long-term business and the slower one to reach. Deferring them costs distribution leverage; building them costs the chance to learn whether the product works at all.",
    changeMind:
      "A school district committing to a paid pilot before launch would reverse this immediately. That is demand evidence, not a bet on it.",
  },
  {
    project: "Alert Triage Copilot",
    question:
      "The retrieval layer scored well on the first evaluation. How do you measure whether it actually works?",
    options: [
      "Cumulative accuracy across the full dataset",
      "A chronological split, training on earlier incidents and testing on later ones",
      "Human spot-check of a sample",
    ],
    answerIndex: 1,
    chose:
      "A chronological split. I re-ran the whole evaluation after the cumulative measure proved misleading.",
    evidence:
      "The cumulative measure let the system retrieve remediations that in production would not have existed yet. It was scoring well by looking at the future.",
    tradeoff:
      "The corrected number was worse, and it changed the product's phasing and requirements. I had a good result and chose to invalidate it.",
    changeMind:
      "Nothing. This is the correct method for anything retrieving from a growing incident history. The lesson generalizes: if an offline metric looks strong, check whether the split leaks time.",
  },
];

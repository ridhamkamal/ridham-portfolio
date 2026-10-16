/**
 * Typed content model for the portfolio.
 *
 * Every value is sourced from portfolio1.html. `source` names the section of
 * that file a value came from (e.g. "#work", "#experience", "<script> J").
 * Anything not present in the source is a `Todo`, never an invented value.
 */

/** Section or script block in portfolio1.html a value was taken from. */
export type SourceRef = string;

/** Placeholder for content that needs confirmation before it can be shown. */
export interface Todo {
  readonly todo: string;
}

export type Maybe<T> = T | Todo;

export const isTodo = (v: unknown): v is Todo => typeof v === "object" && v !== null && "todo" in v;

/**
 * How much evidence stands behind a claim. The UI renders each tier with a
 * distinct badge so measured results are never confused with projections.
 */
export type Provenance =
  | "measured" // observed result (e.g. beta families, % reductions)
  | "validated" // confirmed in discovery
  | "partly-validated" // strong signal, not confirmed at scale
  | "in-test" // being measured in private beta
  | "hypothesis" // the bet itself
  | "modeled" // projection from a pricing/financial model, not booked
  | "research" // third-party market figures cited in a case study
  | "target" // a goal or threshold, not a result
  | "demo"; // playground output, not production analytics

export interface Link {
  readonly label: string;
  readonly href: string;
  readonly kind: "live" | "figma" | "prototype" | "doc" | "board" | "internal" | "social" | "email";
}

export interface Metric {
  readonly id: string;
  readonly value: number;
  readonly prefix?: string;
  readonly suffix?: string; // "%", "+", " years"
  readonly label: string;
  /** Who/what the metric belongs to. Never implied to be a single employer. */
  readonly context: string;
  readonly provenance: Provenance;
  readonly source: SourceRef;
  readonly note?: string;
}

export type ProjectCategory = "Consumer AI" | "Enterprise AI" | "HR Tech" | "Marketplace";
export type ProjectStatus = "Shipped" | "Concept";

export interface ProjectClaim {
  readonly text: string;
  readonly provenance: Provenance;
}

/** The 11-part case-study template. Missing parts are explicit TODOs. */
export interface CaseStudy {
  readonly contextAndUser: Maybe<string>;
  readonly problemAndEvidence: Maybe<string>;
  readonly roleAndCollaborators: Maybe<string>;
  readonly constraints: Maybe<string>;
  readonly hypothesis: Maybe<string>;
  readonly alternativesAndTradeoffs: Maybe<string>;
  readonly keyDecisions: Maybe<string>;
  readonly prototypeOrShipped: Maybe<string>;
  readonly evaluationAndMetrics: Maybe<string>;
  readonly resultsOrValidation: Maybe<string>;
  readonly lessonsAndNextSteps: Maybe<string>;
}

export interface Project {
  readonly slug: string;
  readonly title: string;
  readonly status: ProjectStatus;
  readonly statusLabel: string; // "Shipped — private beta" | "Concept — prototyped"
  readonly prototyped: boolean;
  readonly category: ProjectCategory;
  readonly role: Maybe<string>;
  readonly summary: string;
  readonly problem: string;
  readonly highlights: readonly string[];
  readonly claims: readonly ProjectClaim[];
  readonly boundary?: string; // responsible-AI or data boundary statement
  readonly tools: readonly string[];
  readonly aka?: string; // alternate title used on the résumé
  readonly links: readonly Link[];
  readonly caseStudy: CaseStudy;
  readonly source: SourceRef;
}

export interface Role {
  readonly id: string;
  readonly org: string;
  readonly title: string;
  readonly start: string; // ISO yyyy-mm, used in <time datetime>
  readonly end: string | null; // null = present
  readonly location: Maybe<string>;
  readonly summary: string;
  readonly bullets: readonly string[];
  readonly tags: readonly ("enterprise-ai" | "consumer-ai" | "analytics" | "delivery")[];
  readonly metricIds: readonly string[];
}

export interface JourneyStage {
  readonly name: "Trigger" | "Capture" | "Read" | "Miscue" | "Reinforce" | "Report";
  readonly what: string;
  readonly feeling: string;
  readonly emoji: string;
  /** Emotional valence 0–10 as plotted in the source curve. */
  readonly valence: number;
  readonly pain: string;
  readonly intervention: string;
  readonly figure?: { readonly value: number; readonly label: string };
}

export interface PricingTier {
  readonly id: "free" | "diy" | "family";
  readonly name: string;
  readonly monthly: number;
  readonly annual: number | null;
  readonly features: string;
  readonly projectedMixPct: number;
}

export interface Decision {
  readonly project: string;
  readonly question: string;
  readonly options: readonly string[];
  readonly answerIndex: number;
  readonly chose: string;
  readonly evidence: string;
  readonly tradeoff: string;
  readonly changeMind: string;
}

export interface SeriesPoint {
  readonly period: string;
  readonly value: number | Todo;
}

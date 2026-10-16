import Link from "next/link";
import type { ReactNode } from "react";
import { decisions } from "@/data/playground";
import { metrics } from "@/data/metrics";
import { isTodo, type CaseStudy, type Metric, type Project } from "@/data/types";
import {
  AnimatedCounter,
  FadeIn,
  HoverLift,
  ScrollProgressBar,
  StaggerChildren,
  StaggerItem,
  Tilt3D,
} from "@/components/motion";
import { ArrowIcon, ButtonLink, Chip, ProvenanceBadge } from "@/components/ui";
import { CaseHeroVisual } from "./CaseHero";
import { StickyToc } from "./StickyToc";
import { FlowDiagram } from "./FlowDiagram";
import { Gallery } from "./Gallery";
import { JourneyCurve } from "./JourneyCurve";
import { BetPanel, PricingTiers } from "./WonderWordBlocks";

const SECTIONS: readonly { key: keyof CaseStudy; id: string; label: string }[] = [
  { key: "contextAndUser", id: "context", label: "Context and user" },
  { key: "problemAndEvidence", id: "problem", label: "Problem and evidence" },
  { key: "roleAndCollaborators", id: "role", label: "Role and collaborators" },
  { key: "constraints", id: "constraints", label: "Constraints" },
  { key: "hypothesis", id: "hypothesis", label: "Hypothesis" },
  { key: "alternativesAndTradeoffs", id: "alternatives", label: "Alternatives and tradeoffs" },
  { key: "keyDecisions", id: "decisions", label: "Key decisions" },
  { key: "prototypeOrShipped", id: "experience", label: "Prototype or shipped experience" },
  { key: "evaluationAndMetrics", id: "evaluation", label: "Evaluation and metrics" },
  { key: "resultsOrValidation", id: "results", label: "Results or validation status" },
  { key: "lessonsAndNextSteps", id: "lessons", label: "Lessons and next steps" },
];

/** Drafted copy awaiting the owner's review renders only in development. */
const isDraft = (v: string) => v.startsWith("DRAFT");
const showDrafts = process.env.NODE_ENV !== "production";

type Callout = { value: number; prefix?: string; suffix?: string; label: string; kind: Metric["provenance"] };

const CALLOUTS: Record<string, Callout[]> = {
  "wonderword-ai": [
    { value: metrics.betaFamilies.value, suffix: "+", label: "beta families", kind: "measured" },
    { value: 4, label: "weeks, concept to beta", kind: "measured" },
    {
      value: metrics.vocInterviews.value,
      suffix: "+",
      label: "voice-of-customer interviews",
      kind: "measured",
    },
    {
      value: 10,
      prefix: "<",
      suffix: "%",
      label: "word-recognition error the bet depends on",
      kind: "target",
    },
  ],
  "interviewer-prep-coach": [
    { value: 22, label: "PRD sections", kind: "measured" },
    { value: 3, label: "personas in discovery", kind: "measured" },
    {
      value: 70,
      suffix: "%",
      label: "of loops with complete feedback in 24 hours (north star)",
      kind: "target",
    },
  ],
  "instant-order-resolution": [
    { value: 24, prefix: "~", suffix: "%", label: "Uber Eats US share", kind: "research" },
    { value: 88, suffix: "%", label: "Uber Eats order accuracy", kind: "research" },
    { value: 98, suffix: "%", label: "DoorDash order accuracy", kind: "research" },
  ],
};

const FLOWS: Record<string, { title: string; steps: { label: string; detail?: string }[] }> = {
  "interviewer-prep-coach": {
    title: "The workflow",
    steps: [
      {
        label: "Prepare",
        detail: "Interviewers get approved candidate context and job-related question suggestions.",
      },
      { label: "Align", detail: "Panel coverage-gap detection across the interview loop." },
      { label: "Close the loop", detail: "Evidence-required feedback, written by people." },
    ],
  },
  "instant-order-resolution": {
    title: "The resolution mechanic",
    steps: [
      { label: "Order fails" },
      { label: "Pre-authorization" },
      { label: "Abuse guardrails" },
      { label: "Cost attribution" },
    ],
  },
  "alert-triage-copilot": {
    title: "How the evaluation changed the plan",
    steps: [
      {
        label: "Cumulative evaluation",
        detail: "Scored well by retrieving remediations that would not yet have existed.",
      },
      { label: "Chronological split", detail: "Train on earlier incidents, test on later ones." },
      { label: "Revised phasing", detail: "The corrected, worse number changed phasing and requirements." },
    ],
  },
};

const DECISION_FOR: Record<string, number> = {
  "instant-order-resolution": 0,
  "interviewer-prep-coach": 1,
  "wonderword-ai": 2,
  "alert-triage-copilot": 3,
};

function Section({ id, n, label, children }: { id: string; n: number; label: string; children: ReactNode }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      className="scroll-mt-32 border-t border-[var(--color-line)] py-12 first:border-t-0 first:pt-0"
    >
      <FadeIn>
        <p className="font-[family-name:var(--font-display)] text-sm text-[var(--color-faint)] tabular-nums">
          {String(n).padStart(2, "0")}
        </p>
        <h2 id={`${id}-h`} className="display mt-1 text-[clamp(1.6rem,3vw,2.3rem)]">
          {label}
        </h2>
      </FadeIn>
      <div className="mt-5 grid gap-6">{children}</div>
    </section>
  );
}

export function CaseStudyLayout({ project: p, next }: { project: Project; next: Project }) {
  const cs = p.caseStudy;
  const ww = p.slug === "wonderword-ai";
  const visible = SECTIONS.filter((s) => {
    const v = cs[s.key];
    return !isTodo(v) && (showDrafts || !isDraft(v));
  });
  const dec = decisions[DECISION_FOR[p.slug] ?? -1];
  const callouts = CALLOUTS[p.slug];
  const flow = FLOWS[p.slug];
  const role = isTodo(p.role) ? null : p.role;

  const extras: Partial<Record<keyof CaseStudy, ReactNode>> = {
    hypothesis: ww ? <BetPanel level="h3" /> : null,
    alternativesAndTradeoffs: dec ? (
      <Tilt3D size="lg" glare={false} className="[border-radius:var(--radius-lg)]">
        <div className="card p-5 sm:p-6">
          <p className="eyebrow">The question</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-lg">{dec.question}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {dec.options.map((o, i) => (
              <li
                key={o}
                className={
                  i === dec.answerIndex
                    ? "rounded-[var(--radius-md)] border border-[var(--color-good)] bg-[rgba(126,226,168,0.08)] p-3"
                    : "rounded-[var(--radius-md)] border border-[var(--color-line)] p-3 text-[var(--color-muted)]"
                }
              >
                {o}
                {i === dec.answerIndex && (
                  <span className="ml-2 font-[family-name:var(--font-display)] text-xs font-semibold tracking-[0.1em] text-[var(--color-good)] uppercase">
                    Chosen
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[var(--color-muted)]">
            <strong className="font-[family-name:var(--font-display)] text-[var(--color-text)]">
              Tradeoff.{" "}
            </strong>
            {dec.tradeoff}
          </p>
          <p className="mt-2 text-[var(--color-muted)]">
            <strong className="font-[family-name:var(--font-display)] text-[var(--color-text)]">
              What would change my mind.{" "}
            </strong>
            {dec.changeMind}
          </p>
          <Link
            href="/playground"
            className="mt-4 inline-flex items-center gap-1.5 font-[family-name:var(--font-display)] text-sm font-semibold hover:text-[var(--color-cyan)]"
          >
            Try this call yourself on the Playground <ArrowIcon />
          </Link>
        </div>
      </Tilt3D>
    ) : null,
    keyDecisions: ww ? <JourneyCurve headingLevel="h3" /> : flow ? <FlowDiagram {...flow} /> : null,
    prototypeOrShipped: ww ? (
      <Gallery />
    ) : (
      <div className="flex flex-wrap gap-3">
        {p.links
          .filter((l) => l.kind !== "internal")
          .map((l, i) => (
            <ButtonLink key={l.href} href={l.href} variant={i === 0 ? "primary" : "ghost"}>
              {l.label}
            </ButtonLink>
          ))}
      </div>
    ),
    evaluationAndMetrics: (
      <>
        {callouts && (
          <StaggerChildren as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {callouts.map((c) => (
              <StaggerItem as="li" key={c.label}>
                <HoverLift>
                  <Tilt3D size="sm" className="[border-radius:var(--radius-lg)]">
                    <div className="card flex h-full flex-col p-5">
                      <p className="display text-4xl">
                        <AnimatedCounter
                          value={c.value}
                          prefix={c.prefix}
                          suffix={c.suffix}
                          className="gradient-text"
                        />
                      </p>
                      <p className="mt-2 flex-1 text-[0.95rem] text-[var(--color-muted)]">{c.label}</p>
                      <div className="mt-3">
                        <ProvenanceBadge kind={c.kind} />
                      </div>
                    </div>
                  </Tilt3D>
                </HoverLift>
              </StaggerItem>
            ))}
          </StaggerChildren>
        )}
        {ww && <PricingTiers level="h3" />}
      </>
    ),
    resultsOrValidation: (
      <ul className="grid gap-2">
        {p.claims.map((c) => (
          <li
            key={c.text}
            className="flex flex-wrap items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-line)] p-3"
          >
            <ProvenanceBadge kind={c.provenance} />
            <span>{c.text}</span>
          </li>
        ))}
      </ul>
    ),
  };

  return (
    <>
      <ScrollProgressBar label={`Reading progress: ${p.title} case study`} />
      <header className="container-x pt-32 pb-12 md:pt-40">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 font-[family-name:var(--font-display)] text-sm text-[var(--color-faint)]"
        >
          <ol className="flex gap-2">
            <li>
              <Link href="/work" className="hover:text-[var(--color-text)]">
                Work
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[var(--color-muted)]">
              {p.title}
            </li>
          </ol>
        </nav>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <FadeIn>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <ProvenanceBadge kind={p.status === "Shipped" ? "measured" : "demo"} label={p.statusLabel} />
                <Chip>{p.category}</Chip>
              </div>
              <h1 className="display h-xl">{p.title}</h1>
              <p className="lede mt-5">{p.summary}</p>
              {role && (
                <p className="mt-5 font-[family-name:var(--font-display)] text-[0.95rem] text-[var(--color-muted)]">
                  <span className="text-[var(--color-faint)]">Role · </span>
                  {role}
                </p>
              )}
              {p.boundary && (
                <p className="mt-4 border-l-2 border-[var(--color-violet)] pl-3 text-[var(--color-muted)]">
                  {p.boundary}
                </p>
              )}
              <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tools">
                {p.tools.map((t) => (
                  <li key={t}>
                    <Chip>{t}</Chip>
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                {p.links
                  .filter((l) => l.kind !== "internal")
                  .map((l, i) => (
                    <ButtonLink key={l.href} href={l.href} variant={i === 0 ? "primary" : "ghost"}>
                      {i === 0 && p.status === "Shipped" ? "View live product" : l.label}
                    </ButtonLink>
                  ))}
              </div>
            </FadeIn>
          </div>
          <CaseHeroVisual slug={p.slug} />
        </div>
      </header>

      <div className="container-x grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
        <aside className="min-w-0">
          <StickyToc items={visible.map((s) => ({ id: s.id, label: s.label }))} />
        </aside>
        <article className="max-w-[820px] min-w-0">
          {visible.map((s, i) => {
            const text = cs[s.key] as string;
            return (
              <Section key={s.id} id={s.id} n={i + 1} label={s.label}>
                {isDraft(text) && (
                  <ProvenanceBadge kind="hypothesis" label="Draft — not shown in production" />
                )}
                <p className="text-[1.15rem] leading-relaxed text-[var(--color-muted)]">
                  {text.replace(/^DRAFT \(review\):\s*/, "")}
                </p>
                {extras[s.key]}
              </Section>
            );
          })}
        </article>
      </div>

      <nav aria-label="Next case study" className="container-x mt-16">
        <Link
          href={`/work/${next.slug}`}
          className="card group flex items-center justify-between gap-6 p-6 transition-colors hover:border-[var(--color-line-strong)] sm:p-8"
        >
          <span>
            <span className="eyebrow">Next case study</span>
            <span className="display mt-2 block text-[clamp(1.6rem,3vw,2.4rem)]">{next.title}</span>
          </span>
          <ArrowIcon className="h-6 w-6 transition-transform group-hover:translate-x-2" />
        </Link>
      </nav>
    </>
  );
}

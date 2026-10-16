"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { roles } from "@/data/experience";
import { metrics } from "@/data/metrics";
import { decisions, guardrail, pricingSim } from "@/data/playground";
import {
  pricingNotes,
  pricingTiers,
  roadmap,
  targets,
  projectionCaptions,
  tutoringComparison,
} from "@/data/wonderword";
import type { Metric } from "@/data/types";
import { buildProjection, projectionAssumptions } from "@/lib/projection";
import { checkStory } from "@/lib/guardrail";
import { simulatePricing } from "@/lib/pricing";
import { RoleGantt, TAG_LABEL } from "@/components/experience/Timeline";
import { AnimatedCounter, HoverLift, StaggerChildren, StaggerItem, Tilt3D } from "@/components/motion";
import { ProvenanceBadge } from "@/components/ui";
import { MetricCard } from "@/components/ui/MetricCard";
import { usePlaygroundSession } from "@/components/interactive/sessionStore";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/cn";
import { ChartCard } from "./ChartCard";
import { HBarChart, MarginChart, MixDonut, MrrChart, UsersChart } from "./LazyCharts";
import { usd } from "./theme";

type Tag = keyof typeof TAG_LABEL;
const FILTERS: readonly (Tag | "all")[] = ["all", "enterprise-ai", "consumer-ai", "analytics", "delivery"];

/* ───────────── 1. Career impact ───────────── */

export function CareerImpact() {
  const [tag, setTag] = useState<Tag | "all">("all");
  const m = useMotionPrefs();
  const shown = roles.filter((r) => tag === "all" || r.tags.includes(tag));
  const withMetrics = shown.filter((r) => r.metricIds.length);

  return (
    <div>
      <div role="group" aria-label="Filter roles by focus area" className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={tag === f}
            onClick={() => setTag(f)}
            className={cn(
              "rounded-full border px-4 py-2 font-[family-name:var(--font-display)] text-[0.9rem] transition-colors",
              tag === f
                ? "border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-bg)]"
                : "border-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-text)]",
            )}
          >
            {f === "all" ? "All roles" : TAG_LABEL[f]}
          </button>
        ))}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {`${shown.length} roles match. ${withMetrics.length} have documented metrics.`}
      </p>
      <RoleGantt activeTag={tag} />
      <h3 className="eyebrow mt-10 mb-4">Documented results by employer or project</h3>
      <LayoutGroup>
        <motion.ul layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {withMetrics.map((r) => (
              <motion.li
                key={r.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: m.dur(0.35) }}
              >
                <Tilt3D size="md" glare={false} className="[border-radius:var(--radius-lg)]">
                  <article className="card h-full p-5">
                    <h4 className="font-[family-name:var(--font-display)] font-semibold">{r.org}</h4>
                    <p className="text-sm text-[var(--color-muted)]">{r.title}</p>
                    <ul className="mt-4 grid gap-3">
                      {r.metricIds.map((id) => {
                        const mt = metrics[id as keyof typeof metrics] as Metric;
                        return (
                          <li key={id} className="flex items-baseline gap-3">
                            <span className="display min-w-[4.5rem] text-2xl">
                              <AnimatedCounter
                                value={mt.value}
                                prefix={mt.prefix}
                                suffix={mt.suffix === " years" ? "" : mt.suffix}
                              />
                            </span>
                            <span className="text-[0.95rem] text-[var(--color-muted)]">{mt.label}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </article>
                </Tilt3D>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>
      {withMetrics.length === 0 && (
        <p className="text-[var(--color-muted)]">
          No quantified results are documented for roles in this filter.
        </p>
      )}
      <p className="mt-4 text-sm text-[var(--color-faint)]">
        Cloudera and Mu Sigma roles have no quantified results in the source material, so they appear on the
        timeline only.
      </p>
    </div>
  );
}

/* ───────────── 2. WonderWord AI beta dashboard ───────────── */

export function WonderWordDashboard() {
  const rows = useMemo(() => buildProjection(), []);
  const mix = pricingTiers.map((t) => ({ name: t.name, value: t.projectedMixPct }));
  const priceRows = tutoringComparison.map((t) => ({ name: t.label, value: t.monthly }));
  const last = rows[rows.length - 1]!;

  return (
    <div className="grid gap-6">
      <StaggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <MetricCard metric={metrics.betaFamilies} level="p" />
        </StaggerItem>
        {targets.slice(0, 3).map((t) => (
          <StaggerItem key={t.label}>
            <HoverLift>
              <Tilt3D size="sm" className="[border-radius:var(--radius-lg)]">
                <article className="card flex h-full flex-col p-6">
                  <p className="display text-[clamp(2.4rem,4.5vw,3.2rem)] leading-none">
                    <AnimatedCounter
                      value={t.value}
                      prefix={"prefix" in t ? t.prefix : ""}
                      suffix={t.suffix}
                      decimals={t.value % 1 ? 1 : 0}
                      className="gradient-text"
                    />
                  </p>
                  <p className="mt-3 font-[family-name:var(--font-display)] font-medium">{t.label}</p>
                  <div className="mt-auto pt-5">
                    <ProvenanceBadge kind="target" />
                  </div>
                </article>
              </Tilt3D>
            </HoverLift>
          </StaggerItem>
        ))}
      </StaggerChildren>

      <ConceptToRoadmap />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Modeled monthly recurring revenue"
          explanation={projectionCaptions.mrr}
          provenance="modeled"
          summary={`Modeled MRR rises from ${usd(rows[0]!.mrr)} in ${rows[0]!.month} to ${usd(last.mrr)} in ${last.month}. No revenue has been booked.`}
          rows={rows}
          columns={[
            { key: "month", label: "Month" },
            { key: "mrr", label: "Modeled MRR", numeric: true, format: (v) => usd(Number(v)) },
          ]}
          chart={(p) => <MrrChart data={rows} {...p} />}
        />
        <ChartCard
          title="Modeled free versus paying users"
          explanation={projectionCaptions.users}
          provenance="modeled"
          summary={`Modeled users grow from ${rows[0]!.totalUsers} to ${last.totalUsers.toLocaleString()}, with ${last.payingUsers} paying in ${last.month}.`}
          rows={rows}
          columns={[
            { key: "month", label: "Month" },
            { key: "freeUsers", label: "Free", numeric: true, format: (v) => Number(v).toLocaleString() },
            { key: "payingUsers", label: "Paying", numeric: true, format: (v) => Number(v).toLocaleString() },
            { key: "totalUsers", label: "Total", numeric: true, format: (v) => Number(v).toLocaleString() },
          ]}
          chart={(p) => <UsersChart data={rows} {...p} />}
        />
        <ChartCard
          title="Modeled gross margin"
          explanation={projectionCaptions.margin}
          provenance="modeled"
          summary={`Modeled gross margin holds near ${last.grossMarginPct}% once paying users exist, inside the ${pricingNotes.grossMarginBand.low} to ${pricingNotes.grossMarginBand.high}% band.`}
          rows={rows.filter((r) => r.mrr > 0)}
          columns={[
            { key: "month", label: "Month" },
            { key: "grossMarginPct", label: "Modeled gross margin", numeric: true, format: (v) => `${v}%` },
          ]}
          chart={(p) => <MarginChart data={rows} band={pricingNotes.grossMarginBand} {...p} />}
        />
        <ChartCard
          title="Projected user mix by tier"
          explanation="Share of users expected on each tier once the pricing model is live. Modelled, not booked."
          provenance="modeled"
          summary="Projected mix: Free 70%, DIY Coach 20%, Family Coach 10%, so 30% paid."
          rows={mix}
          columns={[
            { key: "name", label: "Tier" },
            { key: "value", label: "Projected share", numeric: true, format: (v) => `${v}%` },
          ]}
          chart={(p) => <MixDonut data={mix} {...p} />}
        />
      </div>

      <ChartCard
        title="Monthly price compared with tutoring"
        explanation="What a family pays each month on each paid tier, against typical private tutoring. Tutoring comparison uses published rates."
        provenance="research"
        summary="DIY Coach $9.99 and Family Coach $17.99 a month, against typical tutoring of $200 or more a month."
        rows={priceRows}
        columns={[
          { key: "name", label: "Option" },
          {
            key: "value",
            label: "Monthly cost",
            numeric: true,
            format: (v) => (Number(v) >= 200 ? "$200+" : `$${Number(v).toFixed(2)}`),
          },
        ]}
        chart={(p) => (
          <HBarChart
            data={[...priceRows].reverse()}
            format={(v) => (v >= 200 ? "$200+" : `$${v.toFixed(2)}`)}
            {...p}
          />
        )}
      />

      <AssumptionsTable />
    </div>
  );
}

function ConceptToRoadmap() {
  const m = useMotionPrefs();
  const steps = [
    { label: "Concept", detail: "August 2026" },
    { label: "Private beta", detail: "Four weeks later · 100+ families" },
    { label: "MVP 1", detail: "Three MVPs" },
    { label: "MVP 2", detail: roadmap.summary.replace("Three MVPs, ", "") },
    { label: "MVP 3", detail: "Target: March 2027" },
  ];
  return (
    <Tilt3D size="lg" glare={false} className="[border-radius:var(--radius-lg)]">
      <section aria-labelledby="ctr-t" className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 id="ctr-t" className="font-[family-name:var(--font-display)] text-lg font-semibold">
              Concept to beta, and the roadmap through March 2027
            </h3>
            <p className="mt-1 text-[0.95rem] text-[var(--color-muted)]">
              {roadmap.conceptToBeta}. {roadmap.summary}. {roadmap.schoolPilots}. Individual MVP dates are not
              published.
            </p>
          </div>
          <ProvenanceBadge kind="measured" label="Measured + plan" />
        </div>
        <ol className="relative mt-8 grid gap-6 sm:grid-cols-5 sm:gap-2">
          <div
            aria-hidden="true"
            className="absolute top-2 left-[7px] h-[calc(100%-16px)] w-px bg-[var(--color-line)] sm:top-[7px] sm:left-0 sm:h-px sm:w-full"
          />
          <motion.div
            aria-hidden="true"
            className="absolute top-2 left-[6px] hidden h-[3px] origin-left bg-gradient-to-r from-[var(--color-violet)] to-[var(--color-cyan)] sm:top-[6px] sm:left-0 sm:block"
            initial={{ width: m.enabled ? "0%" : "28%" }}
            whileInView={{ width: "28%" }}
            viewport={{ once: true }}
            transition={{ duration: m.dur(1.2), ease: [0.16, 1, 0.3, 1] }}
          />
          {steps.map((s, i) => (
            <li key={s.label} className="relative pl-7 sm:pt-7 sm:pl-0">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-0.5 left-0 h-4 w-4 rounded-full border-2 sm:top-0",
                  i < 2
                    ? "border-[var(--color-cyan)] bg-[var(--color-cyan)]"
                    : "border-[var(--color-line-strong)] bg-[var(--color-bg)]",
                )}
              />
              <p className="font-[family-name:var(--font-display)] font-semibold">{s.label}</p>
              <p className="text-sm text-[var(--color-muted)]">{s.detail}</p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-xs tracking-[0.1em] text-[var(--color-faint)] uppercase">
                {i < 2 ? "Done" : "Planned"}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </Tilt3D>
  );
}

function AssumptionsTable() {
  const a = projectionAssumptions;
  const rows = [
    ["Starting users", `${a.startUsers} (the beta families)`, "Sourced"],
    ["Users, March 2027", `${a.endUsers.toLocaleString()}+`, "Sourced target"],
    ["MRR, March 2027", usd(a.targetMrr), "Sourced target"],
    [
      "Prices",
      pricingTiers
        .filter((t) => t.monthly)
        .map((t) => `${t.name} $${t.monthly}`)
        .join(", "),
      "Sourced",
    ],
    ["DIY : Family paying split", "2 : 1", "From the projected 20% / 10% mix"],
    [
      "Blended cost to serve",
      `$${a.costToServe.toFixed(2)} per paying user`,
      `Midpoint of the sourced $${pricingNotes.costToServe.low}–${pricingNotes.costToServe.high} range`,
    ],
    ["User growth", "Even monthly growth rate between the two user anchors", "Modeling assumption"],
    [
      "Paid share",
      "Ramps linearly from 0% during the free beta to the share that reaches the MRR target",
      "Modeling assumption",
    ],
    [
      "Excluded",
      "Annual plans and their 17% discount, support, payment processing, acquisition",
      "As in the pricing strategy",
    ],
  ];
  return (
    <details className="card group p-5 sm:p-6">
      <summary className="cursor-pointer list-none font-[family-name:var(--font-display)] font-semibold marker:hidden">
        <span className="inline-flex items-center gap-2">
          How the projection is built
          <svg
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className="transition-transform group-open:rotate-180"
          >
            <path
              d="M2 4l4 4 4-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </summary>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left font-[family-name:var(--font-display)] text-[0.9rem]">
          <caption className="sr-only">Projection inputs and their sources</caption>
          <thead>
            <tr className="border-b border-[var(--color-line-strong)] text-[var(--color-muted)]">
              <th scope="col" className="py-2 pr-4 font-medium">
                Input
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Value
              </th>
              <th scope="col" className="py-2 font-medium">
                Basis
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([k, v, b]) => (
              <tr key={k} className="border-b border-[var(--color-line)] align-top">
                <th scope="row" className="py-2 pr-4 font-normal text-[var(--color-text)]">
                  {k}
                </th>
                <td className="py-2 pr-4 text-[var(--color-muted)]">{v}</td>
                <td className="py-2 text-[var(--color-faint)]">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/* ───────────── 3. Enterprise delivery ───────────── */

export function EnterpriseDelivery() {
  const list = [metrics.integrations, metrics.c3Reporting, metrics.c3Engagement, metrics.c3Rework];
  return (
    <StaggerChildren as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {list.map((mt) => (
        <StaggerItem as="li" key={mt.id}>
          <MetricCard metric={mt} />
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}

/* ───────────── 4. Product-thinking demos ───────────── */

export function DemoMetrics() {
  const session = usePlaygroundSession();
  const presetRows = guardrail.presets.map((p) => {
    const r = checkStory(p.word, p.story);
    return { name: p.label, value: r.score, result: r.passes ? "Shown to child" : "Fallback shown" };
  });
  const sim = session.simulatorLast ?? pricingSim.baseline;
  const out = simulatePricing(sim);
  const picks = Object.entries(session.picks);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ChartCard
        title="Story guardrail: preset results"
        explanation="Scores from the simplified checker for the four documented example stories. Under 90 the child sees a fallback."
        provenance="demo"
        summary={presetRows.map((r) => `${r.name}: ${r.value}, ${r.result}`).join("; ")}
        rows={presetRows}
        columns={[
          { key: "name", label: "Example" },
          { key: "value", label: "Score", numeric: true },
          { key: "result", label: "Outcome" },
        ]}
        chart={(p) => <HBarChart data={presetRows} format={(v) => String(v)} {...p} height={220} />}
        footnote={`Stories you checked on the Playground this visit: ${session.guardrailRuns}.`}
      />
      <Tilt3D size="md" glare={false} className="[border-radius:var(--radius-lg)]">
        <section aria-labelledby="sim-out" className="card h-full p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 id="sim-out" className="font-[family-name:var(--font-display)] text-lg font-semibold">
              Pricing simulator: {session.simulatorLast ? "your last inputs" : "baseline"}
            </h3>
            <ProvenanceBadge kind="modeled" />
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-4 font-[family-name:var(--font-display)]">
            {[
              ["Users", sim.users.toLocaleString()],
              ["Free → DIY", `${sim.diyPct}%`],
              ["Free → Family", `${out.familyPct}%`],
              ["Cost to serve", `$${sim.costToServe.toFixed(2)}`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-sm text-[var(--color-faint)]">{k}</dt>
                <dd className="text-lg">{v}</dd>
              </div>
            ))}
          </dl>
          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-[var(--color-line)] pt-4 font-[family-name:var(--font-display)]">
            <div>
              <dt className="text-sm text-[var(--color-faint)]">Monthly revenue</dt>
              <dd className="display text-2xl">
                <AnimatedCounter value={Math.round(out.mrr)} prefix="$" />
              </dd>
            </div>
            <div>
              <dt className="text-sm text-[var(--color-faint)]">Gross margin</dt>
              <dd className="display text-2xl">
                <AnimatedCounter value={Math.round(out.grossMarginPct)} suffix="%" />
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            Formulas and assumptions are documented on the Playground. Modelled projections, not booked
            revenue.
          </p>
        </section>
      </Tilt3D>
      <Tilt3D size="md" glare={false} className="[border-radius:var(--radius-lg)]">
        <section aria-labelledby="dec-out" className="card h-full p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 id="dec-out" className="font-[family-name:var(--font-display)] text-lg font-semibold">
              Decision explorer: this visit
            </h3>
            <ProvenanceBadge kind="demo" />
          </div>
          {picks.length === 0 ? (
            <p className="mt-4 text-[var(--color-muted)]">
              No decisions answered yet. Try the four calls on the Playground; your picks show here for this
              visit only.
            </p>
          ) : (
            <ul className="mt-4 grid gap-3">
              {picks.map(([d, o]) => {
                const dec = decisions[Number(d)]!;
                const same = dec.answerIndex === o;
                return (
                  <li key={d} className="rounded-[var(--radius-md)] border border-[var(--color-line)] p-3">
                    <p className="font-[family-name:var(--font-display)] text-sm font-semibold">
                      {dec.project}
                    </p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {same
                        ? "Matched the documented decision"
                        : "Chose differently from the documented decision"}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-4 text-sm text-[var(--color-faint)]">
            Kept in memory only. Nothing is stored or sent.
          </p>
        </section>
      </Tilt3D>
    </div>
  );
}

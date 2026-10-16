"use client";

import { useEffect, useId, useState } from "react";
import { pricingSim } from "@/data/playground";
import { bandMessage, simulatePricing, type PricingInput } from "@/lib/pricing";
import { AnimatedCounter, PressFeedback, Tilt3D } from "@/components/motion";
import { ProvenanceBadge } from "@/components/ui";
import { SimulatorBars } from "@/components/dashboard/LazyCharts";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { usePlaygroundSession } from "./sessionStore";
import { cn } from "@/lib/cn";

type Key = keyof PricingInput;

const SLIDERS: { key: Key; label: string; fmt: (v: number) => string; unit: string }[] = [
  { key: "users", label: "Total users", fmt: (v) => v.toLocaleString("en-US"), unit: "users" },
  { key: "diyPct", label: "Free to DIY Coach", fmt: (v) => `${v}%`, unit: "percent" },
  { key: "familyPct", label: "Free to Family Coach", fmt: (v) => `${v}%`, unit: "percent" },
  {
    key: "costToServe",
    label: "Cost to serve each paying user",
    fmt: (v) => `$${v.toFixed(2)}`,
    unit: "dollars",
  },
];

const BAND_TONE = {
  "no-paying": "text-[var(--color-warn)]",
  negative: "text-[var(--color-bad)]",
  thin: "text-[var(--color-warn)]",
  validated: "text-[var(--color-good)]",
} as const;

/** Monthly pricing model with the formulas from the August 2026 pricing strategy. Modeled. */
export function PricingSimulator({ level = "h2" }: { level?: "h2" | "h3" }) {
  const [v, setV] = useState<PricingInput>({ ...pricingSim.baseline });
  const out = simulatePricing(v);
  const m = useMotionPrefs();
  const id = useId();
  const setSession = usePlaygroundSession((s) => s.setSimulator);
  const H = level;

  useEffect(() => {
    const t = window.setTimeout(() => setSession({ ...v, familyPct: out.familyPct }), 400);
    return () => window.clearTimeout(t);
  }, [v, out.familyPct, setSession]);

  const set = (k: Key, n: number) =>
    setV((prev) => {
      const next = { ...prev, [k]: n };
      // Same clamp as the source: DIY + Family can never exceed 100%.
      if (next.diyPct + next.familyPct > 100) next.familyPct = 100 - next.diyPct;
      return next;
    });

  const isBaseline = (Object.keys(pricingSim.baseline) as Key[]).every(
    (k) => v[k] === pricingSim.baseline[k],
  );

  return (
    <Tilt3D
      size="lg"
      maxDeg={2.5}
      glare={false}
      cursor="default"
      className="[border-radius:var(--radius-lg)]"
    >
      <section aria-labelledby={`${id}-h`} className="card p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <H id={`${id}-h`} className="display text-[1.7rem] [font-stretch:105%]">
            {pricingSim.title}
          </H>
          <ProvenanceBadge kind="modeled" label="Modeled projection" />
        </div>
        <p className="mt-2 max-w-2xl text-[var(--color-muted)]">{pricingSim.body}</p>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="grid gap-5">
            {SLIDERS.map((s) => {
              const r = pricingSim.ranges[s.key];
              const value = s.key === "familyPct" ? out.familyPct : v[s.key];
              return (
                <div key={s.key}>
                  <div className="flex items-baseline justify-between gap-3">
                    <label
                      htmlFor={`${id}-${s.key}`}
                      className="font-[family-name:var(--font-display)] text-[0.95rem] font-medium"
                    >
                      {s.label}
                    </label>
                    <output
                      htmlFor={`${id}-${s.key}`}
                      className="font-[family-name:var(--font-display)] text-lg font-semibold tabular-nums"
                    >
                      {s.fmt(value)}
                    </output>
                  </div>
                  <input
                    id={`${id}-${s.key}`}
                    type="range"
                    min={r.min}
                    max={r.max}
                    step={r.step}
                    value={value}
                    aria-valuetext={`${s.fmt(value)}`}
                    onChange={(e) => set(s.key, Number(e.target.value))}
                    className="mt-1 w-full"
                    data-cursor="drag"
                  />
                  <div
                    className="flex justify-between font-[family-name:var(--font-display)] text-xs text-[var(--color-faint)]"
                    aria-hidden="true"
                  >
                    <span>{s.fmt(r.min)}</span>
                    <span>{s.fmt(r.max)}</span>
                  </div>
                </div>
              );
            })}
            <PressFeedback className="self-start">
              <button
                type="button"
                onClick={() => setV({ ...pricingSim.baseline })}
                disabled={isBaseline}
                className="rounded-full border border-[var(--color-line-strong)] px-4 py-2 font-[family-name:var(--font-display)] text-sm font-semibold hover:bg-[var(--color-raised)] disabled:opacity-40"
              >
                Reset to baseline
              </button>
            </PressFeedback>
          </div>

          <div>
            <dl className="grid grid-cols-2 gap-3">
              {[
                { k: "Monthly recurring revenue", v: Math.round(out.mrr), pre: "$", suf: "" },
                { k: "Annual run rate", v: Math.round(out.annualRunRate), pre: "$", suf: "" },
                { k: "Gross margin", v: Math.round(out.grossMarginPct), pre: "", suf: "%" },
                { k: "Paying users", v: out.payingUsers, pre: "", suf: "" },
              ].map((o) => (
                <div
                  key={o.k}
                  className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-bg)] p-4"
                >
                  <dt className="font-[family-name:var(--font-display)] text-sm text-[var(--color-muted)]">
                    {o.k}
                  </dt>
                  <dd className="display mt-1 text-[1.9rem]">
                    <AnimatedCounter value={o.v} prefix={o.pre} suffix={o.suf} />
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-line)] p-3">
              <SimulatorBars
                revenue={out.mrr}
                cost={out.payingUsers * v.costToServe}
                animate={m.enabled}
                duration={Math.round(m.dur(0.5) * 1000)}
              />
            </div>
            <p
              role="status"
              aria-live="polite"
              className={cn("mt-4 font-[family-name:var(--font-display)] font-medium", BAND_TONE[out.band])}
            >
              {bandMessage[out.band]}
            </p>
          </div>
        </div>

        <details className="mt-6 rounded-[var(--radius-md)] border border-[var(--color-line)] p-4">
          <summary className="cursor-pointer font-[family-name:var(--font-display)] font-semibold">
            Formulas and assumptions
          </summary>
          <p className="mt-3 text-[var(--color-muted)]">{pricingSim.formulas}</p>
          <p className="mt-2 text-[var(--color-muted)]">{pricingSim.assumptions}</p>
        </details>
      </section>
    </Tilt3D>
  );
}

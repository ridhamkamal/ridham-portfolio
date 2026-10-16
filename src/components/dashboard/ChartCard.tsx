"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState, type ReactNode } from "react";
import type { Provenance } from "@/data/types";
import { AnimatedChart, Tilt3D } from "@/components/motion";
import { ProvenanceBadge } from "@/components/ui";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/cn";

export interface Column<Row> {
  key: keyof Row & string;
  label: string;
  format?: (v: Row[keyof Row]) => string;
  numeric?: boolean;
}

/**
 * Every dashboard chart: title, explanation, evidence badge, a text summary
 * (aria-describedby), and a Chart/Table toggle over the same rows. The table is
 * server-rendered in <noscript> so data is readable without JS.
 */
export function ChartCard<Row extends object>({
  title,
  explanation,
  provenance,
  summary,
  rows,
  columns,
  chart,
  className,
  level = "h3",
  footnote,
}: {
  title: string;
  explanation: ReactNode;
  provenance: Provenance;
  summary: string;
  rows: readonly Row[];
  columns: readonly Column<Row>[];
  chart: (anim: { animate: boolean; duration: number; inView: boolean }) => ReactNode;
  className?: string;
  level?: "h2" | "h3";
  footnote?: ReactNode;
}) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const id = useId();
  const m = useMotionPrefs();
  const H = level;

  const table = (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left font-[family-name:var(--font-display)] text-[0.9rem]">
        <caption className="sr-only">{title} — data table</caption>
        <thead>
          <tr className="border-b border-[var(--color-line-strong)] text-[var(--color-muted)]">
            {columns.map((c) => (
              <th key={c.key} scope="col" className={cn("px-2 py-2 font-medium", c.numeric && "text-right")}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-[var(--color-line)]">
              {columns.map((c, j) => {
                const v = r[c.key] as Row[keyof Row];
                const Cell = j === 0 ? "th" : "td";
                return (
                  <Cell
                    key={c.key}
                    {...(j === 0 ? { scope: "row" } : {})}
                    className={cn(
                      "px-2 py-2 font-normal tabular-nums",
                      c.numeric && "text-right",
                      j === 0 && "text-[var(--color-text)]",
                    )}
                  >
                    {c.format ? c.format(v) : String(v)}
                  </Cell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <Tilt3D size="lg" glare={false} className={cn("[border-radius:var(--radius-lg)]", className)}>
      <section
        aria-labelledby={`${id}-t`}
        aria-describedby={`${id}-s`}
        className="card flex h-full flex-col p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <H
              id={`${id}-t`}
              className="font-[family-name:var(--font-display)] text-lg leading-snug font-semibold"
            >
              {title}
            </H>
            <div className="mt-1 text-[0.95rem] text-[var(--color-muted)]">{explanation}</div>
          </div>
          <ProvenanceBadge kind={provenance} />
        </div>

        <div
          role="group"
          aria-label={`${title}: view as`}
          className="mt-4 inline-flex self-start rounded-full border border-[var(--color-line)] p-0.5"
        >
          {(["chart", "table"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-full px-3 py-1 font-[family-name:var(--font-display)] text-[0.8rem] capitalize transition-colors",
                view === v
                  ? "bg-[var(--color-raised)] text-[var(--color-text)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)]",
              )}
            >
              {v}
            </button>
          ))}
        </div>

        <p id={`${id}-s`} className="sr-only">
          {summary}
        </p>

        <div className="mt-4 flex-1">
          <AnimatePresence mode="wait" initial={false}>
            {view === "chart" ? (
              <motion.div
                key="chart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: m.dur(0.2) }}
              >
                <AnimatedChart>
                  {({ animate, duration, inView }) =>
                    inView ? chart({ animate, duration, inView }) : <div className="h-[240px]" />
                  }
                </AnimatedChart>
              </motion.div>
            ) : (
              <motion.div
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: m.dur(0.2) }}
              >
                {table}
              </motion.div>
            )}
          </AnimatePresence>
          <noscript>{table}</noscript>
        </div>
        {footnote && (
          <div className="mt-4 border-t border-[var(--color-line)] pt-3 text-sm text-[var(--color-muted)]">
            {footnote}
          </div>
        )}
      </section>
    </Tilt3D>
  );
}

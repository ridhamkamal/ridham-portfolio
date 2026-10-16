"use client";

import { motion } from "framer-motion";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";

/**
 * Animated step flow: nodes appear in sequence and connectors draw between
 * them as the diagram scrolls into view. Semantic ordered list underneath.
 */
export function FlowDiagram({
  title,
  steps,
}: {
  title: string;
  steps: readonly { label: string; detail?: string }[];
}) {
  const m = useMotionPrefs();
  const step = (i: number) => (m.enabled ? (0.15 + i * 0.22) / m.speed : 0);
  return (
    <figure className="card p-5 sm:p-6">
      <figcaption className="eyebrow mb-5">{title}</figcaption>
      <ol className="grid gap-4 md:auto-cols-fr md:grid-flow-col md:gap-0">
        {steps.map((s, i) => (
          <li key={s.label} className="relative flex gap-4 md:flex-col md:gap-3 md:pr-6">
            {i < steps.length - 1 && (
              <motion.span
                aria-hidden="true"
                className="absolute top-9 left-[15px] h-[calc(100%-12px)] w-px origin-top bg-gradient-to-b from-[var(--color-violet)] to-[var(--color-cyan)] md:top-[15px] md:right-2 md:left-9 md:h-px md:w-auto md:origin-left md:bg-gradient-to-r"
                initial={{ scale: m.enabled ? 0 : 1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: m.dur(0.4), delay: step(i) + 0.15 }}
              />
            )}
            <motion.span
              aria-hidden="true"
              className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--color-violet)] bg-[var(--color-bg)] font-[family-name:var(--font-display)] text-sm font-semibold"
              initial={{ scale: m.enabled ? 0.4 : 1, opacity: m.enabled ? 0 : 1 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ type: "spring", stiffness: 400, damping: 22, delay: step(i) }}
            >
              {i + 1}
            </motion.span>
            <div>
              <p className="font-[family-name:var(--font-display)] font-semibold">{s.label}</p>
              {s.detail && <p className="mt-0.5 text-[0.95rem] text-[var(--color-muted)]">{s.detail}</p>}
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}

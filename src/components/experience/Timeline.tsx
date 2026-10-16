"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useId, useRef, useState } from "react";
import { roles } from "@/data/experience";
import { isTodo, type Role } from "@/data/types";
import { metrics } from "@/data/metrics";
import { StaggerChildren, StaggerItem, Tilt3D, HoverLift } from "@/components/motion";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { currentMonth, durationLabel, formatMonth, monthIndex } from "@/lib/dates";
import { cn } from "@/lib/cn";

const TAG_LABEL = {
  "enterprise-ai": "Enterprise AI",
  "consumer-ai": "Consumer AI",
  analytics: "Analytics",
  delivery: "Product delivery",
} as const;

/**
 * Gantt-style overview. Each role is its own row, so concurrent roles overlap
 * visibly instead of being flattened into a false sequence.
 */
export function RoleGantt({
  className,
  activeTag,
}: {
  className?: string;
  activeTag?: keyof typeof TAG_LABEL | "all";
}) {
  const m = useMotionPrefs();
  const uid = useId().replace(/:/g, "");
  const now = currentMonth();
  const startAll = monthIndex("2016-01");
  const endAll = monthIndex(now) + 3;
  const span = endAll - startAll;
  const ordered = [...roles].sort((a, b) => monthIndex(a.start) - monthIndex(b.start));
  const years = Array.from({ length: Math.floor(span / 12) + 1 }, (_, i) => 2016 + i).filter(
    (y) => y % 2 === 0,
  );
  const W = 1000;
  const rowH = 34;
  const top = 26;
  const H = top + ordered.length * rowH + 8;
  const x = (ym: string) => ((monthIndex(ym) - startAll) / span) * W;

  return (
    <figure className={cn("card overflow-x-auto p-4 sm:p-6", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="min-w-[640px]"
        role="img"
        aria-labelledby={`${uid}-t ${uid}-d`}
      >
        <title id={`${uid}-t`}>Career timeline, 2016 to present</title>
        <desc id={`${uid}-d`}>
          {ordered
            .map(
              (r) =>
                `${r.org}, ${r.title}: ${formatMonth(r.start)} to ${r.end ? formatMonth(r.end) : "present"}.`,
            )
            .join(" ")}{" "}
          Juniper Networks, WonderWord AI and PM Accelerator run concurrently from August 2026.
        </desc>
        {years.map((y) => (
          <g key={y}>
            <line x1={x(`${y}-01`)} x2={x(`${y}-01`)} y1={top - 6} y2={H} stroke="rgba(244,239,230,0.08)" />
            <text x={x(`${y}-01`) + 4} y={14} fontSize="12" fill="#8c877f" fontFamily="var(--font-archivo)">
              {y}
            </text>
          </g>
        ))}
        {ordered.map((r, i) => {
          const x1 = x(r.start);
          const x2 = x(r.end ?? now);
          const dim = activeTag && activeTag !== "all" && !r.tags.includes(activeTag);
          const live = r.end === null;
          return (
            <g
              key={r.id}
              transform={`translate(0 ${top + i * rowH})`}
              opacity={dim ? 0.25 : 1}
              style={{ transition: "opacity .4s" }}
            >
              <motion.rect
                x={x1}
                y={4}
                height={rowH - 12}
                rx={8}
                fill={live ? `url(#${uid}-live)` : "rgba(165,148,255,0.35)"}
                initial={{ width: m.enabled ? 0 : Math.max(6, x2 - x1) }}
                whileInView={{ width: Math.max(6, x2 - x1) }}
                viewport={{ once: true }}
                transition={{
                  duration: m.dur(0.9),
                  delay: m.enabled ? (i * 0.08) / m.speed : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
              <text
                x={x1 > W * 0.7 ? x1 - 8 : x1 + 10}
                y={rowH / 2 + 2}
                textAnchor={x1 > W * 0.7 ? "end" : "start"}
                fontSize="13"
                fontFamily="var(--font-archivo)"
                fill="#f4efe6"
              >
                {r.org}
              </text>
            </g>
          );
        })}
        <defs>
          <linearGradient id={`${uid}-live`} x1="0" x2="1">
            <stop offset="0" stopColor="#a594ff" />
            <stop offset="1" stopColor="#67e0f0" />
          </linearGradient>
        </defs>
      </svg>
      <figcaption className="mt-3 text-sm text-[var(--color-muted)]">
        Bars that overlap ran at the same time. Gradient bars are current roles.
      </figcaption>
    </figure>
  );
}

function RoleCard({ role: r, level }: { role: Role; level: 3 | 4 }) {
  const H = level === 3 ? "h3" : "h4";
  const [open, setOpen] = useState(false);
  const m = useMotionPrefs();
  const id = useId();
  const roleMetrics = r.metricIds.map((k) => metrics[k as keyof typeof metrics]).filter(Boolean);
  return (
    <HoverLift distance={4}>
      <Tilt3D size="lg" glare={false} className="[border-radius:var(--radius-lg)]">
        <article className="card h-full p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.12em] text-[var(--color-cyan)] uppercase">
              {r.org}
            </p>
            <p className="font-[family-name:var(--font-display)] text-sm text-[var(--color-muted)]">
              <time dateTime={r.start}>{formatMonth(r.start)}</time> –{" "}
              {r.end ? <time dateTime={r.end}>{formatMonth(r.end)}</time> : <span>Present</span>}
              <span className="text-[var(--color-faint)]"> · {durationLabel(r.start, r.end)}</span>
            </p>
          </div>
          <H className="display mt-2 text-[1.45rem] [font-stretch:104%]">{r.title}</H>
          {!isTodo(r.location) && <p className="text-sm text-[var(--color-faint)]">{r.location}</p>}
          <p className="mt-3 text-[var(--color-muted)]">{r.summary}</p>
          {roleMetrics.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Key results">
              {roleMetrics.map((mt) => (
                <li
                  key={mt.id}
                  className="rounded-full border border-[var(--color-line)] px-3 py-1 font-[family-name:var(--font-display)] text-[0.82rem]"
                >
                  <span className="font-semibold text-[var(--color-text)]">
                    {mt.value}
                    {"suffix" in mt ? mt.suffix : ""}
                  </span>{" "}
                  <span className="text-[var(--color-muted)]">{mt.label}</span>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((o) => !o)}
            className="mt-5 inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-[0.9rem] font-semibold text-[var(--color-text)] hover:text-[var(--color-cyan)]"
          >
            {open ? "Hide details" : "What I did"}
            <motion.svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: m.dur(0.25) }}
            >
              <path
                d="M2 4l4 4 4-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </motion.svg>
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: m.dur(0.35), ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <ul className="mt-4 grid gap-2.5 border-t border-[var(--color-line)] pt-4 text-[1rem] text-[var(--color-muted)]">
                  {r.bullets.map((b) => (
                    <li
                      key={b}
                      className="relative pl-5 before:absolute before:top-[0.7em] before:left-0 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[var(--color-violet)]"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Focus areas">
            {r.tags.map((t) => (
              <li
                key={t}
                className="font-[family-name:var(--font-display)] text-[0.75rem] tracking-[0.1em] text-[var(--color-faint)] uppercase"
              >
                {TAG_LABEL[t]}
              </li>
            ))}
          </ul>
        </article>
      </Tilt3D>
    </HoverLift>
  );
}

/**
 * Full timeline. Concurrent current roles sit side by side in one "Now" band;
 * earlier roles follow down an animated progress line.
 */
export function Timeline({ limit, headingLevel = 2 }: { limit?: number; headingLevel?: 2 | 3 }) {
  const G = headingLevel === 2 ? "h2" : "h3";
  const cardLevel = headingLevel === 2 ? 3 : 4;
  const ref = useRef<HTMLDivElement>(null);
  const m = useMotionPrefs();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const current = roles.filter((r) => r.end === null);
  const past = roles
    .filter((r) => r.end !== null)
    .slice(0, limit ? Math.max(0, limit - current.length) : undefined);

  return (
    <div ref={ref} className="relative pl-7 sm:pl-10">
      <div
        className="absolute top-2 bottom-0 left-[7px] w-px bg-[var(--color-line)] sm:left-[11px]"
        aria-hidden="true"
      />
      <motion.div
        aria-hidden="true"
        className="absolute top-2 bottom-0 left-[6px] w-[3px] origin-top rounded-full bg-gradient-to-b from-[var(--color-violet)] to-[var(--color-cyan)] sm:left-[10px]"
        style={{ scaleY: m.enabled ? scaleY : 1 }}
      />
      <section aria-labelledby="tl-now" className="relative">
        <span
          className="absolute top-1 -left-7 h-4 w-4 rounded-full border-2 border-[var(--color-cyan)] bg-[var(--color-bg)] sm:-left-10"
          aria-hidden="true"
        />
        <G id="tl-now" className="eyebrow mb-1">
          Now · {current.length} concurrent roles
        </G>
        <p className="mb-5 text-[var(--color-muted)]">These run at the same time; they are not a sequence.</p>
        <StaggerChildren as="ul" className="grid gap-5 lg:grid-cols-3">
          {current.map((r) => (
            <StaggerItem as="li" key={r.id}>
              <RoleCard role={r} level={cardLevel} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>
      {past.length > 0 && (
        <section aria-labelledby="tl-past" className="relative mt-14">
          <span
            className="absolute top-1 -left-7 h-4 w-4 rounded-full border-2 border-[var(--color-violet)] bg-[var(--color-bg)] sm:-left-10"
            aria-hidden="true"
          />
          <G id="tl-past" className="eyebrow mb-5">
            Earlier
          </G>
          <StaggerChildren as="ol" className="grid gap-5 md:grid-cols-2">
            {past.map((r) => (
              <StaggerItem as="li" key={r.id}>
                <RoleCard role={r} level={cardLevel} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>
      )}
    </div>
  );
}

export { TAG_LABEL };

"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState, type KeyboardEvent } from "react";
import { journey, miscueCallout } from "@/data/wonderword";
import { AnimatedCounter, Tilt3D } from "@/components/motion";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/cn";

const W = 760;
const H = 230;
const PL = 30;
const PR = 30;
const PT = 40;
const PB = 40;
const X = (i: number) => PL + ((W - PL - PR) * i) / (journey.length - 1);
const Y = (v: number) => PT + (H - PT - PB) * (1 - v / 10);

/** Smooth path through the stage points (Catmull-Rom → cubic Bézier). */
function smoothPath(): string {
  const pts = journey.map((d, i) => [X(i), Y(d.valence)] as const);
  let d = `M${pts[0]![0]},${pts[0]![1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/**
 * Six-stage emotional journey. Stage selector is a tablist; the curve draws
 * itself on scroll; the selected stage's pain, intervention and figure animate in.
 */
export function JourneyCurve({ headingLevel = "h3" }: { headingLevel?: "h3" | "h4" }) {
  const [k, setK] = useState(3); // Miscue: the make-or-break stage, as in the source.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const m = useMotionPrefs();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const d = journey[k]!;
  const H3 = headingLevel;

  const onKey = (e: KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const n = (k + step + journey.length) % journey.length;
    setK(n);
    tabs.current[n]?.focus();
  };

  return (
    <div ref={ref}>
      <div role="tablist" aria-label="Journey stage" onKeyDown={onKey} className="mb-4 flex flex-wrap gap-2">
        {journey.map((s, n) => (
          <button
            key={s.name}
            ref={(el) => {
              tabs.current[n] = el;
            }}
            role="tab"
            id={`jt-${n}`}
            aria-selected={n === k}
            aria-controls="journey-panel"
            tabIndex={n === k ? 0 : -1}
            onClick={() => setK(n)}
            className={cn(
              "rounded-full border px-4 py-2 font-[family-name:var(--font-display)] text-[0.9rem] transition-colors",
              n === k
                ? "border-[var(--color-violet)] bg-[rgba(165,148,255,0.14)] text-[var(--color-text)]"
                : "border-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-text)]",
            )}
          >
            <span className="mr-1.5 text-[var(--color-faint)]">{n + 1}</span>
            {s.name}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden p-3 sm:p-5">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label={`Emotional curve across six stages: ${journey.map((s) => `${s.name} ${s.feeling} (${s.valence} of 10)`).join(", ")}.`}
        >
          <defs>
            <linearGradient id="jc-line" x1="0" x2="1">
              <stop offset="0" stopColor="#ff8f8f" />
              <stop offset="0.5" stopColor="#a594ff" />
              <stop offset="1" stopColor="#67e0f0" />
            </linearGradient>
            <linearGradient id="jc-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#a594ff" stopOpacity="0.22" />
              <stop offset="1" stopColor="#a594ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line
            x1={PL}
            x2={W - PR}
            y1={Y(5)}
            y2={Y(5)}
            stroke="rgba(244,239,230,0.1)"
            strokeDasharray="3 6"
          />
          <motion.path
            d={`${smoothPath()} L${X(journey.length - 1)},${H - PB} L${X(0)},${H - PB} Z`}
            fill="url(#jc-fill)"
            initial={{ opacity: m.enabled ? 0 : 1 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: m.dur(1), delay: m.enabled ? 0.6 : 0 }}
          />
          <motion.path
            d={smoothPath()}
            fill="none"
            stroke="url(#jc-line)"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: m.enabled ? 0 : 1 }}
            animate={inView ? { pathLength: 1 } : undefined}
            transition={{ duration: m.dur(1.6), ease: [0.65, 0, 0.35, 1] }}
          />
          {journey.map((s, n) => (
            <g key={s.name}>
              <text x={X(n)} y={Y(s.valence) - 18} textAnchor="middle" fontSize="18" aria-hidden="true">
                {s.emoji}
              </text>
              <circle
                cx={X(n)}
                cy={Y(s.valence)}
                r={n === k ? 9 : 6}
                fill={n === k ? "#f4efe6" : "#0b0b0f"}
                stroke={n === k ? "#a594ff" : "#b4aea4"}
                strokeWidth={2.5}
                onClick={() => setK(n)}
                style={{ cursor: "pointer", transition: "r .25s, fill .25s" }}
              />
              <text
                x={X(n)}
                y={H - 14}
                textAnchor="middle"
                fontSize="13"
                fill={n === k ? "#f4efe6" : "#8c877f"}
                fontFamily="var(--font-archivo)"
              >
                {s.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div id="journey-panel" role="tabpanel" aria-labelledby={`jt-${k}`} aria-live="polite" className="mt-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={d.name}
            initial={{ opacity: 0, y: 12 * m.scale }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 * m.scale }}
            transition={{ duration: m.dur(0.3) }}
            className="grid gap-4 md:grid-cols-[1.2fr_1fr_0.8fr]"
          >
            <Tilt3D size="md" glare={false} className="[border-radius:var(--radius-lg)]">
              <div className="card h-full p-5">
                <H3 className="display text-2xl">
                  {d.name}{" "}
                  <span className="text-[var(--color-muted)] [font-stretch:100%]">· {d.feeling}</span>
                </H3>
                <p className="mt-1 text-[var(--color-muted)]">{d.what}</p>
                <p className="mt-4 font-[family-name:var(--font-display)] text-sm tracking-[0.12em] text-[var(--color-bad)] uppercase">
                  Pain
                </p>
                <p className="mt-1">{d.pain}</p>
              </div>
            </Tilt3D>
            <Tilt3D size="md" glare={false} className="[border-radius:var(--radius-lg)]">
              <div className="card h-full p-5">
                <p className="font-[family-name:var(--font-display)] text-sm tracking-[0.12em] text-[var(--color-good)] uppercase">
                  Intervention
                </p>
                <p className="mt-1">{d.intervention}</p>
              </div>
            </Tilt3D>
            <Tilt3D size="sm" glare={false} className="[border-radius:var(--radius-lg)]">
              <div className="card flex h-full flex-col justify-center p-5">
                {d.figure ? (
                  <>
                    <p className="display text-5xl">
                      <AnimatedCounter
                        key={d.name}
                        value={d.figure.value}
                        className="gradient-text"
                        duration={0.8}
                      />
                    </p>
                    <p className="mt-2 text-[var(--color-muted)]">{d.figure.label}</p>
                  </>
                ) : (
                  <p className="text-[var(--color-muted)]">No figure documented for this stage.</p>
                )}
              </div>
            </Tilt3D>
          </motion.div>
        </AnimatePresence>
      </div>
      {d.name === "Miscue" && (
        <aside className="mt-5 rounded-[var(--radius-lg)] border border-[rgba(165,148,255,0.35)] bg-[rgba(165,148,255,0.06)] p-5">
          <p className="font-[family-name:var(--font-display)] font-semibold">{miscueCallout.title}</p>
          <p className="mt-1 text-[var(--color-muted)]">{miscueCallout.body}</p>
        </aside>
      )}
    </div>
  );
}

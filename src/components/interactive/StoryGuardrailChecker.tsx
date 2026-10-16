"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useDeferredValue, useEffect, useId, useRef, useState } from "react";
import { guardrail } from "@/data/playground";
import { checkStory } from "@/lib/guardrail";
import { AnimatedCounter, PressFeedback, Tilt3D } from "@/components/motion";
import { ProvenanceBadge } from "@/components/ui";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { usePlaygroundSession } from "./sessionStore";
import { cn } from "@/lib/cn";

/** Simplified demo of the four-layer story guardrail. Runs entirely in the browser. */
export function StoryGuardrailChecker({ level = "h2" }: { level?: "h2" | "h3" }) {
  const first = guardrail.presets[0];
  const [word, setWord] = useState<string>(first.word);
  const [story, setStory] = useState<string>(first.story);
  const dWord = useDeferredValue(word);
  const dStory = useDeferredValue(story);
  const r = checkStory(dWord, dStory);
  const m = useMotionPrefs();
  const id = useId();
  const count = usePlaygroundSession((s) => s.countGuardrailRun);
  const H = level;

  // Count distinct checks for the dashboard (debounced; in memory only).
  const t = useRef<number | undefined>(undefined);
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    window.clearTimeout(t.current);
    t.current = window.setTimeout(count, 700);
    return () => window.clearTimeout(t.current);
  }, [dWord, dStory, count]);

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
            {guardrail.title}
          </H>
          <ProvenanceBadge kind="demo" label="Simplified demo" />
        </div>
        <p className="mt-2 max-w-2xl text-[var(--color-muted)]">{guardrail.body}</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div role="group" aria-label="Load an example story" className="mb-4 flex flex-wrap gap-2">
              {guardrail.presets.map((p) => (
                <PressFeedback key={p.label}>
                  <button
                    type="button"
                    onClick={() => {
                      setWord(p.word);
                      setStory(p.story);
                    }}
                    aria-pressed={word === p.word && story === p.story}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 font-[family-name:var(--font-display)] text-[0.85rem] transition-colors",
                      word === p.word && story === p.story
                        ? "border-[var(--color-violet)] bg-[rgba(165,148,255,0.14)]"
                        : "border-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-text)]",
                    )}
                  >
                    {p.label}
                  </button>
                </PressFeedback>
              ))}
            </div>
            <label
              htmlFor={`${id}-w`}
              className="block font-[family-name:var(--font-display)] text-sm font-medium"
            >
              Target word the child missed
            </label>
            <input
              id={`${id}-w`}
              value={word}
              onChange={(e) => setWord(e.target.value)}
              maxLength={24}
              autoComplete="off"
              spellCheck={false}
              className="mt-1.5 w-full rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-[var(--color-bg)] px-3 py-2.5 font-[family-name:var(--font-display)] focus:border-[var(--color-cyan)]"
            />
            <label
              htmlFor={`${id}-s`}
              className="mt-4 block font-[family-name:var(--font-display)] text-sm font-medium"
            >
              Generated story
            </label>
            <textarea
              id={`${id}-s`}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={4}
              maxLength={600}
              aria-describedby={`${id}-disc`}
              className="mt-1.5 w-full resize-y rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-[var(--color-bg)] px-3 py-2.5 text-[1.05rem] leading-relaxed focus:border-[var(--color-cyan)]"
            />
            <p id={`${id}-disc`} className="mt-3 text-sm text-[var(--color-faint)]">
              {guardrail.disclaimer}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-5 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-bg)] p-4">
              <ScoreRing score={r.score} pass={r.passes} />
              <div>
                <p className="font-[family-name:var(--font-display)] text-sm text-[var(--color-muted)]">
                  Validation score
                </p>
                <p
                  className={cn(
                    "font-[family-name:var(--font-display)] text-lg font-semibold",
                    r.passes ? "text-[var(--color-good)]" : "text-[var(--color-bad)]",
                  )}
                >
                  {r.passes ? "✓ Passes, shown to the child" : "✕ Blocked, fallback shown"}
                </p>
              </div>
            </div>
            <ul className="mt-4 grid gap-2" aria-label="Checks">
              {r.checks.map((c) => (
                <motion.li
                  key={c.id}
                  layout={m.enabled}
                  className={cn(
                    "flex gap-3 rounded-[var(--radius-md)] border p-3",
                    c.ok
                      ? "border-[rgba(126,226,168,0.3)]"
                      : "border-[rgba(255,143,143,0.4)] bg-[rgba(255,143,143,0.05)]",
                  )}
                >
                  <motion.span
                    key={String(c.ok)}
                    initial={m.enabled ? { scale: 0.4, rotate: -30 } : false}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    aria-hidden="true"
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-full text-sm font-bold",
                      c.ok
                        ? "bg-[var(--color-good)] text-[var(--color-bg)]"
                        : "bg-[var(--color-bad)] text-[var(--color-bg)]",
                    )}
                  >
                    {c.ok ? "✓" : "✕"}
                  </motion.span>
                  <span>
                    <span className="block font-[family-name:var(--font-display)] font-semibold">
                      {c.title} <span className="sr-only">{c.ok ? "passed" : "failed"}</span>
                    </span>
                    <span className="block text-[0.95rem] text-[var(--color-muted)]">{c.detail}</span>
                  </span>
                </motion.li>
              ))}
            </ul>
            <AnimatePresence initial={false}>
              {!r.passes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: m.dur(0.3) }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 rounded-[var(--radius-md)] border border-dashed border-[rgba(242,196,109,0.5)] p-4">
                    <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-warn)]">
                      Fallback shown instead
                    </p>
                    <p className="mt-1 text-lg">
                      “Look at the <strong>{r.fallbackWord}</strong>. The <strong>{r.fallbackWord}</strong> is
                      here.”
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">{guardrail.fallbackNote}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <p role="status" aria-live="polite" className="sr-only">
              {`Score ${r.score}. ${r.passes ? "Passes; the story would be shown to the child." : "Blocked; the fallback story is shown."} ${r.checks
                .filter((c) => !c.ok)
                .map((c) => `${c.title} failed.`)
                .join(" ")}`}
            </p>
          </div>
        </div>
      </section>
    </Tilt3D>
  );
}

function ScoreRing({ score, pass }: { score: number; pass: boolean }) {
  const m = useMotionPrefs();
  const C = 2 * Math.PI * 30;
  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(244,239,230,0.1)" strokeWidth="6" />
        <motion.circle
          cx="36"
          cy="36"
          r="30"
          fill="none"
          stroke={pass ? "#7ee2a8" : "#ff8f8f"}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={C}
          animate={{ strokeDashoffset: C * (1 - score / 100) }}
          transition={{ duration: m.dur(0.6), ease: [0.16, 1, 0.3, 1] }}
        />
        <circle
          cx="36"
          cy="36"
          r="30"
          fill="none"
          stroke="#f4efe6"
          strokeOpacity="0.5"
          strokeWidth="1"
          strokeDasharray={`1 ${C}`}
          strokeDashoffset={-C * 0.9}
        />
      </svg>
      <span className="display absolute inset-0 grid place-items-center text-2xl">
        <AnimatedCounter value={score} duration={0.5} />
      </span>
    </div>
  );
}

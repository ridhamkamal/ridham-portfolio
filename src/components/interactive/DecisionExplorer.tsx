"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { decisions, decisionsIntro } from "@/data/playground";
import { Tilt3D } from "@/components/motion";
import { ProvenanceBadge } from "@/components/ui";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { usePlaygroundSession } from "./sessionStore";
import { cn } from "@/lib/cn";

/**
 * Pick an option (radio group), then reveal the documented decision.
 * Choices stay in memory for this visit; no analytics are sent.
 */
export function DecisionExplorer({ level = "h2" }: { level?: "h2" | "h3" }) {
  const [tab, setTab] = useState(0);
  const [choice, setChoice] = useState<Record<number, number | undefined>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const m = useMotionPrefs();
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const record = usePlaygroundSession((s) => s.pick);
  const d = decisions[tab]!;
  const picked = choice[tab];
  const shown = revealed[tab];
  const H = level;
  const H4 = level === "h2" ? "h3" : "h4";

  const onTabKey = (e: KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const n = (tab + step + decisions.length) % decisions.length;
    setTab(n);
    tabs.current[n]?.focus();
  };

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
            {decisionsIntro.title}
          </H>
          <ProvenanceBadge kind="demo" label="Documented decisions" />
        </div>
        <p className="mt-2 max-w-2xl text-[var(--color-muted)]">{decisionsIntro.body}</p>

        <div role="tablist" aria-label="Decision" onKeyDown={onTabKey} className="mt-6 flex flex-wrap gap-2">
          {decisionsIntro.tabs.map((t, n) => (
            <button
              key={t}
              ref={(el) => {
                tabs.current[n] = el;
              }}
              role="tab"
              id={`${id}-tab-${n}`}
              aria-selected={n === tab}
              aria-controls={`${id}-panel`}
              tabIndex={n === tab ? 0 : -1}
              onClick={() => setTab(n)}
              className={cn(
                "rounded-full border px-4 py-2 font-[family-name:var(--font-display)] text-[0.9rem] transition-colors",
                n === tab
                  ? "border-[var(--color-violet)] bg-[rgba(165,148,255,0.14)]"
                  : "border-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-text)]",
              )}
            >
              {t}
              {revealed[n] && (
                <span className="ml-1.5 text-[var(--color-good)]" aria-label="answered">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>

        <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${tab}`} className="mt-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 16 * m.scale }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 * m.scale }}
              transition={{ duration: m.dur(0.28) }}
            >
              <p className="eyebrow">{d.project}</p>
              <fieldset className="mt-2">
                <legend className="display text-[1.35rem] leading-snug [font-stretch:100%]">
                  {d.question}
                </legend>
                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {d.options.map((o, i) => {
                    const isPick = picked === i;
                    const isAns = shown && i === d.answerIndex;
                    const isMiss = shown && isPick && i !== d.answerIndex;
                    return (
                      <label
                        key={o}
                        className={cn(
                          "relative flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[var(--color-cyan)]",
                          isAns
                            ? "border-[var(--color-good)] bg-[rgba(126,226,168,0.08)]"
                            : isMiss
                              ? "border-[var(--color-bad)] bg-[rgba(255,143,143,0.06)]"
                              : isPick
                                ? "border-[var(--color-violet)] bg-[rgba(165,148,255,0.1)]"
                                : "border-[var(--color-line)] hover:border-[var(--color-line-strong)]",
                          shown && "cursor-default",
                        )}
                      >
                        <input
                          type="radio"
                          name={`${id}-opt-${tab}`}
                          value={i}
                          checked={isPick}
                          disabled={shown}
                          onChange={() => setChoice((c) => ({ ...c, [tab]: i }))}
                          className="mt-1 h-4 w-4 accent-[var(--color-violet)]"
                        />
                        <span>{o}</span>
                        {isAns && (
                          <span className="ml-auto shrink-0 font-[family-name:var(--font-display)] text-xs font-semibold tracking-[0.1em] text-[var(--color-good)] uppercase">
                            Chosen
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {!shown && (
                <button
                  type="button"
                  disabled={picked === undefined}
                  onClick={() => {
                    setRevealed((r) => ({ ...r, [tab]: true }));
                    if (picked !== undefined) record(tab, picked);
                  }}
                  className="mt-5 rounded-full bg-[var(--color-text)] px-5 py-2.5 font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {picked === undefined ? "Pick an option to reveal" : "Reveal what I chose"}
                </button>
              )}

              <div aria-live="polite">
                <AnimatePresence initial={false}>
                  {shown && (
                    <motion.div
                      initial={{ opacity: 0, y: 14 * m.scale }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: m.dur(0.4) }}
                      className="mt-6 grid gap-4 md:grid-cols-2"
                    >
                      <div className="md:col-span-2">
                        <p
                          className={cn(
                            "font-[family-name:var(--font-display)] font-semibold",
                            picked === d.answerIndex
                              ? "text-[var(--color-good)]"
                              : "text-[var(--color-warn)]",
                          )}
                        >
                          {picked === d.answerIndex ? "You picked the same one." : "I went a different way."}
                        </p>
                        <H4 className="display mt-1 text-xl [font-stretch:100%]">{d.chose}</H4>
                      </div>
                      {[
                        ["Evidence", d.evidence],
                        ["Tradeoff", d.tradeoff],
                        ["What would change my mind", d.changeMind],
                      ].map(([k, v], i) => (
                        <motion.div
                          key={k}
                          initial={{ opacity: 0, y: 10 * m.scale }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: m.dur(0.35),
                            delay: m.enabled ? (0.08 * (i + 1)) / m.speed : 0,
                          }}
                          className={cn(
                            "rounded-[var(--radius-md)] border border-[var(--color-line)] p-4",
                            i === 2 && "md:col-span-2",
                          )}
                        >
                          <p className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.1em] text-[var(--color-cyan)] uppercase">
                            {k}
                          </p>
                          <p className="mt-1.5 text-[var(--color-muted)]">{v}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </Tilt3D>
  );
}

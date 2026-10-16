"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useMotionStore, type Intensity, type Speed } from "./store";
import { MotionToggle } from "./MotionToggle";
import { usePointerFine } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/cn";

let opener: HTMLElement | null = null;

/** Opens the panel and remembers which control to return focus to. */
export function openMotionPanel() {
  opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  useMotionStore.getState().setPanelOpen(true);
}

/** Button used in the nav and footer. */
export function MotionControlsButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const open = useMotionStore((s) => s.panelOpen);
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls="motion-panel"
      onClick={() => (open ? useMotionStore.getState().setPanelOpen(false) : openMotionPanel())}
      className={className}
    >
      {children ?? "Motion controls"}
    </button>
  );
}

function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const idx = options.findIndex((o) => o.value === value);
  const onKey = (e: KeyboardEvent) => {
    const d =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!d) return;
    e.preventDefault();
    const n = (idx + d + options.length) % options.length;
    onChange(options[n]!.value);
    refs.current[n]?.focus();
  };
  return (
    <div className={cn("py-2.5", disabled && "opacity-50")}>
      <span id={id} className="mb-2 block font-[family-name:var(--font-display)] text-[0.95rem] font-medium">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={id}
        onKeyDown={onKey}
        className="relative grid auto-cols-fr grid-flow-col rounded-full border border-[var(--color-line)] bg-[var(--color-bg)] p-1"
      >
        {options.map((o, i) => {
          const on = o.value === value;
          return (
            <button
              key={String(o.value)}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              disabled={disabled}
              onClick={() => onChange(o.value)}
              className={cn(
                "relative isolate z-10 rounded-full px-3 py-1.5 font-[family-name:var(--font-display)] text-sm transition-colors",
                on ? "text-[var(--color-bg)]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]",
              )}
            >
              {on && (
                <motion.span
                  layoutId={`${id}-pill`}
                  className="absolute inset-0 -z-10 rounded-full bg-[var(--color-text)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const INTENSITIES = [
  { value: "subtle", label: "Subtle" },
  { value: "balanced", label: "Balanced" },
  { value: "cinematic", label: "Cinematic" },
] as const satisfies readonly { value: Intensity; label: string }[];
const SPEEDS = [
  { value: 0.5, label: "0.5×" },
  { value: 1, label: "1×" },
  { value: 1.5, label: "1.5×" },
] as const satisfies readonly { value: Speed; label: string }[];

/**
 * Floating, non-modal settings dialog. Escape or the close button dismisses it
 * and returns focus to the control that opened it.
 */
export function MotionPanel() {
  const s = useMotionStore();
  const fine = usePointerFine();
  const ref = useRef<HTMLDivElement>(null);
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    if (!s.panelOpen) return;
    const t = window.setTimeout(
      () => ref.current?.querySelector<HTMLElement>("button, [tabindex='0']")?.focus(),
      30,
    );
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (
        ref.current &&
        !ref.current.contains(t) &&
        !(t instanceof Element && t.closest("[aria-controls='motion-panel']"))
      )
        close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [s.panelOpen]);

  function close() {
    useMotionStore.getState().setPanelOpen(false);
    opener?.focus();
  }

  const off = !s.enabled;

  return (
    <AnimatePresence>
      {s.panelOpen && (
        <motion.div
          ref={ref}
          id="motion-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="motion-panel-title"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: s.enabled ? 0.28 / s.speed : 0, ease: [0.16, 1, 0.3, 1] }}
          className="glass fixed inset-x-3 bottom-3 z-[90] max-h-[85vh] overflow-y-auto rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-2)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[360px]"
        >
          <div className="mb-2 flex items-start justify-between gap-4">
            <div>
              <h2 id="motion-panel-title" className="display text-xl">
                Motion controls
              </h2>
              <p className="text-sm text-[var(--color-muted)]">
                {s.systemReduced && !s.userChosen
                  ? "Your device asks for reduced motion, so effects start off. Turn them on if you like."
                  : "Saved on this device."}
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close motion controls"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--color-line)] hover:bg-[var(--color-raised)]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="divide-y divide-[var(--color-line)]">
            <MotionToggle
              label="Motion"
              description="All animation and 3D movement"
              checked={s.enabled}
              onChange={(v) => s.set({ enabled: v })}
            />
            <Segmented
              label="Intensity"
              value={s.intensity}
              options={INTENSITIES}
              onChange={(v) => s.set({ intensity: v })}
              disabled={off}
            />
            <MotionToggle
              label="3D tilt"
              description={fine ? "Cards lean toward the pointer" : "Not available on touch screens"}
              checked={s.tilt}
              onChange={(v) => s.set({ tilt: v })}
              disabled={off || !fine}
            />
            <MotionToggle
              label="Parallax"
              description="Layers scroll at different speeds"
              checked={s.parallax}
              onChange={(v) => s.set({ parallax: v })}
              disabled={off}
            />
            <MotionToggle
              label="Cursor effects"
              description={fine ? "Custom cursor, magnetic buttons, glow" : "Not available on touch screens"}
              checked={s.cursor}
              onChange={(v) => s.set({ cursor: v })}
              disabled={off || !fine}
            />
            <Segmented
              label="Animation speed"
              value={s.speed}
              options={SPEEDS}
              onChange={(v) => s.set({ speed: v })}
              disabled={off}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              s.reset();
              setAnnounce("Motion settings restored to defaults.");
              window.setTimeout(() => setAnnounce(""), 2500);
            }}
            className="mt-4 w-full rounded-full border border-[var(--color-line-strong)] px-4 py-2.5 font-[family-name:var(--font-display)] text-sm font-medium hover:bg-[var(--color-raised)]"
          >
            Reset to defaults
          </button>
          <p
            role="status"
            aria-live="polite"
            className="mt-2 min-h-[1.25rem] text-center text-sm text-[var(--color-cyan)]"
          >
            {announce}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

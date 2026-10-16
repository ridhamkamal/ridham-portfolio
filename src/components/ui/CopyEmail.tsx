"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { PressFeedback } from "@/components/motion";
import { cn } from "@/lib/cn";

/** Copies the address with the Clipboard API; announces the result politely. */
export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const m = useMotionPrefs();
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2200);
  }

  return (
    <span className="relative inline-flex items-center">
      <PressFeedback>
        <button
          type="button"
          onClick={copy}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] px-5 py-3 font-[family-name:var(--font-display)] text-[0.95rem] font-semibold hover:bg-[var(--color-raised)]",
            className,
          )}
        >
          <svg
            aria-hidden="true"
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {state === "copied" ? (
              <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <>
                <rect x="5" y="5" width="9" height="9" rx="2" />
                <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" />
              </>
            )}
          </svg>
          {state === "copied" ? "Copied" : "Copy email"}
        </button>
      </PressFeedback>
      <AnimatePresence>
        {state !== "idle" && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: m.dur(0.25) }}
            aria-hidden="true"
            className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-cyan)] px-3 py-1 font-[family-name:var(--font-display)] text-xs font-semibold whitespace-nowrap text-[var(--color-bg)]"
          >
            {state === "copied" ? "Copied to clipboard" : email}
          </motion.span>
        )}
      </AnimatePresence>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied"
          ? "Email address copied to clipboard"
          : state === "failed"
            ? `Copy failed. The address is ${email}`
            : ""}
      </span>
    </span>
  );
}

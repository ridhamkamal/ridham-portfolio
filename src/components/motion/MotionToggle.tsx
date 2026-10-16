"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { cn } from "@/lib/cn";

/** Accessible switch (role="switch") with a spring thumb. */
export function MotionToggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className={cn("flex items-center justify-between gap-4 py-2.5", disabled && "opacity-50")}>
      <div>
        <span
          id={`${id}-l`}
          className="block font-[family-name:var(--font-display)] text-[0.95rem] font-medium"
        >
          {label}
        </span>
        {description && (
          <span id={`${id}-d`} className="block text-sm text-[var(--color-muted)]">
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-l`}
        aria-describedby={description ? `${id}-d` : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border p-0.5 transition-colors",
          checked
            ? "justify-end border-[var(--color-violet)] bg-[var(--color-violet-deep)]"
            : "justify-start border-[var(--color-line-strong)] bg-[var(--color-raised)]",
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className="h-5 w-5 rounded-full bg-[var(--color-text)]"
        />
        <span className="sr-only">{checked ? "On" : "Off"}</span>
      </button>
    </div>
  );
}

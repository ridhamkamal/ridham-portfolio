"use client";

import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/cn";

/**
 * Moves its children at a different speed from the page.
 * speed > 0 drifts up as you scroll down; distance is in px across the viewport pass.
 */
export function ParallaxLayer({
  children,
  className,
  speed = 0.2,
  ariaHidden,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
  ariaHidden?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const m = useMotionPrefs();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const d = m.parallax ? 220 * speed * m.scale : 0;
  const y = useTransform(scrollYProgress, [0, 1], [d, -d]);
  return (
    <motion.div ref={ref} className={className} style={{ y }} aria-hidden={ariaHidden}>
      {children}
    </motion.div>
  );
}

/** Thin progress bar fixed to the top of the viewport (or of a container). */
export function ScrollProgressBar({
  className,
  label = "Reading progress",
}: {
  className?: string;
  label?: string;
}) {
  const { scrollYProgress } = useScroll();
  const m = useMotionPrefs();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const [pct, setPct] = useState(0);
  useEffect(() => scrollYProgress.on("change", (v) => setPct(Math.round(v * 100))), [scrollYProgress]);
  return (
    <motion.div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={cn(
        "fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[var(--color-violet)] to-[var(--color-cyan)]",
        className,
      )}
      style={{ scaleX: m.enabled ? scaleX : scrollYProgress }}
    />
  );
}

/** Soft glow that follows the cursor across a dark section. Decorative only. */
export function CursorFollow({ className }: { className?: string }) {
  const m = useMotionPrefs();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(-1000), { stiffness: 90, damping: 20 });
  const y = useSpring(useMotionValue(-1000), { stiffness: 90, damping: 20 });
  const inView = useInView(ref);
  useEffect(() => {
    if (!m.cursor || !inView) return;
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const move = (e: PointerEvent) => {
      const r = parent.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
    };
    parent.addEventListener("pointermove", move);
    return () => parent.removeEventListener("pointermove", move);
  }, [m.cursor, inView, x, y]);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {m.cursor && (
        <motion.div
          className="absolute h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
          style={{
            x,
            y,
            left: 0,
            top: 0,
            background: "radial-gradient(circle, rgba(109,90,230,0.28), transparent 65%)",
          }}
        />
      )}
    </div>
  );
}

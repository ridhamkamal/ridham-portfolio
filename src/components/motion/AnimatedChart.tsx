"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";

/**
 * Wraps a chart: reveals it when scrolled into view and tells it whether to
 * animate its own series (render-prop receives `animate` and `inView`).
 */
export function AnimatedChart({
  children,
  className,
}: {
  children: (state: { animate: boolean; inView: boolean; duration: number }) => ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const m = useMotionPrefs();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 16 * m.scale }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: m.dur(0.6) }}
      data-reveal=""
    >
      {children({ animate: m.enabled, inView, duration: Math.round(m.dur(1.1) * 1000) })}
    </motion.div>
  );
}

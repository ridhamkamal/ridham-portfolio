"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";

/**
 * Counts up to `value` once visible. Server-renders the final value, so the
 * number is correct without JS and for screen readers (aria-hidden ticker).
 */
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.4,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const m = useMotionPrefs();
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const [display, setDisplay] = useState(fmt(value));
  const started = useRef(false);

  // With JS and motion on, start from zero so the count-up has somewhere to go.
  useEffect(() => {
    if (m.enabled && !started.current && !inView) setDisplay(fmt(0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m.enabled]);

  useEffect(() => {
    if (!m.enabled) {
      setDisplay(fmt(value));
      return;
    }
    if (!inView || started.current) return;
    started.current = true;
    const controls = animate(0, value, {
      duration: m.dur(duration),
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(fmt(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, m.enabled, value]);

  // Re-animate when the value changes after the first run (e.g. simulator output).
  const prev = useRef(value);
  useEffect(() => {
    if (!started.current || prev.current === value) return;
    const from = prev.current;
    prev.current = value;
    if (!m.enabled) return setDisplay(fmt(value));
    const c = animate(from, value, { duration: m.dur(0.45), onUpdate: (v) => setDisplay(fmt(v)) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">
        {prefix}
        {fmt(value)}
        {suffix}
      </span>
      <span aria-hidden="true" className="tabular-nums">
        {prefix}
        {display}
        {suffix}
      </span>
    </span>
  );
}

"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";

// The first page a visitor lands on is never hidden: server HTML paints
// immediately and hydration matches it. Only later client-side navigations
// (when the template remounts) animate in. Set in an effect, so React's
// double render in development cannot flip it mid-hydration.
let hasMounted = false;

/** Used by app/template.tsx: each route fades and rises in on navigation. */
export function PageTransition({ children }: { children: ReactNode }) {
  const m = useMotionPrefs();
  const [animateIn] = useState(() => hasMounted);
  useEffect(() => {
    hasMounted = true;
  }, []);
  return (
    <motion.div
      initial={animateIn && m.enabled ? { opacity: 0, y: 12 * m.scale } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: m.dur(0.45), ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

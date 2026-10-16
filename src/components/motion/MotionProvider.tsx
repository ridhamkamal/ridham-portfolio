"use client";

import { MotionConfig } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { useMotionStore } from "./store";
import { usePointerFine } from "@/hooks/useMotionPrefs";

/** Hydrates preferences, mirrors them onto <html>, and configures framer-motion globally. */
export function MotionProvider({ children }: { children: ReactNode }) {
  const hydrate = useMotionStore((s) => s.hydrate);
  const enabled = useMotionStore((s) => s.enabled);
  const cursor = useMotionStore((s) => s.cursor);
  const speed = useMotionStore((s) => s.speed);
  const fine = usePointerFine();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    hydrate(mq.matches);
    const onChange = () => {
      // Only follow OS changes while the user has not made an explicit choice.
      if (!useMotionStore.getState().userChosen) hydrate(mq.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [hydrate]);

  useEffect(() => {
    const el = document.documentElement;
    el.dataset.motion = enabled ? "on" : "off";
    el.dataset.cursor = enabled && cursor && fine ? "on" : "off";
    el.style.setProperty("--motion-speed", String(speed));
  }, [enabled, cursor, fine, speed]);

  return <MotionConfig reducedMotion={enabled ? "never" : "always"}>{children}</MotionConfig>;
}

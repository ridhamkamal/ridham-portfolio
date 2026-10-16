"use client";

import { useSyncExternalStore } from "react";
import { INTENSITY_SCALE, useMotionStore } from "@/components/motion/store";

function subscribeFine(cb: () => void) {
  const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getFine = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** True on devices with a precise, hover-capable pointer. False during SSR. */
export function usePointerFine(): boolean {
  return useSyncExternalStore(subscribeFine, getFine, () => false);
}

/**
 * Resolved motion preferences. Every motion primitive reads this, so a single
 * change in the Motion controls panel applies everywhere.
 */
export function useMotionPrefs() {
  const s = useMotionStore();
  const fine = usePointerFine();
  const scale = s.enabled ? INTENSITY_SCALE[s.intensity] : 0;
  return {
    enabled: s.enabled,
    intensity: s.intensity,
    speed: s.speed,
    scale,
    /** Duration in seconds, adjusted by the speed multiplier. */
    dur: (seconds: number) => (s.enabled ? seconds / s.speed : 0),
    tilt: s.enabled && s.tilt && fine,
    parallax: s.enabled && s.parallax,
    cursor: s.enabled && s.cursor && fine,
    hover: s.enabled && fine,
    fine,
    hydrated: s.hydrated,
  };
}

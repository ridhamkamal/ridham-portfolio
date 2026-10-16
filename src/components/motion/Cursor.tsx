"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";

type CursorState = "default" | "link" | "external" | "drag" | "3d" | "text" | "hidden";

const LABEL: Partial<Record<CursorState, string>> = { external: "↗", drag: "↔", "3d": "" };

function resolve(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return "default";
  if (target.closest("input, textarea, select, [contenteditable='true']")) return "hidden";
  const tagged = target.closest<HTMLElement>("[data-cursor]");
  const link = target.closest(
    "a, button, [role='button'], [role='switch'], [role='radio'], [role='tab'], summary, label",
  );
  if (link) {
    if (link instanceof HTMLAnchorElement && link.target === "_blank") return "external";
    const t = link.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
    if (t === "drag") return "drag";
    return "link";
  }
  if (tagged?.dataset.cursor === "3d") return "3d";
  if (tagged?.dataset.cursor === "drag") return "drag";
  if (target.closest("p, li, h1, h2, h3, h4, blockquote, dd, td, th, figcaption")) return "text";
  return "default";
}

/**
 * Dot + eased ring. Pure decoration: pointer-events none, aria-hidden, never
 * focusable. Only mounts on fine pointers with cursor effects enabled.
 */
export function Cursor() {
  const m = useMotionPrefs();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 });
  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!m.cursor) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => setState(resolve(e.target));
    const leave = () => setVisible(false);
    const pd = () => setDown(true);
    const pu = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", pd);
    window.addEventListener("pointerup", pu);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", pd);
      window.removeEventListener("pointerup", pu);
    };
  }, [m.cursor, x, y]);

  if (!m.cursor) return null;

  const ring =
    state === "link" || state === "external"
      ? 54
      : state === "3d"
        ? 72
        : state === "drag"
          ? 64
          : state === "text"
            ? 22
            : 34;
  const hidden = !visible || state === "hidden";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="absolute top-0 left-0 rounded-full bg-[var(--color-text)] mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: state === "text" ? 3 : 7,
          height: state === "text" ? 18 : 7,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center rounded-full border text-sm font-semibold text-[var(--color-text)]"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: ring,
          height: ring,
          opacity: hidden || state === "text" ? 0 : 1,
          scale: down ? 0.85 : 1,
          borderColor: state === "default" ? "rgba(244,239,230,0.35)" : "rgba(103,224,240,0.85)",
          backgroundColor: state === "3d" ? "rgba(165,148,255,0.10)" : "rgba(0,0,0,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        {LABEL[state]}
      </motion.div>
    </div>
  );
}

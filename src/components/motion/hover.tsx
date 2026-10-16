"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/cn";

const SPRING = { stiffness: 180, damping: 22, mass: 0.6 };

/**
 * Perspective tilt with depth, shadow and glare. Spring-returns to rest.
 * Off on touch, when motion or tilt is off, and under reduced motion.
 * Size picks the max angle: sm 10°, md 8°, lg 6° (scaled by intensity, capped at 10°).
 */
export function Tilt3D({
  children,
  className,
  size = "md",
  glare = true,
  cursor = "3d",
  maxDeg,
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  glare?: boolean;
  cursor?: string;
  /** Override the size-based maximum, e.g. a gentler tilt for panels with sliders. */
  maxDeg?: number;
}) {
  const m = useMotionPrefs();
  const ref = useRef<HTMLDivElement>(null);
  const base = size === "sm" ? 10 : size === "md" ? 8 : 6;
  const max = Math.min(10, (maxDeg ?? base) * Math.max(m.scale, 0.5));
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), SPRING);
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), SPRING);
  const lift = useSpring(useTransform(hover, [0, 1], [0, 1]), SPRING);
  const z = useTransform(lift, [0, 1], [0, 24]);
  const shadow = useTransform(
    lift,
    [0, 1],
    [
      "0 8px 24px -12px rgba(0,0,0,0.6)",
      "0 30px 60px -24px rgba(0,0,0,0.85), 0 0 0 1px rgba(165,148,255,0.25)",
    ],
  );
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, rgba(255,255,255,0.10), transparent 45%)`;

  if (!m.tilt) {
    return (
      <div className={cn("h-full min-w-0", className)} data-cursor={cursor}>
        {children}
      </div>
    );
  }

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = ref.current!.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    hover.set(0);
  };

  return (
    <div className={cn("h-full min-w-0", className)} style={{ perspective: 1000 }} data-cursor={cursor}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={() => hover.set(1)}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, z, boxShadow: shadow, transformStyle: "preserve-3d" }}
        className="relative h-full [border-radius:var(--radius-lg)] rounded-[inherit] will-change-transform"
      >
        {children}
        {glare && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: glareBg, opacity: lift }}
          />
        )}
      </motion.div>
    </div>
  );
}

/** Pulls the element toward the pointer. For CTAs, nav links, social icons. */
export function MagneticHover({
  children,
  className,
  strength = 14,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const m = useMotionPrefs();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  if (!m.hover) return <span className={cn("inline-flex", className)}>{children}</span>;
  const s = strength * m.scale;
  return (
    <motion.span
      ref={ref}
      className={cn("inline-flex", className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width - 0.5) * 2 * s);
        y.set(((e.clientY - r.top) / r.height - 0.5) * 2 * s);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/** Raises the element a few pixels on hover or keyboard focus within. */
export function HoverLift({
  children,
  className,
  distance = 6,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const m = useMotionPrefs();
  return (
    <motion.div
      className={cn("h-full min-w-0", className)}
      whileHover={m.enabled ? { y: -distance * m.scale } : undefined}
      whileFocus={m.enabled ? { y: -distance * m.scale } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      {children}
    </motion.div>
  );
}

/** Soft radial glow that tracks the pointer inside the element. */
export function GlowHover({
  children,
  className,
  color = "165,148,255",
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  const m = useMotionPrefs();
  const x = useMotionValue(-999);
  const y = useMotionValue(-999);
  const bg = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, rgba(${color},0.16), transparent 70%)`;
  return (
    <div
      className={cn("relative", className)}
      onPointerMove={(e) => {
        if (!m.hover) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        x.set(-999);
        y.set(-999);
      }}
    >
      {m.hover && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: bg }}
        />
      )}
      {children}
    </div>
  );
}

/** Tactile press: scales down slightly while pressed. Wraps buttons and links. */
export function PressFeedback({ children, className }: { children: ReactNode; className?: string }) {
  const m = useMotionPrefs();
  return (
    <motion.span
      className={cn("inline-flex", className)}
      whileTap={m.enabled ? { scale: 0.96 } : undefined}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {children}
    </motion.span>
  );
}

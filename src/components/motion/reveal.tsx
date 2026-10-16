"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/cn";

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

type Tag = "div" | "section" | "article" | "li" | "ul" | "ol" | "span" | "p" | "header" | "figure" | "aside";

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: Tag;
  delay?: number;
  /** Portion of the element that must be visible before it reveals. */
  amount?: number;
  id?: string;
}

/**
 * Elements carry `data-reveal`; a <noscript> rule in the root layout forces them
 * visible so the site is fully readable without JavaScript.
 */
function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
  amount = 0.25,
  id,
  from,
}: RevealProps & { from: { x?: number; y?: number; scale?: number } }) {
  const m = useMotionPrefs();
  const Comp = motion[as];
  const s = m.scale;
  return (
    <Comp
      id={id}
      data-reveal=""
      className={className}
      initial={{
        opacity: 0,
        x: (from.x ?? 0) * s,
        y: (from.y ?? 0) * s,
        scale: 1 - (1 - (from.scale ?? 1)) * s,
      }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration: m.dur(0.75), delay: m.enabled ? delay / m.speed : 0, ease: EASE_OUT_EXPO }}
    >
      {children}
    </Comp>
  );
}

export const FadeIn = (p: RevealProps) => <Reveal {...p} from={{ y: 14 }} />;

export const SlideIn = ({
  direction = "up",
  ...p
}: RevealProps & { direction?: "up" | "down" | "left" | "right" }) => {
  const d = 36;
  const from =
    direction === "left"
      ? { x: -d }
      : direction === "right"
        ? { x: d }
        : direction === "down"
          ? { y: -d }
          : { y: d };
  return <Reveal {...p} from={from} />;
};

export const ScaleIn = (p: RevealProps) => <Reveal {...p} from={{ scale: 0.92, y: 10 }} />;

const containerVariants: Variants = { hidden: {}, show: {} };

/** Staggers direct <StaggerItem> children as the group scrolls into view. */
export function StaggerChildren({
  children,
  className,
  as = "div",
  stagger = 0.08,
  amount = 0.15,
}: RevealProps & { stagger?: number }) {
  const m = useMotionPrefs();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={{
        ...containerVariants,
        show: { transition: { staggerChildren: m.enabled ? stagger / m.speed : 0 } },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = "div" }: Omit<RevealProps, "delay" | "amount">) {
  const m = useMotionPrefs();
  const Comp = motion[as];
  return (
    <Comp
      data-reveal=""
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 * m.scale, scale: 1 - 0.03 * m.scale },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: m.dur(0.7), ease: EASE_OUT_EXPO } },
      }}
    >
      {children}
    </Comp>
  );
}

/**
 * Word-by-word headline reveal, done in CSS so it starts at first paint
 * (before hydration) and never delays the LCP element. The full sentence is in
 * a visually hidden span; animated words are aria-hidden. Motion-off and
 * prefers-reduced-motion disable it via the global rules in globals.css.
 */
export function TextReveal({
  text,
  as: Heading = "h2",
  className,
  delay = 0,
  highlight,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  /** Words to render with the gradient accent. */
  highlight?: readonly string[];
}) {
  const words = text.split(" ");
  return (
    <Heading className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span
              className={cn(
                "word-reveal inline-block",
                highlight?.includes(w.replace(/[.,]/g, "")) && "gradient-text",
              )}
              style={{ animationDelay: `calc(${(delay + i * 0.045).toFixed(3)}s / var(--motion-speed))` }}
            >
              {w}
              {i < words.length - 1 ? "\u00a0" : ""}
            </span>
          </span>
        ))}
      </span>
    </Heading>
  );
}

/** Scroll-linked depth reveal: tilts up from the page plane as it enters. */
export function ScrollReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const m = useMotionPrefs();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 98%", "start 62%"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [m.enabled ? 0 : 1, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [14 * m.scale, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [60 * m.scale, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1 - 0.06 * m.scale, 1]);
  return (
    <div ref={ref} className={className} style={{ perspective: 1200 }}>
      <motion.div data-reveal="" style={{ opacity, rotateX, y, scale, transformOrigin: "50% 100%" }}>
        {children}
      </motion.div>
    </div>
  );
}

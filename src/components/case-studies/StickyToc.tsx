"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";

/** Scroll-spy table of contents. Sticky sidebar on desktop, chip rail on mobile. */
export function StickyToc({ items }: { items: readonly { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const m = useMotionPrefs();

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => Boolean(e));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  return (
    <>
      <nav
        aria-label="On this page"
        className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block"
      >
        <p className="eyebrow mb-4">On this page</p>
        <ol className="relative grid gap-0.5 border-l border-[var(--color-line)]">
          {items.map((it, n) => {
            const on = it.id === active;
            return (
              <li key={it.id} className="relative">
                {on && (
                  <motion.span
                    layoutId="toc-active"
                    className="absolute top-0 -left-px h-full w-[2px] bg-gradient-to-b from-[var(--color-violet)] to-[var(--color-cyan)]"
                    transition={{ type: "spring", stiffness: 400, damping: 34, duration: m.dur(0.3) }}
                  />
                )}
                <a
                  href={`#${it.id}`}
                  aria-current={on ? "location" : undefined}
                  className={cn(
                    "block py-1.5 pl-4 font-[family-name:var(--font-display)] text-[0.88rem] transition-colors",
                    on
                      ? "text-[var(--color-text)]"
                      : "text-[var(--color-faint)] hover:text-[var(--color-muted)]",
                  )}
                >
                  <span className="mr-2 tabular-nums opacity-60">{String(n + 1).padStart(2, "0")}</span>
                  {it.label}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
      <nav
        aria-label="On this page"
        className="glass sticky top-[76px] z-30 -mx-[var(--gutter)] mb-8 overflow-x-auto px-[var(--gutter)] py-2 lg:hidden"
      >
        <ol className="flex gap-2 whitespace-nowrap">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={it.id === active ? "location" : undefined}
                className={cn(
                  "inline-block rounded-full px-3 py-1.5 font-[family-name:var(--font-display)] text-[0.82rem]",
                  it.id === active
                    ? "bg-[var(--color-text)] text-[var(--color-bg)]"
                    : "text-[var(--color-muted)]",
                )}
              >
                {it.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

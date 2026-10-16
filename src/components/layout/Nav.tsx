"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/site";
import { profile } from "@/data/profile";
import { MagneticHover, MotionControlsButton, PressFeedback } from "@/components/motion";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/cn";

function MotionIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M2 4h7M12 4h2M2 12h2M7 12h7" />
      <circle cx="10.5" cy="4" r="1.6" />
      <circle cx="5.5" cy="12" r="1.6" />
    </svg>
  );
}

export function Nav() {
  const pathname = usePathname();
  const m = useMotionPrefs();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 12));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex max-w-[var(--maxw)] items-center justify-between gap-2 rounded-full py-2 pr-2 pl-4 transition-[background,box-shadow,border-color] duration-300 sm:gap-4 sm:pr-3 sm:pl-5",
          scrolled || open ? "glass shadow-[var(--shadow-2)]" : "border border-transparent",
        )}
      >
        <Link
          href="/"
          className="display min-w-0 truncate text-[0.98rem] tracking-[-0.01em] whitespace-nowrap [font-stretch:100%] sm:text-[1.05rem]"
          aria-current={pathname === "/" ? "page" : undefined}
        >
          {profile.name}
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <MagneticHover strength={6}>
                <Link
                  href={n.href}
                  aria-current={isActive(n.href) ? "page" : undefined}
                  className={cn(
                    "relative isolate rounded-full px-3.5 py-2 font-[family-name:var(--font-display)] text-[0.9rem] transition-colors",
                    isActive(n.href)
                      ? "text-[var(--color-text)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-text)]",
                  )}
                >
                  {isActive(n.href) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-[var(--color-raised)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32, duration: m.dur(0.3) }}
                    />
                  )}
                  {n.label}
                </Link>
              </MagneticHover>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <MotionControlsButton className="hidden h-10 items-center gap-2 rounded-full border border-[var(--color-line)] px-3.5 font-[family-name:var(--font-display)] text-[0.85rem] text-[var(--color-muted)] hover:text-[var(--color-text)] sm:inline-flex">
            <MotionIcon />
            <span className="whitespace-nowrap">Motion controls</span>
          </MotionControlsButton>
          <MotionControlsButton className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-line)] text-[var(--color-muted)] sm:hidden">
            <MotionIcon />
            <span className="sr-only">Motion controls</span>
          </MotionControlsButton>
          <span className="hidden sm:inline-flex">
            <MagneticHover>
              <PressFeedback>
                <Link
                  href="/contact"
                  className="inline-flex h-10 items-center rounded-full bg-[var(--color-text)] px-4 font-[family-name:var(--font-display)] text-[0.9rem] font-semibold whitespace-nowrap text-[var(--color-bg)] hover:bg-white"
                >
                  Get in touch
                </Link>
              </PressFeedback>
            </MagneticHover>
          </span>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-line)] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            >
              {open ? <path d="M3 3l12 12M15 3L3 15" /> : <path d="M2 5h14M2 9h14M2 13h14" />}
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: m.dur(0.22) }}
            className="glass mx-auto mt-2 max-w-[var(--maxw)] rounded-[var(--radius-lg)] p-3 shadow-[var(--shadow-2)] lg:hidden"
          >
            <ul className="grid gap-1">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={isActive(n.href) ? "page" : undefined}
                    className={cn(
                      "block rounded-[var(--radius-md)] px-4 py-3 font-[family-name:var(--font-display)] text-lg",
                      isActive(n.href) ? "bg-[var(--color-raised)]" : "hover:bg-[var(--color-raised)]",
                    )}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
              <li className="sm:hidden">
                <Link
                  href="/contact"
                  className="mt-1 block rounded-[var(--radius-md)] bg-[var(--color-text)] px-4 py-3 text-center font-[family-name:var(--font-display)] font-semibold text-[var(--color-bg)]"
                >
                  Get in touch
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

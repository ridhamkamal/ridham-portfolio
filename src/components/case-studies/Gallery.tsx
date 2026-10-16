"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { screenshots } from "@/data/wonderword";
import { Tilt3D } from "@/components/motion";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/cn";

/**
 * Tabbed product gallery (WAI-ARIA tabs pattern) with browser-chrome frames,
 * captions, and an accessible lightbox dialog.
 */
export function Gallery({ className }: { className?: string }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  const m = useMotionPrefs();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const shot = screenshots[i]!;

  const onKey = (e: KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const n =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? screenshots.length - 1
          : (i + d + screenshots.length) % screenshots.length;
    if (!d && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    setI(n);
    tabs.current[n]?.focus();
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="WonderWord AI screens"
        onKeyDown={onKey}
        className="mb-5 flex flex-wrap gap-2"
      >
        {screenshots.map((s, n) => (
          <button
            key={s.id}
            ref={(el) => {
              tabs.current[n] = el;
            }}
            role="tab"
            id={`shot-tab-${s.id}`}
            aria-selected={n === i}
            aria-controls={`shot-panel-${s.id}`}
            tabIndex={n === i ? 0 : -1}
            onClick={() => setI(n)}
            className={cn(
              "relative rounded-full px-4 py-2 font-[family-name:var(--font-display)] text-[0.9rem] transition-colors",
              n === i ? "text-[var(--color-bg)]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]",
            )}
          >
            {n === i && (
              <motion.span
                layoutId="shot-pill"
                className="absolute inset-0 -z-10 rounded-full bg-[var(--color-text)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            {s.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`shot-panel-${shot.id}`} aria-labelledby={`shot-tab-${shot.id}`}>
        <Tilt3D size="lg" className="[border-radius:var(--radius-lg)]">
          <figure className="card overflow-hidden p-2">
            <div className="flex items-center gap-2 px-3 py-2" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff8f8f]/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#f2c46d]/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#7ee2a8]/60" />
              <span className="ml-3 truncate rounded-full bg-[var(--color-bg)] px-3 py-1 font-[family-name:var(--font-display)] text-xs text-[var(--color-faint)]">
                {shot.url}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setZoom(true)}
              className="relative block aspect-[1000/511] w-full overflow-hidden rounded-[var(--radius-md)]"
              aria-label={`Enlarge screenshot: ${shot.alt}`}
              data-cursor="3d"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={shot.id}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: m.dur(0.45) }}
                  className="absolute inset-0"
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(min-width: 1024px) 760px, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </button>
            <figcaption className="px-3 pt-4 pb-2 text-[1rem] text-[var(--color-muted)]">
              {shot.caption}
            </figcaption>
          </figure>
        </Tilt3D>
      </div>

      <Lightbox open={zoom} onClose={() => setZoom(false)} src={shot.src} alt={shot.alt} />
    </div>
  );
}

function Lightbox({
  open,
  onClose,
  src,
  alt,
}: {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={alt}
      className="m-auto max-h-[92vh] w-[min(1200px,94vw)] rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-2 text-[var(--color-text)] backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <div className="relative aspect-[1000/511] w-full">
        {open && (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="94vw"
            className="rounded-[var(--radius-md)] object-contain"
          />
        )}
      </div>
      <form method="dialog" className="mt-2 flex justify-end">
        <button
          className="rounded-full border border-[var(--color-line-strong)] px-4 py-2 font-[family-name:var(--font-display)] text-sm"
          autoFocus
        >
          Close
        </button>
      </form>
    </dialog>
  );
}

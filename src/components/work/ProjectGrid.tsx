"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useState } from "react";
import { matchesFilter, projectFilters, projects, type ProjectFilter } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/cn";

/** Filterable project grid with animated layout changes and a live result count. */
export function ProjectGrid() {
  const [filter, setFilter] = useState<ProjectFilter>("All");
  const m = useMotionPrefs();
  const shown = projects.filter((p) => matchesFilter(p, filter));

  return (
    <LayoutGroup>
      <div role="group" aria-label="Filter projects" className="mb-8 flex flex-wrap gap-2">
        {projectFilters.map((f) => {
          const on = f === filter;
          const count = projects.filter((p) => matchesFilter(p, f)).length;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(f)}
              className={cn(
                "relative rounded-full border px-4 py-2 font-[family-name:var(--font-display)] text-[0.9rem] transition-colors",
                on
                  ? "border-transparent text-[var(--color-bg)]"
                  : "border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-line-strong)] hover:text-[var(--color-text)]",
              )}
            >
              {on && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-[var(--color-text)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              {f}
              <span className={cn("ml-1.5 tabular-nums", on ? "opacity-70" : "text-[var(--color-faint)]")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {`Showing ${shown.length} ${shown.length === 1 ? "project" : "projects"}${filter === "All" ? "" : ` in ${filter}`}`}
      </p>
      <motion.ul layout className="grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.94, y: 20 * m.scale }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{
                duration: m.dur(0.45),
                delay: m.enabled ? (i * 0.05) / m.speed : 0,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <ProjectCard project={p} headingLevel="h2" priority={i < 2} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </LayoutGroup>
  );
}

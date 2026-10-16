"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import type { Project } from "@/data/types";
import { Tilt3D } from "@/components/motion";
import { ArrowIcon, ExternalIcon, ProvenanceBadge } from "@/components/ui";
import { ProjectVisual } from "./ProjectVisual";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { navigateWithTransition, vtName } from "@/lib/viewTransition";

/**
 * The card body is one link to the case study (stretched over the card), and
 * artifact links sit above it in the stacking order so both stay clickable.
 */
export function ProjectCard({
  project: p,
  headingLevel = "h3",
  priority,
}: {
  project: Project;
  headingLevel?: "h2" | "h3";
  priority?: boolean;
}) {
  const router = useRouter();
  const m = useMotionPrefs();
  const H = headingLevel;
  const href = `/work/${p.slug}`;
  const external = p.links.filter((l) => l.kind !== "internal");

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!m.enabled || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (navigateWithTransition(() => router.push(href))) e.preventDefault();
  };

  return (
    <Tilt3D size="md" className="[border-radius:var(--radius-lg)]">
      <article className="card group flex h-full flex-col p-3 transition-colors hover:border-[var(--color-line-strong)] sm:p-4">
        <div style={{ viewTransitionName: vtName(p.slug) }}>
          <ProjectVisual slug={p.slug} priority={priority} />
        </div>
        <div className="flex flex-1 flex-col px-2 pt-5 pb-2">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <ProvenanceBadge kind={p.status === "Shipped" ? "measured" : "demo"} label={p.statusLabel} />
            <span className="font-[family-name:var(--font-display)] text-[0.78rem] tracking-[0.12em] text-[var(--color-faint)] uppercase">
              {p.category}
            </span>
          </div>
          <H className="display text-[1.7rem] [font-stretch:105%]">
            <Link
              href={href}
              onClick={onClick}
              className="after:absolute after:inset-0 after:rounded-[var(--radius-lg)] after:content-['']"
            >
              {p.title}
            </Link>
          </H>
          <p className="mt-2 text-[var(--color-muted)]">{p.summary}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Highlights">
            {p.highlights.slice(0, 4).map((h) => (
              <li
                key={h}
                className="rounded-full bg-[var(--color-raised)] px-2.5 py-1 font-[family-name:var(--font-display)] text-[0.78rem] text-[var(--color-muted)]"
              >
                {h}
              </li>
            ))}
          </ul>
          {p.boundary && (
            <p className="mt-4 border-l-2 border-[var(--color-violet)] pl-3 text-[0.95rem] text-[var(--color-muted)]">
              {p.boundary}
            </p>
          )}
          <div className="relative z-10 mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6 font-[family-name:var(--font-display)] text-[0.92rem]">
            <span
              aria-hidden="true"
              className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-text)]"
            >
              Case study <ArrowIcon className="transition-transform group-hover:translate-x-1" />
            </span>
            {external.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-cyan)]"
              >
                {l.label}
                <ExternalIcon />
                <span className="sr-only">for {p.title} (opens in a new tab)</span>
              </a>
            ))}
          </div>
        </div>
      </article>
    </Tilt3D>
  );
}

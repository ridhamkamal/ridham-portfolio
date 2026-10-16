import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Provenance } from "@/data/types";
import { MagneticHover, PressFeedback } from "@/components/motion";

type Variant = "primary" | "ghost" | "quiet";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-text)] text-[var(--color-bg)] hover:bg-white shadow-[0_10px_30px_-10px_rgba(165,148,255,0.6)]",
  ghost: "border border-[var(--color-line-strong)] text-[var(--color-text)] hover:bg-[var(--color-raised)]",
  quiet: "text-[var(--color-text)] hover:text-[var(--color-cyan)] px-0",
};

const base =
  "inline-flex items-center gap-2 rounded-full px-5 py-3 font-[family-name:var(--font-display)] text-[0.95rem] font-semibold tracking-[-0.005em] transition-colors";

/** Internal or external link styled as a button, with magnetic hover and press feedback. */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  magnetic = true,
  external,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  magnetic?: boolean;
  external?: boolean;
} & Omit<ComponentProps<"a">, "href">) {
  const isExternal = external ?? /^(https?:|mailto:)/.test(href);
  const cls = cn(base, variants[variant], className);
  const content = isExternal ? (
    <a
      href={href}
      className={cls}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
      {href.startsWith("http") && (
        <>
          <ExternalIcon />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      )}
    </a>
  ) : (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
  const pressed = <PressFeedback>{content}</PressFeedback>;
  return magnetic ? <MagneticHover>{pressed}</MagneticHover> : pressed;
}

export function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" className={cn("shrink-0", className)}>
      <path
        d="M4 1h7v7M11 1L1 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className={cn("shrink-0", className)}>
      <path
        d="M1 7h11M8 3l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PROV: Record<Provenance, { label: string; cls: string }> = {
  measured: {
    label: "Measured",
    cls: "text-[var(--color-cyan)] border-[rgba(103,224,240,0.4)] bg-[rgba(103,224,240,0.08)]",
  },
  validated: {
    label: "Validated",
    cls: "text-[var(--color-good)] border-[rgba(126,226,168,0.4)] bg-[rgba(126,226,168,0.08)]",
  },
  "partly-validated": {
    label: "Partly validated",
    cls: "text-[var(--color-warn)] border-[rgba(242,196,109,0.4)] bg-[rgba(242,196,109,0.08)]",
  },
  "in-test": {
    label: "In test",
    cls: "text-[var(--color-warn)] border-[rgba(242,196,109,0.4)] bg-[rgba(242,196,109,0.08)]",
  },
  hypothesis: {
    label: "Hypothesis",
    cls: "text-[var(--color-violet)] border-[rgba(165,148,255,0.4)] bg-[rgba(165,148,255,0.08)]",
  },
  modeled: {
    label: "Modeled, not booked",
    cls: "text-[var(--color-text)] border-dashed border-[var(--color-line-strong)]",
  },
  research: { label: "Research", cls: "text-[var(--color-muted)] border-[var(--color-line-strong)]" },
  target: { label: "Target", cls: "text-[var(--color-violet)] border-dashed border-[rgba(165,148,255,0.5)]" },
  demo: {
    label: "Demo",
    cls: "text-[var(--color-muted)] border-[var(--color-line-strong)] bg-[repeating-linear-gradient(135deg,transparent_0_6px,rgba(255,255,255,0.04)_6px_12px)]",
  },
};

/** Evidence badge. The label text always states the tier; colour is secondary. */
export function ProvenanceBadge({
  kind,
  className,
  label,
}: {
  kind: Provenance;
  className?: string;
  label?: string;
}) {
  const p = PROV[kind];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-[family-name:var(--font-display)] text-[0.72rem] font-semibold tracking-[0.08em] uppercase",
        p.cls,
        className,
      )}
    >
      {label ?? p.label}
    </span>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--color-line)] bg-[var(--color-raised)] px-3 py-1 font-[family-name:var(--font-display)] text-[0.8rem] text-[var(--color-muted)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Section heading block: eyebrow, h2, optional lede. */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  id,
  className,
  as: H = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <header className={cn("mb-10 max-w-3xl md:mb-14", className)}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <H id={id} className={cn("display", H === "h1" ? "h-xl" : "h-lg")}>
        {title}
      </H>
      {lede && <p className="lede mt-5">{lede}</p>}
    </header>
  );
}

export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const ext = /^https?:/.test(href);
  const cls = cn(
    "link-underline inline-flex items-center gap-1.5 font-[family-name:var(--font-display)] font-medium text-[var(--color-text)] hover:text-[var(--color-cyan)]",
    className,
  );
  return ext ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
      <ExternalIcon />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

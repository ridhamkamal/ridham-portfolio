import type { Metric } from "@/data/types";
import { AnimatedCounter, HoverLift, Tilt3D } from "@/components/motion";
import { ProvenanceBadge } from "./index";
import { cn } from "@/lib/cn";

/** Animated metric with its owner and evidence tier always visible. */
export function MetricCard({
  metric: m,
  className,
  level = "h3",
}: {
  metric: Metric;
  className?: string;
  level?: "h3" | "p";
}) {
  const L = level;
  return (
    <HoverLift className={className}>
      <Tilt3D size="sm" className="[border-radius:var(--radius-lg)]">
        <article className="card flex h-full flex-col p-6">
          <p className="display text-[clamp(2.6rem,5vw,3.6rem)] leading-none">
            <AnimatedCounter value={m.value} prefix={m.prefix} suffix={m.suffix} className="gradient-text" />
          </p>
          <L
            className={cn(
              "mt-3 font-[family-name:var(--font-display)] text-[1.05rem] leading-snug font-medium text-[var(--color-text)]",
            )}
          >
            {m.label}
          </L>
          <p className="mt-2 text-[0.95rem] text-[var(--color-muted)]">{m.context}</p>
          <div className="mt-auto pt-5">
            <ProvenanceBadge kind={m.provenance} />
          </div>
        </article>
      </Tilt3D>
    </HoverLift>
  );
}

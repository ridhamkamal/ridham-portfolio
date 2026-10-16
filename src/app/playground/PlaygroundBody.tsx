"use client";

import dynamic from "next/dynamic";

const Skeleton = () => <div className="skeleton h-[520px] rounded-[var(--radius-lg)]" aria-hidden="true" />;

// Each demo is its own chunk.
const StoryGuardrailChecker = dynamic(
  () => import("@/components/interactive/StoryGuardrailChecker").then((m) => m.StoryGuardrailChecker),
  { loading: Skeleton },
);
const PricingSimulator = dynamic(
  () => import("@/components/interactive/PricingSimulator").then((m) => m.PricingSimulator),
  { loading: Skeleton },
);
const DecisionExplorer = dynamic(
  () => import("@/components/interactive/DecisionExplorer").then((m) => m.DecisionExplorer),
  { loading: Skeleton },
);

export function PlaygroundBody() {
  return (
    <div className="grid gap-10">
      <StoryGuardrailChecker />
      <PricingSimulator />
      <DecisionExplorer />
      <p className="text-sm text-[var(--color-faint)]">
        Nothing on this page calls a production service or sends analytics. Interactions are kept in memory
        for this visit and shown on the Dashboard.
      </p>
    </div>
  );
}

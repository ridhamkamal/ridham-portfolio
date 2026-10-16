"use client";

import dynamic from "next/dynamic";

const ChartSkeleton = () => (
  <div className="skeleton h-[240px] w-full rounded-[var(--radius-md)]" aria-hidden="true" />
);
const SmallSkeleton = () => (
  <div className="skeleton h-[90px] w-full rounded-[var(--radius-md)]" aria-hidden="true" />
);

// Each chart is code-split; Recharts never lands in the initial bundle.
export const MrrChart = dynamic(() => import("./charts").then((m) => m.MrrChart), {
  ssr: false,
  loading: ChartSkeleton,
});
export const UsersChart = dynamic(() => import("./charts").then((m) => m.UsersChart), {
  ssr: false,
  loading: ChartSkeleton,
});
export const MarginChart = dynamic(() => import("./charts").then((m) => m.MarginChart), {
  ssr: false,
  loading: ChartSkeleton,
});
export const MixDonut = dynamic(() => import("./charts").then((m) => m.MixDonut), {
  ssr: false,
  loading: ChartSkeleton,
});
export const HBarChart = dynamic(() => import("./charts").then((m) => m.HBarChart), {
  ssr: false,
  loading: ChartSkeleton,
});
export const SimulatorBars = dynamic(() => import("./charts").then((m) => m.SimulatorBars), {
  ssr: false,
  loading: SmallSkeleton,
});
export const Sparkline = dynamic(() => import("./charts").then((m) => m.Sparkline), {
  ssr: false,
  loading: SmallSkeleton,
});

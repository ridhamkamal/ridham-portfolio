"use client";

import { useMemo } from "react";
import { buildProjection } from "@/lib/projection";
import { AnimatedChart } from "@/components/motion";
import { MrrChart } from "@/components/dashboard/LazyCharts";

export function DashboardPreviewChart() {
  const rows = useMemo(() => buildProjection(), []);
  return (
    <div className="mt-4">
      <p className="sr-only">{`Modeled MRR rises from $0 in ${rows[0]!.month} to $${rows.at(-1)!.mrr.toLocaleString()} in ${rows.at(-1)!.month}.`}</p>
      <AnimatedChart>
        {(p) => (p.inView ? <MrrChart data={rows} {...p} height={240} /> : <div className="h-[240px]" />)}
      </AnimatedChart>
    </div>
  );
}

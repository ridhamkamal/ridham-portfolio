"use client";

import { useLayoutEffect } from "react";
import { ParallaxLayer, Tilt3D } from "@/components/motion";
import { ProjectVisual } from "@/components/work/ProjectVisual";
import { finishViewTransition, vtName } from "@/lib/viewTransition";

/** Hero visual shares a view-transition name with its card on /work. */
export function CaseHeroVisual({ slug }: { slug: string }) {
  useLayoutEffect(() => finishViewTransition(), []);
  return (
    <ParallaxLayer speed={0.12}>
      <Tilt3D size="lg" className="[border-radius:var(--radius-lg)]">
        <div className="card p-2" style={{ viewTransitionName: vtName(slug) }}>
          <ProjectVisual slug={slug} priority />
        </div>
      </Tilt3D>
    </ParallaxLayer>
  );
}

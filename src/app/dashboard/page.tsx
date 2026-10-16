import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui";
import { ParallaxLayer, FadeIn } from "@/components/motion";
import { DashboardBody } from "./DashboardBody";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Product and impact dashboard",
  description:
    "Career impact, the WonderWord AI beta and its modeled economics, enterprise delivery results, and product-thinking demos, with measured and modeled data labelled apart.",
  path: "/dashboard",
});

export default function DashboardPage() {
  return (
    <div className="relative isolate overflow-hidden">
      <ParallaxLayer
        speed={-0.5}
        ariaHidden
        className="pointer-events-none absolute top-40 right-[-200px] -z-10 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(31,169,189,0.14),transparent_70%)]"
      >
        <span />
      </ParallaxLayer>
      <ParallaxLayer
        speed={0.4}
        ariaHidden
        className="pointer-events-none absolute top-[900px] left-[-240px] -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(109,90,230,0.16),transparent_70%)]"
      >
        <span />
      </ParallaxLayer>
      <div className="container-x pt-32 md:pt-40">
        <SectionHeader
          as="h1"
          eyebrow="Dashboard"
          title="Product and impact dashboard"
          lede="My product work as data. Every chart has a short explanation, a table view, and a label that says whether its numbers are measured, a target, modeled, research or a demo."
        />
        <FadeIn>
          <ul
            className="mb-14 flex flex-wrap gap-x-6 gap-y-2 font-[family-name:var(--font-display)] text-sm text-[var(--color-muted)]"
            aria-label="Legend for evidence labels"
          >
            <li>
              <b className="text-[var(--color-cyan)]">Measured</b>: observed results
            </li>
            <li>
              <b className="text-[var(--color-violet)]">Target</b>: goals, not results
            </li>
            <li>
              <b className="text-[var(--color-text)]">Modeled</b>: projections, dashed lines, never booked
              revenue
            </li>
            <li>
              <b>Research</b>: third-party figures
            </li>
            <li>
              <b>Demo</b>: playground output, not production analytics
            </li>
          </ul>
        </FadeIn>
        <DashboardBody />
      </div>
    </div>
  );
}

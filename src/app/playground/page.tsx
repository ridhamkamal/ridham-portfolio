import type { Metadata } from "next";
import { playgroundIntro } from "@/data/playground";
import { SectionHeader } from "@/components/ui";
import { PlaygroundBody } from "./PlaygroundBody";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Product-thinking playground",
  description:
    "Run a simplified AI story guardrail, break a freemium pricing model, and make four documented product decisions yourself.",
  path: "/playground",
});

export default function PlaygroundPage() {
  return (
    <div className="container-x pt-32 md:pt-40">
      <SectionHeader
        as="h1"
        eyebrow="Product thinking, running"
        title={playgroundIntro.heading}
        lede={playgroundIntro.body}
      />
      <PlaygroundBody />
    </div>
  );
}

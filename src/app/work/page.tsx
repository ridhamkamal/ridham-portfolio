import type { Metadata } from "next";
import { workIntro } from "@/data/projects";
import { SectionHeader } from "@/components/ui";
import { ProjectGrid } from "@/components/work/ProjectGrid";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Selected work",
  description:
    "WonderWord AI, shipped in private beta, and three AI product concepts taken from discovery through PRD to a working prototype.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <div className="container-x pt-32 pb-10 md:pt-40">
      <SectionHeader as="h1" eyebrow="Selected work" title={workIntro.heading} lede={workIntro.body} />
      <ProjectGrid />
    </div>
  );
}

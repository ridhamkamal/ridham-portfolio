import type { Metadata } from "next";
import { experienceIntro } from "@/data/experience";
import { about } from "@/data/profile";
import { SectionHeader } from "@/components/ui";
import { RoleGantt, Timeline } from "@/components/experience/Timeline";
import { HoverLift, StaggerChildren, StaggerItem, Tilt3D } from "@/components/motion";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Experience",
  description:
    "Juniper Networks, WonderWord AI, PM Accelerator, C3.ai, Cloudera and Mu Sigma: ten years from analytics into AI product management.",
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <div className="container-x pt-32 md:pt-40">
      <SectionHeader
        as="h1"
        eyebrow="Experience"
        title={experienceIntro.heading}
        lede={experienceIntro.body}
      />
      <RoleGantt className="mb-16" />
      <Timeline headingLevel={2} />
      <section aria-labelledby="principles-h" className="mt-24">
        <h2 id="principles-h" className="display h-md mb-8">
          What transfers from enterprise to a children’s product
        </h2>
        <StaggerChildren as="ul" className="grid gap-5 md:grid-cols-3">
          {about.principles.map((p) => (
            <StaggerItem as="li" key={p.title}>
              <HoverLift>
                <Tilt3D size="md" className="[border-radius:var(--radius-lg)]">
                  <article className="card h-full p-6">
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-[var(--color-muted)]">{p.body}</p>
                  </article>
                </Tilt3D>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { about, certifications, contactCopy, education, profile, skillGroups } from "@/data/profile";
import { FadeIn, HoverLift, ParallaxLayer, StaggerChildren, StaggerItem, Tilt3D } from "@/components/motion";
import { ButtonLink } from "@/components/ui";
import { TestimonialBlock } from "@/components/home/HomeSections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "AI Product Manager with eight years delivering AI-enabled, data-driven and enterprise software products. Education, certifications and skills.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="pt-32 md:pt-40">
      <section className="container-x grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
        <div>
          <p className="eyebrow mb-4">About</p>
          <h1 className="display h-xl">{profile.name}</h1>
          <FadeIn>
            <p className="lede mt-6">{about.bio}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="display h-md mt-14">From enterprise systems to a six-year-old’s confidence</h2>
            <p className="mt-4 text-[1.15rem] leading-relaxed text-[var(--color-muted)]">{about.bridge}</p>
          </FadeIn>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Get in touch</ButtonLink>
            {"href" in contactCopy.resume && (
              <ButtonLink href={contactCopy.resume.href} variant="ghost" external download>
                {contactCopy.resume.label}
              </ButtonLink>
            )}
          </div>
        </div>
        <ParallaxLayer speed={0.1}>
          <Tilt3D size="md" className="[border-radius:var(--radius-xl)]">
            <div className="card overflow-hidden rounded-[var(--radius-xl)] p-2">
              <Image
                src={profile.headshot.src}
                alt={`Portrait of ${profile.name}`}
                width={520}
                height={520}
                priority
                className="h-auto w-full rounded-[calc(var(--radius-xl)-8px)]"
                sizes="(min-width: 1024px) 420px, 100vw"
              />
              <p className="px-3 pt-3 pb-2 font-[family-name:var(--font-display)] text-sm text-[var(--color-muted)]">
                {profile.title} · {profile.location}
              </p>
            </div>
          </Tilt3D>
        </ParallaxLayer>
      </section>

      <section aria-labelledby="skills-h" className="container-x mt-24">
        <h2 id="skills-h" className="display h-md mb-8">
          Skills
        </h2>
        <StaggerChildren as="ul" className="grid gap-5 md:grid-cols-2">
          {skillGroups.map((g) => (
            <StaggerItem as="li" key={g.id}>
              <HoverLift>
                <Tilt3D size="lg" className="[border-radius:var(--radius-lg)]">
                  <article className="card h-full p-6">
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold">
                      {g.title}
                    </h3>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {g.items.map((s) => (
                        <li
                          key={s}
                          className="rounded-full border border-[var(--color-line)] px-3 py-1 font-[family-name:var(--font-display)] text-[0.82rem] text-[var(--color-muted)]"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Tilt3D>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      <section className="container-x mt-24 grid gap-5 md:grid-cols-2">
        <div>
          <h2 className="display h-md mb-6">Education</h2>
          <StaggerChildren as="ul" className="grid gap-4">
            {education.map((e) => (
              <StaggerItem as="li" key={e.credential}>
                <Tilt3D size="md" className="[border-radius:var(--radius-lg)]">
                  <article className="card flex items-start justify-between gap-4 p-5">
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] font-semibold">{e.credential}</h3>
                      <p className="text-[var(--color-muted)]">{e.institution}</p>
                    </div>
                    <p className="font-[family-name:var(--font-display)] text-[var(--color-faint)]">
                      <time dateTime={String(e.year)}>{e.year}</time>
                    </p>
                  </article>
                </Tilt3D>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
        <div>
          <h2 className="display h-md mb-6">Certifications</h2>
          <StaggerChildren as="ul" className="grid gap-4">
            {certifications.map((c) => (
              <StaggerItem as="li" key={c}>
                <Tilt3D size="md" className="[border-radius:var(--radius-lg)]">
                  <article className="card flex items-center gap-4 p-5">
                    <span
                      aria-hidden="true"
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[rgba(165,148,255,0.14)] text-[var(--color-violet)]"
                    >
                      ✓
                    </span>
                    <h3 className="font-[family-name:var(--font-display)] font-semibold">{c}</h3>
                  </article>
                </Tilt3D>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <TestimonialBlock />
    </div>
  );
}

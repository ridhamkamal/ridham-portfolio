import Image from "next/image";
import Link from "next/link";
import { impactSnapshot } from "@/data/metrics";
import { projects, workIntro } from "@/data/projects";
import { experienceIntro } from "@/data/experience";
import { testimonials, contactCopy, profile, contactLinks } from "@/data/profile";
import { bet, logo } from "@/data/wonderword";
import { playgroundIntro, guardrail, pricingSim, decisionsIntro } from "@/data/playground";
import {
  CursorFollow,
  FadeIn,
  GlowHover,
  HoverLift,
  MagneticHover,
  ParallaxLayer,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
  Tilt3D,
} from "@/components/motion";
import {
  ArrowIcon,
  ButtonLink,
  ExternalIcon,
  ProvenanceBadge,
  SectionHeader,
  TextLink,
} from "@/components/ui";
import { MetricCard } from "@/components/ui/MetricCard";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { ProjectCard } from "@/components/work/ProjectCard";
import { Gallery } from "@/components/case-studies/Gallery";
import { RoleGantt, Timeline } from "@/components/experience/Timeline";
import { DashboardPreviewChart } from "./DashboardPreviewChart";

export function ImpactSnapshot() {
  return (
    <section aria-labelledby="impact-h" className="container-x py-20 md:py-28">
      <SectionHeader
        id="impact-h"
        eyebrow="Impact snapshot"
        title="Results, each with its owner"
        lede="Four numbers from different roles and products. The label under each one says where it comes from."
      />
      <StaggerChildren as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {impactSnapshot.map((m) => (
          <StaggerItem as="li" key={m.id}>
            <MetricCard metric={m} />
          </StaggerItem>
        ))}
      </StaggerChildren>
    </section>
  );
}

export function SelectedWork() {
  return (
    <section aria-labelledby="work-h" className="relative py-20 md:py-28">
      <ParallaxLayer
        speed={-0.3}
        ariaHidden
        className="pointer-events-none absolute top-20 -left-40 -z-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(109,90,230,0.18),transparent_70%)]"
      >
        <span />
      </ParallaxLayer>
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            id="work-h"
            eyebrow="Selected work"
            title={workIntro.heading}
            lede={workIntro.body}
            className="mb-0 md:mb-0"
          />
          <TextLink href="/work">
            Filter all work <ArrowIcon />
          </TextLink>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <ScrollReveal>
                <ProjectCard project={p} priority={i === 0} />
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FeaturedProduct() {
  return (
    <section aria-labelledby="ww-h" className="relative isolate overflow-hidden py-20 md:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent,rgba(27,27,37,0.6)_20%,rgba(27,27,37,0.6)_80%,transparent)]"
      />
      <CursorFollow className="-z-10" />
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <FadeIn>
            <div className="mb-6 flex items-center gap-4">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={72}
                height={85}
                className="rounded-[var(--radius-md)] bg-[#f6f1e7] p-1"
              />
              <ProvenanceBadge kind="measured" label="Shipped — private beta" />
            </div>
            <p className="eyebrow mb-4">Featured shipped product</p>
            <h2 id="ww-h" className="display h-lg">
              WonderWord AI
            </h2>
            <p className="lede mt-5">
              An AI reading coach that turns a child’s real school worksheet into a karaoke reading adventure.
            </p>
            <blockquote className="mt-8 border-l-2 border-[var(--color-violet)] pl-5">
              <p className="text-[1.15rem] text-[var(--color-text)] italic">{bet.hypothesis}</p>
              <footer className="mt-2 font-[family-name:var(--font-display)] text-sm text-[var(--color-faint)]">
                The product bet · Hypothesis
              </footer>
            </blockquote>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="https://www.wonderwordai.net/">View live product</ButtonLink>
              <ButtonLink href="/work/wonderword-ai" variant="ghost">
                Full case study <ArrowIcon />
              </ButtonLink>
            </div>
          </FadeIn>
        </div>
        <ParallaxLayer speed={0.08}>
          <Gallery />
        </ParallaxLayer>
      </div>
    </section>
  );
}

export function DashboardPreview() {
  return (
    <section aria-labelledby="dash-h" className="container-x py-20 md:py-28">
      <SectionHeader
        id="dash-h"
        eyebrow="Product and impact dashboard"
        title="The work, as data"
        lede="Career impact, the WonderWord beta and its modeled economics, enterprise delivery results, and the playground demos. Measured and modeled numbers are labelled differently everywhere."
      />
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
        <Tilt3D size="lg" className="[border-radius:var(--radius-lg)]">
          <div className="card h-full p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold">
                  WonderWord AI, modeled MRR to March 2027
                </h3>
                <p className="text-[0.95rem] text-[var(--color-muted)]">
                  From the 100+ beta families to the $4.8K MRR target. Not booked revenue.
                </p>
              </div>
              <ProvenanceBadge kind="modeled" />
            </div>
            <DashboardPreviewChart />
          </div>
        </Tilt3D>
        <div className="grid min-w-0 gap-5">
          <Tilt3D size="md" className="[border-radius:var(--radius-lg)]">
            <div className="card p-6">
              <h3 className="font-[family-name:var(--font-display)] font-semibold">Career timeline</h3>
              <p className="mb-3 text-sm text-[var(--color-muted)]">
                Six roles since 2016, three running at once today.
              </p>
              <RoleGantt className="!border-0 !bg-transparent !p-0 !shadow-none" />
            </div>
          </Tilt3D>
          <ButtonLink href="/dashboard" className="justify-center">
            Open the dashboard <ArrowIcon />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function PlaygroundPreview() {
  const demos = [
    {
      title: guardrail.title,
      body: "Edit an AI-generated correction story and watch four guardrails score it.",
      tag: "Responsible AI",
    },
    {
      title: pricingSim.title,
      body: "Move conversion and cost-to-serve sliders and find where margin goes negative.",
      tag: "Unit economics",
    },
    {
      title: decisionsIntro.title,
      body: "Pick an option before seeing what I chose, with the evidence and the tradeoff.",
      tag: "Judgment",
    },
  ];
  return (
    <section aria-labelledby="play-h" className="relative py-20 md:py-28">
      <div className="container-x">
        <SectionHeader
          id="play-h"
          eyebrow="Product-thinking playground"
          title={playgroundIntro.heading}
          lede={playgroundIntro.body}
        />
        <StaggerChildren as="ul" className="grid gap-5 md:grid-cols-3">
          {demos.map((d, i) => (
            <StaggerItem as="li" key={d.title}>
              <HoverLift>
                <Tilt3D size="md" className="[border-radius:var(--radius-lg)]">
                  <GlowHover className="card h-full rounded-[var(--radius-lg)]">
                    <article className="relative flex h-full flex-col p-6">
                      <span className="font-[family-name:var(--font-display)] text-sm text-[var(--color-faint)] tabular-nums">
                        0{i + 1}
                      </span>
                      <p className="eyebrow mt-4">{d.tag}</p>
                      <h3 className="display mt-2 text-[1.5rem] [font-stretch:104%]">
                        <Link href="/playground" className="after:absolute after:inset-0 after:content-['']">
                          {d.title}
                        </Link>
                      </h3>
                      <p className="mt-2 flex-1 text-[var(--color-muted)]">{d.body}</p>
                      <span
                        aria-hidden="true"
                        className="mt-6 inline-flex items-center gap-1.5 font-[family-name:var(--font-display)] text-sm font-semibold"
                      >
                        Try it <ArrowIcon />
                      </span>
                    </article>
                  </GlowHover>
                </Tilt3D>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

export function ExperiencePreview() {
  return (
    <section aria-labelledby="exp-h" className="container-x py-20 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeader
          id="exp-h"
          eyebrow="Experience"
          title={experienceIntro.heading}
          lede={experienceIntro.body}
          className="mb-0 md:mb-0"
        />
        <TextLink href="/experience">
          Full timeline <ArrowIcon />
        </TextLink>
      </div>
      <div className="mt-10">
        <Timeline headingLevel={3} limit={4} />
      </div>
    </section>
  );
}

export function TestimonialBlock({ headingLevel = "h2" }: { headingLevel?: "h2" | "h3" }) {
  const t = testimonials[0];
  const H = headingLevel;
  return (
    <section aria-labelledby="voices-h" className="container-x py-20 md:py-28">
      <p className="eyebrow mb-4">Voices</p>
      <H id="voices-h" className="sr-only">
        What colleagues say
      </H>
      <FadeIn>
        <Tilt3D size="lg" className="[border-radius:var(--radius-xl)]">
          <figure className="card relative overflow-hidden rounded-[var(--radius-xl)] p-8 sm:p-12">
            <span
              aria-hidden="true"
              className="display pointer-events-none absolute -top-6 left-6 text-[10rem] leading-none text-[var(--color-violet)] opacity-20"
            >
              “
            </span>
            <blockquote className="relative">
              <p className="text-[clamp(1.2rem,2.2vw,1.6rem)] leading-relaxed">{t.quote}</p>
            </blockquote>
            <figcaption className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 font-[family-name:var(--font-display)]">
              <span className="font-semibold">{t.name}</span>
              <span className="text-[var(--color-muted)]">{t.title}</span>
              <a
                href={t.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-cyan)]"
              >
                LinkedIn <ExternalIcon />
                <span className="sr-only">profile of {t.name} (opens in a new tab)</span>
              </a>
            </figcaption>
          </figure>
        </Tilt3D>
      </FadeIn>
    </section>
  );
}

export function ContactCta() {
  const socials = contactLinks.filter((l) => l.kind === "social");
  return (
    <section aria-labelledby="cta-h" className="container-x py-20 md:py-28">
      <div className="card relative isolate overflow-hidden rounded-[var(--radius-xl)] px-6 py-14 text-center sm:px-12 sm:py-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(109,90,230,0.35),transparent_70%)]"
        />
        <CursorFollow className="-z-10" />
        <p className="eyebrow mb-4">Contact</p>
        <h2 id="cta-h" className="display h-lg mx-auto max-w-3xl">
          {contactCopy.heading}
        </h2>
        <p className="lede mx-auto mt-5 max-w-2xl">{contactCopy.body}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href={`mailto:${profile.email}?subject=Hello%20from%20your%20portfolio`}>
            Write to me
          </ButtonLink>
          <CopyEmail email={profile.email} />
        </div>
        <ul className="mt-8 flex justify-center gap-5 font-[family-name:var(--font-display)]">
          {socials.map((s) => (
            <li key={s.href}>
              <MagneticHover>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                >
                  {s.label === "GitHub" ? "GitHub (WonderWord)" : s.label} <ExternalIcon />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </MagneticHover>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

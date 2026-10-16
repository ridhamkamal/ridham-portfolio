import Image from "next/image";
import { profile } from "@/data/profile";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { CursorFollow, TextReveal } from "@/components/motion";
import { ArrowIcon, ButtonLink } from "@/components/ui";
import { asset } from "@/lib/asset";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16"
    >
      {/* Decorative layers */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(60%_50%_at_70%_40%,rgba(109,90,230,0.22),transparent_70%),radial-gradient(40%_40%_at_90%_80%,rgba(31,169,189,0.14),transparent_70%)]"
      />
      <div className="absolute inset-0 -z-10 md:left-[30%]">
        <HeroCanvas />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--color-bg)] via-[rgba(11,11,15,0.75)] to-transparent md:via-[rgba(11,11,15,0.35)]"
      />
      <CursorFollow className="-z-10" />

      <div className="container-x">
        <div className="max-w-[1000px]">
          <div className="fade-up" style={{ animationDelay: "calc(0.05s / var(--motion-speed))" }}>
            <p className="mb-6 inline-flex items-center gap-3 rounded-full border border-[var(--color-line)] bg-[rgba(19,19,26,0.6)] py-1.5 pr-4 pl-1.5 font-[family-name:var(--font-display)] text-sm text-[var(--color-muted)] backdrop-blur">
              <Image
                src={asset(profile.headshot.src)}
                alt=""
                width={28}
                height={28}
                className="rounded-full"
                priority
              />
              <span>
                <span className="text-[var(--color-text)]">{profile.name}</span> · {profile.title}
              </span>
            </p>
          </div>
          <TextReveal
            as="h1"
            text={profile.positioning}
            highlight={["trust"]}
            className="display text-[clamp(2.5rem,6vw,5.4rem)] text-balance lg:max-w-[16ch]"
            delay={0.15}
          />
          <div className="fade-up" style={{ animationDelay: "calc(0.55s / var(--motion-speed))" }}>
            <p className="lede mt-7 max-w-[620px]">{profile.narrative}</p>
          </div>
          <div className="fade-up" style={{ animationDelay: "calc(0.7s / var(--motion-speed))" }}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="/work">
                Explore selected work <ArrowIcon />
              </ButtonLink>
              <ButtonLink href="/contact" variant="ghost">
                Get in touch
              </ButtonLink>
            </div>
          </div>
          <div className="fade-up" style={{ animationDelay: "calc(0.85s / var(--motion-speed))" }}>
            <dl className="mt-12 grid max-w-[620px] gap-4 border-t border-[var(--color-line)] pt-6 font-[family-name:var(--font-display)] text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[var(--color-faint)]">Based in</dt>
                <dd className="mt-0.5 text-[var(--color-text)]">{profile.location}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-faint)]">Availability</dt>
                <dd className="mt-0.5 flex items-center gap-2 text-[var(--color-text)]">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-good)] opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-good)]" />
                  </span>
                  {profile.availability}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

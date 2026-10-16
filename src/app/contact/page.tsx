import type { Metadata } from "next";
import { contactCopy, contactLinks, profile } from "@/data/profile";
import {
  CursorFollow,
  HoverLift,
  MagneticHover,
  StaggerChildren,
  StaggerItem,
  TextReveal,
  Tilt3D,
} from "@/components/motion";
import { ButtonLink, ExternalIcon } from "@/components/ui";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { pageMetadata } from "@/lib/seo";
import { asset } from "@/lib/asset";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Open to AI Product Manager roles, remote or Bay Area. Email is the fastest way to reach Ridham Chawala.",
  path: "/contact",
});

export default function ContactPage() {
  const socials = contactLinks.filter((l) => l.kind === "social");
  return (
    <div className="relative isolate overflow-hidden pt-32 pb-10 md:pt-40">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_50%_10%,rgba(109,90,230,0.25),transparent_70%)]"
      />
      <CursorFollow className="-z-10" />
      <div className="container-x">
        <p className="eyebrow mb-4">Contact</p>
        <TextReveal as="h1" text={contactCopy.heading} className="display h-xl" />
        <p className="lede mt-6 max-w-2xl">{contactCopy.body}</p>
        <p className="mt-4 font-[family-name:var(--font-display)] text-[var(--color-muted)]">
          {profile.availability}.
        </p>

        <StaggerChildren as="ul" className="mt-14 grid gap-5 md:grid-cols-3">
          <StaggerItem as="li" className="md:col-span-2">
            <HoverLift>
              <Tilt3D size="lg" className="[border-radius:var(--radius-lg)]">
                <article className="card h-full p-6 sm:p-8">
                  <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.12em] text-[var(--color-cyan)] uppercase">
                    Email
                  </h2>
                  <p className="display mt-3 text-[clamp(1.4rem,3.2vw,2.4rem)] break-all">
                    <a
                      href={`mailto:${profile.email}?subject=Hello%20from%20your%20portfolio`}
                      className="link-underline"
                    >
                      {profile.email}
                    </a>
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <ButtonLink href={`mailto:${profile.email}?subject=Hello%20from%20your%20portfolio`}>
                      Write to me
                    </ButtonLink>
                    <CopyEmail email={profile.email} />
                  </div>
                </article>
              </Tilt3D>
            </HoverLift>
          </StaggerItem>
          <StaggerItem as="li">
            <HoverLift>
              <Tilt3D size="md" className="[border-radius:var(--radius-lg)]">
                <article className="card h-full p-6 sm:p-8">
                  <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.12em] text-[var(--color-cyan)] uppercase">
                    Elsewhere
                  </h2>
                  <ul className="mt-4 grid gap-3 font-[family-name:var(--font-display)] text-lg">
                    {socials.map((s) => (
                      <li key={s.href}>
                        <MagneticHover>
                          <a
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 hover:text-[var(--color-cyan)]"
                          >
                            {s.label === "GitHub" ? "GitHub (WonderWord)" : s.label} <ExternalIcon />
                            <span className="sr-only">(opens in a new tab)</span>
                          </a>
                        </MagneticHover>
                      </li>
                    ))}
                    {"href" in contactCopy.resume && (
                      <li>
                        <a
                          href={asset(contactCopy.resume.href)}
                          download
                          className="inline-flex items-center gap-2 hover:text-[var(--color-cyan)]"
                        >
                          {contactCopy.resume.label}
                          <span className="text-sm text-[var(--color-faint)]">
                            {contactCopy.resume.sizeKb} KB
                          </span>
                        </a>
                      </li>
                    )}
                  </ul>
                  <p className="mt-6 text-sm text-[var(--color-muted)]">{profile.location}</p>
                </article>
              </Tilt3D>
            </HoverLift>
          </StaggerItem>
        </StaggerChildren>
      </div>
    </div>
  );
}

import Link from "next/link";
import { NAV } from "@/lib/site";
import { contactCopy, contactLinks, profile } from "@/data/profile";
import { MagneticHover, MotionControlsButton } from "@/components/motion";
import { ExternalIcon } from "@/components/ui";

export function Footer() {
  const socials = contactLinks.filter((l) => l.kind === "social");
  return (
    <footer className="relative mt-24 border-t border-[var(--color-line)]">
      <div className="container-x grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="display text-2xl">{profile.name}</p>
          <p className="mt-1 text-[var(--color-muted)]">
            {profile.title} · {profile.location}
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] px-3 py-1 font-[family-name:var(--font-display)] text-sm text-[var(--color-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-good)]" aria-hidden="true" />
            {contactCopy.footerNote}
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="eyebrow mb-4">Pages</p>
          <ul className="grid gap-2 font-[family-name:var(--font-display)]">
            <li>
              <Link href="/" className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
                Home
              </Link>
            </li>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <MotionControlsButton className="text-[var(--color-muted)] underline-offset-4 hover:text-[var(--color-text)] hover:underline" />
            </li>
          </ul>
        </nav>
        <div>
          <p className="eyebrow mb-4">Elsewhere</p>
          <ul className="grid gap-2 font-[family-name:var(--font-display)]">
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="break-all text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                {profile.email}
              </a>
            </li>
            {socials.map((s) => (
              <li key={s.href}>
                <MagneticHover strength={8}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  >
                    {s.label === "GitHub" ? "GitHub (WonderWord)" : s.label}
                    <ExternalIcon />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </MagneticHover>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col justify-between gap-2 border-t border-[var(--color-line)] py-6 text-sm text-[var(--color-faint)] sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <p>Built with Next.js, React Three Fiber and Framer Motion.</p>
      </div>
    </footer>
  );
}

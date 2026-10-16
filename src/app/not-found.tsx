import type { Metadata } from "next";
import Link from "next/link";
import { NAV } from "@/lib/site";
import { ButtonLink } from "@/components/ui";
import { HeroFallback } from "@/components/three/HeroFallback";

export const metadata: Metadata = { title: "Page not found — Ridham Chawala", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-[80vh] items-center overflow-hidden pt-28">
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-30">
        <HeroFallback />
      </div>
      <div className="container-x">
        <p className="eyebrow mb-4">404</p>
        <h1 className="display h-xl max-w-3xl">This page didn’t make it past the guardrails.</h1>
        <p className="lede mt-5 max-w-xl">
          The address may be mistyped, or the page has moved. Try one of these instead.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/work" variant="ghost">
            Selected work
          </ButtonLink>
        </div>
        <nav aria-label="Site pages" className="mt-10">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 font-[family-name:var(--font-display)] text-[var(--color-muted)]">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-[var(--color-text)]">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

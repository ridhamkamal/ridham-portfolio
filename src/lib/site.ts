import { profile } from "@/data/profile";

/**
 * Canonical origin. Order: explicit NEXT_PUBLIC_SITE_URL, then the production
 * domain Vercel injects at build time, then the address in profile.ts.
 */
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? (vercelHost ? `https://${vercelHost}` : profile.seo.siteUrl)
).replace(/\/$/, "");

export const NAV = [
  { href: "/work", label: "Work" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/playground", label: "Playground" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const absoluteUrl = (path = "/") => `${SITE_URL}${path === "/" ? "" : path}`;

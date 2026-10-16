import { profile } from "@/data/profile";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? profile.seo.siteUrl).replace(/\/$/, "");

export const NAV = [
  { href: "/work", label: "Work" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/playground", label: "Playground" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const absoluteUrl = (path = "/") => `${SITE_URL}${path === "/" ? "" : path}`;

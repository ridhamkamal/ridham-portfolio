import type { Metadata } from "next";
import { profile, contactLinks } from "@/data/profile";
import { roles } from "@/data/experience";
import type { Project } from "@/data/types";
import { absoluteUrl, SITE_URL } from "./site";

/** Per-route metadata with canonical URL and Open Graph/Twitter tags. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = title ? `${title} — ${profile.name}` : profile.seo.title;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: "website",
      siteName: profile.name,
      title: fullTitle,
      description,
      url: absoluteUrl(path),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    url: SITE_URL,
    email: `mailto:${profile.email}`,
    image: absoluteUrl(profile.headshot.src),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Fremont",
      addressRegion: "CA",
      addressCountry: "US",
    },
    sameAs: contactLinks.filter((l) => l.kind === "social").map((l) => l.href),
    worksFor: roles.filter((r) => r.end === null).map((r) => ({ "@type": "Organization", name: r.org })),
  };
}

export function caseStudyJsonLd(p: Project) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: p.title,
      about: p.category,
      abstract: p.summary,
      url: absoluteUrl(`/work/${p.slug}`),
      creator: { "@type": "Person", name: profile.name, url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Work", item: absoluteUrl("/work") },
        { "@type": "ListItem", position: 3, name: p.title, item: absoluteUrl(`/work/${p.slug}`) },
      ],
    },
  ];
}

/** Serialises JSON-LD safely for a <script> tag. */
export const jsonLdString = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

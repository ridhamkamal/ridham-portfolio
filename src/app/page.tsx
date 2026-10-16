import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import {
  ContactCta,
  DashboardPreview,
  ExperiencePreview,
  FeaturedProduct,
  ImpactSnapshot,
  PlaygroundPreview,
  SelectedWork,
  TestimonialBlock,
} from "@/components/home/HomeSections";
import { profile } from "@/data/profile";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ description: profile.seo.description, path: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <ImpactSnapshot />
      <SelectedWork />
      <FeaturedProduct />
      <DashboardPreview />
      <PlaygroundPreview />
      <ExperiencePreview />
      <TestimonialBlock />
      <ContactCta />
    </>
  );
}

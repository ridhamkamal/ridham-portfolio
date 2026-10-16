import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { projects } from "@/data/projects";
import { testimonials, profile } from "@/data/profile";
import { roles } from "@/data/experience";
import { impactSnapshot, metrics } from "@/data/metrics";

const walk = (d: string): string[] =>
  readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));

describe("content integrity", () => {
  it("has exactly one testimonial, Marcus Hardiman's", () => {
    expect(testimonials).toHaveLength(1);
    expect(testimonials[0].name).toBe("Marcus Hardiman");
  });
  it("never ships the unfinished recommendations placeholder", () => {
    const src = walk("src")
      .filter((f) => /\.(ts|tsx)$/.test(f))
      .map((f) => readFileSync(f, "utf8"))
      .join("\n");
    expect(src).not.toMatch(/Add your other recommendations/);
  });
  it("uses the confirmed email", () => {
    expect(profile.email).toBe("ridhambatra15@gmail.com");
  });
  it("keeps concurrent roles concurrent", () => {
    const current = roles.filter((r) => r.end === null).map((r) => r.org);
    expect(current).toEqual(expect.arrayContaining(["Juniper Networks", "WonderWord AI", "PM Accelerator"]));
  });
  it("attributes C3.ai results to C3.ai and integrations to Juniper", () => {
    expect(metrics.c3Reporting.context).toMatch(/^C3\.ai/);
    expect(metrics.integrations.context).toMatch(/^Juniper Networks/);
    expect(impactSnapshot).toHaveLength(4);
  });
  it("gives every project external artifact links and an internal case study", () => {
    for (const p of projects) {
      expect(p.links.some((l) => l.kind === "internal" && l.href === `/work/${p.slug}`)).toBe(true);
      expect(p.links.filter((l) => l.href.startsWith("https://")).length).toBeGreaterThanOrEqual(2);
    }
  });
  it("states the Alert Triage data boundary", () => {
    expect(projects.find((p) => p.slug === "alert-triage-copilot")!.boundary).toMatch(/No employer data/);
  });
});

import { describe, expect, it } from "vitest";
import { checkStory } from "@/lib/guardrail";
import { simulatePricing } from "@/lib/pricing";
import { buildProjection, projectionAssumptions } from "@/lib/projection";
import { guardrail, pricingSim } from "@/data/playground";
import { matchesFilter, projects } from "@/data/projects";

describe("story guardrail (ported from portfolio1.html)", () => {
  const score = (label: string) => {
    const p = guardrail.presets.find((x) => x.label === label)!;
    return checkStory(p.word, p.story);
  };
  it("passes the documented passing story", () => {
    const r = score("Passes");
    expect(r.score).toBe(100);
    expect(r.passes).toBe(true);
  });
  it("blocks the too-complex story on vocabulary, complexity and safety", () => {
    const r = score("Too complex");
    expect(r.passes).toBe(false);
    expect(r.checks.filter((c) => !c.ok).map((c) => c.id)).toEqual(["vocabulary", "complexity", "safety"]);
  });
  it("blocks bad structure and unsafe stories at 75", () => {
    expect(score("Bad structure").score).toBe(75);
    expect(score("Unsafe").score).toBe(75);
    expect(score("Unsafe").checks.find((c) => c.id === "safety")!.ok).toBe(false);
  });
  it("uses the target word in the fallback", () => {
    expect(checkStory("cat", "The CAT.").fallbackWord).toBe("CAT");
    expect(checkStory("", "x").fallbackWord).toBe("WORD");
  });
});

describe("pricing simulator", () => {
  it("baseline matches the documented formula", () => {
    const r = simulatePricing(pricingSim.baseline);
    expect(r.payingUsers).toBe(150);
    expect(r.mrr).toBeCloseTo(100 * 9.99 + 50 * 17.99);
    expect(Math.round(r.grossMarginPct)).toBe(49);
    expect(r.band).toBe("validated");
    expect(r.annualRunRate).toBeCloseTo(r.mrr * 12);
  });
  it("clamps DIY + Family to 100%", () => {
    expect(simulatePricing({ users: 100, diyPct: 80, familyPct: 30, costToServe: 5 }).familyPct).toBe(20);
  });
  it("reports each margin band", () => {
    expect(simulatePricing({ users: 500, diyPct: 0, familyPct: 0, costToServe: 5 }).band).toBe("no-paying");
    expect(simulatePricing({ users: 500, diyPct: 20, familyPct: 10, costToServe: 20 }).band).toBe("negative");
    expect(simulatePricing({ users: 500, diyPct: 20, familyPct: 10, costToServe: 9 }).band).toBe("thin");
  });
});

describe("modeled projection", () => {
  const rows = buildProjection();
  it("starts at the measured beta and ends at the sourced targets", () => {
    expect(rows[0]).toMatchObject({ totalUsers: 100, payingUsers: 0, mrr: 0 });
    const last = rows.at(-1)!;
    expect(last.totalUsers).toBe(projectionAssumptions.endUsers);
    expect(Math.abs(last.mrr - projectionAssumptions.targetMrr)).toBeLessThan(25);
  });
  it("never decreases users or revenue", () => {
    rows.slice(1).forEach((r, i) => {
      expect(r.totalUsers).toBeGreaterThanOrEqual(rows[i]!.totalUsers);
      expect(r.mrr).toBeGreaterThanOrEqual(rows[i]!.mrr);
    });
  });
});

describe("project filters", () => {
  const n = (f: Parameters<typeof matchesFilter>[1]) => projects.filter((p) => matchesFilter(p, f)).length;
  it("matches categories and statuses", () => {
    expect(n("All")).toBe(4);
    expect(n("Shipped")).toBe(1);
    expect(n("Concept")).toBe(3);
    expect(n("Prototype")).toBe(3);
    expect(n("Consumer AI")).toBe(1);
    expect(n("Enterprise AI")).toBe(1);
  });
});

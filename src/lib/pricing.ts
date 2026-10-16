import { pricingTiers } from "@/data/wonderword";

export interface PricingInput {
  users: number;
  diyPct: number;
  familyPct: number;
  costToServe: number;
}

export interface PricingOutput {
  /** familyPct after clamping so diy + family never exceeds 100%. */
  familyPct: number;
  diyUsers: number;
  familyUsers: number;
  payingUsers: number;
  mrr: number;
  annualRunRate: number;
  grossMarginPct: number;
  band: "no-paying" | "negative" | "thin" | "validated";
}

const DIY = pricingTiers.find((t) => t.id === "diy")!.monthly; // 9.99
const FAMILY = pricingTiers.find((t) => t.id === "family")!.monthly; // 17.99

/** Ported 1:1 from the economics block in portfolio1.html. Modeled, not booked. */
export function simulatePricing(input: PricingInput): PricingOutput {
  const familyPct = input.diyPct + input.familyPct > 100 ? 100 - input.diyPct : input.familyPct;
  const diyUsers = Math.round((input.users * input.diyPct) / 100);
  const familyUsers = Math.round((input.users * familyPct) / 100);
  const payingUsers = diyUsers + familyUsers;
  const mrr = diyUsers * DIY + familyUsers * FAMILY;
  const grossMarginPct = mrr > 0 ? ((mrr - payingUsers * input.costToServe) / mrr) * 100 : 0;
  // Thresholds as in source: <0 negative, <40 thin, else inside the 47–61% band.
  const band =
    payingUsers === 0
      ? "no-paying"
      : grossMarginPct < 0
        ? "negative"
        : grossMarginPct < 40
          ? "thin"
          : "validated";
  return {
    familyPct,
    diyUsers,
    familyUsers,
    payingUsers,
    mrr,
    annualRunRate: mrr * 12,
    grossMarginPct,
    band,
  };
}

export const bandMessage: Record<PricingOutput["band"], string> = {
  "no-paying": "No paying users. The free tier alone has no path to covering inference cost.",
  negative:
    "Margin is negative. At this cost to serve every new paying user loses money, and the fix is routing cheaper work to a smaller model, not raising price.",
  thin: "Below the 47 to 61% band the model was validated at. Thin enough that support costs would erase it.",
  validated: "Inside the validated 47 to 61% band.",
};

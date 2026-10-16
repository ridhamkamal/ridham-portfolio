import { pricingTiers } from "@/data/wonderword";

/**
 * MODELED WonderWord AI projection, Sep 2026 → Mar 2027. Not booked revenue.
 *
 * Anchors (sourced): 100+ beta families at launch; 2,000+ users and $4.8K MRR
 * targeted by March 2027 (résumé); tier prices; DIY:Family = 2:1 from the
 * projected 20/10 paid mix; $6.50 baseline cost to serve.
 * Assumptions (portfolio model, shown on the dashboard): geometric user growth
 * between the anchors, and a paid share ramping linearly from 0% during the
 * free beta to whatever share makes March land on $4.8K.
 */
export const projectionAssumptions = {
  months: ["Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026", "Jan 2027", "Feb 2027", "Mar 2027"],
  startUsers: 100,
  endUsers: 2000,
  targetMrr: 4800,
  diyShareOfPaid: 2 / 3,
  costToServe: 6.5,
} as const;

export interface ProjectionRow {
  month: string;
  totalUsers: number;
  freeUsers: number;
  payingUsers: number;
  mrr: number;
  grossMarginPct: number;
}

const price = (id: "diy" | "family") => pricingTiers.find((t) => t.id === id)!.monthly;

export function buildProjection(a = projectionAssumptions): ProjectionRow[] {
  const n = a.months.length - 1;
  const growth = Math.pow(a.endUsers / a.startUsers, 1 / n);
  const arpu = a.diyShareOfPaid * price("diy") + (1 - a.diyShareOfPaid) * price("family");
  const endPaidShare = a.targetMrr / (a.endUsers * arpu);

  return a.months.map((month, i) => {
    const totalUsers = Math.round(a.startUsers * Math.pow(growth, i));
    const payingUsers = Math.round(totalUsers * endPaidShare * (i / n));
    const mrr = Math.round(payingUsers * arpu);
    const grossMarginPct = mrr > 0 ? Math.round(((mrr - payingUsers * a.costToServe) / mrr) * 100) : 0;
    return { month, totalUsers, freeUsers: totalUsers - payingUsers, payingUsers, mrr, grossMarginPct };
  });
}

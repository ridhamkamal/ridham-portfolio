import type { Metric } from "./types";

/**
 * Every quantitative claim in portfolio1.html, attributed to its owner.
 * Source uses "15+" and "100+"; the "+" is kept so the site never states
 * more precision than the source does.
 */
export const metrics = {
  pmYears: {
    id: "pmYears",
    value: 8,
    suffix: " years",
    label: "in product management",
    context: "Career, across Cloudera, C3.ai, Juniper Networks and WonderWord AI",
    provenance: "measured",
    source: "#top impact strip; #about",
  },
  integrations: {
    id: "integrations",
    value: 15,
    suffix: "+",
    label: "enterprise AI integrations delivered",
    context: "Juniper Networks — AI-powered capabilities across business systems and data workflows",
    provenance: "measured",
    source: "#top; #experience Juniper",
  },
  c3Reporting: {
    id: "c3Reporting",
    value: 37,
    suffix: "%",
    label: "less manual reporting effort",
    context: "C3.ai — self-service reporting",
    provenance: "measured",
    source: "#top; #experience C3.ai",
  },
  c3Engagement: {
    id: "c3Engagement",
    value: 28,
    suffix: "%",
    label: "increase in internal platform engagement",
    context: "C3.ai — usability enhancements, workflow redesign, clearer navigation",
    provenance: "measured",
    source: "#experience C3.ai",
  },
  c3Rework: {
    id: "c3Rework",
    value: 22,
    suffix: "%",
    label: "reduction in rework",
    context: "C3.ai — clearer user stories and acceptance criteria with UX and engineering",
    provenance: "measured",
    source: "#experience C3.ai",
  },
  betaFamilies: {
    id: "betaFamilies",
    value: 100,
    suffix: "+",
    label: "families in the WonderWord AI private beta",
    context: "WonderWord AI — concept to beta in four weeks",
    provenance: "measured",
    source: "#top; #work; #experience WonderWord",
  },
  vocInterviews: {
    id: "vocInterviews",
    value: 50,
    suffix: "+",
    label: "voice-of-customer interviews behind pricing",
    context: "WonderWord AI — three-tier freemium model",
    provenance: "measured",
    source: "#work; #experience WonderWord",
  },
  pmaScope: {
    id: "pmaScope",
    value: 30,
    suffix: "%",
    label: "reduction in initial feature scope",
    context: "PM Accelerator — customer discovery and market-validation interviews",
    provenance: "measured",
    source: "#experience PM Accelerator",
  },
  pmaCompetitors: {
    id: "pmaCompetitors",
    value: 8,
    suffix: "+",
    label: "AI products in competitive analysis",
    context: "PM Accelerator",
    provenance: "measured",
    source: "#experience PM Accelerator",
  },
  wwEngineers: {
    id: "wwEngineers",
    value: 8,
    label: "engineers, plus 2.5 FTE hires",
    context: "WonderWord AI — cross-functional team",
    provenance: "measured",
    source: "#work; #experience WonderWord",
  },
} as const satisfies Record<string, Metric>;

/** Home "Impact snapshot" — four cards, each with its own owner shown. */
export const impactSnapshot = [
  metrics.pmYears,
  metrics.integrations,
  metrics.c3Reporting,
  metrics.betaFamilies,
] as const;

/** Enterprise delivery dashboard — separate achievements, not a sum. */
export const enterpriseMetrics = [
  metrics.integrations,
  metrics.c3Reporting,
  metrics.c3Engagement,
  metrics.c3Rework,
] as const;

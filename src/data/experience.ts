import type { Role } from "./types";

export const experienceIntro = {
  heading: "Ten years, from analytics into AI product",
  body: "Enterprise systems that already had users, auditors and a support queue, and now a consumer product built from nothing. Both are the same job under different constraints.",
} as const;

/**
 * Ordered newest-start first. Three roles run concurrently from Aug 2026;
 * the timeline renders them as parallel lanes, never as a sequence.
 */
export const roles: readonly Role[] = [
  {
    id: "wonderword",
    org: "WonderWord AI",
    title: "Co-founder and Product Lead",
    start: "2026-08",
    end: null,
    location: "Fremont, CA",
    summary:
      "An AI-powered K–5 reading coach built on a PWA and FastAPI, taken from concept to 100+ beta families in four weeks.",
    bullets: [
      "Lead product strategy and roadmap across three MVPs to March 2027",
      "Manage a cross-functional team of 8 engineers plus 2.5 FTE hires; established product processes, metrics tracking in Amplitude and Mixpanel, and go-to-market",
      "Designed a three-tier freemium model with annual billing, validated against 50+ voice-of-customer interviews",
      "Modelled unit economics at $5–8 cost to serve for 47–61% gross margin; recruiting school pilots for Q4 2026",
    ],
    tags: ["consumer-ai", "delivery"],
    metricIds: ["betaFamilies", "vocInterviews", "wwEngineers"],
  },
  {
    id: "pm-accelerator",
    org: "PM Accelerator",
    title: "AI Lead Product Manager, Advisor",
    start: "2026-08",
    end: null,
    location: "Miami, FL",
    summary:
      "Product strategy for an early-stage generative AI platform: target users, problem statements, MVP scope, PRDs, roadmap priorities and launch outcomes.",
    bullets: [
      "Customer discovery and market-validation interviews reduced initial feature scope by 30% by separating critical MVP capabilities from lower-priority ideas",
      "Evaluated GPT, Claude, Gemini and open-source models on capability fit, response quality, cost, latency, scalability and integration effort",
      "Competitive analysis across 8+ AI products; defined AI success measures including response relevance, task completion, engagement and latency",
      "Assessed data considerations for retrieval workflows: quality, privacy, compliance and freshness",
    ],
    tags: ["enterprise-ai", "delivery"],
    metricIds: ["pmaScope", "pmaCompetitors"],
  },
  {
    id: "juniper",
    org: "Juniper Networks",
    title: "AI Product Manager",
    start: "2025-08",
    end: null,
    location: "Bridgewater, NJ",
    summary:
      "Product strategy and roadmap for enterprise AI, analytics and intelligent automation, aligning customer pain, business priorities, technical feasibility and measurable outcomes.",
    bullets: [
      "Defined and prioritized AI-powered capabilities contributing to 15+ enterprise integrations across business systems and data workflows",
      "Led a post-sale process and systems initiative covering onboarding, Professional Services coordination, expansion tracking and the link to revenue processes",
      "Converted business and technical requirements into prioritized capabilities, user stories, acceptance criteria, process flows and delivery plans",
      "Partnered with Salesforce and integration teams on data fields, status transitions, ownership rules and reporting, coordinating validation and downstream revenue impact",
      "Ran backlog refinement, sprint planning, defect triage and release readiness; supported UAT, rollout and post-release feedback",
    ],
    tags: ["enterprise-ai", "analytics", "delivery"],
    metricIds: ["integrations"],
  },
  {
    id: "c3ai",
    org: "C3.ai",
    title: "Product Manager, AI and Data Platforms",
    start: "2022-09",
    end: "2024-07",
    location: "Redwood City, CA",
    summary:
      "Enhancements for enterprise analytics, data-accessibility and workflow platforms, turning business needs into prioritized requirements and measurable outcomes.",
    bullets: [
      "Delivered self-service reporting that cut manual reporting effort 37% and removed recurring dependency on manual data preparation",
      "Increased internal platform engagement 28% through usability enhancements, workflow redesign and clearer navigation",
      "Reduced rework 22% by working with UX and engineering from discovery through release on clearer user stories and acceptance criteria",
      "Ran customer-feedback and adoption programs that improved roadmap accuracy",
      "Tracked adoption, retention and feature usage to evaluate releases and define success measures for experiments",
    ],
    tags: ["enterprise-ai", "analytics", "delivery"],
    metricIds: ["c3Reporting", "c3Engagement", "c3Rework"],
  },
  {
    id: "cloudera",
    org: "Cloudera",
    title: "Associate Product Manager",
    start: "2018-08",
    end: "2022-07",
    location: { todo: "Cloudera role location is not stated in source" },
    summary:
      "Digital-transformation and product-modernization programs across enterprise analytics and workflow platforms.",
    bullets: [
      "Gathered requirements through stakeholder interviews, workshops and current-state assessments; wrote functional specs, use cases, process flows and user stories",
      "Managed and prioritized backlogs with business owners and engineering using MoSCoW and value-versus-effort scoring",
      "Developed KPI dashboards and analytics frameworks in SQL, Tableau and Power BI",
      "Automated recurring reporting and operational workflows",
      "Planned and coordinated UAT, tracked defects to resolution and confirmed release readiness",
      "Wrote release notes, user guides and change communications",
    ],
    tags: ["analytics", "delivery"],
    metricIds: [],
  },
  {
    id: "mu-sigma",
    org: "Mu Sigma",
    title: "Product Analyst",
    start: "2016-07",
    end: "2018-07",
    location: "Bangalore, India",
    summary:
      "Analytics and decision-science engagements for enterprise clients, translating business problems into data requirements, analysis plans and reporting deliverables.",
    bullets: [
      "Gathered requirements through stakeholder interviews and workshops; documented process flows, use cases and functional specifications",
      "Built dashboards and recurring reports in SQL, Excel and Tableau to support client decision-making",
      "Cleaned, transformed and validated data from multiple sources, reconciling discrepancies to keep reporting trusted",
      "Partnered with data science and engineering to turn findings into actionable recommendations",
      "Presented findings and documented assumptions and methods for repeatable analysis",
    ],
    tags: ["analytics"],
    metricIds: [],
  },
];

import type { Link } from "./types";

export const profile = {
  name: "Ridham Chawala",
  title: "AI Product Manager",
  location: "Fremont, California",
  availability: "Open to AI Product Manager roles, remote or Bay Area",
  email: "ridhambatra15@gmail.com",
  headshot: { src: "/images/headshot.jpg", alt: "Ridham Chawala", width: 520, height: 520 },

  // #top h1. Source punctuation: "children, parents and regulators".
  positioning: "I build AI products that children, parents, and regulators can all trust.",
  // Brief-supplied narrative; hero copy in source is kept as `heroSupport`.
  narrative:
    "Eight years in product management, shipping AI-enabled enterprise products and now co-founding WonderWord AI, an AI reading coach that turns a child’s real school worksheet into an engaging reading experience.",
  heroSupport:
    "Eight years shipping AI into enterprise systems that already had users, auditors and a support queue. Now co-founding WonderWord AI, a reading coach that turns a child's real school worksheet into something they want to read.",

  seo: {
    title: "Ridham Chawala — AI Product Manager",
    description:
      "AI Product Manager with 8+ years shipping AI-enabled enterprise products. Co-founder of WonderWord AI, a reading coach for K-5. Based in Fremont, California.",
    ogDescription:
      "Eight years shipping AI products at Juniper Networks, C3.ai, Cloudera and Mu Sigma. Co-founder of WonderWord AI.",
    siteUrl: "https://ridhamchawala15.netlify.app", // from résumé header
  },
} as const;

export const contactLinks: readonly Link[] = [
  {
    label: "Email",
    href: "mailto:ridhambatra15@gmail.com?subject=Hello%20from%20your%20portfolio",
    kind: "email",
  },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ridham-chawala-7b456212b/", kind: "social" },
  // Source links GitHub to the WonderWord team repo, not a personal profile.
  { label: "GitHub", href: "https://github.com/WonderWord-DEV-Team/WonderWordAI/tree/main", kind: "social" },
];

export const contactCopy = {
  heading: "Get in touch",
  body: "Open to AI Product Manager roles and to conversations about building responsible AI for children. Email is the fastest way to reach me.",
  footerNote: "WonderWord AI, private beta since August 2026",
  resume: { label: "Download résumé (PDF)", href: "/resume/Ridham-Chawala-AI-PM-Resume.pdf", sizeKb: 191 },
} as const;

export const about = {
  bio: "AI Product Manager with eight years delivering AI-enabled, data-driven and enterprise software products. I own the full lifecycle for generative AI, LLM and RAG, analytics and intelligent automation: discovery, vision, roadmaps, PRDs, user stories, success metrics, evaluation and launch.",
  bridge:
    "What connects the enterprise work to a children's reading app is the constraint. At Juniper the boundary is compliance and interoperability; in WonderWord it is COPPA and a six-year-old's confidence. In both, the regulatory line is the specification, not an afterthought, and the product only works if the person in the workflow trusts what the model says.",
  principles: [
    {
      title: "The buyer is not the user",
      body: "At Juniper, engineers use it and leadership buys it. In WonderWord, the child uses it and the parent pays. Both demand a product that proves its value to someone who never touches it.",
    },
    {
      title: "Constraint as specification",
      body: "Enterprise compliance and COPPA are the same discipline at different stakes. Treating the regulatory boundary as the architecture, rather than a policy page bolted on afterward, is the habit that transfers.",
    },
    {
      title: "Trust before capability",
      body: "A model that is right 90% of the time and honest about the rest beats one that is right 95% and silent. That held for enterprise recommendations and it holds harder for a six-year-old.",
    },
  ],
} as const;

export const education = [
  {
    credential: "Post Graduate Program in Data Engineering",
    institution: "Purdue University and Simplilearn",
    year: 2025,
  },
  { credential: "MBA", institution: "IEC University, Himachal Pradesh", year: 2018 },
  { credential: "BBA", institution: "Amity University, Noida", year: 2014 },
] as const;

export const certifications = [
  "Certified Scrum Product Owner (CSPO)",
  "IBM AI Product Manager",
  "Certification in Data Analytics",
] as const;

/** Verbatim from #about; split on the source's commas/periods only. */
export const skillGroups = [
  {
    id: "strategy",
    title: "Product strategy and discovery",
    items: [
      "AI and ML product strategy",
      "Lifecycle management",
      "Product vision",
      "Roadmaps",
      "Discovery",
      "Customer research",
      "MVP definition",
      "PRDs",
      "User stories",
      "Backlog prioritization",
      "Go-to-market",
      "Responsible AI and guardrails",
    ],
  },
  {
    id: "ai",
    title: "AI product development and evaluation",
    items: [
      "LLMs across GPT, Claude, Gemini, Llama and open-source",
      "Prompt engineering",
      "RAG",
      "Vector search and embeddings",
      "AI agents",
      "Conversational AI",
      "Semantic search",
      "Evaluation frameworks",
      "Hallucination and guardrail design",
      "Fine-tuning against prompting tradeoffs",
      "Model selection on cost, latency and quality",
    ],
  },
  {
    id: "analytics",
    title: "Analytics and experimentation",
    items: [
      "KPI and north-star metrics",
      "Product analytics",
      "A/B testing",
      "Funnel, cohort and retention analysis",
      "Adoption metrics",
      "SQL",
      "Python (Pandas)",
      "Excel",
      "Tableau",
      "Power BI",
      "Amplitude",
      "Mixpanel",
      "Google Analytics",
    ],
  },
  {
    id: "delivery",
    title: "Technical collaboration and delivery",
    items: [
      "REST APIs",
      "System integrations",
      "Data pipelines and ETL",
      "Enterprise data products",
      "MLOps concepts",
      "AWS and Azure",
      "Databricks",
      "Snowflake",
      "Cloudera Data Platform",
      "Salesforce",
      "FastAPI",
      "AI/ML platforms",
      "Data governance and privacy",
      "Lovable prototyping",
      "Agile and Scrum",
      "SAFe concepts",
      "Cross-functional leadership",
      "Acceptance criteria",
      "Release planning",
      "UAT",
      "Stakeholder management",
      "Jira",
      "Confluence",
      "Figma",
      "Miro",
      "Notion",
    ],
  },
] as const;

/** The only testimonial in source. The unfinished placeholder for more recommendations is dropped. */
export const testimonials = [
  {
    quote:
      "Having worked alongside Ridham as Product Manager, I have seen his creativity, initiative, persistence, and willingness to turn an ambitious idea into a functioning product. He has been receptive to Voice of the Customer feedback and has worked collaboratively to balance user needs, product vision, technical feasibility, and development priorities. Ridham's ability to apply emerging AI technologies to a meaningful real-world problem demonstrates both an entrepreneurial mindset and a strong commitment to continuous product improvement.",
    name: "Marcus Hardiman",
    title: "Product Manager",
    linkedin: "https://www.linkedin.com/in/marcus-hardiman-414a4441b/",
  },
] as const;

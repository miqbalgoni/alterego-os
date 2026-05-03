// Module catalog. Each module addresses one or more gap tags from rubrics.ts.
// recommend.ts intersects assessment gapTags with module.addressesTags.
//
// Content lives in modules/content/{moduleId}.ts as a sequence of "beats".
// The lesson player streams each beat as A2UI surfaces.

import type { GapTag } from "@/lib/scoring/rubrics";

export interface ModuleSummary {
  id: string;
  title: string;
  shortTitle: string;
  section: string; // "irl-1" .. "irl-5"
  estMinutes: number;
  // Gap tags this module addresses (drives recommendation)
  addressesTags: GapTag[];
  // Module-level prerequisites (other module ids). Honored by recommend.ts.
  prerequisites: string[];
  // 1–2 sentence pitch shown on the recommendation card
  blurb: string;
  // Source PDF section(s) for citation
  source: string;
}

export const MODULES: ModuleSummary[] = [
  // -------------------- IRL 0 — FOUNDATION --------------------
  {
    id: "m1-what-is-startup",
    title: "What is a startup?",
    shortTitle: "What is a startup",
    section: "irl-0",
    estMinutes: 8,
    addressesTags: [],
    prerequisites: [],
    blurb:
      "A startup is a temporary organization searching for a scalable, repeatable business model under uncertainty. Understand the definition, life stages (pre-seed → scale-up), and the difference from a traditional business.",
    source: "Module 1 — What is a startup?",
  },
  {
    id: "m2-trl-irl",
    title: "TRL & IRL — measuring readiness",
    shortTitle: "TRL & IRL",
    section: "irl-0",
    estMinutes: 7,
    addressesTags: [],
    prerequisites: [],
    blurb:
      "Two scales: Technology Readiness Level (1–9) and Investment Readiness Level (1–9). Knowing where you sit on both is how you communicate maturity to investors and grant programs.",
    source: "Module 2 — TRL/IRL",
  },
  {
    id: "m3-idea",
    title: "From idea to action",
    shortTitle: "Idea",
    section: "irl-0",
    estMinutes: 6,
    addressesTags: [],
    prerequisites: [],
    blurb:
      "Every business starts with an idea — but not every idea becomes a business. Learn how to talk about your idea, talk to people, and start moving without waiting to feel ready.",
    source: "Module 3 — Idea",
  },
  {
    id: "m4-validation",
    title: "Validation — before you build",
    shortTitle: "Validation",
    section: "irl-0",
    estMinutes: 8,
    addressesTags: [],
    prerequisites: [],
    blurb:
      "Three levels of validation: problem, solution, willingness to pay. Test cheaply with interviews, landing pages, concierge MVPs — before investing real money.",
    source: "Module 4 — Validation",
  },
  {
    id: "m5-company-system",
    title: "The company as a system",
    shortTitle: "Company system",
    section: "irl-0",
    estMinutes: 8,
    addressesTags: [],
    prerequisites: [],
    blurb:
      "A company is a system of resources, stakeholders, and accounting flows. Understand the basics: stakeholders, financial statements, why incorporated startups exist.",
    source: "Module 5 — The Company System",
  },
  {
    id: "m6-funding-options",
    title: "Funding options for startups",
    shortTitle: "Funding options",
    section: "irl-0",
    estMinutes: 9,
    addressesTags: [],
    prerequisites: [],
    blurb:
      "Bootstrapping, FFF, business angels, VC, equity crowdfunding, bank loans, public grants. Pick the right capital for your stage — and avoid the wrong one.",
    source: "Module 6 — Funding Options",
  },
  {
    id: "m7-patents-trademarks",
    title: "Patents & trademark protection",
    shortTitle: "IP protection",
    section: "irl-0",
    estMinutes: 7,
    addressesTags: [],
    prerequisites: [],
    blurb:
      "When a patent is worth filing, when a trade secret is smarter, and when a registered trademark is the highest-leverage protection a startup can buy.",
    source: "Module 7 — Patents and Trademark Protection",
  },
  {
    id: "m8-legal",
    title: "Legal foundations",
    shortTitle: "Legal",
    section: "irl-0",
    estMinutes: 8,
    addressesTags: [],
    prerequisites: [],
    blurb:
      "The legal basics every founder needs: incorporation, articles of association, cap table, shareholders' agreements, NDAs, contracts, GDPR. Don't be a lawyer — but know what to ask.",
    source: "Module 8 — Legal",
  },
  {
    id: "m9-corporate-forms",
    title: "Corporate forms — VAT, S.r.l., S.r.l.s.",
    shortTitle: "Corporate forms",
    section: "irl-0",
    estMinutes: 7,
    addressesTags: [],
    prerequisites: [],
    blurb:
      "Sole proprietorship vs S.r.l.s. vs S.r.l. vs cooperative vs innovative startup status. Pick the form that matches your stage, ambition, and tax exposure.",
    source: "Module 9 — Corporate Forms",
  },
  {
    id: "m10-being-entrepreneur",
    title: "Being an entrepreneur",
    shortTitle: "Mindset",
    section: "irl-0",
    estMinutes: 6,
    addressesTags: [],
    prerequisites: [],
    blurb:
      "Entrepreneurship is a way of thinking and acting under uncertainty. Income, time, security, decisions — what really changes when you stop being an employee.",
    source: "Module 10 — Being an entrepreneur",
  },
  {
    id: "m11-afc",
    title: "Administration, Finance & Control (AFC)",
    shortTitle: "AFC basics",
    section: "irl-0",
    estMinutes: 8,
    addressesTags: [],
    prerequisites: [],
    blurb:
      "AFC is your compass: cash flow, runway, expense classification, monthly review. Even a one-person startup needs this — start small, build the habit early.",
    source: "Module 11 — Administration, Finance and Control",
  },
  {
    id: "m12-ai-for-startups",
    title: "AI for startups",
    shortTitle: "AI toolkit",
    section: "irl-0",
    estMinutes: 8,
    addressesTags: [],
    prerequisites: [],
    blurb:
      "AI is a force multiplier for tiny teams: idea validation, market research, MVP scaffolding, marketing, automation. A practical toolkit, not hype.",
    source: "Module 12 — AI for Startups",
  },
  // -------------------- IRL 1 --------------------
  {
    id: "m13-defining-the-problem",
    title: "Defining the Problem",
    shortTitle: "Define the problem",
    section: "irl-1",
    estMinutes: 8,
    addressesTags: ["problem_unverified"],
    prerequisites: [],
    blurb:
      "A real, painful, specific problem is the only foundation a startup needs. Learn to interview, listen, and write a problem statement that survives contact with the market.",
    source: "Module 13 — Defining the Problem",
  },
  {
    id: "m14-bmc",
    title: "Business Model Canvas",
    shortTitle: "BMC",
    section: "irl-1",
    estMinutes: 12,
    addressesTags: ["bmc_incomplete", "hypotheses_unstructured"],
    prerequisites: [],
    blurb:
      "Map your business in nine blocks: customers, value, channels, revenue, costs. Build your first BMC for your startup as you go.",
    source: "Module 14 — Business Model Canvas",
  },
  {
    id: "m15-cv-and-team",
    title: "CV & Team",
    shortTitle: "Team",
    section: "irl-1",
    estMinutes: 6,
    addressesTags: ["team_undefined"],
    prerequisites: [],
    blurb:
      "Investors invest in people. Learn what makes a startup team credible — complementary skills, shared values, clear roles.",
    source: "Module 15 — CV & Team",
  },
  {
    id: "m16-experiments",
    title: "Running Experiments",
    shortTitle: "Experiments",
    section: "irl-1",
    estMinutes: 7,
    addressesTags: ["no_experiments", "hypotheses_unstructured"],
    prerequisites: [],
    blurb:
      "Stop debating, start testing. Define hypotheses, design lean experiments, and decide based on signal — not opinions.",
    source: "Module 16 — Experiments",
  },
  // -------------------- IRL 2 --------------------
  {
    id: "m17-competitive-analysis",
    title: "Competitive Analysis",
    shortTitle: "Competitors",
    section: "irl-2",
    estMinutes: 8,
    addressesTags: ["competitors_unmapped", "weak_differentiation"],
    prerequisites: [],
    blurb:
      "Every market has alternatives — even Excel is a competitor. Map who else is solving this problem and find your real edge.",
    source: "Module 17 — Competitive Analysis",
  },
  {
    id: "m18-positioning",
    title: "Market Positioning",
    shortTitle: "Positioning",
    section: "irl-2",
    estMinutes: 9,
    addressesTags: ["no_positioning", "weak_differentiation"],
    prerequisites: ["m17-competitive-analysis"],
    blurb:
      "Be relevant to a few, instead of invisible to many. Build a clear positioning statement using the For-Who-We-Offer-Unlike formula.",
    source: "Module 18 — Market Positioning",
  },
  {
    id: "m19-networking",
    title: "Networking for Startups",
    shortTitle: "Networking",
    section: "irl-2",
    estMinutes: 6,
    addressesTags: ["no_network"],
    prerequisites: [],
    blurb:
      "No startup grows alone. Build relationships that unlock customers, partners, and capital — even from a local context.",
    source: "Module 19 — Networking for Startups",
  },
  // -------------------- IRL 3 --------------------
  {
    id: "m20-mission-vision",
    title: "Mission & Vision",
    shortTitle: "Mission",
    section: "irl-3",
    estMinutes: 6,
    addressesTags: ["weak_value_proposition"],
    prerequisites: [],
    blurb:
      "Vision points to the future you want to build. Mission says how you'll get there. Both make decisions easier.",
    source: "Module 20 — Mission & Vision",
  },
  {
    id: "m21-market-analysis",
    title: "Market Analysis (TAM·SAM·SOM)",
    shortTitle: "Market sizing",
    section: "irl-3",
    estMinutes: 10,
    addressesTags: ["market_size_unknown", "no_target_audience"],
    prerequisites: [],
    blurb:
      "Stop saying 'just 1% of a huge market'. Estimate TAM, SAM, and a defensible SOM with a top-down + bottom-up approach.",
    source: "Module 21 — Market Analysis",
  },
  {
    id: "m22-startup-tools",
    title: "Startup Tools",
    shortTitle: "Tools",
    section: "irl-3",
    estMinutes: 5,
    addressesTags: ["no_validation_tools"],
    prerequisites: [],
    blurb:
      "Pick the right tools for CRM, automation, analytics, and ops. Start lean — Notion + a spreadsheet beats five subscriptions.",
    source: "Module 22 — Startup Tools",
  },
  {
    id: "m23-project-management",
    title: "Project Management (Agile)",
    shortTitle: "PM",
    section: "irl-3",
    estMinutes: 6,
    addressesTags: ["no_experiments"],
    prerequisites: [],
    blurb:
      "Run weekly sprints. Use a Kanban. Reflect, adjust, repeat. The framework that makes startup execution measurable.",
    source: "Module 23 — Project Management",
  },
  // -------------------- IRL 4 --------------------
  {
    id: "m24-mvp",
    title: "Building an MVP",
    shortTitle: "MVP",
    section: "irl-4",
    estMinutes: 11,
    addressesTags: ["no_mvp", "ignored_feedback"],
    prerequisites: [],
    blurb:
      "An MVP is a strategic experiment, not a small product. Test the riskiest hypothesis with the least product possible.",
    source: "Module 24 — MVP",
  },
  {
    id: "m25-customer-journey",
    title: "Customer Journey",
    shortTitle: "Journey",
    section: "irl-4",
    estMinutes: 8,
    addressesTags: ["no_customer_journey"],
    prerequisites: [],
    blurb:
      "Awareness → Consideration → Purchase → Retention → Advocacy. Map each touchpoint and design what users actually experience.",
    source: "Module 25 — Customer Journey",
  },
  {
    id: "m26-kpis",
    title: "KPIs & Metrics",
    shortTitle: "KPIs",
    section: "irl-4",
    estMinutes: 8,
    addressesTags: ["no_test_metrics"],
    prerequisites: [],
    blurb:
      "Track what truly matters. SMART KPIs over vanity metrics. Build a data-driven culture from day one.",
    source: "Module 26 — KPIs and Metrics",
  },
  {
    id: "m27-first-customer",
    title: "First Customer Acquisition",
    shortTitle: "First customers",
    section: "irl-4",
    estMinutes: 8,
    addressesTags: ["no_first_customers"],
    prerequisites: [],
    blurb:
      "First customers don't arrive — they're found. Cold outreach, in-person visits, and small offers that build a portfolio.",
    source: "Module 27 — First Customer Acquisition",
  },
  // -------------------- IRL 5 --------------------
  {
    id: "m28-ecosystem",
    title: "Understanding the Ecosystem",
    shortTitle: "Ecosystem",
    section: "irl-5",
    estMinutes: 7,
    addressesTags: ["no_ecosystem_view", "no_network"],
    prerequisites: [],
    blurb:
      "Map the people, partners, and institutions around your startup. Find allies, anticipate barriers, accelerate growth.",
    source: "Module 28 — Understanding the Ecosystem",
  },
  {
    id: "m29-sales",
    title: "Sales",
    shortTitle: "Sales",
    section: "irl-5",
    estMinutes: 9,
    addressesTags: ["no_sales_motion", "no_acquisition_plan"],
    prerequisites: [],
    blurb:
      "Selling is listening, proposing, building trust — not pushing. Build a repeatable motion with cold outreach and clear pricing.",
    source: "Module 29 — Sales",
  },
  {
    id: "m30-presence",
    title: "Building a Presence",
    shortTitle: "Presence",
    section: "irl-5",
    estMinutes: 7,
    addressesTags: ["weak_presence"],
    prerequisites: [],
    blurb:
      "Brand, logo, website, social, materials. Even at idea stage, a clear presence builds trust before you sell.",
    source: "Module 30 — Building a Presence",
  },
  {
    id: "m31-social-startups",
    title: "Social Startups & Benefit Corporations",
    shortTitle: "Impact",
    section: "irl-5",
    estMinutes: 8,
    addressesTags: ["weak_value_proposition"],
    prerequisites: [],
    blurb:
      "Social mission and economic sustainability aren't a contradiction. Learn the benefit-company model and impact metrics.",
    source: "Module 31 — Social Startups",
  },
  {
    id: "m32-marketing-branding",
    title: "Marketing & branding for startups",
    shortTitle: "Marketing & brand",
    section: "irl-5",
    estMinutes: 9,
    addressesTags: ["weak_presence", "no_acquisition_plan"],
    prerequisites: [],
    blurb:
      "Marketing is the bridge between what you do and who needs it. Build value proposition, brand, positioning, message, channels — coherent and sustainable.",
    source: "Module 32 — Marketing & branding for Startups",
  },
  {
    id: "m33-editorial-plan",
    title: "Editorial plan & social media",
    shortTitle: "Editorial plan",
    section: "irl-5",
    estMinutes: 8,
    addressesTags: ["weak_presence"],
    prerequisites: ["m32-marketing-branding"],
    blurb:
      "Move from sporadic posting to a structured digital editorial plan: who you're addressing, what you publish, on which channels, with what cadence and metrics.",
    source: "Module 33 — Editorial Plan and Social Media",
  },
  {
    id: "m34-abm",
    title: "Account-Based Marketing (ABM)",
    shortTitle: "ABM",
    section: "irl-5",
    estMinutes: 8,
    addressesTags: ["no_sales_motion", "no_acquisition_plan"],
    prerequisites: [],
    blurb:
      "Sell less, but better. Pick a small list of strategic accounts, personalize ruthlessly, and build relationships that B2B mass marketing can never replicate.",
    source: "Module 34 — Account-Based Marketing",
  },
  // -------------------- IRL 6 — REVENUE MODEL VALIDATION --------------------
  {
    id: "m35-financial-model",
    title: "Financial model — your compass",
    shortTitle: "Financial model",
    section: "irl-6",
    estMinutes: 10,
    addressesTags: ["no_revenue", "revenue_streams_unclear"],
    prerequisites: [],
    blurb:
      "Numbers translate vision into runway, decisions, and credibility. Build a forecast income statement and a simple cash-flow projection — the only models you actually need at this stage.",
    source: "Module 35 — Financial Model",
  },
  {
    id: "m36-scalability",
    title: "Scalability — the difference between existing and growing",
    shortTitle: "Scalability",
    section: "irl-6",
    estMinutes: 9,
    addressesTags: ["not_scalable", "revenue_streams_unclear"],
    prerequisites: [],
    blurb:
      "Scalability is the ability to grow without scaling costs at the same rate. Revenue · operations · technology · organization — design for growth, but only when ready.",
    source: "Module 36 — Scalability",
  },
  {
    id: "m37-management-control",
    title: "Management control — measure to decide",
    shortTitle: "Management control",
    section: "irl-6",
    estMinutes: 8,
    addressesTags: ["no_test_metrics", "no_pricing_validation"],
    prerequisites: [],
    blurb:
      "Budget, variance analysis, cost monitoring, KPI dashboards. A lightweight management-control system catches problems early — and demonstrates rigor to investors.",
    source: "Module 37 — Management Control",
  },
  {
    id: "m38-crm",
    title: "Customer Relationship Management",
    shortTitle: "CRM",
    section: "irl-6",
    estMinutes: 7,
    addressesTags: ["no_retention_data", "no_revenue_interviews"],
    prerequisites: [],
    blurb:
      "Real value lives in relationships, not single sales. Centralize contacts, structure your funnel, plan personalized communication — even with 5 customers.",
    source: "Module 38 — Customer Relationship Management",
  },
  {
    id: "m39-business-plan",
    title: "Business plan",
    shortTitle: "Business plan",
    section: "irl-6",
    estMinutes: 11,
    addressesTags: ["revenue_streams_unclear", "no_pricing_validation"],
    prerequisites: ["m35-financial-model"],
    blurb:
      "When grants, banks, or investors require it: a business plan that's actually useful. Executive summary · market · model · operations · financials. Adapt to the audience.",
    source: "Module 39 — Business Plan",
  },
  {
    id: "m40-recruiting",
    title: "Recruiting & people management",
    shortTitle: "Recruiting",
    section: "irl-6",
    estMinutes: 8,
    addressesTags: ["team_undefined"],
    prerequisites: [],
    blurb:
      "When and how to hire — not before. Roles, motivation, ownership, culture, and the lightweight tools to manage a small team without bureaucracy.",
    source: "Module 40 — Recruiting and People Management",
  },
  // -------------------- IRL 7 — HIGH-FIDELITY MVP & FUNDRAISING --------------------
  {
    id: "m41-industrial-plan",
    title: "Industrial plan",
    shortTitle: "Industrial plan",
    section: "irl-7",
    estMinutes: 10,
    addressesTags: ["no_advanced_prototype", "revenue_streams_unclear"],
    prerequisites: ["m39-business-plan"],
    blurb:
      "The strategic translation of vision into execution: model, market, operations, financials, growth. Required for grants, investors, and large-scale partners.",
    source: "Module 41 — Development of an Industrial Plan",
  },
  {
    id: "m42-fundraising",
    title: "Fundraising strategies",
    shortTitle: "Fundraising",
    section: "irl-7",
    estMinutes: 11,
    addressesTags: ["no_partnerships", "no_revenue"],
    prerequisites: [],
    blurb:
      "Capital follows clarity, not desperation. Map fundraising tools (equity, debt, grants, crowdfunding) to your stage and run a structured 8-step process.",
    source: "Module 42 — Fundraising Strategies",
  },
  {
    id: "m43-crowdfunding",
    title: "Crowdfunding",
    shortTitle: "Crowdfunding",
    section: "irl-7",
    estMinutes: 9,
    addressesTags: ["no_partnerships", "no_revenue"],
    prerequisites: [],
    blurb:
      "Reward · equity · donation · lending. Crowdfunding raises capital AND validates the market — when the campaign is structured, communicated, and timed right.",
    source: "Module 43 — Crowdfunding",
  },
  {
    id: "m44-wfe-stock-options",
    title: "Work for Equity & stock options",
    shortTitle: "WFE & options",
    section: "irl-7",
    estMinutes: 8,
    addressesTags: ["team_undefined", "no_partnerships"],
    prerequisites: [],
    blurb:
      "When cash is short and skills are critical, equity-based compensation can attract the right people. Understand vesting, strike prices, dilution — and the legal ground rules.",
    source: "Module 44 — Work for Equity & Stock Option",
  },
  {
    id: "m45-esg",
    title: "ESG — sustainability as strategy",
    shortTitle: "ESG",
    section: "irl-7",
    estMinutes: 8,
    addressesTags: ["weak_value_proposition", "no_partnerships"],
    prerequisites: [],
    blurb:
      "Environmental, Social, Governance: not a bureaucratic checklist but a competitive lever. Even early-stage startups can embed ESG without slowing down.",
    source: "Module 45 — ESG",
  },
  // -------------------- IRL 8 — OPERATIONS & STORYTELLING --------------------
  {
    id: "m46-pitch",
    title: "The pitch",
    shortTitle: "Pitch",
    section: "irl-8",
    estMinutes: 10,
    addressesTags: ["weak_presence", "no_partnerships"],
    prerequisites: [],
    blurb:
      "Elevator pitch · pitch deck · investor deck. Hook → problem → solution → market → model → team → traction → ask. Clarity, conciseness, conviction.",
    source: "Module 46 — Pitch",
  },
  {
    id: "m47-company-formation",
    title: "Company formation — when & how",
    shortTitle: "Incorporate",
    section: "irl-8",
    estMinutes: 9,
    addressesTags: ["not_operational"],
    prerequisites: ["m9-corporate-forms"],
    blurb:
      "From validated idea to a real legal entity: pick the form, draft the statute, sign with the notary, open VAT, register at the Chamber of Commerce, decide on innovative-startup status.",
    source: "Module 47 — Company Formation",
  },
  {
    id: "m48-accounting",
    title: "Accounting — control your numbers",
    shortTitle: "Accounting",
    section: "irl-8",
    estMinutes: 8,
    addressesTags: ["no_dashboards", "kpi_no_cadence"],
    prerequisites: ["m11-afc"],
    blurb:
      "Flat-rate vs ordinary regimes, invoicing, deadlines, the accountant relationship. Even at idea stage, organized accounting is freedom.",
    source: "Module 48 — Accounting",
  },
  {
    id: "m49-public-calls",
    title: "Public calls & incentives",
    shortTitle: "Grants & calls",
    section: "irl-8",
    estMinutes: 9,
    addressesTags: ["no_partnerships", "no_revenue"],
    prerequisites: [],
    blurb:
      "Local, national (Smart&Start, Invitalia), European (EIC, Horizon). How to find the right call, prepare the dossier, and write a competitive application.",
    source: "Module 49 — Public Calls and Incentives",
  },
  // -------------------- IRL 9 — METRICS & OPEN INNOVATION --------------------
  {
    id: "m50-open-innovation",
    title: "Open innovation",
    shortTitle: "Open innovation",
    section: "irl-9",
    estMinutes: 9,
    addressesTags: ["no_partnerships", "no_ecosystem_view"],
    prerequisites: ["m28-ecosystem"],
    blurb:
      "Innovate WITH external partners — corporates, hubs, accelerators, hackathons. Access resources, credibility, and channels that an early-stage team can't build alone.",
    source: "Module 50 — Open Innovation",
  },
];

export const MODULE_BY_ID: Record<string, ModuleSummary> = Object.fromEntries(
  MODULES.map(m => [m.id, m])
);

export function modulesForSection(section: string): ModuleSummary[] {
  return MODULES.filter(m => m.section === section);
}

export function getModule(id: string): ModuleSummary | null {
  return MODULE_BY_ID[id] ?? null;
}

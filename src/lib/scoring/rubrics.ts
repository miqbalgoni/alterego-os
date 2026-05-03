// Per-section scoring rubrics. Each rubric defines:
//  - which questions feed into the score
//  - the controlled vocabulary of "gap tags" the evaluator may assign
//  - per-section pass threshold
//
// Rubrics are loaded into the Claude prompt verbatim — keep them concise and
// concrete. Versioned so we can detect when an old assessment was scored under
// a stale rubric.

export const RUBRIC_VERSION = "2026-04-v1";

// Default threshold: scores at/above this are "ready", below triggers module recs.
export const DEFAULT_THRESHOLD = 65;

// Controlled-vocabulary tags. Modules in the catalog declare which tags they
// address; recommend.ts intersects assessment.gapTags with module.addressesTags.
//
// Keep this list curated: adding tags has high cost (every module + rubric
// must keep up).
export const GAP_TAGS = [
  // IRL 1 — idea & BMC
  "bmc_incomplete",
  "hypotheses_unstructured",
  "problem_unverified",
  "team_undefined",
  "no_experiments",
  // IRL 2 — market & competition
  "competitors_unmapped",
  "weak_differentiation",
  "market_size_unknown",
  "no_positioning",
  "no_network",
  // IRL 3 — problem validation & VP
  "no_target_audience",
  "few_interviews",
  "no_validation_tools",
  "no_documented_feedback",
  "weak_value_proposition",
  // IRL 4 — MVP testing
  "no_mvp",
  "no_test_metrics",
  "no_customer_journey",
  "ignored_feedback",
  "no_first_customers",
  // IRL 5 — product/market fit
  "no_acquisition_plan",
  "no_early_adopters",
  "channels_unvalidated",
  "no_retention_data",
  "no_ecosystem_view",
  "no_sales_motion",
  "weak_presence",
  // IRL 6 — revenue model validation
  "no_revenue",
  "no_pricing_validation",
  "no_revenue_interviews",
  "revenue_streams_unclear",
  // IRL 7 — high-fidelity MVP & prototype
  "no_advanced_prototype",
  "no_real_env_test",
  "no_partnerships",
  "tests_not_iterated",
  // IRL 8 — operations & scalability
  "not_operational",
  "partnerships_few",
  "not_scalable",
  "no_geo_expansion",
  // IRL 9 — fundamental metrics
  "kpi_few",
  "kpi_no_cadence",
  "no_reports",
  "no_dashboards",
  "metrics_stagnant",
] as const;

export type GapTag = (typeof GAP_TAGS)[number];

export interface SectionRubric {
  section: string;
  title: string;
  threshold: number;
  // Which questionIds feed into the score (used to filter the answer payload)
  questionIds: string[];
  // Plain-English criteria block injected into the Claude system prompt
  criteria: string;
  // Controlled tags this section may emit
  allowedGapTags: GapTag[];
}

const IRL1: SectionRubric = {
  section: "irl-1",
  title: "Idea & Business Model Canvas",
  threshold: DEFAULT_THRESHOLD,
  questionIds: ["q6", "q7", "q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15", "q16", "q17", "q18", "q19"],
  criteria: `
A founder at IRL 1 should have:
- Filled at least one BMC; ideally iterated through multiple versions (q6, q7, q18).
- Formalized hypotheses across most BMC blocks, not just Value Proposition (q8, q9).
- Hypotheses grounded in interviews or market data, not pure intuition (q10).
- A problem identified through experience, observation, or data — not still vague (q11, q12).
- Concrete plans to demonstrate the need (interviews, mockups, surveys) (q13).
- Tested at least one hypothesis or has a credible test plan (q14).
- Discussed hypotheses with experts or stakeholders, with documentation (q15, q16, q17).
- Reasonable confidence in main hypotheses without being overconfident (q19).

Penalties:
- "None" / "I haven't" answers across multiple validation questions => weak overall.
- BMC unfilled OR no hypotheses formalized => major gap.
- Pure-intuition hypotheses with no validation => major gap.
- Confidence "Very" with no validation evidence => flag as overconfidence.
`.trim(),
  allowedGapTags: [
    "bmc_incomplete",
    "hypotheses_unstructured",
    "problem_unverified",
    "team_undefined",
    "no_experiments",
  ],
};

const IRL2: SectionRubric = {
  section: "irl-2",
  title: "Market & Competition",
  threshold: DEFAULT_THRESHOLD,
  questionIds: ["q20", "q21", "q22", "q23", "q24", "q25", "q26"],
  criteria: `
A founder at IRL 2 should have:
- Identified at least one specific market segment, ideally more (q20, q21).
- Mapped 3+ competitors (direct and indirect) (q22).
- A reasoned market-size estimate based on public data, not gut feel (q23, q24).
- A clear differentiation story vs competitors (q25).
- Done structured competitive analysis, not just casual observation (q26).

Penalties:
- "Not differentiated" or "I haven't yet identified a market" => major gap.
- Estimated market only by approximation => moderate gap.
- 0–1 competitors mapped => major gap (every market has alternatives).
`.trim(),
  allowedGapTags: [
    "competitors_unmapped",
    "weak_differentiation",
    "market_size_unknown",
    "no_positioning",
    "no_network",
  ],
};

const IRL3: SectionRubric = {
  section: "irl-3",
  title: "Problem Validation & Value Proposition",
  threshold: DEFAULT_THRESHOLD,
  questionIds: ["q27", "q28", "q29", "q30", "q31"],
  criteria: `
A founder at IRL 3 should have:
- A defined target audience (q27).
- Conducted at least 10 interviews with potential customers; 60+ is strong (q28).
- Received at least partial confirmation that the problem is real (q29).
- Used multiple validation tools — interviews, surveys, focus groups (q30).
- Documented several complete user stories or feedback cases (q31).

Penalties:
- 0 interviews => major gap (problem unvalidated).
- "No confirmation" outcome => the value prop needs rework, not just more validation.
- Only "a few examples" documented => insufficient evidence base.
`.trim(),
  allowedGapTags: [
    "no_target_audience",
    "few_interviews",
    "no_validation_tools",
    "no_documented_feedback",
    "weak_value_proposition",
  ],
};

const IRL4: SectionRubric = {
  section: "irl-4",
  title: "Low-Fidelity MVP Testing",
  threshold: DEFAULT_THRESHOLD,
  questionIds: ["q32", "q33", "q34", "q35", "q36"],
  criteria: `
A founder at IRL 4 should have:
- A basic prototype built, even if rough (q32).
- Run 5+ tests on it, not 0–4 (q33).
- Collected both qualitative AND quantitative feedback (q34).
- Made relevant changes to the product based on feedback (q35).
- Defined success metrics in advance for tests, not after the fact (q36).

Penalties:
- No prototype => major gap (cannot validate without something to show).
- 0 tests => major gap.
- "No structured feedback" => major gap.
- "Never" defined success metrics => moderate gap (testing without rigor).
`.trim(),
  allowedGapTags: [
    "no_mvp",
    "no_test_metrics",
    "no_customer_journey",
    "ignored_feedback",
    "no_first_customers",
  ],
};

const IRL5: SectionRubric = {
  section: "irl-5",
  title: "Product / Market Fit",
  threshold: DEFAULT_THRESHOLD,
  questionIds: ["q37", "q38", "q39", "q40", "q41"],
  criteria: `
A founder at IRL 5 should have:
- A documented acquisition + retention plan (q37).
- 10+ early-adopter customers, not 0–9 (q38).
- Validated 2+ sales channels (q39).
- Objective retention/frequency data, not just gut feel (q40).
- At least some customer reviews or case studies (q41).

Penalties:
- 0 early adopters => major gap (no evidence of fit).
- No retention data => moderate gap (cannot prove repeatability).
- No reviews/case studies => social proof missing.
`.trim(),
  allowedGapTags: [
    "no_acquisition_plan",
    "no_early_adopters",
    "channels_unvalidated",
    "no_retention_data",
    "no_ecosystem_view",
    "no_sales_motion",
    "weak_presence",
  ],
};

const IRL6: SectionRubric = {
  section: "irl-6",
  title: "Revenue Model Validation",
  threshold: DEFAULT_THRESHOLD,
  questionIds: ["q42", "q43", "q44", "q45", "q46"],
  criteria: `
A founder at IRL 6 should have:
- Generated some revenue, even small (q42, q43).
- Conducted 20+ revenue-stream interviews to validate the monetisation model (q44).
- Clearly identified all possible revenue sources for the business (q45).
- Achieved at least partial customer acceptance of the price (q46).

Penalties:
- 0 revenue AND 0 revenue interviews => major gap (model unproven).
- "No" on revenue sources identified => moderate gap.
- "No" on price acceptance => major gap (pricing wrong or customer wrong).
`.trim(),
  allowedGapTags: [
    "no_revenue",
    "no_pricing_validation",
    "no_revenue_interviews",
    "revenue_streams_unclear",
  ],
};

const IRL7: SectionRubric = {
  section: "irl-7",
  title: "High-Fidelity MVP & Prototype",
  threshold: DEFAULT_THRESHOLD,
  questionIds: ["q47", "q48", "q49", "q50"],
  criteria: `
A founder at IRL 7 should have:
- Built an advanced prototype that approximates the real product (q47).
- Tested it in a real environment with at least partial positive results (q48).
- Initiated 1+ strategic partnerships (q49).
- Run repeated tests (4+ ideal) to iterate on findings (q50).

Penalties:
- "No" on advanced prototype => major gap.
- "No" on real-environment testing => major gap (lab results aren't enough).
- 0 partnerships => moderate gap (high-fidelity stage benefits from allies).
- 0–3 repeated tests => moderate gap (one-shot testing isn't validation).
`.trim(),
  allowedGapTags: [
    "no_advanced_prototype",
    "no_real_env_test",
    "no_partnerships",
    "tests_not_iterated",
  ],
};

const IRL8: SectionRubric = {
  section: "irl-8",
  title: "Operations, Scalability & Delivery",
  threshold: DEFAULT_THRESHOLD,
  questionIds: ["q51", "q52", "q53", "q54"],
  criteria: `
A founder at IRL 8 should have:
- A continuously operating business (>8 months ideal) (q51).
- 2+ consolidated partnerships (q52).
- Production that's scalable with current resources, at least partially (q53).
- Operations in 2+ countries OR a credible plan to expand (q54).

Penalties:
- "Not operational" => major gap (cannot evaluate scalability without operations).
- 0 partnerships at this stage => major gap.
- "Not yet" scalable => major gap (whole point of IRL 8).
- 1 country only AND no expansion plan => moderate gap.
`.trim(),
  allowedGapTags: [
    "not_operational",
    "partnerships_few",
    "not_scalable",
    "no_geo_expansion",
  ],
};

const IRL9: SectionRubric = {
  section: "irl-9",
  title: "Fundamental Metrics",
  threshold: DEFAULT_THRESHOLD,
  questionIds: ["q55", "q56", "q57", "q58", "q59"],
  criteria: `
A founder at IRL 9 should have:
- 3+ key KPIs monitored regularly (q55).
- Monthly-or-better cadence of metric review (q56).
- 4+ reports produced in the last 12 months (q57).
- Demonstrable improvement in metrics over time (q58).
- Automated dashboards/software (not just Excel) for monitoring (q59).

Penalties:
- "None" on KPIs tracked => major gap (cannot manage what you don't measure).
- "Not monitored" cadence => major gap (KPIs without cadence are noise).
- "No" on improvement over time => moderate gap (metrics should move).
- "None" on automation => moderate gap (manual tracking doesn't scale).
`.trim(),
  allowedGapTags: [
    "kpi_few",
    "kpi_no_cadence",
    "no_reports",
    "no_dashboards",
    "metrics_stagnant",
  ],
};

export const RUBRICS: Record<string, SectionRubric> = {
  "irl-1": IRL1,
  "irl-2": IRL2,
  "irl-3": IRL3,
  "irl-4": IRL4,
  "irl-5": IRL5,
  "irl-6": IRL6,
  "irl-7": IRL7,
  "irl-8": IRL8,
  "irl-9": IRL9,
};

export function getRubric(section: string): SectionRubric | null {
  return RUBRICS[section] ?? null;
}

// IRL questionnaire definition. Single source of truth used by both forms and API.
// Section ids: "personal", "irl-1" ... "irl-9", "review"

export type QuestionType =
  | "text"
  | "email"
  | "tel"
  | "longtext"
  | "number"
  | "single"      // radio, one of options
  | "multi";      // checkboxes, many of options

export interface Question {
  id: string;                  // stable id ("q1"..."q59", or "p_email" etc.)
  section: string;             // "personal" | "irl-1" ... "irl-9"
  number?: number;             // display number from PDF (1..59)
  label: string;
  help?: string;
  type: QuestionType;
  required?: boolean;
  options?: string[];
  maxSelect?: number;          // for multi
  minSelect?: number;
}

export interface IRLSection {
  id: string;
  title: string;
  subtitle?: string;
  order: number;
  questionIds: string[];
}

// --- PERSONAL INFO ------------------------------------------------------------

export const PERSONAL_QUESTIONS: Question[] = [
  { id: "p_email",       section: "personal", label: "Email",        type: "email",    required: true },
  { id: "p_fullName",    section: "personal", label: "Full Name",    type: "text",     required: true },
  { id: "p_phone",       section: "personal", label: "Phone",        type: "tel",      required: true },
  { id: "p_address",     section: "personal", label: "Address",      type: "text",     required: true },
  { id: "p_startupName", section: "personal", label: "Startup Name", type: "text",     required: true },
  {
    id: "p_industries", section: "personal", number: 4,
    label: "Industry / Field of Activity",
    help: "Select 1 to 3 fields that apply.",
    type: "multi", required: true, minSelect: 1, maxSelect: 3,
    options: [
      "Agriculture, Aquaculture & Agritech","Forestry & Paper","Fishing & Hunting",
      "Food & Beverages","Mining & Metallurgy","Materials & Chemistry",
      "Machinery & Electronics","Construction","Manufacturing","Engineering",
      "Defence","Infrastructure & Logistics","Transport","Aerospace","Automotive",
      "Maritime","Road & Rail","Healthcare","Biotechnology","Diagnostics",
      "Medical Devices","Digital Health","Pharmaceutical","Wellness","Femtech",
      "Scientific Tools & Services","Veterinary","Cleantech","Fintech","Proptech",
      "Edtech","Deep Tech","Legaltech","Media","Entertainment","Gaming",
      "Creative Industries","Travel & Hospitality","Marketing","Data & Analytics",
      "Software & Services","Hardware & Electronic Equipment",
      "Telecommunications & Services","Retail","E-commerce",
      "Textiles, Apparel & Luxury Goods","Consumer Electronics & Appliances",
      "Home & Personal Care Products","Consumer Services",
      "Human Resources & Employment","Research & Consulting","Office Services",
      "Public Services (excl. education)",
    ],
  },
  {
    id: "p_stage", section: "personal", number: 5,
    label: "Startup development stage", type: "single", required: true,
    options: [
      "Initial idea",
      "Pre-seed: Prototype ready / First version of product",
      "Product market-ready",
      "Growth and expansion",
    ],
  },
];

// --- IRL 1 — IDEA AND BUSINESS MODEL CANVAS ----------------------------------

const IRL1: Question[] = [
  { id: "q6",  section: "irl-1", number: 6,  type: "single", required: true,
    label: "Have you completed at least one version of the Business Model Canvas (BMC)?",
    options: ["YES", "NO"] },
  { id: "q7",  section: "irl-1", number: 7,  type: "single", required: true,
    label: "How many different versions have you filled out?",
    options: ["0", "1", "2 or more"] },
  { id: "q8",  section: "irl-1", number: 8,  type: "multi",  required: true,
    label: "For which BMC blocks have you formalized at least one hypothesis?",
    help: "Select all that apply.",
    options: ["None","Value Proposition","Customer Segments","Channels","Customer Relationships","Revenue Streams","Key Resources","Key Activities","Key Partners","Cost Structure"] },
  { id: "q9",  section: "irl-1", number: 9,  type: "single", required: true,
    label: "Have you thought about hypotheses for each of these areas?",
    options: ["No","Only for some","Yes, for all"] },
  { id: "q10", section: "irl-1", number: 10, type: "multi", required: true, minSelect: 1,
    label: "The hypotheses are based on:",
    help: "Select all that apply.",
    options: ["Personal intuitions or other","Interviews with people","Market data","I have not formulated hypotheses"] },
  { id: "q11", section: "irl-1", number: 11, type: "multi", required: true, minSelect: 1,
    label: "How did you identify the problem you want to solve?",
    help: "Select all that apply.",
    options: ["Personal experience","Direct observation","Data / market reports","I have not identified it yet"] },
  { id: "q12", section: "irl-1", number: 12, type: "single", required: true,
    label: "Have you quantified the problem?",
    options: ["No","Only rough estimates","Yes, detailed data"] },
  { id: "q13", section: "irl-1", number: 13, type: "multi",  required: true,
    label: "Have you thought about how to demonstrate that your idea addresses a real need?",
    help: "Select all applicable methods.",
    options: ["Interviews","Online surveys","Mockups / landing pages","Desk research","Other","I haven't thought about it yet"] },
  { id: "q14", section: "irl-1", number: 14, type: "single", required: true,
    label: "Have you already tested the hypotheses underlying your idea?",
    options: ["No","Planned","Yes, at least one"] },
  { id: "q15", section: "irl-1", number: 15, type: "single", required: true,
    label: "Have you discussed the hypotheses with experts or stakeholders?",
    options: ["No","Yes"] },
  { id: "q16", section: "irl-1", number: 16, type: "single", required: true,
    label: "Are the hypotheses formally documented?",
    options: ["Informal meetings / nothing","Yes"] },
  { id: "q17", section: "irl-1", number: 17, type: "single", required: true,
    label: "Have you received structured feedback on these hypotheses?",
    options: ["No","Only impressions","Yes, documented"] },
  { id: "q18", section: "irl-1", number: 18, type: "single", required: true,
    label: "Have you made changes to any block in the business model after receiving feedback?",
    options: ["0","1–2","3 or more"] },
  { id: "q19", section: "irl-1", number: 19, type: "single", required: true,
    label: "How confident are you in your main hypotheses?",
    options: ["Not very","Quite","Very"] },
];

// --- IRL 2 — MARKET AND COMPETITION ------------------------------------------

const IRL2: Question[] = [
  { id: "q20", section: "irl-2", number: 20, type: "single", required: true,
    label: "Have you identified market segments?",
    help: "Market segments are specific groups of customers with similar characteristics.",
    options: ["None","1","2 or more"] },
  { id: "q21", section: "irl-2", number: 21, type: "longtext", required: false,
    label: "Which market segments have you identified?" },
  { id: "q22", section: "irl-2", number: 22, type: "single", required: true,
    label: "How many competitors have you mapped?",
    help: "A company/product/service competing in the same market or sector.",
    options: ["None","1–2","3 or more"] },
  { id: "q23", section: "irl-2", number: 23, type: "single", required: true,
    label: "How large is the market you are aiming to serve?",
    help: "Overall economic value of the target market.",
    options: ["Less than €1 million","From €1 million to €10 million","More than €10 million","I have not yet identified a market"] },
  { id: "q24", section: "irl-2", number: 24, type: "single", required: true,
    label: "How did you estimate the market size?",
    options: ["Not estimated","Approximation / experience","Public data / sector reports"] },
  { id: "q25", section: "irl-2", number: 25, type: "single", required: true,
    label: "Is your offering different from that of your competitors?",
    options: ["Not differentiated","Partially differentiated","Highly differentiated"] },
  { id: "q26", section: "irl-2", number: 26, type: "single", required: true,
    label: "Have you analysed the competition in a structured way?",
    options: ["No","Yes"] },
];

// --- IRL 3 — PROBLEM VALIDATION AND VALUE PROPOSITION ------------------------

const IRL3: Question[] = [
  { id: "q27", section: "irl-3", number: 27, type: "single", required: true,
    label: "Have you defined your target audience?",
    help: "Specific group of people toward whom a company directs its products and marketing.",
    options: ["No","Yes"] },
  { id: "q28", section: "irl-3", number: 28, type: "single", required: true,
    label: "How many interviews have you conducted with potential customers?",
    options: ["0","fewer than 10","between 10 and 59","60 or more"] },
  { id: "q29", section: "irl-3", number: 29, type: "single", required: true,
    label: "What was the main outcome of the interviews?",
    options: ["No confirmation","Partial confirmation","Strong confirmation"] },
  { id: "q30", section: "irl-3", number: 30, type: "multi",  required: true,
    label: "Which tools have you used to validate your idea?",
    help: "Select all that apply.",
    options: ["Interviews","Surveys","Focus groups","Other"] },
  { id: "q31", section: "irl-3", number: 31, type: "single", required: true,
    label: "Have you documented customer feedback or user stories?",
    options: ["No","Only a few examples","Several complete cases"] },
];

// --- IRL 4 — IDEA DEVELOPMENT AND TESTING (LOW-FIDELITY MVP) -----------------

const IRL4: Question[] = [
  { id: "q32", section: "irl-4", number: 32, type: "single", required: true,
    label: "Have you created a basic prototype of the product or service?",
    options: ["No","Yes"] },
  { id: "q33", section: "irl-4", number: 33, type: "single", required: true,
    label: "How many tests have you run on the prototype?",
    options: ["0","between 1 and 4","5 or more"] },
  { id: "q34", section: "irl-4", number: 34, type: "multi", required: true, minSelect: 1,
    label: "What type of feedback have you collected?",
    help: "Qualitative: opinions & narratives. Quantitative: numbers & statistics. Select all that apply.",
    options: ["No structured feedback","Qualitative only","Also quantitative"] },
  { id: "q35", section: "irl-4", number: 35, type: "single", required: true,
    label: "Did the feedback lead to changes in the product?",
    options: ["No","Partially","Yes, relevant changes"] },
  { id: "q36", section: "irl-4", number: 36, type: "single", required: true,
    label: "Did you define success metrics in advance for measuring the test?",
    help: "e.g. Conversion, Retention, ROI, CLV, NPS.",
    options: ["Never","Only for some","For all tests"] },
];

// --- IRL 5 — PRODUCT / MARKET FIT --------------------------------------------

const IRL5: Question[] = [
  { id: "q37", section: "irl-5", number: 37, type: "single", required: true,
    label: "Have you documented how to acquire and retain customers?",
    options: ["No","Yes"] },
  { id: "q38", section: "irl-5", number: 38, type: "single", required: true,
    label: "How many 'early adopter' customers have you acquired?",
    options: ["0","between 1 and 9","10 or more"] },
  { id: "q39", section: "irl-5", number: 39, type: "single", required: true,
    label: "Have you validated your sales channels?",
    options: ["None","1","2 or more"] },
  { id: "q40", section: "irl-5", number: 40, type: "single", required: true,
    label: "Do you have information on customer retention or purchase frequency?",
    options: ["No","Partial","Yes, objective data"] },
  { id: "q41", section: "irl-5", number: 41, type: "single", required: true,
    label: "Do you have customer reviews or case studies?",
    options: ["No","Yes"] },
];

// --- IRL 6 — REVENUE MODEL VALIDATION ----------------------------------------

const IRL6: Question[] = [
  { id: "q42", section: "irl-6", number: 42, type: "single", required: true,
    label: "Has the startup already generated revenue?",
    options: ["No","Yes"] },
  { id: "q43", section: "irl-6", number: 43, type: "number", required: false,
    label: "Total revenue generated (€) to date:" },
  { id: "q44", section: "irl-6", number: 44, type: "single", required: true,
    label: "How many revenue stream interviews have you conducted?",
    help: "Structured conversations with potential customers to validate the monetisation model.",
    options: ["0","between 1 and 19","20 or more"] },
  { id: "q45", section: "irl-6", number: 45, type: "single", required: true,
    label: "Have you clearly identified all possible revenue sources for your business?",
    options: ["No","Yes"] },
  { id: "q46", section: "irl-6", number: 46, type: "single", required: true,
    label: "Has the price you charge been accepted by customers?",
    options: ["No","Partially","Yes"] },
];

// --- IRL 7 — HIGH-FIDELITY MVP AND PROTOTYPE ---------------------------------

const IRL7: Question[] = [
  { id: "q47", section: "irl-7", number: 47, type: "single", required: true,
    label: "Have you created an advanced prototype?", options: ["No","Yes"] },
  { id: "q48", section: "irl-7", number: 48, type: "single", required: true,
    label: "Have you tested the prototype in a real environment?",
    options: ["No","Yes, partial results","Yes, positive results"] },
  { id: "q49", section: "irl-7", number: 49, type: "single", required: true,
    label: "Have you initiated strategic partnerships?",
    options: ["None","1","2 or more"] },
  { id: "q50", section: "irl-7", number: 50, type: "single", required: true,
    label: "How many repeated tests have you conducted?",
    options: ["0","between 1 and 3","4 or more"] },
];

// --- IRL 8 — OPERATIONS, SCALABILITY AND DELIVERY ----------------------------

const IRL8: Question[] = [
  { id: "q51", section: "irl-8", number: 51, type: "single", required: true,
    label: "How long has your business been operating continuously?",
    options: ["Not operational","1–8 months",">8 months"] },
  { id: "q52", section: "irl-8", number: 52, type: "single", required: true,
    label: "How many partnerships have you consolidated?",
    options: ["0","1","2 or more"] },
  { id: "q53", section: "irl-8", number: 53, type: "single", required: true,
    label: "Is your production scalable?",
    help: "Ability to grow output efficiently while maintaining quality and margins.",
    options: ["Not yet","Only partially","Yes, with current resources"] },
  { id: "q54", section: "irl-8", number: 54, type: "single", required: true,
    label: "In how many countries are you operational?",
    options: ["1","2–3",">3"] },
];

// --- IRL 9 — FUNDAMENTAL METRICS ---------------------------------------------

const IRL9: Question[] = [
  { id: "q55", section: "irl-9", number: 55, type: "single", required: true,
    label: "How many key metrics (KPIs) do you monitor regularly?",
    options: ["None","1–2","3 or more"] },
  { id: "q56", section: "irl-9", number: 56, type: "single", required: true,
    label: "How frequently do you monitor your metrics?",
    options: ["Not monitored","Occasionally","Monthly or more often"] },
  { id: "q57", section: "irl-9", number: 57, type: "single", required: true,
    label: "How many reports have you produced in the last 12 months?",
    options: ["None","1–3","4 or more"] },
  { id: "q58", section: "irl-9", number: 58, type: "single", required: true,
    label: "Have your metrics improved over time?",
    options: ["No, they have remained the same","Yes, they have improved"] },
  { id: "q59", section: "irl-9", number: 59, type: "single", required: true,
    label: "Do you have automated systems to monitor your metrics?",
    options: ["None","Excel / manual only","Yes, dashboard / software"] },
];

export const IRL_QUESTIONS: Question[] = [
  ...IRL1, ...IRL2, ...IRL3, ...IRL4, ...IRL5, ...IRL6, ...IRL7, ...IRL8, ...IRL9,
];

export const ALL_QUESTIONS: Question[] = [...PERSONAL_QUESTIONS, ...IRL_QUESTIONS];

export const SECTIONS: IRLSection[] = [
  { id: "personal", title: "Personal Information",                       order: 0,
    questionIds: PERSONAL_QUESTIONS.map(q => q.id) },
  // IRL 0 has no scored questions in the source PDF — it's a library of
  // foundational learning modules. Listed here so prev/next navigation
  // reaches /onboarding/irl/0 between personal and irl-1.
  { id: "irl-0", title: "IRL 0 — Foundation",                            order: 1,
    subtitle: "Foundational concepts every founder should share before the assessment.",
    questionIds: [] },
  { id: "irl-1", title: "IRL 1 — Idea & Business Model Canvas",          order: 2,
    subtitle: "Formalize your value proposition and validate initial hypotheses.",
    questionIds: IRL1.map(q => q.id) },
  { id: "irl-2", title: "IRL 2 — Market & Competition",                   order: 3,
    subtitle: "Understand the landscape you're entering.",
    questionIds: IRL2.map(q => q.id) },
  { id: "irl-3", title: "IRL 3 — Problem Validation & Value Proposition", order: 4,
    subtitle: "Confirm there is a real need worth solving.",
    questionIds: IRL3.map(q => q.id) },
  { id: "irl-4", title: "IRL 4 — Low-Fidelity MVP Testing",               order: 5,
    subtitle: "Test the idea with a basic prototype.",
    questionIds: IRL4.map(q => q.id) },
  { id: "irl-5", title: "IRL 5 — Product / Market Fit",                   order: 6,
    subtitle: "Find the sweet spot between your product and the market.",
    questionIds: IRL5.map(q => q.id) },
  { id: "irl-6", title: "IRL 6 — Revenue Model Validation",               order: 7,
    subtitle: "Prove people will pay — and how much.",
    questionIds: IRL6.map(q => q.id) },
  { id: "irl-7", title: "IRL 7 — High-Fidelity MVP & Prototype",          order: 8,
    subtitle: "Ship something close to the real product.",
    questionIds: IRL7.map(q => q.id) },
  { id: "irl-8", title: "IRL 8 — Operations, Scalability & Delivery",     order: 9,
    subtitle: "Can you deliver consistently and grow?",
    questionIds: IRL8.map(q => q.id) },
  { id: "irl-9", title: "IRL 9 — Fundamental Metrics",                    order: 10,
    subtitle: "Track what matters and act on it.",
    questionIds: IRL9.map(q => q.id) },
];

export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(
  ALL_QUESTIONS.map(q => [q.id, q])
);

export function getSection(id: string): IRLSection | undefined {
  return SECTIONS.find(s => s.id === id);
}

export function nextSectionId(current: string): string | null {
  const idx = SECTIONS.findIndex(s => s.id === current);
  if (idx < 0 || idx >= SECTIONS.length - 1) return null;
  return SECTIONS[idx + 1].id;
}

export function prevSectionId(current: string): string | null {
  const idx = SECTIONS.findIndex(s => s.id === current);
  if (idx <= 0) return null;
  return SECTIONS[idx - 1].id;
}

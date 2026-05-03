// Structured module content. Each module is a sequence of "beats" — discrete
// teaching units. A beat has a kind (concept | example | check | exercise) and
// a body that Claude uses to generate A2UI surfaces.
//
// IMPORTANT: this content is the AUTHORITATIVE source. Claude is instructed
// NOT to invent content beyond what's here — only to render it as A2UI.

import type { VideoResource } from "./videos";

export type BeatKind = "intro" | "concept" | "example" | "check" | "exercise" | "outro";

export interface QuizOption {
  text: string;
  correct?: boolean;
  feedback?: string;
}

export interface Beat {
  id: string;
  kind: BeatKind;
  title: string;
  // Free-form teaching body. Claude renders it via KeyIdeaCard / ExampleCallout etc.
  body?: string;
  // For "check" beats — multiple choice quiz
  quiz?: {
    question: string;
    options: QuizOption[];
  };
  // For "exercise" beats — structured exercise the founder fills in
  exercise?: {
    kind: "bmc" | "value-prop" | "tam-sam-som" | "checklist" | "free-text";
    prompt: string;
    // Map exercise outputs to Answer questionIds we should write back to.
    writeBack?: string[];
  };
  // Optional video resources surfaced inline with the beat (e.g. for an intro
  // or example). Curated from the source PDF.
  videos?: VideoResource[];
  // Optional citation for footer
  citation?: string;
}

export interface ModuleContent {
  moduleId: string;
  beats: Beat[];
}

// =============================================================================
// IRL 1 — full content (demo-quality)
// =============================================================================

const M13: ModuleContent = {
  moduleId: "m13-defining-the-problem",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Why a real problem matters",
      body:
        "Every business is born from a problem. A vague or imagined problem makes everything that follows weaker — product, marketing, sales. The founder who deeply understands the problem wins half the game before building anything.",
      citation: "Module 13 — Defining the Problem",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Get out of theory: meet people",
      body:
        "The most reliable source for understanding a problem is the person who actually experiences it. Don't rely on blogs and statistics — talk directly. Ask: how often does the problem occur? What does it cost in time, money, or stress? What have they already tried? What's missing from existing solutions?",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Run exploratory interviews with method",
      body:
        "Interviews need preparation. Define the hypothesis you want to verify. Profile your typical customer (their day, goals, frustrations). Structure each interview into intro, problem exploration, deeper investigation, closing. Ask open questions and follow up on the 'why'. Take notes on phrases, behaviors, emotions — not just facts.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question:
          "You're interviewing a potential customer about a booking platform. Which question is best?",
        options: [
          {
            text: "Would you use an app that lets you book home services in 90 seconds?",
            feedback:
              "This is a leading question — it tests your idea, not the problem. People say yes to be polite.",
          },
          {
            text: "What do you do today when you can't find an electrician?",
            correct: true,
            feedback:
              "Open-ended, present-tense, focused on real behavior. The gold standard.",
          },
          {
            text: "Do you like our solution?",
            feedback: "You're not selling here. You're learning.",
          },
        ],
      },
    },
    {
      id: "concept-3",
      kind: "concept",
      title: "Synthesize: write a problem statement",
      body:
        "After 10–20 interviews, look for patterns. Which phrases repeat? Which frustrations are strongest? What are people already doing to cope? A good problem statement is specific, relevant, verifiable, communicable.",
    },
    {
      id: "example-1",
      kind: "example",
      title: "Vague vs. sharp",
      body:
        "❌ 'Small businesses struggle with digitalization.'\n\n✅ 'Micro-business owners in personal care often lose appointments and clients because they still manage bookings manually and can't respond fast enough.'\n\nThe second version is observable, testable, and points to a solution shape.",
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Apply to your startup",
      exercise: {
        kind: "free-text",
        prompt:
          "Write a one-paragraph problem statement for your startup. Who has the problem? When does it occur? What does it cost them? What are they doing today to cope? Be specific — names, numbers, situations.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "What's next",
      body:
        "If you can't write a sharp problem statement, you don't yet know your problem well enough. Schedule 5 more interviews this week. The clarity you'll gain compounds across every later decision.",
    },
  ],
};

const M14: ModuleContent = {
  moduleId: "m14-bmc",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Why the BMC matters",
      body:
        "The Business Model Canvas is the operational core of your business — how value is created, delivered, and captured, on one page. It's not a final document; it's a working tool you'll iterate as you learn.",
      citation: "Module 14 — Business Model Canvas",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "The 9 blocks",
      body:
        "Customer Segments · Value Propositions · Channels · Customer Relationships · Revenue Streams · Key Resources · Key Activities · Key Partners · Cost Structure. Each block is a hypothesis until you've tested it.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Start from the right",
      body:
        "The right side (customers, value, revenue) is what the customer sees. Get this right first. The left side (resources, activities, partners, costs) is how you deliver — figure it out after you know the value proposition is real.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question:
          "A founder says: 'We have a great new technology, we just need to find a market for it.' What's the issue?",
        options: [
          {
            text: "They started from Key Resources, not Customer Segments.",
            correct: true,
            feedback:
              "Exactly. Tech-first thinking skips the most important question: who has a problem worth paying for?",
          },
          {
            text: "They need a bigger marketing budget.",
            feedback: "More marketing on the wrong product just amplifies the problem.",
          },
          {
            text: "Nothing — that's how innovation works.",
            feedback:
              "Sometimes. But more often, that's how startups die looking for product-market fit.",
          },
        ],
      },
    },
    {
      id: "example-1",
      kind: "example",
      title: "Concrete BMC example",
      body:
        "A startup reinventing how small local producers sell online:\n• Customers: artisan food producers in Tuscany, <€500k revenue\n• Value: shared logistics + e-commerce in 1 click\n• Channels: trade fairs, partnerships with food associations\n• Revenue: 8% commission per sale\n• Key resources: shared warehouse, web platform\n• Costs: warehouse lease, dev team",
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Build YOUR BMC (right side first)",
      exercise: {
        kind: "bmc",
        prompt:
          "Fill in the right side of YOUR BMC: Customer Segments, Value Propositions, Channels, Customer Relationships, Revenue Streams. Don't worry about the left side yet.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Iterate the BMC",
      body:
        "Save this BMC. Re-take it after every 5 interviews. The blocks that change most are your weakest hypotheses — those are next to test.",
    },
  ],
};

const M15: ModuleContent = {
  moduleId: "m15-cv-and-team",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Why team matters more than idea",
      body:
        "Investors invest in people, not slides. Ideas pivot; teams persist. A weak idea with a strong team often wins; a great idea with the wrong team almost always loses.",
      citation: "Module 15 — CV & Team",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Five practices for team building",
      body:
        "1) Look for self-starters who can move across multiple areas.\n2) Prioritize value alignment over just complementary skills.\n3) Make roles flexible — they'll evolve with the startup.\n4) Don't hire if you can outsource. Stay lean.\n5) Plan team growth around real revenue, not assumptions.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Co-founder fit",
      body:
        "A good co-founder fills a skill gap, shares the vision, and adds resilience in dark moments. They can communicate, resolve conflict, and stay present. The relationship is closer to a marriage than a hire — be honest about commitment from day one.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question:
          "Which is the worst predictor of co-founder success?",
        options: [
          {
            text: "They graduated from a top university.",
            correct: true,
            feedback:
              "Resumes don't predict startup performance. Action under uncertainty does.",
          },
          {
            text: "You've worked together on a hard project before.",
            feedback:
              "This is one of the strongest signals. Past collaboration under pressure shows fit.",
          },
          {
            text: "They have skills you lack and care about the same problem.",
            feedback: "This is what you actually want.",
          },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Team gap analysis",
      exercise: {
        kind: "free-text",
        prompt:
          "List your top 3 critical skills/roles for the next 6 months. For each, note: who covers it today? Is the coverage strong, weak, or missing? What's your plan?",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Action this week",
      body:
        "If you have a team, schedule a 30-minute alignment call this week: vision, roles, what we won't compromise on. If you're solo, list 3 specific people you could co-found with — and reach out to one.",
    },
  ],
};

const M16: ModuleContent = {
  moduleId: "m16-experiments",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Experiments beat opinions",
      body:
        "In a startup, opinions are cheap and uncertainty is high. The team that ships small, measurable experiments — and lets data correct course — moves faster than the team that argues in a room.",
      citation: "Module 16 — Experiments",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "What makes an experiment effective",
      body:
        "1) Specific — tests one hypothesis, not five.\n2) Measurable — results are observable and clear.\n3) Quick & cheap — runs in days, not months.\n\nA good experiment changes your mind one way or the other. If you can't predict the outcome confidently, you have a good experiment.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Prioritize: ease × impact × confidence",
      body:
        "List 5–10 hypotheses. For each, score 0–10 on (a) ease of testing, (b) impact if true, (c) your confidence it's true. Top of the list = highest impact + lowest confidence + easy to test. That's where the money is.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question:
          "Which is a well-designed experiment for the hypothesis: 'Users will book a service directly from Instagram'?",
        options: [
          {
            text: "Build the full booking platform, launch it, and measure usage.",
            feedback:
              "Slow and expensive. You'll spend months before learning anything.",
          },
          {
            text: "Post once with a booking link in bio and monitor clicks for a week.",
            correct: true,
            feedback:
              "Cheap, specific, fast. Real signal in days. Classic lean experiment.",
          },
          {
            text: "Survey 200 followers about whether they'd book through Instagram.",
            feedback:
              "Survey intent doesn't predict behavior. People say yes; clicks don't lie.",
          },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Plan one experiment",
      exercise: {
        kind: "free-text",
        prompt:
          "Pick the riskiest hypothesis underlying your startup right now. Design one experiment you can run in the next 2 weeks: what you'll do, what success looks like, what failure looks like.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Set a weekly cadence",
      body:
        "Ship one experiment a week. Review results every Friday. After 4 weeks, you'll have learned more than most founders learn in 6 months of planning.",
    },
  ],
};

// =============================================================================
// IRL 2 — IRL 5 — lighter content (4 beats each, expandable later)
// Each module follows the same pattern: intro → concept → example/check → exercise.
// =============================================================================

const M17: ModuleContent = {
  moduleId: "m17-competitive-analysis",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Why competitor analysis isn't optional",
      body:
        "Building without mapping the context means risking replicating an existing model — or worse, building what others already do better.",
      citation: "Module 17",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Direct, indirect, and the status quo",
      body:
        "Direct competitors offer something similar to the same target. Indirect competitors solve the same problem differently. The status quo (e.g., Excel) is often the strongest competitor — never underestimate it.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question:
          "A startup says 'we have no competitors'. What's most likely true?",
        options: [
          {
            text: "They've discovered a true blue ocean.",
            feedback:
              "Possible, but rare. More often this answer reveals weak competitive analysis.",
          },
          {
            text: "There's no real demand for what they're building.",
            feedback:
              "Sometimes. If nobody else is solving it, ask why.",
          },
          {
            text: "They haven't mapped indirect alternatives or the status quo.",
            correct: true,
            feedback:
              "Yes. Every problem has alternatives — even if they're 'do nothing' or 'use Excel'.",
          },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Build a 3-row benchmark table",
      exercise: {
        kind: "free-text",
        prompt:
          "List 3 competitors (direct or indirect). For each: what they offer, their pricing, one strength, one weakness. Where can YOU be different and credible?",
      },
    },
  ],
};

const M18: ModuleContent = {
  moduleId: "m18-positioning",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Positioning: be relevant to a few",
      body:
        "It's not about being 'the best'. It's about being the best fit for a specific customer with a specific problem.",
      citation: "Module 18",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "The For-Who-We-Offer-Unlike formula",
      body:
        "For [TARGET] who has [PROBLEM], we offer [SOLUTION] that enables [UNIQUE RESULT], unlike [COMPETITORS]. Specific. Customer-centered. Benefit-driven.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Which positioning is strongest?",
        options: [
          {
            text: "We help everyone do everything better with AI.",
            feedback: "Generic. Says nothing.",
          },
          {
            text: "We help small hairdressers stop losing bookings to no-shows.",
            correct: true,
            feedback: "Specific target, specific problem, specific outcome.",
          },
          {
            text: "We're a cloud-based platform for businesses.",
            feedback: "Tech-first, not customer-first.",
          },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Write your positioning",
      exercise: {
        kind: "value-prop",
        prompt:
          "Fill in the formula for your startup. For [TARGET] who has [PROBLEM], we offer [SOLUTION] that enables [UNIQUE RESULT], unlike [COMPETITORS].",
      },
    },
  ],
};

const M19: ModuleContent = {
  moduleId: "m19-networking",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "No startup grows alone",
      body:
        "Networking isn't collecting contacts — it's building relationships that activate resources, opportunities, and trust.",
      citation: "Module 19",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Give before you ask",
      body:
        "Lead with value: useful content, an introduction, thoughtful feedback. The relationships built this way last and compound.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Best follow-up after a useful 30-min call with a potential mentor?",
        options: [
          {
            text: "Wait two months and reach out asking for a favor.",
            feedback: "Cold. Asks without giving.",
          },
          {
            text: "Within 24h: thank-you note, share something specific you'll act on, suggest a concrete next step.",
            correct: true,
            feedback: "Sharp follow-up. Builds trust and momentum.",
          },
          {
            text: "Connect on LinkedIn with the default message.",
            feedback: "Better than nothing — but generic.",
          },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Plan 3 outreach actions",
      exercise: {
        kind: "free-text",
        prompt:
          "Name 3 people you'll reach out to this week. For each: who they are, why they're relevant, and what you'll offer (not ask for) first.",
      },
    },
  ],
};

const M20: ModuleContent = {
  moduleId: "m20-mission-vision",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Direction before action",
      body:
        "Vision describes the world you want to help create. Mission says how you'll get there today. Together they make every later decision easier.",
      citation: "Module 20",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Vision = future. Mission = present.",
      body:
        "Vision is inspirational and forward-looking. Mission is operational and current. A good mission describes what you do, for whom, with what differentiating element.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Which is a strong mission?",
        options: [
          {
            text: "Be the best company in the world.",
            feedback: "Generic. No customer, no value, no specificity.",
          },
          {
            text: "We help local micro-businesses sell online without technical barriers.",
            correct: true,
            feedback: "Customer + problem + differentiator. Clean.",
          },
          {
            text: "Disrupt everything with AI.",
            feedback: "Buzzwords. Says nothing concrete.",
          },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Draft yours",
      exercise: {
        kind: "free-text",
        prompt:
          "Write a 1-sentence mission for your startup. Then a 1-sentence vision. Don't optimize — just draft. You'll iterate later.",
      },
    },
  ],
};

const M21: ModuleContent = {
  moduleId: "m21-market-analysis",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Stop saying '1% of a huge market'",
      body:
        "Investors hate it. Use TAM-SAM-SOM to show you know your real reachable market.",
      citation: "Module 21",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "TAM · SAM · SOM",
      body:
        "TAM = total global market. SAM = portion reachable by your business model. SOM = realistic share you can capture in early years. Always specify assumptions.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Best way to estimate market size?",
        options: [
          {
            text: "Top-down only.",
            feedback: "Risk: assumptions inflate quickly.",
          },
          {
            text: "Bottom-up only.",
            feedback: "Risk: misses the broader opportunity.",
          },
          {
            text: "Both, and reconcile the gap.",
            correct: true,
            feedback:
              "Always do both. The discrepancy reveals where your assumptions are weakest.",
          },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Estimate yours",
      exercise: {
        kind: "tam-sam-som",
        prompt:
          "Compute a quick TAM, SAM, and SOM for your startup. State your assumptions clearly. Don't aim for precision — aim for defensibility.",
      },
    },
  ],
};

const M22: ModuleContent = {
  moduleId: "m22-startup-tools",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Tools should multiply your output",
      body: "The right tools save time. The wrong ones add overhead.",
      citation: "Module 22",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Pick by need, not novelty",
      body:
        "Define the workflow first. Choose tools that integrate with what you already use. Start cheap and scalable. Avoid 'enterprise' tooling at idea stage.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "You're at idea stage. Which tooling stack is healthier?",
        options: [
          {
            text: "Salesforce + HubSpot + Asana + Slack + Linear + Mailchimp.",
            feedback: "Five subscriptions before your first customer? Stop.",
          },
          {
            text: "Notion + a spreadsheet + Gmail.",
            correct: true,
            feedback:
              "Lean and flexible. Add tools when a real bottleneck demands it.",
          },
          {
            text: "Whatever the loudest tutorial recommends.",
            feedback: "Tools follow workflow, not trends.",
          },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Audit your current stack",
      exercise: {
        kind: "free-text",
        prompt:
          "List the tools you currently use. For each, write: what's it for? Could you replace it with something simpler? Is it actually used weekly?",
      },
    },
  ],
};

const M23: ModuleContent = {
  moduleId: "m23-project-management",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Agile or Waterfall?",
      body:
        "For early-stage startups, Agile wins. Short cycles, real feedback, willingness to change direction.",
      citation: "Module 23",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "The weekly sprint",
      body:
        "Pick a sprint length (1–2 weeks). Define 3–5 outcomes. Daily 15-min stand-up. End with a review + retro. Adjust the next sprint based on what you learned.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Best Kanban setup for a 2-person startup?",
        options: [
          {
            text: "12 columns covering every micro-stage of every workflow.",
            feedback: "Process kills momentum at this stage.",
          },
          {
            text: "Backlog · In Progress · Done.",
            correct: true,
            feedback: "Simple is sustainable. Add columns only when pain demands it.",
          },
          {
            text: "No board — just remember what you're doing.",
            feedback: "Memory fails. Even a sticky note on a wall beats nothing.",
          },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Plan next sprint",
      exercise: {
        kind: "free-text",
        prompt:
          "Define your next 2-week sprint. List 3–5 outcomes (not tasks — outcomes). What does done look like for each?",
      },
    },
  ],
};

const M24: ModuleContent = {
  moduleId: "m24-mvp",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "An MVP is an experiment, not a product",
      body:
        "The minimum viable product tests the riskiest hypothesis with the least code. Less is more — when designed well.",
      citation: "Module 24",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "MVP formats",
      body:
        "Landing page · Concierge MVP (manual delivery behind the scenes) · Demo video · Interactive prototype (Figma) · Fake-door test. Pick the one that tests your specific hypothesis cheapest.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Hypothesis: 'Customers will pay for X'. Best MVP?",
        options: [
          {
            text: "Build the full product, then check sales.",
            feedback: "Slowest, riskiest path.",
          },
          {
            text: "Pre-orders with refund option, or paid pilot with 5 users.",
            correct: true,
            feedback:
              "A real payment is the strongest signal. Even a small one beats any survey.",
          },
          {
            text: "A landing page with an email signup form.",
            feedback:
              "Tests interest, not willingness to pay. Useful, but not the strongest test for THIS hypothesis.",
          },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Define your MVP",
      exercise: {
        kind: "free-text",
        prompt:
          "Write the riskiest hypothesis your startup must validate. Then design the smallest MVP that could disconfirm it in 2–3 weeks.",
      },
    },
  ],
};

const M25: ModuleContent = {
  moduleId: "m25-customer-journey",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "What does the user actually experience?",
      body:
        "Map the journey from 'doesn't know you exist' to 'recommending you to friends'. Every stage is designable.",
      citation: "Module 25",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Awareness · Consideration · Purchase · Retention · Advocacy",
      body:
        "For each stage, ask: where does the user encounter you? what do they think? what do they need? what's the friction? Most startups optimize Awareness and forget the other four.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Which stage do most early-stage startups under-invest in?",
        options: [
          {
            text: "Awareness — they don't market enough.",
            feedback: "It's usually the opposite — over-investing in awareness.",
          },
          {
            text: "Retention and advocacy.",
            correct: true,
            feedback:
              "Acquisition without retention burns cash. Loyal users are the cheapest growth channel.",
          },
          {
            text: "Consideration — they don't have enough sales pages.",
            feedback: "Sometimes. Less common.",
          },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Map your journey",
      exercise: {
        kind: "free-text",
        prompt:
          "Sketch your customer's journey across 5 stages. Note: where they encounter you, what they think, the biggest friction, and what would make them recommend you.",
      },
    },
  ],
};

const M26: ModuleContent = {
  moduleId: "m26-kpis",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "What you measure shapes what you build",
      body:
        "KPIs aren't reporting — they're how a team aligns. Pick 3–5 that genuinely reflect progress, not vanity.",
      citation: "Module 26",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "SMART KPIs",
      body:
        "Specific · Measurable · Achievable · Relevant · Time-bound. Vanity KPI: 'social media followers'. Real KPI: 'monthly active users who returned in the last 30 days'.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Best KPI for an early-stage SaaS?",
        options: [
          {
            text: "Number of website visits.",
            feedback: "Vanity. Visits don't pay bills.",
          },
          {
            text: "Weekly active users + churn rate.",
            correct: true,
            feedback: "Together they show real engagement and retention.",
          },
          {
            text: "Twitter followers.",
            feedback: "Social proof, not progress.",
          },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Pick your KPIs",
      exercise: {
        kind: "free-text",
        prompt:
          "List 3 KPIs you'll track for the next 30 days. For each: definition, current value, 30-day target, why it matters.",
      },
    },
  ],
};

const M27: ModuleContent = {
  moduleId: "m27-first-customer",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "First customers are found, not delivered",
      body:
        "They come from cold outreach, in-person visits, conversations. Inbound takes months; outbound starts today.",
      citation: "Module 27",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "20 conversations rule",
      body:
        "Have 20 real, scheduled conversations with potential customers in the next 30 days. Track them in a spreadsheet. The patterns you see across them are worth more than any market report.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Best first move for a brand-new startup?",
        options: [
          {
            text: "Run paid ads to a landing page.",
            feedback:
              "Possible, but you'll burn money before you understand your customer.",
          },
          {
            text: "Email 20 specific people who fit your target.",
            correct: true,
            feedback:
              "Personal, free, and you learn a ton from the responses.",
          },
          {
            text: "Wait until the product is perfect.",
            feedback: "It never will be. Ship messy, learn fast.",
          },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Plan 5 outreach messages",
      exercise: {
        kind: "free-text",
        prompt:
          "Write a short, personal outreach message and identify 5 specific people to send it to. Send 1 today.",
      },
    },
  ],
};

const M28: ModuleContent = {
  moduleId: "m28-ecosystem",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "You're a node in a network",
      body:
        "Map the people, companies, and institutions around your startup. Find allies, anticipate barriers.",
      citation: "Module 28",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Map by category",
      body:
        "Customers (direct + indirect) · Distribution channels · Industry associations · Synergistic companies · Institutions (chambers, incubators) · Communities. For each: who they are, what you could do together, who to contact, the next step.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Best first ecosystem move for a new startup?",
        options: [
          {
            text: "Apply to 10 international accelerators.",
            feedback: "Often premature. Local proof comes first.",
          },
          {
            text: "Join one local industry community and contribute for 60 days.",
            correct: true,
            feedback:
              "Builds reputation. Real relationships beat outreach campaigns.",
          },
          {
            text: "Buy ads in trade magazines.",
            feedback: "Expensive at idea stage.",
          },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Map 10 actors",
      exercise: {
        kind: "free-text",
        prompt:
          "List 10 actors in your ecosystem. For each: name, what you could do together, who to contact, next step.",
      },
    },
  ],
};

const M29: ModuleContent = {
  moduleId: "m29-sales",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Selling is listening, not pushing",
      body:
        "Sales at idea stage is a conversation. Lead with curiosity. Convert interest into trust, then trust into a paid trial.",
      citation: "Module 29",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "From cold to closed",
      body:
        "Reach out · Qualify (do they have the problem?) · Listen · Propose a clear, narrow first step · Follow up · Don't fear the no — it teaches you something.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question:
          "First time you talk to a prospect, what's the best thing to do?",
        options: [
          {
            text: "Pitch your product for 15 minutes.",
            feedback: "Fastest way to lose them.",
          },
          {
            text: "Ask about their problem and listen.",
            correct: true,
            feedback:
              "Listening earns trust. Listening also tells you exactly how to pitch.",
          },
          {
            text: "Demo every feature in detail.",
            feedback: "Features matter only after problems are confirmed.",
          },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Build your first 'value ladder'",
      exercise: {
        kind: "free-text",
        prompt:
          "Sketch 3 offers with increasing commitment: free conversation → small paid pilot → full engagement. What's the price and timeline of each?",
      },
    },
  ],
};

const M30: ModuleContent = {
  moduleId: "m30-presence",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Presence builds trust before you sell",
      body:
        "Brand, logo, website, social, materials. Clarity beats polish. Even at idea stage, a coherent presence opens doors.",
      citation: "Module 30",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Less is more",
      body:
        "1) A clear name. 2) A simple logo. 3) A 1-page website that says what you do, who for, and how to start. 4) One social channel where you post weekly. That's enough for now.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Earliest 'good enough' brand presence for a 1-month-old startup?",
        options: [
          {
            text: "Full custom design system, 8-page website, presence on 6 platforms.",
            feedback: "Premature optimization. Spend that time on customers.",
          },
          {
            text: "Logo, single landing page, one consistent social channel.",
            correct: true,
            feedback: "Coherent, clear, fast to build.",
          },
          {
            text: "No website, just an email address.",
            feedback: "Hurts credibility unnecessarily.",
          },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Audit yours",
      exercise: {
        kind: "checklist",
        prompt:
          "Check off what you have: clear name · logo · landing page · about page · contact path · one active social channel. What's the one missing piece you'll fix this week?",
      },
    },
  ],
};

const M31: ModuleContent = {
  moduleId: "m31-social-startups",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Mission and economics aren't a contradiction",
      body:
        "A social or benefit corporation can be profitable, scalable, and impact-driven all at once. The model exists; the question is fit.",
      citation: "Module 31",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Italian benefit company basics",
      body:
        "Formal legal status. Statute commits to common-benefit goals. Annual impact report required. Tools: B Impact Assessment, Theory of Change Canvas, SDG Compass.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question:
          "Which is true about a benefit corporation in Italy?",
        options: [
          {
            text: "It can't distribute profits.",
            feedback: "False — that's a non-profit.",
          },
          {
            text: "It must pursue common-benefit goals AND can generate profit.",
            correct: true,
            feedback: "Correct. Hybrid model.",
          },
          {
            text: "It's exempt from corporate taxes.",
            feedback:
              "Not generally exempt — but specific incentives may apply.",
          },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Define your impact",
      exercise: {
        kind: "free-text",
        prompt:
          "Write 3 impact metrics specific to your startup. For each: how you'd measure it, how often, and how it ties to your business model.",
      },
    },
  ],
};

// Add curated video resources to existing beats where the source PDF cites them.
// Done as a side-effect (rather than re-typing each Beat block) to keep diffs
// surgical. Paths reference the videos.ts central registry.
import { MODULE_VIDEOS } from "./videos";

function attachVideoToIntro(content: ModuleContent, moduleId: string) {
  const vids = MODULE_VIDEOS[moduleId];
  if (!vids || vids.length === 0) return;
  const intro = content.beats.find(b => b.kind === "intro");
  if (intro) intro.videos = vids;
}

// =============================================================================
// IRL 0 — Foundation modules (Modules 1–12)
// =============================================================================

const M1: ModuleContent = {
  moduleId: "m1-what-is-startup",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Startup ≠ small business",
      body:
        "A startup is a temporary organization designed to validate a scalable, repeatable business model under high uncertainty. Its goal isn't merely to survive — it's to grow rapidly by leveraging innovation.",
      citation: "Module 1 — What is a startup?",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Three definitions worth knowing",
      body:
        "Steve Blank: 'A startup is a temporary organization in search of a repeatable and scalable business model.' Eric Ries: 'A startup is a human institution designed to create a new product or service under conditions of extreme uncertainty.' Y Combinator: 'A startup is a company designed to grow very quickly.' All three converge on innovation + scalability.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Italian innovative startup status",
      body:
        "In Italy, an 'innovative startup' is a capital company under 5 years old, registered in Italy, that doesn't distribute profits and develops products/services with high technological value. Must satisfy at least one: 15% of costs in R&D, 1/3 PhDs (or 2/3 master's degrees) on team, or owns a patent / registered software. Benefits: tax breaks, simplified bureaucracy, access to the SME Guarantee Fund.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Which trait most clearly distinguishes a startup from a small business?",
        options: [
          { text: "It uses software." },
          { text: "It searches for a scalable, repeatable business model.", correct: true,
            feedback: "Yes — searching for a model that scales without proportional cost growth is the defining trait." },
          { text: "It has fewer than 10 employees." },
        ],
      },
    },
    {
      id: "concept-3",
      kind: "concept",
      title: "Life stages: pre-seed → scale-up",
      body:
        "Pre-seed: idea → MVP. Seed: product + first customers, find product-market fit. Growth: model works, expand. Scale-up: dominate the market or a global niche. Each stage has different funding sources and decision priorities.",
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Place yourself on the map",
      exercise: {
        kind: "free-text",
        prompt:
          "Write one paragraph: which life stage are you in right now (pre-seed / seed / growth / scale-up), and what's the single biggest decision you have to make in the next 30 days?",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Next step",
      body:
        "If you're not sure whether your project is really a startup, it might just be a small business — and that's a valid path too. The label matters because it determines the tools (calls, investors, accelerators) you can credibly use.",
    },
  ],
};

const M2: ModuleContent = {
  moduleId: "m2-trl-irl",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Two scales for two questions",
      body:
        "TRL measures how technically ready your tech is. IRL measures how investment-ready your business is. They're different — and you need both.",
      citation: "Module 2 — TRL/IRL",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "TRL — Technology Readiness Level (1–9)",
      body:
        "1: basic principles observed. 3: experimental proof of concept. 4: validated in lab. 6: prototype tested in a realistic environment. 8: system complete and qualified. 9: in real-world use. NASA invented this in the 1970s; Horizon Europe and most public funds use it today.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "IRL — Investment Readiness Level (1–9)",
      body:
        "1: idea on paper. 3: market research and first positive feedback. 5: working MVP, first paid users. 7: validated business model with growing revenue. 9: ready for international Series A+. Investors care about IRL — TRL alone doesn't pay bills.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "A startup has TRL 8 (ready tech) but no customers and no go-to-market plan. Their IRL is most likely:",
        options: [
          { text: "Also 8 — tech maturity drives investability." },
          { text: "Low (3 or below) — no validated business.", correct: true,
            feedback: "Right. Tech without a market is exactly why deep-tech startups so often struggle to raise." },
          { text: "Irrelevant — IRL only matters in B2C." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Self-assess",
      exercise: {
        kind: "free-text",
        prompt:
          "Estimate your current TRL and IRL on a 1–9 scale. Briefly justify each. Where's the bigger gap, and what's the next concrete step to close it?",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Communicate both",
      body:
        "When you talk to a public-call evaluator, lead with TRL. When you talk to a VC, lead with IRL. When you talk to a corporate partner, talk about both.",
    },
  ],
};

const M3: ModuleContent = {
  moduleId: "m3-idea",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Anyone has ideas. Few do something about them.",
      body:
        "An idea is a starting point — and the most important one. But ideas don't become businesses unless someone takes responsibility for the work that follows.",
      citation: "Module 3 — Idea",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Talk to people you know",
      body:
        "Find at least 5 people in your network who could plausibly want what you're building. Explain it as a casual conversation. Ask: 'Would you use it? Would you pay for it?' Then ask to be introduced to others. The value is in the discussion, not in secrecy.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Look for those who've done it before",
      body:
        "Study competitors — not to copy them but to learn. Talk to people who've already built in a related field. Most founders are happy to share if approached sincerely. Don't underestimate a well-written email or an honest phone call.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Which checklist item is most predictive that an idea has potential?",
        options: [
          { text: "It has never been done before." },
          { text: "There's a clear, painful problem someone is willing to pay to solve.", correct: true,
            feedback: "Exactly. Originality without painful demand is just novelty." },
          { text: "You feel passionate about it." },
        ],
      },
    },
    {
      id: "concept-3",
      kind: "concept",
      title: "What strong ideas have in common",
      body:
        "They start from a personal or observed problem. They offer something simpler, cheaper, more sustainable, or faster than what exists. They sit on a real growth trend (digital, well-being, sustainability, automation, education, care). They don't have to be brilliant — they have to be useful.",
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "The 7-question idea checklist",
      exercise: {
        kind: "checklist",
        prompt:
          "Check each: (1) clear problem, (2) sensible solution, (3) target market, (4) someone would pay, (5) you can test small, (6) you want to carry it forward, (7) you can start now. >5 ✓ = ready to test. 3–5 ✓ = needs more shape. <3 ✓ = define the problem better first.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Start small. Today.",
      body:
        "Don't wait until you feel ready — you won't. Ship one tiny act of trust this week: a phone call, a one-page brief, a 5-person interview round. Confidence comes from action, not the other way around.",
    },
  ],
};

const M4: ModuleContent = {
  moduleId: "m4-validation",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Validate before you build",
      body:
        "Validation isn't a survey among friends or an expert opinion. It's a process based on concrete, measurable feedback from the market — even at small scale.",
      citation: "Module 4 — Validation",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Three levels of validation",
      body:
        "1) Problem validation: do real people have this problem and feel it as relevant? 2) Solution validation: is your proposal understandable, desirable, interesting? 3) Willingness-to-pay validation: are people actually willing to spend money, even a little?",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Methods that match each level",
      body:
        "Problem: 5–20 exploratory interviews. Observe what people already use. Solution: a clear landing page with a CTA, a small ad test, a network share — measure clicks and signups, not opinions. Willingness to pay: pre-orders with refund, concierge MVP, paid pilot for a small group.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "You want to test 'people will pay €20/month for this'. Best test?",
        options: [
          { text: "Survey 200 people whether they'd pay." },
          { text: "Open pre-orders at €20/month with a refund option for 10 users.", correct: true,
            feedback: "A real payment is the strongest signal. Even a small one beats any survey." },
          { text: "Build the full product and see what happens." },
        ],
      },
    },
    {
      id: "example-1",
      kind: "example",
      title: "Three real Italian validation paths",
      body:
        "Dendron — sustainability startup — validated through scientific data, certifications, multi-sector prototypes. Magnifica Rotonda — gourmet frozen pizza — validated through patented R&D + Horeca tasting + dual sales channels. Mashcream — experiential gelato — validated through trade fairs and live show-cooking before opening a single store.",
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Pick your next validation",
      exercise: {
        kind: "free-text",
        prompt:
          "Which level (problem / solution / willingness to pay) is your weakest right now? Design one validation experiment for the next 14 days: what you'll do, what success looks like, what failure looks like.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Don't validate to confirm — validate to understand",
      body:
        "Look for truth, not reassurance. Accept that your idea might need to change or be discarded. Validation is also training in constructive confrontation.",
    },
  ],
};

const M5: ModuleContent = {
  moduleId: "m5-company-system",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "A company is a system",
      body:
        "A company is a complex system of human, financial, and material resources operating to create economic and social value. Understanding it as a system — not a product — is the prerequisite to managing it.",
      citation: "Module 5 — The Company System",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Internal and external stakeholders",
      body:
        "Internal: employees (the operational engine), managers (strategy), owners/shareholders (capital + risk). External: suppliers, customers, banks, competitors, the State, consultants. Every stakeholder shapes how the company actually behaves.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "The financial statements — what they really do",
      body:
        "Balance Sheet: snapshot of assets vs liabilities. Income Statement: costs vs revenues, profit/loss. Notes: explanatory details. Cash Flow Statement: liquidity in and out. Management Report: performance, risks, strategy. Together they let stakeholders make informed decisions.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "An early-stage startup has no profit yet. What do its financial statements actually show?",
        options: [
          { text: "Nothing useful — wait until profitable." },
          { text: "Burn rate, runway, and growth in key non-financial metrics (users, signups, MRR).", correct: true,
            feedback: "Exactly. Pre-profit, statements + key metrics show whether the business is becoming viable." },
          { text: "Just losses, which scare investors away." },
        ],
      },
    },
    {
      id: "concept-3",
      kind: "concept",
      title: "Five fundamental accounting principles",
      body:
        "Accrual: record revenues/costs in the period they relate to. Clarity: understandable. Prudence: don't overstate. Going concern: assume the business continues. Comparability: same method across periods so you can spot trends.",
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "List your stakeholders",
      exercise: {
        kind: "free-text",
        prompt:
          "List your top 10 stakeholders (internal + external). For each: what do they want from your startup, and what do you want from them? Spot any pair where the answers don't match.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Beyond bureaucracy",
      body:
        "Accounting isn't paperwork — it's the language by which your company is understood by everyone outside it. Even a one-person startup gets serious when its numbers are clean.",
    },
  ],
};

const M6: ModuleContent = {
  moduleId: "m6-funding-options",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Money isn't scarce — good startups are",
      body:
        "Business angels often say: 'There's no shortage of money — there's a shortage of good startups to invest in.' If you have a valid idea pursued the right way, capital is accessible. The question is matching the right capital to the right stage.",
      citation: "Module 6 — Funding Options",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Equity funding pathways",
      body:
        "Bootstrapping: self-funded, total control, slow growth. FFF (Friends, Family, Fools): early, flexible, but personal-relationship risk. Business Angels: capital + mentoring + network in the seed stage. Venture Capital: large checks, fast-growth pressure, dilution. Equity Crowdfunding: many small investors, marketing benefit, regulated.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Debt and public funding",
      body:
        "Banks: loans with guarantees (the SME Guarantee Fund covers up to 80% in Italy). Smart&Start Italia: subsidized loans up to €1.5M, interest-free for innovative startups. Regional and EU calls (PNRR, Horizon Europe): non-repayable funds for innovative projects.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "You're at idea stage with no revenue. Which funding source is most appropriate?",
        options: [
          { text: "Series A from a Tier-1 VC." },
          { text: "Bootstrapping + FFF + a small grant.", correct: true,
            feedback: "Match capital to stage — VC at idea stage rarely happens, and dilutes you when you're worth least." },
          { text: "Bank loan with personal guarantees." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Map your capital strategy",
      exercise: {
        kind: "free-text",
        prompt:
          "Which 2 funding sources will you target in the next 6 months? Why those two specifically, given your stage?",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Combine, don't pick one",
      body:
        "An effective approach combines sources: start with bootstrapping + business angels, then move to VC + equity crowdfunding while integrating public funds and subsidized loans.",
    },
  ],
};

const M7: ModuleContent = {
  moduleId: "m7-patents-trademarks",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Protect what's worth protecting",
      body:
        "IP protection is a strategic investment, not bureaucracy. But not everything needs a patent — and not all patents are worth filing. Knowing the difference saves money and time.",
      citation: "Module 7 — Patents and Trademark Protection",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Patent — when it's worth it",
      body:
        "A patent gives 20-year exclusivity. Requirements: new (not disclosed), inventive (non-obvious), industrially applicable. Pros: blocks competitors, increases company value, monetizable via licensing. Cons: expensive, slow (years), only valid in countries where filed. Alternative: trade secret.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Trademark — almost always worth it",
      body:
        "10 years, renewable indefinitely. Italy: UIBM. EU: EUIPO (one filing, all EU). World: WIPO (Madrid system). Cheap, fast, prevents disputes. If your name has commercial value, register it before someone else does.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "An early-stage startup has limited budget. What should they prioritize?",
        options: [
          { text: "File a patent immediately to protect the idea." },
          { text: "Register the trademark; consider a patent only if there's a real technical invention.", correct: true,
            feedback: "Trademarks are cheap and high-leverage. Patents only pay off when there's a defensible technical edge." },
          { text: "Wait to do all IP filings together at scale." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "IP audit",
      exercise: {
        kind: "free-text",
        prompt:
          "List your IP assets: name, logo, software code, patents, content. For each: is it protected? At what cost would you replace it? What's missing?",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Plus active defense",
      body:
        "Registration alone isn't enough. Monitor the market, register strategic web domains, and act on infringements — politely first, legally if needed.",
    },
  ],
};

const M8: ModuleContent = {
  moduleId: "m8-legal",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Legal isn't bureaucracy — it's a tool",
      body:
        "You don't need to be a lawyer to protect yourself in the early stage. But you do need to know the basics — and when to call one.",
      citation: "Module 8 — Legal",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Five legal areas to know",
      body:
        "1) Incorporation: when to form a company. 2) Statute, cap table, shareholders' agreements. 3) IP protection: trademark, patent, copyright. 4) Essential contracts: founders' agreement, NDAs, contractor letters, customer/supplier contracts. 5) Privacy & GDPR: even an email signup needs a privacy notice.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Cap table & shareholders' agreement",
      body:
        "Cap table: who owns how much. Keep it updated from day one — it's the basis for all future fundraising rounds. Shareholders' agreement: regulates what the statute can't (vesting, anti-dilution, drag-along, tag-along, exit clauses). Save yourself from later conflict by addressing these upfront.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Two co-founders split equity 50/50 with no written agreement. What's the risk?",
        options: [
          { text: "None — gentleman's agreement is fine." },
          { text: "Decision deadlock and zero clarity if one leaves; vesting and exit terms are undefined.", correct: true,
            feedback: "Exactly. 50/50 + no agreement is a textbook recipe for paralysis. Write it down before you need it." },
          { text: "Tax penalty." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Common-mistake audit",
      exercise: {
        kind: "checklist",
        prompt:
          "Check what you've done: founders' agreement signed · cap table maintained · trademark registered · NDA template ready · GDPR privacy notice live · incorporation strategy decided. Anything missing is your week's homework.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "When in doubt, get help",
      body:
        "Use templates for routine documents. For founders' agreements, IP, privacy, and complex contracts — pay for an hour of professional advice. It's cheaper than the lawsuit.",
    },
  ],
};

const M9: ModuleContent = {
  moduleId: "m9-corporate-forms",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Pick the form that matches the stage",
      body:
        "VAT, S.r.l.s., S.r.l., cooperative — each has tradeoffs. Don't open a company just to feel like a startup. Open one when the project actually needs it.",
      citation: "Module 9 — Corporate Forms",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Sole proprietorship / freelancer VAT",
      body:
        "Fastest, cheapest, simplest. Flat-rate regime up to €85k revenue. No social capital required. But: unlimited personal liability, no equity for partners, lower perceived credibility. Good for solo testing; not good for raising money.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "S.r.l., S.r.l.s., cooperative",
      body:
        "S.r.l.: capital company, limited liability, flexible governance — the standard for ambitious startups. S.r.l.s.: simplified S.r.l., €1 minimum capital, free incorporation, but standard non-modifiable statute. Cooperative: democratic, mutuality-driven; great for impact but rigid for scale.",
    },
    {
      id: "concept-3",
      kind: "concept",
      title: "Innovative startup status",
      body:
        "Apply for it after incorporating as a capital company. Requires: <5 years old, registered in Italy, <€5M revenue, no profit distribution, innovative purpose. Plus one of: 15% R&D spending, 1/3 PhDs (or 2/3 master's), or owned IP. Benefits: tax deductions for investors, exemption from incorporation duties, SME Guarantee Fund priority, stock options & WFE allowed.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Two founders + want to raise money + plan to hire. Best form?",
        options: [
          { text: "Two separate VAT numbers." },
          { text: "S.r.l. (or S.r.l.s. evolved later) with innovative-startup status if eligible.", correct: true,
            feedback: "Right. Capital company is required to take on investors, and innovative-startup status unlocks the best support." },
          { text: "Cooperative." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Decide your form",
      exercise: {
        kind: "free-text",
        prompt:
          "Which form fits your project today? Why? List 2–3 reasons grounded in your stage, team, and 12-month plan.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "It can change",
      body:
        "Your form isn't permanent — but changes have cost. Get the first choice as right as you can, with an accountant's input.",
    },
  ],
};

const M10: ModuleContent = {
  moduleId: "m10-being-entrepreneur",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Entrepreneur is a way of acting",
      body:
        "Doing business isn't just a job. It's an attitude under uncertainty: identifying opportunity, imagining solutions, building organization, taking the risk to bring it into the world.",
      citation: "Module 10 — Being an entrepreneur",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Employee vs entrepreneur — what changes",
      body:
        "Income: fixed → variable. Hours: set → flexible (often longer). Security: high → low (especially early). Responsibility: limited → total. Decisions: made by others → you decide. Pressure: contained → high. Earnings: capped → uncapped (with real downside risk).",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Traits that recur in builders",
      body:
        "Intrinsic motivation (it's not about money). Vision and ambition (you can't ignore the problem). Adaptability (you change plans when needed). Tolerance for uncertainty (functioning without certainty). Lateral thinking. Bias toward action (an idea isn't enough — you want to ship).",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "What signals 'ready to be an entrepreneur'?",
        options: [
          { text: "Confidence and a complete plan." },
          { text: "An emergency fund and willingness to act with incomplete information.", correct: true,
            feedback: "Yes. Confidence comes from action — not the other way around. Financial runway buys you the courage." },
          { text: "An MBA and family support." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Self-honesty check",
      exercise: {
        kind: "free-text",
        prompt:
          "Three honest answers: (1) Do you have a 6–12 month emergency fund? (2) Are you OK deciding without certainty? (3) Side-project, full-time, or hybrid — what's your transition strategy?",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "You don't need to feel ready",
      body:
        "An entrepreneur is not someone with all the answers. It's someone with the courage to ask the right questions and act — even in doubt, even in difficulty.",
    },
  ],
};

const M11: ModuleContent = {
  moduleId: "m11-afc",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Numbers are your compass, not paperwork",
      body:
        "AFC (Administration, Finance & Control) is the operating system that keeps your startup honest. Not optional — even at one founder, one customer.",
      citation: "Module 11 — Administration, Finance and Control",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Why AFC matters from day one",
      body:
        "1) Cash flow + runway: how many months you have left. 2) Prevention: missing receipts and untracked bank movements become real problems quickly. 3) Smarter decisions: do we invest in marketing or product? Without numbers it's instinct. 4) Investor trust: nobody invests in a company that can't account for itself.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Lightweight AFC system",
      body:
        "Step 1: assess current state (how do you record income/expenses?). Step 2: standardize (one shared file, monthly review date, separate business account, expense-approval threshold). Step 3: technology (Wave, Xero, QuickBooks, Reviso for accounting; Notion/Sheets for budgeting; Stripe/PayPal for traceable payments). Step 4: monthly internal audit.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "What's the single most useful AFC habit at idea stage?",
        options: [
          { text: "Hire a CFO." },
          { text: "Maintain a separate business account + monthly cash review.", correct: true,
            feedback: "Right. The simple habit that catches almost every problem early." },
          { text: "Buy enterprise accounting software." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Build your runway sheet",
      exercise: {
        kind: "free-text",
        prompt:
          "Calculate: cash on hand. Average monthly burn. Runway = cash ÷ burn. If runway < 6 months, what are 3 ways to extend it (cut, raise, sell)?",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "A startup that controls its numbers controls its destiny",
      body:
        "Don't wait for complexity to force AFC on you. Start lean, measure monthly, scale the system as the company scales.",
    },
  ],
};

const M12: ModuleContent = {
  moduleId: "m12-ai-for-startups",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "AI is a force multiplier",
      body:
        "AI doesn't replace vision, courage, or understanding of people. But it can amplify all three — letting a solo founder accomplish what used to need a team.",
      citation: "Module 12 — AI for Startups",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Six leverage points for AI in early-stage startups",
      body:
        "1) Validate & refine ideas (ChatGPT, Claude for assisted brainstorming). 2) Build identity & brand (Canva AI, Midjourney). 3) Develop MVPs without a CTO (Bubble, Webflow, Builder.ai). 4) Marketing without a team (Jasper, Copy.ai). 5) Collect & analyze feedback (Typeform + GPT, sentiment tools). 6) Stay organized & automate (Notion AI, Zapier + GPT).",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Smart usage rules",
      body:
        "Don't chase novelty — focus on value. Experiment, but measure results. Maintain human control: AI suggests, you decide. Document what you use and what worked. Verify outputs against real data before acting on them.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "An AI tool generates a 'market analysis' showing your idea has €5B TAM. Best response?",
        options: [
          { text: "Put it in your pitch deck — investors love AI-generated insights." },
          { text: "Use it as a starting point but verify with real sources before relying on it.", correct: true,
            feedback: "Right. AI is great for first drafts and structure — terrible if you trust outputs uncritically." },
          { text: "Ignore it; AI can't analyze markets." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "AI workflow audit",
      exercise: {
        kind: "free-text",
        prompt:
          "Pick 3 recurring tasks you do this week (writing, research, customer follow-up). For each: which AI tool could speed it up by ≥50%? Try one this week.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "A virtual team, on call",
      body:
        "AI is the always-available teammate that lets a one-founder startup punch above its weight — if you treat it as a partner, not an oracle.",
    },
  ],
};

// =============================================================================
// IRL 5 — Marketing modules (32, 33, 34) added to fill the section
// =============================================================================

const M32: ModuleContent = {
  moduleId: "m32-marketing-branding",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Marketing is a bridge, not a megaphone",
      body:
        "Marketing connects what your startup does to those who truly need it. It's not about pushing offers — it's about listening, understanding, and building trust over time.",
      citation: "Module 32 — Marketing & Branding",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Value proposition before everything",
      body:
        "Why should someone choose you, right now? Answer: who's the ideal customer, what need you solve, what's the key benefit, what makes you different. A clear value proposition is the foundation; without it, every marketing tactic dilutes.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Brand identity isn't optional",
      body:
        "Brand is what you convey even when you say nothing. Define values, personality, tone of voice, visual elements (colors, font, language). Even with simple tools (Canva, Notion), maintain consistency across communications. A mini brand guide saves hours every week.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Strongest marketing approach for an early-stage startup?",
        options: [
          { text: "Pay for ads everywhere to maximize visibility." },
          { text: "Pick 1–2 channels, define the message clearly, measure results, iterate.", correct: true,
            feedback: "Yes — focus and measurement beat reach for an early-stage budget." },
          { text: "Wait until the product is finished, then market." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Refine your value proposition",
      exercise: {
        kind: "value-prop",
        prompt:
          "Write yours: 'We help [TARGET] who [PROBLEM] by [SOLUTION], unlike [ALTERNATIVES] because [DIFFERENTIATOR].' Read it aloud. Is it specific?",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Marketing built into the product",
      body:
        "Don't do marketing 'after' building — it's what helps the product get understood, chosen, and recommended. Without marketing, innovation stays invisible.",
    },
  ],
};

const M33: ModuleContent = {
  moduleId: "m33-editorial-plan",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Social isn't a megaphone — it's a conversation",
      body:
        "An editorial plan turns sporadic posting into a strategic, measurable activity. Decide what you publish, to whom, with what objective, and on which channels.",
      citation: "Module 33 — Editorial Plan & Social Media",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "The Digital Editorial Plan (DEP) framework",
      body:
        "Audience (who you're addressing). Topics (what you communicate). Objectives (visibility, leads, sales, trust). Tone & format. Channels. Frequency & calendar. Plus fixed content formats (rubrics): 'Tip of the week', 'Customer story', 'Behind the scenes' give continuity.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Match channels to your business",
      body:
        "LinkedIn: B2B, consulting, services. Instagram: visual products, craft, fashion, food. Facebook: still useful for local/community. TikTok / YouTube: only if you have time AND content. Better to manage 1–2 channels well than five poorly.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "How many posts per week are sufficient for an early-stage startup?",
        options: [
          { text: "10+ — quantity wins on social." },
          { text: "2–3 well-crafted posts beats 10 mediocre ones.", correct: true,
            feedback: "Yes. Consistency + quality > volume. Measure engagement, not output." },
          { text: "1 per month is enough." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Plan one month",
      exercise: {
        kind: "free-text",
        prompt:
          "List 8 posts for the next 4 weeks (2/week). For each: topic, format, channel, call-to-action. You don't need 30 posts — 8 well-chosen ones beat that.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Storytelling across all channels",
      body:
        "Tell the story behind the project: how the idea was born, the team, the impact. Storytelling humanizes the brand and builds emotional connection — even at 0 followers.",
    },
  ],
};

const M34: ModuleContent = {
  moduleId: "m34-abm",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Sell less, but better",
      body:
        "Account-Based Marketing reverses the funnel: instead of speaking to many, speak to a few selected targets with highly personalized messaging. Especially powerful in B2B.",
      citation: "Module 34 — Account-Based Marketing",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "When ABM makes sense",
      body:
        "High value per customer. B2B with complex decision processes. Limited market (e.g., medium-large companies in a specific sector). Need to break through skepticism toward innovation. Consultative (not transactional) sales approach.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "The ABM process",
      body:
        "1) Identify strategic accounts (5–20 max). 2) Research them deeply (decision makers, pains, channels). 3) Personalize content (custom landing pages, decks, demos for each). 4) Activate via the right channels (LinkedIn, events, warm intros). 5) Measure interactions (responses, meetings, pipeline).",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "ABM 'success' metric for a 10-account campaign?",
        options: [
          { text: "100,000 impressions." },
          { text: "3–5 qualified meetings + 1 paid pilot.", correct: true,
            feedback: "Right. ABM trades reach for depth — measure meetings and pipeline, not vanity metrics." },
          { text: "1,000 LinkedIn followers." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Build your account list",
      exercise: {
        kind: "free-text",
        prompt:
          "List 10 specific companies that fit your ideal customer. For each: 1 contact name, 1 pain you can address, 1 next step (LinkedIn message, intro request, event).",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "More relationships, less dispersion",
      body:
        "ABM helps you be relevant to a few instead of invisible to many. One well-built relationship can be worth more than a hundred cold contacts.",
    },
  ],
};

// =============================================================================
// IRL 6 — Revenue model (Modules 35–40)
// =============================================================================

const M35: ModuleContent = {
  moduleId: "m35-financial-model",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Numbers are a compass",
      body:
        "A financial model isn't bureaucracy — it's the operational translation of vision. It tells you whether the idea is sustainable, when cash runs out, and which lever moves the business.",
      citation: "Module 35 — Financial Model",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "What to build at this stage",
      body:
        "Forget full balance sheets and balance-sheet-quality outputs. Build a forecast income statement (revenues, costs, margins, P&L) plus a simple cash-flow projection (when money comes in vs goes out). Together they answer: are you generating or burning cash, and how much runway is left?",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "7 steps to build it",
      body:
        "1) Define the model's objective. 2) Pick key KPIs (customers, average deal, conversion, variable cost). 3) Structure assumptions, revenues, costs, cash flow. 4) Start from revenues then work back to costs. 5) Don't forget hidden costs (legal, hosting, banking). 6) Model cash flow carefully (collection times). 7) Make formulas flexible — test best/worst/realistic scenarios.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "You sell with 60-day payment terms. How does this affect the model?",
        options: [
          { text: "Doesn't matter — revenue is revenue." },
          { text: "P&L looks healthy but cash flow lags 2 months — possible cash gap.", correct: true,
            feedback: "Exactly. Profit and cash are different. Many startups die profitable but illiquid." },
          { text: "Investors don't care about cash flow at this stage." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Build your minimal model",
      exercise: {
        kind: "free-text",
        prompt:
          "In a Google Sheet: 12 monthly columns. Rows for revenues (by source), costs (fixed + variable), margin, and cumulative cash. Compute when (if) you cross break-even.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Understanding numbers makes you free",
      body:
        "You don't need to be a CFO. Build a simple model, update it monthly, share it with the team. Investors don't expect precision — they expect realism, logic, and consistency.",
    },
  ],
};

const M36: ModuleContent = {
  moduleId: "m36-scalability",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Existing vs growing",
      body:
        "Scalability is what separates a startup from a small business. It's the ability to grow revenues without growing costs at the same rate.",
      citation: "Module 36 — Scalability",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Four kinds of scalability",
      body:
        "1) Revenue scalability: more customers, markets, products — up-sell, cross-sell. 2) Operational: handle more orders/users without linear cost. 3) Technological: infrastructure that handles increased traffic, data, users. 4) Organizational: structures and processes ready for new people.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Design for growth from the start",
      body:
        "Replicable business model (subscriptions, licenses, digital channels). Standardizable processes (document, automate, delegate). Modular technology (expandable, integrable). Traceable customer journey. Even at 5 customers, you can already test how to handle 500.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Healthiest scalability indicator at IRL 6?",
        options: [
          { text: "Revenue growing 10× while costs grow 9×." },
          { text: "Revenue growing 3× while costs grow 1.5×.", correct: true,
            feedback: "Right. The point of scalability is widening margins, not just bigger numbers." },
          { text: "Hiring 50 people." },
        ],
      },
    },
    {
      id: "concept-3",
      kind: "concept",
      title: "Beware of false growth",
      body:
        "Costs growing faster than revenues. Quality dropping at scale. Loss of control over teams or processes. Rising churn. Scaling badly is worse than not scaling at all.",
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Stress-test your model",
      exercise: {
        kind: "free-text",
        prompt:
          "Imagine 10× more customers next year. What breaks first — operations, tech, team, cash? Which 1 thing would you fix now to prepare?",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Scalability is a choice",
      body:
        "Not all startups will succeed in scaling — but all can prepare for it. Plan present-day decisions with the future in mind, even if growth is still small.",
    },
  ],
};

const M37: ModuleContent = {
  moduleId: "m37-management-control",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Control as strategy, not bureaucracy",
      body:
        "Management control means monitoring economic performance, comparing it to objectives, and adjusting course. It's how you turn numbers into decisions.",
      citation: "Module 37 — Management Control",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Five elements you need",
      body:
        "1) Budget + forecast (annual or quarterly, periodically updated). 2) Cost monitoring (variable, fixed, strategic). 3) Revenue monitoring (by source). 4) Variance analysis (budget vs actual). 5) KPIs and a simple dashboard updated monthly.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Variance analysis is your secret weapon",
      body:
        "Compare what you planned vs what happened. Where the gap is biggest, your assumptions were weakest. The point isn't blame — it's learning. Variance is information.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Your marketing budget was €1,000; you spent €2,500 and got 3 customers. What's the right reaction?",
        options: [
          { text: "Cut marketing immediately." },
          { text: "Analyze: was the overspend ROI-positive? If yes, increase budget; if no, find what worked.", correct: true,
            feedback: "Right. Variance triggers analysis, not reflex. Look at unit economics before reacting." },
          { text: "Ignore — you got customers." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Build a 1-page dashboard",
      exercise: {
        kind: "free-text",
        prompt:
          "Pick 5 KPIs: 2 financial (revenue, burn), 2 operational (CAC, churn), 1 leading indicator (e.g., trial signups). Set monthly targets. Review every Friday.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Measure to decide better",
      body:
        "You don't need fancy software. Start small: a budget, a file with revenues and costs, a monthly update. Numbers used right are tools to guide decisions.",
    },
  ],
};

const M38: ModuleContent = {
  moduleId: "m38-crm",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Real value lives in relationships",
      body:
        "A satisfied customer can return, recommend, become an ambassador. An ignored one leaves silently. CRM isn't software — it's the system to manage every customer as an asset to nurture.",
      citation: "Module 38 — CRM",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Why even 5 customers need a CRM",
      body:
        "Without one: data scattered across emails, WhatsApp, Excel, founder's head. Works at 5 customers, breaks at 50. With one: avoid losing leads, understand who your best customers are, track every interaction, automate follow-ups.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Set up a lightweight CRM",
      body:
        "1) Map all touchpoints (forms, emails, social, events). 2) Centralized database (Sheets, Notion, Airtable, HubSpot Free). 3) Define a relationship funnel (awareness → interest → evaluation → purchase → retention). 4) Plan personalized communication. 5) Integrate marketing, sales, support so everyone sees the same data.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Best first CRM for a 1-month-old startup?",
        options: [
          { text: "Salesforce — go big from day one." },
          { text: "A Google Sheet with name, channel, status, next-action columns.", correct: true,
            feedback: "Right. Pick the simplest tool you'll actually keep updated. Upgrade when pain demands it." },
          { text: "No CRM — keep it in your head." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Build it today",
      exercise: {
        kind: "free-text",
        prompt:
          "List your last 10 customer conversations. For each: name, channel, status, next action, date. That's your CRM v0.1 — keep updating it weekly.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Without relationships, no customer lasts",
      body:
        "CRM isn't for managing complexity — it's for cultivating value. Even the most scalable startup needs people who choose its product, use it, and recommend it.",
    },
  ],
};

const M39: ModuleContent = {
  moduleId: "m39-business-plan",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Why everyone talks about it, few use it well",
      body:
        "A business plan isn't a formal obligation — it's a tool to think, plan, and communicate. It's most useful when grants, banks, or investors require it.",
      citation: "Module 39 — Business Plan",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "The 8 essential sections",
      body:
        "1) Executive Summary (read first, written last). 2) Context & problem analysis. 3) Value proposition & business model (BMC). 4) Target market & marketing strategy. 5) Operational plan (team, milestones, roadmap). 6) Economic-financial plan (3 docs: forecast P&L, investments, cash flow). 7) Team & governance. 8) Growth strategy (2–5 years).",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "When NOT to write one",
      body:
        "If you're still exploring and don't know your customer. If your product hasn't been tested. If you're writing it 'to look good' and will never reread it. In those cases, use lighter tools first: BMC, Lean Canvas, hypothesis log.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Investor asks for your business plan. What matters most?",
        options: [
          { text: "Polished design and 50+ pages." },
          { text: "Clarity, realistic assumptions, consistency between sections.", correct: true,
            feedback: "Right. Investors want to see your thinking — not just numbers." },
          { text: "Optimistic 5-year hockey-stick projections." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Draft the executive summary",
      exercise: {
        kind: "free-text",
        prompt:
          "Write a 1-page executive summary: who you are, what problem you solve, your solution, market, business model, team, traction so far, what you need (€, partners, customers).",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Useful only if you use it",
      body:
        "A business plan's value isn't in the format — it's in helping you think clearly, communicate the idea, and make better decisions. Update it as your project evolves.",
    },
  ],
};

const M40: ModuleContent = {
  moduleId: "m40-recruiting",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "People before processes",
      body:
        "No startup grows without a team. Hiring isn't a routine — it's a strategic lever including roles, methods, culture, and the ability to attract and retain.",
      citation: "Module 40 — Recruiting & People Management",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Who to hire first",
      body:
        "Flexible self-starters who can cover multiple areas. Motivated by the vision, not just salary. Proactive (no defined processes yet). Quick learners. Better a 'broad' profile (deep in 2–3 areas) than a 'generalist' (superficial in many) or a hyper-specialist who doesn't fit a fluid environment.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "When and how to hire",
      body:
        "When: a clear recurring need nobody covers, sustained workload increase, missing critical skills. How: clarify the profile, search through right channels (network, LinkedIn, universities), prefer practical tests over CV review. Alternatives to direct hires: freelancers, training internships, part-time, outsourcing.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Founder is overwhelmed and considers hiring. Best first move?",
        options: [
          { text: "Hire the most experienced senior available." },
          { text: "Map recurring tasks → outsource non-core → hire a junior with growth potential for the rest.", correct: true,
            feedback: "Right. Free time first via outsourcing, then add headcount where it actually compounds." },
          { text: "Hire 3 people at once." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Define your next hire",
      exercise: {
        kind: "free-text",
        prompt:
          "Job profile in 10 lines: title, mission, top 3 responsibilities, must-have skills, nice-to-haves, salary range, contract type, what 'success' looks like in 6 months.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "The team is the real growth multiplier",
      body:
        "People are the most important asset — to execute, think, react, and build the project's future. Recruiting and people management are core competencies, not functions to outsource.",
    },
  ],
};

// =============================================================================
// IRL 7 — High-fidelity MVP, fundraising, ESG (Modules 41–45)
// =============================================================================

const M41: ModuleContent = {
  moduleId: "m41-industrial-plan",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "From validated idea to industrial reality",
      body:
        "An industrial plan transforms an idea into a concrete, sustainable, scalable company. The bridge between vision and execution.",
      citation: "Module 41 — Industrial Plan",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Core sections",
      body:
        "Executive summary. Context & problem analysis (with real data). Value proposition & business model (BMC). Market & marketing strategy (target, channels, KPIs). Operational plan (quarterly roadmap with milestones). Economic-financial plan (forecast P&L + investments + cash flow). Team & governance. Growth strategy.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Best practices",
      body:
        "Involve customers from the beginning (test with a small group). Don't seek perfection — concrete and actionable beats theoretical. Focus on a few clear 12-month objectives. Review every 6 months in evolving markets. Validate assumptions with sources.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Difference between a business plan and an industrial plan?",
        options: [
          { text: "Same thing — different word." },
          { text: "Industrial plan adds depth on operations, supply chain, scalability roadmap.", correct: true,
            feedback: "Right. Industrial = how you actually produce + deliver at scale, not just what you sell." },
          { text: "Industrial plans are only for manufacturing." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Sketch your roadmap",
      exercise: {
        kind: "free-text",
        prompt:
          "Build a 4-quarter operational roadmap. For each quarter: 3 milestones, key resources required, success metric.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "An ally, not a requirement",
      body:
        "A clear industrial plan builds trust with partners, investors, and customers. It's the first step in showing your project deserves their commitment.",
    },
  ],
};

const M42: ModuleContent = {
  moduleId: "m42-fundraising",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Fundraising is more than money",
      body:
        "It's a strategic process defining the relationship between your startup and its ecosystem. The way you seek capital determines the partners you'll have and the company you'll build.",
      citation: "Module 42 — Fundraising Strategies",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Match capital to stage",
      body:
        "Pre-seed: bootstrapping, FFF, micro-grants. Seed: business angels, equity crowdfunding, small VC, accelerators. Series A/B/C: VC funds, sector funds, corporate venture. Growth/Exit: large funds, IPO, M&A. Wrong-stage capital is harder to manage than no capital.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "The 8-step fundraising process",
      body:
        "1) Define objectives & need amount (tied to a milestone). 2) Build the business plan. 3) Prepare a 10–15 slide pitch deck. 4) Map potential investors (right thesis, sector, stage). 5) Train your storytelling (elevator pitch + meeting + public pitch). 6) Manage the negotiation (valuation, clauses, governance). 7) Use the funds with discipline. 8) Nurture investor relationships post-close.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "When should you start fundraising?",
        options: [
          { text: "When you've run out of money." },
          { text: "6 months before you need it — fundraising takes time and investor relationships compound.", correct: true,
            feedback: "Yes. Closing rounds in panic is how founders get terrible terms." },
          { text: "Never; bootstrapping is the only honorable path." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Map 10 investors",
      exercise: {
        kind: "free-text",
        prompt:
          "Identify 10 potential investors aligned with your stage and sector. For each: name, thesis, average ticket, notable portfolio, warmest path to introduction.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Capital follows clarity",
      body:
        "Even startups in traditional sectors can raise capital — if they communicate clearly, position credibly, and build a believable narrative. Resources exist; identify them with awareness and strategy.",
    },
  ],
};

const M43: ModuleContent = {
  moduleId: "m43-crowdfunding",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Crowdfunding raises capital AND validates demand",
      body:
        "Funding from many small contributors via online platforms — in exchange for symbolic, economic, or participatory return. More than a financing mechanism: it tests your market.",
      citation: "Module 43 — Crowdfunding",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Four types",
      body:
        "Reward-based (Kickstarter, Indiegogo, Produzioni dal Basso): supporters get a return — ideal for tangible products. Equity (Mamacrowd, CrowdFundMe, Opstart): investors buy equity — for scalable startups. Donation (GoFundMe, Rete del Dono): pure social/territorial impact. Lending (Prestiamoci, BorsadelCredito): peer loans with interest.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "When crowdfunding fits",
      body:
        "Product easy to understand and tell. Strong values or social component. You want to validate before scaling. You want to build a community. You have time and people to actively manage a campaign — it doesn't run itself.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Why do most crowdfunding campaigns fail?",
        options: [
          { text: "Bad luck." },
          { text: "Founders launch with no community pre-warmed; the first 30–40% must be locked before going public.", correct: true,
            feedback: "Right. Campaigns are won in the pre-launch month, not after going live." },
          { text: "Wrong platform." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Plan your campaign",
      exercise: {
        kind: "free-text",
        prompt:
          "If you ran a 30-day campaign next month: target amount, type, platform, top 3 reward tiers, list of 50 people to contact pre-launch.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "More than a financing tool",
      body:
        "A well-structured campaign improves project awareness, strengthens customer relationships, and validates real market response — beyond the money raised.",
    },
  ],
};

const M44: ModuleContent = {
  moduleId: "m44-wfe-stock-options",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Equity as compensation",
      body:
        "When cash is short and skills are critical, Work for Equity and stock options let you attract and retain key people — even without immediate liquidity.",
      citation: "Module 44 — Work for Equity & Stock Options",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Work for Equity (WFE)",
      body:
        "A collaborator or co-founder is compensated with company shares instead of (or alongside) money. Useful in early stage when you need critical skills you can't otherwise afford. In Italy, mainly available to innovative startups (capital companies, formal contracts, declared share value).",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Stock options",
      body:
        "The right to buy shares in the future at a predetermined (favorable) strike price. Key elements: vesting period (typical: 4 years with 1-year cliff), strike price (current valuation), milestones (optional). Different from WFE: you don't immediately receive shares, you earn the right.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "You give a developer 5% WFE for 6 months of work. Risk?",
        options: [
          { text: "None — equity costs you nothing." },
          { text: "If unvested or undocumented, conflict and dilution at the next round are likely.", correct: true,
            feedback: "Yes. Always use a written contract with vesting + clear conditions. 5% is also a lot — value the work first." },
          { text: "Only legal cost." },
        ],
      },
    },
    {
      id: "concept-3",
      kind: "concept",
      title: "How to structure WFE",
      body:
        "Estimate startup valuation. Determine the work's market value. Set a percentage proportionate to actual contribution (small but meaningful). Draft a clear contract (role, duration, value, conditions). Align expectations openly on risks, governance, time horizons.",
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Draft a WFE proposal",
      exercise: {
        kind: "free-text",
        prompt:
          "If you offered WFE to one critical role: what role, how many months, what % equity, what milestones unlock vesting, what happens if they leave early?",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "More than payment — alignment",
      body:
        "WFE and stock options aren't compensation alternatives. They're tools to build motivated teams, recognize work value, and grow the project together with shared upside.",
    },
  ],
};

const M45: ModuleContent = {
  moduleId: "m45-esg",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "ESG as a strategic lever",
      body:
        "Environmental, Social, Governance criteria are no longer just CSR. They're a real opportunity to build resilient startups attractive to investors, customers, and talent.",
      citation: "Module 45 — ESG",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Three dimensions",
      body:
        "Environmental: resource management, environmental impact reduction, conscious energy use, waste, carbon footprint. Social: relationships with collaborators, customers, communities, inclusion, well-being. Governance: transparency, ethics, organizational structure, risk management, stakeholder engagement.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "How to start at idea stage",
      body:
        "Assess current and potential impact. Define micro-objectives (10% energy consumption reduction, code of ethics public on website, monthly inclusion check). Maintain consistency between declared values and actions — communicate hiring, supplier choices, and decisions through that lens.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "When does ESG become a competitive advantage rather than overhead?",
        options: [
          { text: "Only at IPO stage." },
          { text: "When integrated into the business model and communicated authentically to customers/investors who care.", correct: true,
            feedback: "Right. ESG creates value when it's lived, not when it's a marketing veneer." },
          { text: "Never — it's only a cost." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "ESG mini-audit",
      exercise: {
        kind: "checklist",
        prompt:
          "Pick one initiative for each: Environmental (e.g., remote-first to cut travel), Social (e.g., flexible hours), Governance (e.g., advisory board). Commit to one of the three this quarter.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Conscious AND competitive",
      body:
        "Sustainability isn't a finish line — it's a process of small concrete steps. Startups that begin today with ESG attention will be the most solid, credible, and attractive in the medium term.",
    },
  ],
};

// =============================================================================
// IRL 8 — Pitch, Company Formation, Accounting, Public Calls (Modules 46–49)
// =============================================================================

const M46: ModuleContent = {
  moduleId: "m46-pitch",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "The pitch is where vision meets others",
      body:
        "Whether you're talking to an investor, partner, jury, or customer, the goal is the same: make people understand in a few minutes why your startup deserves attention, trust, and resources.",
      citation: "Module 46 — Pitch",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Three pitch formats",
      body:
        "Elevator Pitch: 30s–2min, oral, in informal settings — spark interest. Pitch Deck: 10–15 visual slides for formal meetings or competitions. Investor Deck: more detailed and technical — sent after a positive meeting.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Pitch deck structure (10 slides)",
      body:
        "1) Initial hook (data, story, statement). 2) The problem. 3) The solution. 4) Social proof / validation. 5) Anticipated objections. 6) The market. 7) Business model. 8) Strategy & roadmap. 9) Team. 10) Call to action (what you ask: investment, partner, pilot customers).",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Best opening for an investor pitch?",
        options: [
          { text: "Detailed company history starting from inception." },
          { text: "A striking data point or short story that makes the problem visceral.", correct: true,
            feedback: "Yes — investors decide whether to listen in the first 30 seconds. Lead with hook, not biography." },
          { text: "A long disclaimer." },
        ],
      },
    },
    {
      id: "concept-3",
      kind: "concept",
      title: "Effective pitch principles",
      body:
        "Simplicity (one slide = one idea). Visual clarity (readable fonts, strong contrast). Concreteness (numbers, facts, customers — not vague claims). Authenticity (no buzzwords if you're not deep-tech). Customization (investor wants returns; accelerator wants team & scalability; customer wants value).",
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Build your 10-slide outline",
      exercise: {
        kind: "free-text",
        prompt:
          "Outline your 10 slides — one sentence per slide. Then summarize all 10 in a single 60-second elevator pitch.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Pitch is not a performance",
      body:
        "It's the moment your vision takes shape in front of others. Train voice and body language, prepare 30s/3min/10min versions, ask for feedback, revise after every important presentation.",
    },
  ],
};

const M47: ModuleContent = {
  moduleId: "m47-company-formation",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "When idea becomes legal entity",
      body:
        "Establishing a startup means moving from planning to action: invoicing, hiring, signing contracts, accessing public calls, attracting investments. Don't open too early — but don't wait too long.",
      citation: "Module 47 — Company Formation",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Signs you're ready",
      body:
        "Idea validated. First customer or commercial channel ready. Cohesive team. Need to issue invoices or sign formal contracts. Plan to apply for public calls or grants requiring a VAT. Found an investor or partner ready to fund.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "6-step formation process",
      body:
        "1) Define team & partners (informal agreement first, formal later). 2) Choose name, business purpose, registered office. 3) Draft statute & incorporation deed. 4) Notarial deed (or online for innovative startups). 5) Open VAT, INPS/INAIL, Chamber of Commerce. 6) Optional: register in innovative startup section for benefits.",
    },
    {
      id: "concept-3",
      kind: "concept",
      title: "Costs roughly",
      body:
        "S.r.l.s.: capital €1–9,999, free notary, €200–400 fees. Ordinary S.r.l.: capital from €10k (partly paid), notary €1,200–2,500, accountant from €1,000/year. Online innovative startup S.r.l.: free registration with digital signature + PEC.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Most common mistake at incorporation?",
        options: [
          { text: "Choosing the wrong notary." },
          { text: "Using a generic copy-paste statute that creates rigidity for future investors.", correct: true,
            feedback: "Right. Statute clauses on share transfers, anti-dilution, vesting, drag-along matter for years." },
          { text: "Filing too late." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Pre-formation checklist",
      exercise: {
        kind: "checklist",
        prompt:
          "Before incorporating: signed founders' agreement · cap table · clear roles · registered office secured · accountant lined up · choice of innovative-startup status decided. Anything missing?",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "The right structure is a foundation",
      body:
        "Whether you're launching tech or transforming a traditional business, the right legal structure is the foundation of growth. Get the first decision as right as you can.",
    },
  ],
};

const M48: ModuleContent = {
  moduleId: "m48-accounting",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Accounting as awareness, not paperwork",
      body:
        "Once you've established your startup, accounting becomes a real responsibility. It's not just 'issuing invoices' — it's keeping financial health under control, making better decisions, and avoiding penalties.",
      citation: "Module 48 — Accounting",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Two main regimes in Italy",
      body:
        "Flat-rate (sole proprietorships/professionals): 15% (5% first 5 years if eligible), no VAT, simplified. Up to €85k revenue. Pros: simple, low cost. Cons: costs not deductible, no equity, lower credibility. Ordinary accounting (S.r.l., S.r.l.s., innovative startups): full system. Invoices, VAT settlements, financial statements, IRES/IRAP/VAT taxes. Pros: structure for growth and investors. Cons: higher cost, more bureaucracy.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "First-month essentials",
      body:
        "Choose a startup-experienced accountant. Open VAT + ATECO code. Get a business bank account. Subscribe to electronic invoicing software. Get digital signature + PEC. Record all expenses (even pre-revenue). Build a monthly income/expense table.",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "You're pre-revenue with €2,000 of MVP development costs. What now?",
        options: [
          { text: "Don't track until you have income." },
          { text: "Record them as startup costs in your books — they reduce future tax base and prove you ran the project.", correct: true,
            feedback: "Right. Even pre-revenue, cost discipline is real management — and useful at fundraising time." },
          { text: "Pay personally and forget about it." },
        ],
      },
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Set up your first system",
      exercise: {
        kind: "free-text",
        prompt:
          "Pick: 1 invoicing tool. 1 expense-tracking tool. 1 monthly review date. Document your VAT cadence (monthly/quarterly). Share the system with your accountant.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Numbers, not paperwork",
      body:
        "Good accounting helps you make informed decisions, demonstrate solidity to partners and investors, and save time and money in the future. Start simple, build the habit early.",
    },
  ],
};

const M49: ModuleContent = {
  moduleId: "m49-public-calls",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Free money? Not quite — strategic capital, yes",
      body:
        "Public calls and incentives offered by local, national, or European institutions aren't 'free money'. They're an opportunity to test the project, finance early growth, or access strategic services.",
      citation: "Module 49 — Public Calls and Incentives",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "Where to find them",
      body:
        "Local: Regions, Municipalities, Chambers of Commerce — non-repayable contributions or vouchers. National: Invitalia (Smart&Start up to €1.5M for innovative startups, ON for youth/women, Voucher 3i for IP). European: EIC Accelerator (Horizon Europe), Erasmus for Young Entrepreneurs, Interreg. Local incubators/hubs: Call4Startup, pre-acceleration with services.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "How to read a call",
      body:
        "Eligible beneficiaries (S.r.l., innovative startup, informal teams). Eligible expenses (only investments? also personnel, consulting, marketing?). Type of contribution (grant, subsidized loan, voucher). Reporting timelines and advance conditions. Total allocation + win probability. Administrative workload (reporting, DURC, financial statements).",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Should you apply to every relevant call?",
        options: [
          { text: "Yes — more shots, better chances." },
          { text: "No — only those where eligible costs match real plans, and you have time to do it well.", correct: true,
            feedback: "Right. Bad applications waste weeks. Pick 1–2 per quarter and ace them." },
          { text: "Never — they take too long." },
        ],
      },
    },
    {
      id: "concept-3",
      kind: "concept",
      title: "Effective application — 5 steps",
      body:
        "1) Read the call carefully (download and highlight). 2) Prepare dossier (Chamber registration, business plan, quotes, CVs, declarations). 3) Write a clear, coherent project (context, objectives, activities, timeline, budget, results). 4) Take care of presentation. 5) Ask for support (accountant, association, incubator).",
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Identify 1 call this quarter",
      exercise: {
        kind: "free-text",
        prompt:
          "Find 1 active call that fits your stage and sector. Map: eligibility, deadline, max funding, eligible expenses, required documents, your fit (1–10).",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "Strategic capital, not just money",
      body:
        "Used with intelligence and strategy, public calls become a real lever to start with greater strength and lower risk. Beyond money: structure, credibility, and access to networks.",
    },
  ],
};

// =============================================================================
// IRL 9 — Open Innovation (Module 50)
// =============================================================================

const M50: ModuleContent = {
  moduleId: "m50-open-innovation",
  beats: [
    {
      id: "intro",
      kind: "intro",
      title: "Innovate WITH others, not just by yourself",
      body:
        "Doing business today doesn't mean working alone in a garage. The ability to collaborate with external stakeholders has become a fundamental driver of innovation.",
      citation: "Module 50 — Open Innovation",
    },
    {
      id: "concept-1",
      kind: "concept",
      title: "What Open Innovation is",
      body:
        "A model where companies don't develop innovation exclusively internally but open to external contributions, collaborations, and co-creation. For startups: collaborations with corporations, open programs (hackathons, challenges, Call4Startup), product co-development, use of external tech/patents, knowledge or data exchange.",
    },
    {
      id: "concept-2",
      kind: "concept",
      title: "Four ways to engage",
      body:
        "1) Call4Startup & challenges (large companies launching public calls). 2) Hackathons & innovation contests (intensive 1–3 day events to solve concrete challenges). 3) Co-development / PoC (Proof of Concept — propose a low-risk pilot). 4) Corporate acceleration programs (Eni Joule, Terna Ideas, Bayer Grants4Apps, Enel Innovation Hub, TIM Open Innovation).",
    },
    {
      id: "check-1",
      kind: "check",
      title: "Quick check",
      quiz: {
        question: "Best first move toward Open Innovation for an early-stage startup?",
        options: [
          { text: "Cold email 50 corporates with your pitch deck." },
          { text: "Identify 1–2 corporates whose problem your solution addresses, and propose a small PoC.", correct: true,
            feedback: "Right. Targeted, value-based outreach beats spray-and-pray every time." },
          { text: "Wait until you're at scale." },
        ],
      },
    },
    {
      id: "concept-3",
      kind: "concept",
      title: "Best practices",
      body:
        "Study the partner before approaching (their strategy, language, priorities). Speak business language: impact, savings, results — not just tech. Ready clear materials. Ask questions before proposing. Protect IP (NDA when needed). Consider your own readiness — collaboration with structured players takes resources.",
    },
    {
      id: "exercise-1",
      kind: "exercise",
      title: "Map 5 OI opportunities",
      exercise: {
        kind: "free-text",
        prompt:
          "List 5 corporates / institutions where your solution could plug into a real problem of theirs. For each: 1 contact, 1 proposed PoC scope, 1 expected outcome.",
      },
    },
    {
      id: "outro",
      kind: "outro",
      title: "A bridge between startup and ecosystem",
      body:
        "Engaging in Open Innovation doesn't mean distorting your startup — it means strengthening the path through strategic alliances. Especially powerful in contexts where innovation isn't yet widespread.",
    },
  ],
};

// =============================================================================
// Registry
// =============================================================================

export const MODULE_CONTENT: Record<string, ModuleContent> = {
  // IRL 0
  "m1-what-is-startup": M1,
  "m2-trl-irl": M2,
  "m3-idea": M3,
  "m4-validation": M4,
  "m5-company-system": M5,
  "m6-funding-options": M6,
  "m7-patents-trademarks": M7,
  "m8-legal": M8,
  "m9-corporate-forms": M9,
  "m10-being-entrepreneur": M10,
  "m11-afc": M11,
  "m12-ai-for-startups": M12,
  // IRL 1
  "m13-defining-the-problem": M13,
  "m14-bmc": M14,
  "m15-cv-and-team": M15,
  "m16-experiments": M16,
  // IRL 2
  "m17-competitive-analysis": M17,
  "m18-positioning": M18,
  "m19-networking": M19,
  // IRL 3
  "m20-mission-vision": M20,
  "m21-market-analysis": M21,
  "m22-startup-tools": M22,
  "m23-project-management": M23,
  // IRL 4
  "m24-mvp": M24,
  "m25-customer-journey": M25,
  "m26-kpis": M26,
  "m27-first-customer": M27,
  // IRL 5
  "m28-ecosystem": M28,
  "m29-sales": M29,
  "m30-presence": M30,
  "m31-social-startups": M31,
  "m32-marketing-branding": M32,
  "m33-editorial-plan": M33,
  "m34-abm": M34,
  // IRL 6
  "m35-financial-model": M35,
  "m36-scalability": M36,
  "m37-management-control": M37,
  "m38-crm": M38,
  "m39-business-plan": M39,
  "m40-recruiting": M40,
  // IRL 7
  "m41-industrial-plan": M41,
  "m42-fundraising": M42,
  "m43-crowdfunding": M43,
  "m44-wfe-stock-options": M44,
  "m45-esg": M45,
  // IRL 8
  "m46-pitch": M46,
  "m47-company-formation": M47,
  "m48-accounting": M48,
  "m49-public-calls": M49,
  // IRL 9
  "m50-open-innovation": M50,
};

// Wire up video resources cited in the source PDF onto the relevant intro beat.
for (const moduleId of Object.keys(MODULE_VIDEOS)) {
  const c = MODULE_CONTENT[moduleId];
  if (c) attachVideoToIntro(c, moduleId);
}

export function getModuleContent(moduleId: string): ModuleContent | null {
  return MODULE_CONTENT[moduleId] ?? null;
}

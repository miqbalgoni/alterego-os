// Rich, PDF-faithful source material for the deep-dive composer.
// ~80% verbatim or close paraphrase from "Content Modules.pdf" (HIVE), ~20%
// structural framing for the visual catalog (diagrams, callout variants).
//
// The deep-dive composer reads this; it never invents content beyond what's
// here. Claude (when active) is given these sections as the source of truth.

import type { DiagramName } from "@/lib/a2ui/types";

export type ExtendedKind =
  | "callout-insight"
  | "callout-story"
  | "callout-warning"
  | "callout-protip"
  | "callout-quote"
  | "ordered-steps"
  | "principle-grid"
  | "comparison"
  | "stat"
  | "quote-card"
  | "diagram";

export interface ExtendedSection {
  id: string;
  title?: string;
  body?: string;
  kind: ExtendedKind;
  // For ordered-steps and principle-grid
  items?: { title: string; body?: string }[];
  // For comparison
  leftLabel?: string;
  rightLabel?: string;
  comparison?: { left: string; right: string }[];
  verdict?: string;
  // For stat
  stat?: { value: string; unit?: string; caption: string; source?: string };
  // For quote-card
  quote?: { quote: string; attribution?: string };
  // For diagram
  diagram?: DiagramName;
  diagramCaption?: string;
}

export interface ExtendedModule {
  moduleId: string;
  hook: string;       // 1-2 sentence atmospheric hero hook
  heroDiagram?: DiagramName;
  sections: ExtendedSection[];
}

// =============================================================================
// IRL 1
// =============================================================================

const M13: ExtendedModule = {
  moduleId: "m13-defining-the-problem",
  heroDiagram: "iceberg",
  hook:
    "Every business is born from a problem. Identifying the right one is what separates a valid idea from a sterile one — and it shapes every choice that comes after.",
  sections: [
    {
      id: "why-real",
      kind: "callout-insight",
      title: "Why a real problem matters",
      body:
        "Without a real need to address, there would be no reason for any startup to exist. Identifying the right problem determines the effectiveness of every subsequent step — from product development to marketing to dialogue with partners and investors. A good entrepreneur doesn't simply observe what doesn't work in the world: they immerse themselves in people's needs, listen, analyze, and turn them into the beating heart of their proposal.",
    },
    {
      id: "out-of-theory",
      kind: "callout-story",
      title: "Move beyond theory and meet people",
      body:
        "The most reliable source for understanding a problem is the person who actually experiences it. Beyond blogs and statistics, it's direct conversations that reveal the most interesting opportunities. Ask: how often does the problem occur? How much does it cost — in money, time, or stress? How much have they already tried? What's missing from existing solutions?",
    },
    {
      id: "prepare-interviews",
      kind: "ordered-steps",
      title: "Prepare exploratory interviews methodically",
      items: [
        { title: "Create a context of listening, not selling", body: "Your goal is to understand, not to propose solutions yet." },
        { title: "Define the hypothesis to verify", body: "Even broadly: 'Is there a group of people actively looking for an alternative?'" },
        { title: "Profile your typical customer", body: "Their day, their goals, their frustrations, their needs." },
        { title: "Organize the interview structure", body: "Introduction · problem exploration · deeper investigation · closing." },
        { title: "Test the script first", body: "Try it on friends or colleagues to verify clarity, flow, and duration." },
      ],
    },
    {
      id: "during-interview",
      kind: "principle-grid",
      title: "Conduct the interview with empathy and attention",
      items: [
        { title: "Leave room for the story", body: "Encourage storytelling and concrete experiences." },
        { title: "Ask open-ended questions", body: "Ask for examples and explore the 'why'." },
        { title: "Take note of what's non-verbal", body: "Sensations, behaviors, key words. Perfect transcripts aren't needed; clear traces are." },
        { title: "Work in pairs if possible", body: "One leads, one takes notes." },
        { title: "Don't guide the answers", body: "Resist the urge to confirm your assumptions." },
      ],
    },
    {
      id: "vague-vs-sharp",
      kind: "comparison",
      title: "Vague vs sharp problem statements",
      leftLabel: "Vague (don't ship)",
      rightLabel: "Sharp (ready to test)",
      comparison: [
        {
          left: "Small businesses struggle with digitalization.",
          right: "Micro-business owners in personal care lose appointments because they manage bookings manually and can't respond quickly enough.",
        },
        {
          left: "People want healthier food.",
          right: "Office workers in mid-sized cities spend €15+/day on lunch and want healthy options ready in under 30 minutes.",
        },
      ],
      verdict: "Specific, observable, testable, communicable. That's the bar.",
    },
    {
      id: "common-mistakes",
      kind: "principle-grid",
      title: "Common mistakes when defining the problem",
      items: [
        { title: "Falling in love with the solution too early", body: "If you focus on what you want to build, you force reality to fit your idea." },
        { title: "Confusing personal annoyance with a market problem", body: "A problem one person experiences is not automatically a scalable opportunity." },
        { title: "Asking leading questions", body: "If interviews are designed to receive confirmation, they lose value." },
        { title: "Remaining too generic", body: "Broad and abstract descriptions are difficult to turn into solutions." },
        { title: "Not documenting what emerges", body: "If conversations aren't captured and revisited, useful insights are lost." },
      ],
    },
    {
      id: "stat",
      kind: "stat",
      stat: {
        value: "5–20",
        unit: "interviews",
        caption: "is a good start. Patterns begin to outweigh noise around the 10th conversation.",
        source: "HIVE field research",
      },
    },
    {
      id: "quote",
      kind: "quote-card",
      quote: {
        quote: "Fall in love with the problem, not your solution.",
        attribution: "Module 13 — Defining the Problem",
      },
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Schedule three 20-minute calls this week with people who probably have this problem. Ask one open question and shut up. The clarity you gain will compound across every later decision.",
    },
  ],
};

const M14: ExtendedModule = {
  moduleId: "m14-bmc",
  heroDiagram: "compass",
  hook:
    "The Business Model Canvas is the operating core of your business — how value is created, delivered, and captured, on one page. Not a final document; a working tool you'll iterate as you learn.",
  sections: [
    {
      id: "core-question",
      kind: "callout-insight",
      title: "The central question",
      body:
        "How does your startup create, deliver, and capture value? The answer requires vision, but also great attention to practical aspects: who your customers are, what value you offer them, how you reach them, how you monetize, and with which resources, activities, and partnerships.",
    },
    {
      id: "five-questions",
      kind: "ordered-steps",
      title: "How to start building your model",
      items: [
        { title: "Reference market", body: "Who might need your offer? Use TAM, SAM, SOM to understand the actual potential." },
        { title: "Competition", body: "Who already tries to solve the same problem? How can you stand out through approach, positioning, or cost structure?" },
        { title: "Target customer", body: "Who are the ideal users? What are their needs, habits, and expectations?" },
        { title: "Revenue streams", body: "Direct sales? Subscription? Commission? Effective models often integrate multiple sources." },
        { title: "Value proposition", body: "What benefit will customers actually pay for? Solve a real problem, better than the alternatives." },
      ],
    },
    {
      id: "nine-blocks",
      kind: "principle-grid",
      title: "The 9 blocks of the Business Model Canvas",
      items: [
        { title: "Customer Segments", body: "Who are your main customers? Identify different segments and their specific needs." },
        { title: "Value Propositions", body: "What problem do you solve? What benefit do you offer? Concentrated value for the customer." },
        { title: "Channels", body: "Direct sales, e-commerce, partners, social, events — every channel has a different model impact." },
        { title: "Customer Relationships", body: "Automated or personalized? Do you have a plan for post-sales support?" },
        { title: "Revenue Streams", body: "One-off sales, subscriptions, commissions, advertising — each linked to a segment + value prop." },
        { title: "Key Resources", body: "Essential assets: technological, human, intellectual, or financial." },
        { title: "Key Activities", body: "The most important actions for creating, delivering, and operating value." },
        { title: "Key Partners", body: "External actors: suppliers, distributors, consultants, third-party tech." },
        { title: "Cost Structure", body: "Most relevant spending. Fixed vs variable. Sustainability over time." },
      ],
    },
    {
      id: "common-models",
      kind: "principle-grid",
      title: "Common business models",
      items: [
        { title: "Transactional", body: "Classic direct sales: pay → receive product/service." },
        { title: "Marketplace", body: "Connect two actors and retain a commission per transaction." },
        { title: "SaaS", body: "User pays a subscription to use software or a digital service." },
        { title: "Freemium", body: "Free core product + paid advanced version." },
        { title: "Pay-as-you-go", body: "Customer pays based on actual usage." },
        { title: "Community-based", body: "A network of loyal users who pay to be part of it." },
      ],
    },
    {
      id: "right-side-first",
      kind: "callout-protip",
      title: "Start from the right side",
      body:
        "The right side of the canvas (customers, value, channels, relationships, revenue) is what the customer sees. Get this right first. The left side (resources, activities, partners, costs) is how you deliver — figure it out after you know the value proposition is real.",
    },
    {
      id: "stat",
      kind: "stat",
      stat: {
        value: "9",
        unit: "blocks",
        caption: "are all hypotheses until you have evidence behind each one.",
      },
    },
    {
      id: "quote",
      kind: "quote-card",
      quote: {
        quote: "If you can't put your business on one page, you don't understand it yet.",
        attribution: "Alexander Osterwalder, Business Model Generation",
      },
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Fill the right side of YOUR BMC in 15 minutes. Don't optimize. The blocks where you struggle most are tomorrow's experiments — those are your weakest hypotheses.",
    },
  ],
};

const M15: ExtendedModule = {
  moduleId: "m15-cv-and-team",
  heroDiagram: "bridge",
  hook:
    "No startup is born ready. But some start with a decisive competitive advantage: the right team. Investors invest in people, not slides — ideas pivot, teams persist.",
  sections: [
    {
      id: "why-team",
      kind: "callout-insight",
      title: "Why team matters more than idea",
      body:
        "A startup is not a structured company; it's an evolving organism. Decisions are fast, resources are limited, and challenges arise daily. The group of people leading the project has an enormous impact on its ability to adapt, learn, and grow. A weak idea with a strong team often wins; a great idea with the wrong team almost always loses.",
    },
    {
      id: "five-practices",
      kind: "ordered-steps",
      title: "Five good practices for building an effective team",
      items: [
        { title: "Look for autonomous people with cross-functional skills", body: "Self-starters who can move across multiple areas — flexibility, speed, autonomy." },
        { title: "Prioritize diversity, but share values", body: "Different skills are an asset only if the group shares a common vision." },
        { title: "Make roles flexible and adaptable over time", body: "Responsibilities evolve. A 'developer' might emerge as the team's coordinator." },
        { title: "Don't hire if you can outsource", body: "Some activities require an internal hire; many can be entrusted to consultants or external providers." },
        { title: "Keep the structure light", body: "Plan team growth around objectives, available resources, and real business evolution — not assumptions." },
      ],
    },
    {
      id: "co-founder",
      kind: "callout-story",
      title: "Finding (or not finding) a co-founder",
      body:
        "Not all startups need more than one founder, but in many cases having a co-founder strengthens the project by offering complementary skills and shared entrepreneurial responsibility. A good co-founder fills a skill gap, is motivated by the same vision, strengthens resilience during complex moments, and knows how to communicate, resolve conflicts, and remain present.",
    },
    {
      id: "common-mistakes",
      kind: "principle-grid",
      title: "Common mistakes in team building",
      items: [
        { title: "Evaluating only the résumé", body: "Prestigious experience doesn't guarantee suitability for a dynamic startup context." },
        { title: "Confusing 'broad' with 'generalist'", body: "A broad profile has solid skills in 2–3 related areas. A generalist is superficial in many." },
        { title: "Hiring only to fill a role", body: "Also evaluate motivation and value alignment with the startup." },
        { title: "Communicating too little", body: "A short daily meeting can prevent misunderstandings, slowdowns, and latent conflicts." },
        { title: "Constant compromises", body: "What's needed is clarity, open discussion, and the ability to make uncomfortable decisions." },
      ],
    },
    {
      id: "quote",
      kind: "quote-card",
      quote: {
        quote: "Leaders eat last. The teams that trust each other keep moving when nobody else can.",
        attribution: "Simon Sinek",
      },
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "List the top three skills your startup needs in the next six months. For each, note: who covers it today? Is the coverage strong, weak, or missing? What's your plan for the missing one?",
    },
  ],
};

const M16: ExtendedModule = {
  moduleId: "m16-experiments",
  heroDiagram: "loop",
  hook:
    "In a startup, opinions are cheap and uncertainty is high. The team that ships small, measurable experiments — and lets data correct course — moves faster than the team arguing in a room.",
  sections: [
    {
      id: "why-experiments",
      kind: "callout-insight",
      title: "Experiments beat opinions",
      body:
        "Experimenting means testing your hypotheses methodically, collecting real data, learning from mistakes, and redirecting based on what truly works. This is the Lean Startup approach: replace long planning phases with short, iterative cycles of building, measuring, and learning.",
    },
    {
      id: "what-makes-effective",
      kind: "ordered-steps",
      title: "What makes an experiment effective",
      items: [
        { title: "Specific", body: "Tests one hypothesis, not a confused set of elements." },
        { title: "Measurable", body: "Results are observable and can be interpreted clearly." },
        { title: "Quick and inexpensive", body: "Runs in a short time and at low cost. If it takes 6 months, it's not an experiment." },
      ],
    },
    {
      id: "process",
      kind: "ordered-steps",
      title: "Run an experiments meeting",
      items: [
        { title: "Hypothesis brainstorming (15 min)", body: "Each team member writes down hypotheses worth testing." },
        { title: "Collection (5 min)", body: "An owner gathers them into a shared table." },
        { title: "Evaluation (15 min)", body: "Score each on ease, expected impact, and confidence (0–10)." },
        { title: "Prioritization (10 min)", body: "Average the scores. Top of the list = highest impact + lowest confidence + easy to test." },
      ],
    },
    {
      id: "example",
      kind: "callout-story",
      title: "Concrete example",
      body:
        "Hypothesis: 'Users will book a service directly from Instagram'. A useful experiment: post once with a booking link in bio, monitor clicks for a week. Within days, you'd have signal worth more than three meetings of speculation.",
    },
    {
      id: "stat",
      kind: "stat",
      stat: {
        value: "1",
        unit: "hypothesis per test",
        caption: "or you won't know which variable moved the result.",
      },
    },
    {
      id: "quote",
      kind: "quote-card",
      quote: {
        quote: "Build → Measure → Learn. Compress the cycle, compress your timeline.",
        attribution: "Eric Ries — The Lean Startup",
      },
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Pick the riskiest hypothesis you have right now. Design a 1-week test. Predict the outcome before you run it. If you can predict it confidently, it's not really an experiment.",
    },
  ],
};

// =============================================================================
// IRL 2
// =============================================================================

const M17: ExtendedModule = {
  moduleId: "m17-competitive-analysis",
  heroDiagram: "scales",
  hook:
    "Building without mapping the context means risking replication of existing models — or worse, building what others already do better. Knowing competitors is a concrete lever for advantage.",
  sections: [
    {
      id: "two-types",
      kind: "comparison",
      title: "Direct vs indirect competitors",
      leftLabel: "Direct",
      rightLabel: "Indirect",
      comparison: [
        { left: "Offer a similar product to the same target.", right: "Offer alternative solutions to the same problem." },
        { left: "Easy to find via Google + marketplaces.", right: "Often hidden — local channels, professional networks, thematic groups." },
      ],
    },
    {
      id: "what-to-gather",
      kind: "principle-grid",
      title: "What to gather on each competitor",
      items: [
        { title: "Product / service", body: "Features, pricing, perceived quality, technology, positioning." },
        { title: "Sales strategies", body: "Channels, distribution, direct or indirect sales, partnerships." },
        { title: "Marketing & communication", body: "Messages, content strategy, engagement style, online presence." },
        { title: "Customer experience", body: "Support, tutorials, demos, community." },
        { title: "Resources & visibility", body: "Funds raised (when public), team size, advertising, events." },
      ],
    },
    {
      id: "tools",
      kind: "ordered-steps",
      title: "Structure and visualize the data",
      items: [
        { title: "Benchmarking table", body: "Compare key features (price, quality, value, distribution) row by row." },
        { title: "Competitive map", body: "Position competitors on two axes — e.g., innovation vs price, quality vs accessibility." },
        { title: "SWOT analysis", body: "Strengths, weaknesses, opportunities, threats — apply to your startup AND the main competitors." },
      ],
    },
    {
      id: "no-competitors",
      kind: "callout-warning",
      title: "Watch out: 'we have no competitors'",
      body:
        "Every market has alternatives — even Excel is a competitor. The status quo (do nothing, do it manually) is often the strongest competitor. If you can't see competitors, your competitive analysis is incomplete, not complete.",
    },
    {
      id: "quote",
      kind: "quote-card",
      quote: {
        quote: "Even the most ordinary spreadsheet is a competitor for any startup that wants to replace it.",
        attribution: "Module 17 — Competitive Analysis",
      },
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Build a 3-row benchmark table this afternoon. Three competitors. Strength, weakness, gap you can own. The gap is your wedge.",
    },
  ],
};

const M18: ExtendedModule = {
  moduleId: "m18-positioning",
  heroDiagram: "target",
  hook:
    "Positioning is not just communication — it's a strategic choice. It defines how a startup takes its place in the market, guides every decision, and builds connection with customers.",
  sections: [
    {
      id: "what-positioning",
      kind: "callout-insight",
      title: "What positioning is",
      body:
        "Positioning is the process by which your startup defines its place in the market by clarifying: how you differ from competitors, who your offering is for, what specific benefit you promise. A synthesis of identity (what you do) and perception (how the audience sees you).",
    },
    {
      id: "three-questions",
      kind: "principle-grid",
      title: "Three key questions a good positioning answers",
      items: [
        { title: "Who are you targeting?", body: "Be specific. The narrower the segment, the sharper the message." },
        { title: "What problem are you solving?", body: "Tied to a real, urgent need — not a hypothetical convenience." },
        { title: "Why should they choose you?", body: "Differentiation that's credible AND meaningful, not just unique." },
      ],
    },
    {
      id: "formula",
      kind: "callout-protip",
      title: "The For-Who-We-Offer-Unlike formula",
      body:
        "For [TARGET] who has [PROBLEM], we offer [SOLUTION] that enables [UNIQUE RESULT], unlike [COMPETITORS]. Specific. Customer-centered. Benefit-driven.",
    },
    {
      id: "examples",
      kind: "comparison",
      title: "Generic vs sharp positioning",
      leftLabel: "Generic",
      rightLabel: "Sharp",
      comparison: [
        { left: "We help everyone do everything better with AI.", right: "We help small hairdressers stop losing bookings to no-shows." },
        { left: "A cloud-based platform for businesses.", right: "Flexible, practical training for artisans who work with their hands." },
      ],
      verdict: "It's better to be relevant to a few than invisible to many.",
    },
    {
      id: "mistakes",
      kind: "principle-grid",
      title: "Mistakes to avoid",
      items: [
        { title: "Being too generic", body: "'We improve people's lives' says nothing." },
        { title: "Following trends", body: "Buzzwords don't create value." },
        { title: "Copying market leaders", body: "You become a worse version of what already exists." },
        { title: "Failing to evolve", body: "Positioning isn't carved in stone; revisit yearly." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Write the For-Who-We-Offer-Unlike formula in one sentence for your startup. Read it out loud. If it doesn't sound sharp and specific, rewrite it.",
    },
  ],
};

const M19: ExtendedModule = {
  moduleId: "m19-networking",
  heroDiagram: "bridge",
  hook:
    "No startup grows alone. Opportunities for funding, customers, partners, and team members often come through your network — not collected contacts, but meaningful relationships.",
  sections: [
    {
      id: "why",
      kind: "callout-insight",
      title: "Why networking is essential",
      body:
        "Startups operate in uncertain environments where every decision matters and rapid learning is critical. Access to the right people at the right time can make the difference between progress and stagnation. Networking lets you find customers and partners, access investors through referrals, receive qualified feedback, be included in support programs, and increase visibility.",
    },
    {
      id: "give-first",
      kind: "ordered-steps",
      title: "How to build valuable relationships",
      items: [
        { title: "Start by giving, not asking", body: "Offer value first — useful content, an introduction, thoughtful feedback." },
        { title: "Take care of your introduction", body: "Prepare a short pitch about who you are, what you do, and what connections you seek." },
        { title: "Follow up and deepen", body: "Don't let it fade after the first interaction — share resources, suggest a second conversation." },
        { title: "Be consistent", body: "Networking isn't one-time. Make it part of your weekly routine with realistic goals." },
      ],
    },
    {
      id: "follow-up",
      kind: "principle-grid",
      title: "Effective follow-up techniques",
      items: [
        { title: "Within 24 hours", body: "Thank them, reference something specific from the conversation, share something useful." },
        { title: "Propose a concrete next step", body: "A call, feedback, an introduction. Asking for advice is a great hook." },
        { title: "Keep the relationship alive", body: "Periodic updates, useful content, even simple greetings. Personalization matters." },
        { title: "Track contacts systematically", body: "Excel or simple CRM (HubSpot, Notion). Memory fails; systems don't." },
      ],
    },
    {
      id: "mentors",
      kind: "callout-story",
      title: "Engaging mentors and advisors",
      body:
        "For early-stage startups, mentors and advisors can significantly impact growth. They provide strategic guidance, valuable connections, and experienced perspective. Approach: identify your specific need (not 'a generic mentor'), choose the right profile (not the most famous — the most relevant), create a valuable first interaction, define a structure (even a 30-min monthly call has impact if well prepared).",
    },
    {
      id: "quote",
      kind: "quote-card",
      quote: {
        quote: "Give before you ask. Then ask less than you think.",
        attribution: "Module 19 — Networking",
      },
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Identify three people you can give value to this week without asking for anything in return. Send them a short note — content, an introduction, a thoughtful question.",
    },
  ],
};

// =============================================================================
// IRL 3
// =============================================================================

const M20: ExtendedModule = {
  moduleId: "m20-mission-vision",
  heroDiagram: "lighthouse",
  hook:
    "In contexts where change is constant and uncertainty is the norm, a compass is required. That compass is built on three pillars: vision, mission, and values.",
  sections: [
    {
      id: "vision",
      kind: "callout-insight",
      title: "Defining the vision",
      body:
        "The vision describes the world your startup aims to help build. A clear, ambitious, inspirational picture of a desirable change. It gives meaning to your actions and emotionally engages those who follow you. It shouldn't be limited to your product — reflect the broader 'why' behind your business.",
    },
    {
      id: "mission",
      kind: "callout-insight",
      title: "Defining the mission",
      body:
        "The mission explains what your startup concretely does to make that vision real. Operational, present-oriented, your value proposition in action. An effective mission starts from your unique value proposition, describes concrete actions that generate impact, and includes a distinctive or innovative element.",
    },
    {
      id: "process",
      kind: "ordered-steps",
      title: "How to write mission and vision coherently",
      items: [
        { title: "Start with the mission", body: "Define clearly what you do and for whom." },
        { title: "Define indicators", body: "How can you measure effectiveness?" },
        { title: "Identify the impact objective", body: "What change do you aim to generate?" },
        { title: "Simplify", body: "Avoid vague language. Focus on clarity." },
        { title: "Build the vision from the mission", body: "Look ahead and describe a future where your solution has succeeded." },
      ],
    },
    {
      id: "values",
      kind: "principle-grid",
      title: "Values that guide decisions",
      items: [
        { title: "Authentic", body: "Consistent with your story — not aspirational fiction." },
        { title: "Useful in real decisions", body: "If a value never causes a hard call, it's a slogan." },
        { title: "Translated into behaviors", body: "'We value transparency' → 'we openly share results, mistakes, and feedback'." },
      ],
    },
    {
      id: "examples",
      kind: "comparison",
      title: "Real examples (Tesla, Patagonia)",
      leftLabel: "Vision",
      rightLabel: "Mission",
      comparison: [
        { left: "Tesla — Create the future of sustainable energy.", right: "Tesla — Accelerate the world's transition to sustainable energy." },
        { left: "Patagonia — Be an example of how a company can help save the planet.", right: "Patagonia — Build the best product, cause no unnecessary harm, use business to inspire environmental solutions." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Draft a one-sentence mission and a one-sentence vision. Don't optimize. Iterate next week. List three decisions your mission would make easier — if zero, rewrite.",
    },
  ],
};

const M21: ExtendedModule = {
  moduleId: "m21-market-analysis",
  heroDiagram: "funnel",
  hook:
    "Every business starts from an intuition, but it grows only when it engages with the real market. Market analysis is one of the most important tools for building solid foundations.",
  sections: [
    {
      id: "why",
      kind: "callout-insight",
      title: "Why analyze the market",
      body:
        "Analyzing the market means answering: Is there real demand? How large is the potential market? Which segments are most attractive to start with? How do competitors behave? It avoids building an offer based on assumptions or perceptions and supports a clear, competitive positioning.",
    },
    {
      id: "tam-sam-som",
      kind: "ordered-steps",
      title: "TAM · SAM · SOM",
      items: [
        { title: "TAM — Total Addressable Market", body: "The total global market value, regardless of limitations." },
        { title: "SAM — Serviceable Available Market", body: "The portion of TAM reachable by your business model." },
        { title: "SOM — Serviceable Obtainable Market", body: "The realistic share of SAM you expect to capture in early years." },
      ],
    },
    {
      id: "approaches",
      kind: "comparison",
      title: "Top-down vs bottom-up",
      leftLabel: "Top-down",
      rightLabel: "Bottom-up",
      comparison: [
        { left: "Start from macro-level institutional data and narrow it.", right: "Start from operational assumptions: avg price × number of reachable customers." },
        { left: "Risks: assumptions inflate quickly.", right: "Risks: misses the broader opportunity." },
        { left: "Example: Italian artisanal food sector = €8B → online producers → SAM ≈ €600M.", right: "Example: €1,000/year service × 200 companies → initial market = €200,000." },
      ],
      verdict: "Always do both. Where the numbers disagree is where your assumptions are weakest.",
    },
    {
      id: "sources",
      kind: "principle-grid",
      title: "Reliable sources",
      items: [
        { title: "Institutional", body: "ISTAT, Eurostat, Chambers of Commerce." },
        { title: "Industry databases", body: "Cerved, Statista, SACE." },
        { title: "Trade associations", body: "CNA, Confartigianato, Coldiretti." },
        { title: "Consulting reports", body: "McKinsey, Deloitte, PwC." },
        { title: "Primary sources", body: "Interviews, surveys, events. Even partial data is useful when assumptions are explicit." },
      ],
    },
    {
      id: "stat",
      kind: "stat",
      stat: {
        value: "0",
        unit: "true 'huge markets'",
        caption: "convince a serious investor. Defensible niches do.",
      },
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Compute a quick TAM, SAM, and SOM for your startup. State your assumptions explicitly. Don't aim for precision — aim for defensibility.",
    },
  ],
};

const M22: ExtendedModule = {
  moduleId: "m22-startup-tools",
  heroDiagram: "compass",
  hook:
    "Startups operate in a dynamic, competitive environment where speed and efficiency are essential. The right tools automate repetitive processes, centralize data, and increase team productivity.",
  sections: [
    {
      id: "criteria",
      kind: "ordered-steps",
      title: "How to choose the right tools",
      items: [
        { title: "Clear objectives", body: "Define specific needs (CRM, automation, data collection) before browsing categories." },
        { title: "Scalability", body: "Choose tools that grow with the company." },
        { title: "Integration", body: "Ensure compatibility with existing tools." },
        { title: "Ease of use", body: "Overly complex tools risk being abandoned." },
        { title: "Cost-benefit balance", body: "Align features with available budget. Free tier first." },
      ],
    },
    {
      id: "by-function",
      kind: "principle-grid",
      title: "Tools by function",
      items: [
        { title: "CRM", body: "HubSpot (free for startups), Pipedrive (visual pipelines), Zoho." },
        { title: "Analytics & BI", body: "Google Analytics 4, Mixpanel, Looker Studio, Amplitude." },
        { title: "Marketing automation", body: "ActiveCampaign, Klaviyo (e-commerce), Mailchimp, Zapier." },
        { title: "Project management", body: "Notion, Asana, Trello, ClickUp." },
        { title: "Finance", body: "Xero, QuickBooks, Fatture in Cloud (Italy), Anaplan." },
        { title: "Collaboration", body: "Slack, Microsoft Teams, Google Workspace, Miro." },
      ],
    },
    {
      id: "notion",
      kind: "callout-protip",
      title: "Notion — the all-in-one solution",
      body:
        "For early-stage startups, use Notion as the main tool and adapt it to multiple needs (project management, documentation, internal wiki, databases). Add specialized tools later only when a real bottleneck demands it. Faster execution, centralization, cost savings.",
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Audit your stack. Anything not used weekly? Cut it. Anything covered by a free tier? Downgrade. Replace one expensive tool with Notion + a spreadsheet for a week and see what you actually missed.",
    },
  ],
};

const M23: ExtendedModule = {
  moduleId: "m23-project-management",
  heroDiagram: "loop",
  hook:
    "Project Management organizes how you ship. For startups, Agile wins: short cycles, real feedback, willingness to change direction.",
  sections: [
    {
      id: "waterfall-vs-agile",
      kind: "comparison",
      title: "Waterfall vs Agile",
      leftLabel: "Waterfall",
      rightLabel: "Agile",
      comparison: [
        { left: "Linear, sequential — each phase complete before next.", right: "Iterative — short cycles called sprints." },
        { left: "Detailed planning at the start; clearly defined requirements.", right: "Flexible, adaptive, continuous customer collaboration." },
        { left: "Fits stable, well-understood projects.", right: "Fits dynamic, innovative environments." },
        { left: "Low flexibility; hard to adapt to change.", right: "Rapid response to changing conditions." },
      ],
      verdict: "For innovative startups: adopt Agile and work with weekly sprints.",
    },
    {
      id: "agile-frameworks",
      kind: "principle-grid",
      title: "Agile flavors",
      items: [
        { title: "Scrum", body: "Sprints, daily standup, sprint review, retrospective. Strong for product teams." },
        { title: "Kanban", body: "Continuous flow, visualize WIP. Strong for operational/support teams." },
        { title: "Lean PM", body: "Eliminate waste, optimize value flow. Borrowed from Toyota Production System." },
      ],
    },
    {
      id: "kanban-board",
      kind: "callout-story",
      title: "Kanban in practice",
      body:
        "Each card represents a task. Cards move across columns: To Do (Product backlog) → In Progress → Completed. The 'In Progress' phase can be split (scoping, development, review) based on workflow. Simple beats elaborate at the start.",
    },
    {
      id: "sprint",
      kind: "ordered-steps",
      title: "What is a sprint",
      items: [
        { title: "Defined period", body: "Typically 2 weeks. Sacred boundary — scope is negotiable, length is not." },
        { title: "Specific outcomes", body: "3–5 outcomes (not tasks). What does done look like for each?" },
        { title: "Daily check-in", body: "15-minute standup. Yesterday, today, blockers." },
        { title: "End-of-sprint review", body: "What shipped? Demo it." },
        { title: "Retrospective", body: "What to keep, drop, try? Same time every sprint. Cadence beats willpower." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Define your next 2-week sprint with 3–5 outcomes (not tasks). Friday: review honestly. End with one keep, one drop, one try.",
    },
  ],
};

// =============================================================================
// IRL 4
// =============================================================================

const M24: ExtendedModule = {
  moduleId: "m24-mvp",
  heroDiagram: "scales",
  hook:
    "An MVP isn't a small product — it's a sharp question. Reduce uncertainty by testing real hypotheses with minimal effort, before committing months to development.",
  sections: [
    {
      id: "what-mvp-is",
      kind: "comparison",
      title: "What an MVP is — and isn't",
      leftLabel: "An MVP IS NOT",
      rightLabel: "An MVP IS",
      comparison: [
        { left: "A technical or aesthetic prototype to show off.", right: "A functional, minimal version that collects useful data on one key hypothesis." },
        { left: "A static demo with no real users.", right: "Touched by real users, who behave (not just answer questions)." },
        { left: "A 'beta' with all features already built.", right: "Designed to learn the most with the least product possible." },
      ],
      verdict: "Build ONLY what's needed to test the riskiest hypothesis.",
    },
    {
      id: "process",
      kind: "ordered-steps",
      title: "How to build an MVP — 4 steps",
      items: [
        { title: "Define the hypothesis to test", body: "What do you want to learn? Which risk to reduce first?" },
        { title: "Design a focused MVP", body: "What MUST the product do to test this hypothesis? Avoid adding more." },
        { title: "Map risks and tests", body: "For each risk: how to test it, which MVP, which metrics to track." },
        { title: "Design the learning path", body: "Sequence of MVPs. Each tests a specific part. Learn → improve → repeat." },
      ],
    },
    {
      id: "formats",
      kind: "principle-grid",
      title: "Common MVP formats",
      items: [
        { title: "Landing page + CTA", body: "Test interest with email signups, waitlists, fake purchase buttons." },
        { title: "Concierge MVP", body: "Service delivered manually behind the scenes — chatbot answered via WhatsApp by a human." },
        { title: "Demo or simulated video", body: "Explain the product, collect feedback. Ideal for complex software/physical products." },
        { title: "Interactive prototype", body: "Figma, InVision — test usability without backend." },
        { title: "Fake door test", body: "Click a feature that doesn't exist → 'coming soon'. Click rate = signal." },
      ],
    },
    {
      id: "dropbox",
      kind: "callout-story",
      title: "Case study — Dropbox",
      body:
        "Dropbox didn't build the full product first. The founders made a simple demo video showing how the file sync would work, shared it on Hacker News, and woke up to over 75,000 sign-ups overnight. They validated demand, collected feedback, and attracted investors — all without writing the production code first.",
    },
    {
      id: "stat",
      kind: "stat",
      stat: {
        value: "75,000",
        unit: "signups",
        caption: "in one night, on a demo video — no product behind it. Proof an MVP can work without code.",
        source: "Dropbox case study",
      },
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Pick the riskiest hypothesis your startup must validate. Design the smallest MVP that could disconfirm it in 2–3 weeks. If it would take longer, it's too complex.",
    },
  ],
};

const M25: ExtendedModule = {
  moduleId: "m25-customer-journey",
  heroDiagram: "compass",
  hook:
    "A need doesn't exist in isolation — it lives within an experience. Mapping that journey is one of the most strategic activities an early-stage team can undertake.",
  sections: [
    {
      id: "five-phases",
      kind: "ordered-steps",
      title: "The five phases of the customer journey",
      items: [
        { title: "Awareness", body: "User becomes aware of a problem or need; first exposure to your brand." },
        { title: "Consideration", body: "Explores and compares options — reading reviews, content, insights." },
        { title: "Purchase", body: "Decision and concrete action: buy, sign up, register." },
        { title: "Retention", body: "Continues using; discovers value over time; relationship deepens." },
        { title: "Advocacy", body: "Recommends through reviews, word of mouth, social media." },
      ],
    },
    {
      id: "common-mistake",
      kind: "callout-warning",
      title: "The common mistake",
      body:
        "Most startups focus only on awareness (bringing traffic to a website) without managing what happens after. What do users find? How do they navigate? Is it clear what to do? How do they feel after the first use? Designing a good journey means giving users a reason to stay, not just to arrive.",
    },
    {
      id: "personas",
      kind: "principle-grid",
      title: "Personas — design for real users",
      items: [
        { title: "Why they choose you", body: "What problem do they have? What language do they use?" },
        { title: "Their habits", body: "How do they discover, evaluate, decide?" },
        { title: "Their obstacles", body: "What stops them from acting?" },
        { title: "Their motivations", body: "What outcomes do they really want?" },
      ],
    },
    {
      id: "mapping",
      kind: "ordered-steps",
      title: "Mapping the journey",
      items: [
        { title: "What does the user do?", body: "Actions, touchpoints — screens, conversations, channels." },
        { title: "What do they think or feel?", body: "Expectations, doubts, emotions at each step." },
        { title: "Which channels do they use?", body: "Where you intersect with their day." },
        { title: "What are the critical moments?", body: "Frictions and opportunities. Each is a designable choice." },
      ],
    },
    {
      id: "quote",
      kind: "quote-card",
      quote: {
        quote: "Awareness is cheap. Retention is the moat.",
        attribution: "Module 25 — Customer Journey",
      },
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Walk through your own onboarding as a fresh user. Note every moment of friction. Fix the worst one by Friday.",
    },
  ],
};

const M26: ExtendedModule = {
  moduleId: "m26-kpis",
  heroDiagram: "growth",
  hook:
    "Initial enthusiasm and good intuition are not enough — you need concrete data to evaluate progress, adjust strategy, and make informed decisions. KPIs are how a team aligns.",
  sections: [
    {
      id: "kpi-vs-metric",
      kind: "comparison",
      title: "KPIs vs metrics",
      leftLabel: "Metric",
      rightLabel: "KPI",
      comparison: [
        { left: "General data describing aspects of the business.", right: "A key measure linked to a specific strategic objective, monitored over time." },
        { left: "Total website visits.", right: "Increase conversion rate from 2% to 4% in six months." },
      ],
      verdict: "Metrics collect data. KPIs indicate progress toward a goal.",
    },
    {
      id: "smart",
      kind: "ordered-steps",
      title: "SMART KPIs",
      items: [
        { title: "Specific", body: "Clearly defined." },
        { title: "Measurable", body: "Quantifiable." },
        { title: "Achievable", body: "Realistic given resources." },
        { title: "Relevant", body: "Tied to business impact." },
        { title: "Time-bound", body: "Defined timeframe." },
      ],
    },
    {
      id: "categories",
      kind: "principle-grid",
      title: "Key KPIs by category",
      items: [
        { title: "Financial", body: "Gross profit margin, CAC, CLV, burn rate." },
        { title: "Marketing & Sales", body: "Conversion rate, marketing ROI, lead generation." },
        { title: "Operational & Product", body: "Retention rate, churn rate, CSAT, average response time." },
      ],
    },
    {
      id: "stat",
      kind: "stat",
      stat: {
        value: "3",
        unit: "KPIs",
        caption: "is enough at idea stage. Track too many and you align around none.",
      },
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "List 3 KPIs you'll track for the next 30 days. For each: definition, current value, 30-day target, why it matters.",
    },
  ],
};

const M27: ExtendedModule = {
  moduleId: "m27-first-customer",
  heroDiagram: "key",
  hook:
    "First customers don't arrive — they're found, approached, and convinced. Going to where customers are beats waiting for them to find you.",
  sections: [
    {
      id: "why",
      kind: "callout-insight",
      title: "Why first customers are crucial",
      body:
        "First customers test your product, validate the business model, and generate initial revenue. Unlike established companies, early-stage startups lack brand recognition, structured network, or large marketing budgets — so they must adopt practical, often hands-on, strategies.",
    },
    {
      id: "strategies",
      kind: "ordered-steps",
      title: "Strategies that work",
      items: [
        { title: "Start from people you already know", body: "Friends, former colleagues, local contacts. Talk, ask for feedback, offer to try." },
        { title: "Go where your customers are", body: "Knock on shop doors, attend fairs, organize small presentations in shared spaces." },
        { title: "Offer something in exchange for attention", body: "Free or discounted product for feedback, demo invitations, simple landing-page CTAs." },
        { title: "Create simple but useful content", body: "A simple PDF, a video explaining the idea, a clear LinkedIn post — clarity over polish." },
        { title: "Run focused ads", body: "If you have budget — small, targeted, measurable. Avoid generic visibility campaigns." },
      ],
    },
    {
      id: "real-example",
      kind: "callout-story",
      title: "Real example",
      body:
        "A startup selling dog food rented a van, filled it with products, and visited pet stores door-to-door. They came back with their first orders and valuable feedback. Personal beats polished, especially when nobody knows you.",
    },
    {
      id: "track",
      kind: "callout-protip",
      title: "Track everything",
      body:
        "Whatever approach you choose, track who you contacted, what you proposed, how they responded, what you learned. With few customers, you can build strong relationships — and the patterns across them are worth more than any market report.",
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Make a list of 20 named people who probably have your problem. Email three. Today. The first 'no' will teach you more than the first 'yes'.",
    },
  ],
};

// =============================================================================
// IRL 5
// =============================================================================

const M28: ExtendedModule = {
  moduleId: "m28-ecosystem",
  heroDiagram: "bridge",
  hook:
    "Every business is born and grows within a context. For a startup, understanding that ecosystem is core strategic work — anticipate barriers, identify levers, accelerate growth.",
  sections: [
    {
      id: "actors",
      kind: "principle-grid",
      title: "Map the key actors",
      items: [
        { title: "Potential customers", body: "Direct and indirect — those who experience the problem." },
        { title: "Distribution channels", body: "Shops, consultants, suppliers — gateways to your users." },
        { title: "Associations", body: "Industry, professional, territorial — gatekeepers of trust." },
        { title: "Communities", body: "Online or offline, formal or informal — where your audience already gathers." },
        { title: "Synergistic companies", body: "Complementary, not competitors — partners-in-waiting." },
        { title: "Institutions & local entities", body: "Municipalities, chambers of commerce, incubators, training bodies." },
      ],
    },
    {
      id: "talk-observe",
      kind: "ordered-steps",
      title: "Talk to people and observe behavior",
      items: [
        { title: "Use exploratory interviews", body: "Informal but strategic. Listen for hidden needs, established habits, trust dynamics." },
        { title: "Visit places", body: "Stores, events, companies. Reality reveals what people don't say explicitly." },
        { title: "Follow communities", body: "Even quietly. Learn the language, the pain points, the rhythm." },
      ],
    },
    {
      id: "barriers-levers",
      kind: "comparison",
      title: "Barriers vs levers (matrix)",
      leftLabel: "Barriers",
      rightLabel: "Levers",
      comparison: [
        { left: "Distrust of digital tools, low tech literacy.", right: "Trust in local references, time-saving value." },
        { left: "Fear of losing personal relationships.", right: "Interest in automation, efficiency focus." },
      ],
      verdict: "For each segment, knowing both lets you communicate, onboard, and prioritize correctly.",
    },
    {
      id: "partnerships",
      kind: "callout-protip",
      title: "Strategic partnerships",
      body:
        "Some ecosystem actors can become strategic partners — they share your audience or goal. Working together: multiplies impact, reduces costs, increases credibility. Start with small measurable collaborations, propose a clear concrete objective, communicate mutual value, define roles, nurture transparently.",
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Map at least 10 relevant actors in your ecosystem. Conduct 3 exploratory interviews this week. Identify 1 potential partner and propose a micro-collaboration.",
    },
  ],
};

const M29: ExtendedModule = {
  moduleId: "m29-sales",
  heroDiagram: "key",
  hook:
    "Selling is not aggressive pushing. It's listening, proposing useful solutions, building relationships, generating trust. A skill that can be learned, even without prior sales experience.",
  sections: [
    {
      id: "offer",
      kind: "ordered-steps",
      title: "Create an offer that can be sold",
      items: [
        { title: "Clarity", body: "Explain in a few words what you do and why it matters." },
        { title: "Differentiation", body: "Why choose you over others." },
        { title: "Focus", body: "You can't sell to everyone — start with those with a clear and urgent need." },
      ],
    },
    {
      id: "strategies",
      kind: "principle-grid",
      title: "Strategies for first customers",
      items: [
        { title: "Cold outreach", body: "Personal email/LinkedIn/phone to a specific person. Get to the point. Ask for a meeting, not an immediate sale." },
        { title: "Inbound marketing", body: "Educate over time — articles solving real problems, social posts, guides, newsletters, webinars." },
        { title: "Networking", body: "Attend places where your target is. Build relationships before selling. Bring simple materials." },
      ],
    },
    {
      id: "pricing",
      kind: "principle-grid",
      title: "Pricing models — more than a number",
      items: [
        { title: "Fixed price", body: "Simple products/services." },
        { title: "Subscription", body: "Recurring services (e.g., SaaS)." },
        { title: "Variable", body: "Customized solutions." },
        { title: "Freemium", body: "Free basic + paid premium." },
        { title: "Pay-per-use", body: "Usage-based." },
      ],
    },
    {
      id: "fundamentals",
      kind: "principle-grid",
      title: "Sales fundamentals",
      items: [
        { title: "Listen before speaking", body: "Ask questions. Understand the problem before pitching." },
        { title: "Guide, don't convince", body: "Value sells itself when made visible." },
        { title: "Be helpful, not pushy", body: "Trust drives sales. Trust takes longer than one call." },
        { title: "Test, improve, repeat", body: "Every conversation is learning, even a 'no'." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Schedule 3 first-conversations next week. Don't pitch — ask about their problem and listen for 80%. The other 20% is enough.",
    },
  ],
};

const M30: ExtendedModule = {
  moduleId: "m30-presence",
  heroDiagram: "lighthouse",
  hook:
    "Long before the product, there is perception. A well-crafted presence is a concrete tool to attract customers, partners, suppliers, and investors — even at idea stage.",
  sections: [
    {
      id: "branding",
      kind: "callout-insight",
      title: "Branding — identity is not optional",
      body:
        "Branding is much deeper than a logo. It's the set of elements that defines who you are, who you serve, why people should choose you. Tone, personality, visual identity, language. Even with simple tools (Canva, Looka), you can build a professional, consistent identity from the start.",
    },
    {
      id: "logo",
      kind: "ordered-steps",
      title: "Creating a professional logo",
      items: [
        { title: "Work at small sizes", body: "Must be readable at favicon size." },
        { title: "Black and white version", body: "Pass the grayscale test." },
        { title: "Three minimum versions", body: "Colored on light background; monochrome; icon-only (for app icons / social profiles)." },
      ],
    },
    {
      id: "website",
      kind: "callout-protip",
      title: "Website — from showcase to strategic tool",
      body:
        "Even a simple landing page has immediate value: shows you're real and professional, allows contact, increases visibility. Must include: who you are, what you do, why you do it (mission/value), contact, products/services, optional updates/blog. Mobile-friendly. Fast-loading. Tools: WordPress.com, Wix, Carrd, Notion, Readymag.",
    },
    {
      id: "physical",
      kind: "principle-grid",
      title: "Physical marketing materials",
      items: [
        { title: "Business cards", body: "Logo, name, role, phone, email, website." },
        { title: "Letterhead", body: "Formal documents." },
        { title: "PDF presentation", body: "Share via email." },
        { title: "Folders, flyers, stickers", body: "For events." },
        { title: "Roll-up banners", body: "For exhibitions and meetings." },
      ],
    },
    {
      id: "social",
      kind: "callout-protip",
      title: "Social media — strategic, not noisy",
      body:
        "Better to manage 1–2 channels well than many poorly. LinkedIn for B2B / professional services. Instagram for visual products / lifestyle. Facebook for local. TikTok / YouTube only if you have time AND content. Define content types, set frequency, mix updates / behind-scenes / testimonials / insights. Even with few followers, consistency builds relationships and trust.",
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Audit your one-pager. Name, what you do, who for, how to start. Anything unclear? Fix today. Look at your LinkedIn / website through a stranger's eyes — do you trust this brand?",
    },
  ],
};

const M31: ExtendedModule = {
  moduleId: "m31-social-startups",
  heroDiagram: "lighthouse",
  hook:
    "A social startup is not just a 'good' organization. It's a competitive, innovative business that solves social, environmental, or cultural problems through entrepreneurial solutions.",
  sections: [
    {
      id: "what",
      kind: "callout-insight",
      title: "What a social startup is",
      body:
        "A social startup operates in the market and generates profit, but is primarily created to address a social, environmental, or cultural need. Profit is not the goal but the means to sustain the mission.",
    },
    {
      id: "italian-benefit",
      kind: "ordered-steps",
      title: "Italian benefit company basics",
      items: [
        { title: "Formal legal status", body: "Introduced in 2016. Companies formally include common-benefit goals in their statute." },
        { title: "Legal commitment", body: "To pursue social or environmental goals alongside profit." },
        { title: "Annual impact report", body: "Public document describing objectives, actions, evaluation metrics, results." },
        { title: "Optional benefit officer", body: "Recommended internal role for accountability." },
      ],
    },
    {
      id: "models",
      kind: "principle-grid",
      title: "Business models for social startups",
      items: [
        { title: "Social-purpose sales", body: "Revenue funds impact activities (e.g., 'buy one, give one')." },
        { title: "Inclusive production", body: "Employ or train disadvantaged groups." },
        { title: "Peer-to-peer platforms", body: "Enable access to essential goods/services through collaboration." },
        { title: "Circular economy", body: "Reuse materials, reduce waste, build sustainable supply chains." },
      ],
    },
    {
      id: "tools",
      kind: "principle-grid",
      title: "Impact measurement tools",
      items: [
        { title: "B Impact Assessment", body: "ESG evaluation framework. Industry-standard for benefit corporations." },
        { title: "Theory of Change Canvas", body: "Map inputs → activities → outputs → outcomes → impact." },
        { title: "SDG Compass", body: "Aligns business with UN Sustainable Development Goals." },
      ],
    },
    {
      id: "growth",
      kind: "callout-protip",
      title: "Growth strategies",
      body:
        "Strategic partnerships (public entities, foundations, schools, research centers). Social franchising (replicate the model in other territories). Technology for impact (apps, platforms to scale reach). Positioning as an impact startup unlocks impact investment funds, specialized accelerators, international networks.",
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Write 3 impact metrics specific to your startup. How would you measure each every month? How does each tie to your business model?",
    },
  ],
};

// =============================================================================
// IRL 0 — Foundation modules
// =============================================================================

const M1: ExtendedModule = {
  moduleId: "m1-what-is-startup",
  heroDiagram: "compass",
  hook:
    "A startup is not just a young company. It's a temporary organization built to validate a scalable, repeatable business model under high uncertainty.",
  sections: [
    {
      id: "definitions",
      kind: "principle-grid",
      title: "Three definitions worth memorizing",
      items: [
        { title: "Steve Blank", body: "A startup is a temporary organization in search of a repeatable and scalable business model." },
        { title: "Eric Ries", body: "A startup is a human institution designed to create a new product or service under conditions of extreme uncertainty." },
        { title: "Y Combinator", body: "A startup is a company designed to grow very quickly." },
      ],
    },
    {
      id: "core",
      kind: "comparison",
      title: "Startup vs traditional business",
      leftLabel: "Startup",
      rightLabel: "Traditional business",
      comparison: [
        { left: "Searches for a business model.", right: "Applies an established model efficiently." },
        { left: "Seeks scalability — exponential growth.", right: "Seeks gradual, territorial, relational growth." },
        { left: "Operates under high uncertainty.", right: "Faces fewer initial uncertainties, more long-term ones." },
        { left: "Small teams, flexible roles.", right: "Defined hierarchies, specialized roles." },
      ],
      verdict: "Neither is 'better' — they're different ways of doing business. Choose deliberately.",
    },
    {
      id: "stages",
      kind: "ordered-steps",
      title: "Life stages",
      items: [
        { title: "Pre-seed", body: "Idea → first MVP. Funding: personal savings, FFF, early grants, incubators." },
        { title: "Seed", body: "MVP → first customers. Funding: grants, angels, crowdfunding, early-stage VC." },
        { title: "Growth", body: "Model works → expand. Funding: VC funds, partnerships, accelerators." },
        { title: "Scale-up", body: "Validated model → dominate. Funding: Series A/B/C, international funds, IPO/exit." },
      ],
    },
    {
      id: "italian",
      kind: "callout-protip",
      title: "Italian innovative-startup status",
      body:
        "A specific category under DL 179/2012. Capital company, <5 years, registered in Italy, no profit distribution, innovative-purpose. Plus one of: 15% R&D spending · 1/3 PhDs (or 2/3 master's) on team · owned patent or registered software. Benefits: tax breaks, simplified bureaucracy, SME Guarantee Fund priority, stock options & WFE.",
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Place your project on the pre-seed → scale-up map. Then list the single biggest decision in front of you in the next 30 days for that stage.",
    },
  ],
};

const M2: ExtendedModule = {
  moduleId: "m2-trl-irl",
  heroDiagram: "growth",
  hook:
    "Two scales for two questions: TRL measures technology maturity, IRL measures investability. Both matter — and they don't move together.",
  sections: [
    {
      id: "trl",
      kind: "ordered-steps",
      title: "TRL — Technology Readiness Level",
      items: [
        { title: "1–3", body: "Basic principles → concept formulated → experimental proof of concept." },
        { title: "4–6", body: "Lab validation → relevant-environment validation → prototype tested in operational environment." },
        { title: "7–9", body: "System demonstrated → complete & qualified → in real-world use." },
      ],
    },
    {
      id: "irl",
      kind: "ordered-steps",
      title: "IRL — Investment Readiness Level",
      items: [
        { title: "1–3", body: "Idea → basic validation with experts → first market signals." },
        { title: "4–6", body: "Business proof of concept → MVP with first users → early revenue." },
        { title: "7–9", body: "Validated business model → demonstrated scalability → ready for international rounds." },
      ],
    },
    {
      id: "compare",
      kind: "callout-warning",
      title: "Beware: TRL ≠ IRL",
      body:
        "A deep-tech startup can sit at TRL 8 (tech ready) but IRL 3 (no validated business). Investors will pass — and rightly so. Strategic startups balance both, communicating to public-call evaluators in TRL terms and to VCs in IRL terms.",
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Self-assess your current TRL and IRL on a 1–9 scale. The bigger gap is your next priority — close it before raising or applying.",
    },
  ],
};

const M3: ExtendedModule = {
  moduleId: "m3-idea",
  heroDiagram: "key",
  hook:
    "Anyone has ideas in the shower. Few do something about them. The history of innovation is made by ordinary people who started building before they felt ready.",
  sections: [
    {
      id: "talk",
      kind: "ordered-steps",
      title: "Make your idea concrete",
      items: [
        { title: "Talk to 5+ people you know", body: "Explain casually. Ask: 'Would you use it? Would you pay?'" },
        { title: "Look for those who've already built it", body: "Analyze competitors. Reach out — most founders share when approached sincerely." },
        { title: "Convince yourself you're ready", body: "You don't need funding, patent, or company yet. The barriers are mental." },
      ],
    },
    {
      id: "strong-ideas",
      kind: "principle-grid",
      title: "What strong ideas have in common",
      items: [
        { title: "Born from a problem you experienced", body: "Direct, painful, persistent." },
        { title: "Simpler / cheaper / more sustainable / faster", body: "Real edge over what exists." },
        { title: "Add value to something already working", body: "Riding a wave is easier than creating one." },
        { title: "Sit on a growing trend", body: "Digital · well-being · sustainability · automation · education · care." },
      ],
    },
    {
      id: "checklist",
      kind: "callout-protip",
      title: "The 7-question idea checklist",
      body:
        "1) Clear problem? 2) Sensible solution? 3) Real market? 4) Someone would pay? 5) Can test small? 6) Want to carry forward? 7) Can start now? More than 5 ✓ = ready to test. 3–5 = needs shape. <3 = define problem better.",
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Schedule three 30-minute conversations this week. Don't pitch — listen. The first 5 conversations reshape every assumption you started with.",
    },
  ],
};

const M4: ExtendedModule = {
  moduleId: "m4-validation",
  heroDiagram: "scales",
  hook:
    "Validation isn't a survey among friends or an expert opinion. It's concrete, measurable feedback from the market — even at small scale.",
  sections: [
    {
      id: "three-levels",
      kind: "ordered-steps",
      title: "Three levels of validation",
      items: [
        { title: "Problem validation", body: "Do real people have this problem and feel it as relevant? Method: 5–20 exploratory interviews." },
        { title: "Solution validation", body: "Is your proposal understandable, desirable, interesting? Method: landing page + CTA + small ad test." },
        { title: "Willingness to pay", body: "Are people actually willing to spend money? Method: pre-orders, concierge MVP, paid pilot." },
      ],
    },
    {
      id: "cases",
      kind: "principle-grid",
      title: "Three Italian validation case studies",
      items: [
        { title: "Dendron", body: "Sustainability — validated through scientific data + certifications + multi-sector prototypes." },
        { title: "Magnifica Rotonda", body: "Gourmet frozen pizza — validated via patented R&D + Horeca tasting + dual sales channel." },
        { title: "Mashcream", body: "Experiential gelato — validated through trade fairs + live show-cooking before the first store." },
      ],
    },
    {
      id: "mistakes",
      kind: "principle-grid",
      title: "Mistakes to avoid",
      items: [
        { title: "Working in silence", body: "If nobody knows about it, nobody can validate it." },
        { title: "Asking 'do you like my idea?'", body: "Ask for behaviors, not opinions." },
        { title: "Drawing conclusions from a few yeses", body: "Friends and family aren't the market." },
        { title: "Quitting at the first criticism", body: "Validation is also training in constructive confrontation." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Pick the validation level you're weakest on. Design one experiment for the next 14 days. Predict the outcome before running it.",
    },
  ],
};

const M5: ExtendedModule = {
  moduleId: "m5-company-system",
  heroDiagram: "compass",
  hook:
    "A company is a complex system of resources, stakeholders, and accounting flows. Understanding it as a system — not just a product — is the prerequisite to managing it.",
  sections: [
    {
      id: "stakeholders",
      kind: "principle-grid",
      title: "Stakeholder map",
      items: [
        { title: "Employees", body: "Operational engine — well-being and productivity drive success." },
        { title: "Managers", body: "Plan and execute — decisions shape competitiveness." },
        { title: "Owners / shareholders", body: "Capital + risk." },
        { title: "Customers", body: "Main revenue source — satisfaction = growth." },
        { title: "Suppliers, banks, the State, consultants", body: "External relationships that shape day-to-day reality." },
      ],
    },
    {
      id: "fs",
      kind: "ordered-steps",
      title: "The financial statements",
      items: [
        { title: "Balance Sheet", body: "Snapshot: assets vs liabilities + equity." },
        { title: "Income Statement", body: "Costs vs revenues → profit/loss for the period." },
        { title: "Notes to the Financial Statements", body: "Explanatory details for accurate interpretation." },
        { title: "Cash Flow Statement", body: "Liquidity in and out — essential for cash management." },
        { title: "Management Report", body: "Performance, risks, and strategy narrative." },
      ],
    },
    {
      id: "principles",
      kind: "principle-grid",
      title: "Five accounting principles",
      items: [
        { title: "Accrual", body: "Record in the period the activity relates to, regardless of cash movement." },
        { title: "Clarity & transparency", body: "Understandable to outsiders." },
        { title: "Prudence", body: "Conservative valuations — no overstatement." },
        { title: "Going concern", body: "Assume the business continues." },
        { title: "Comparability", body: "Same method across periods so trends are visible." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "List your top 10 stakeholders. For each: what do they want from you? What do you want from them? Find any pair where the answers don't match.",
    },
  ],
};

const M6: ExtendedModule = {
  moduleId: "m6-funding-options",
  heroDiagram: "key",
  hook:
    "There's no shortage of money — there's a shortage of good startups to invest in. Match capital to stage; the wrong source dilutes more than it helps.",
  sections: [
    {
      id: "equity",
      kind: "principle-grid",
      title: "Equity funding",
      items: [
        { title: "Bootstrapping", body: "Self-funded. Total control. Slow growth." },
        { title: "FFF (Friends, Family, Fools)", body: "Early, flexible — but personal-relationship risk. Always document." },
        { title: "Business Angels", body: "Capital + mentoring + network. Best for seed stage." },
        { title: "Venture Capital", body: "Big checks, growth pressure, dilution. Right for proven traction." },
        { title: "Equity Crowdfunding", body: "Many small investors + marketing benefit. Strict regulation." },
      ],
    },
    {
      id: "debt-public",
      kind: "principle-grid",
      title: "Debt + public",
      items: [
        { title: "Bank loans", body: "SME Guarantee Fund covers up to 80% in Italy. Specialized banks for startups exist." },
        { title: "Smart&Start Italia", body: "Subsidized loans up to €1.5M for innovative startups." },
        { title: "Regional / EU calls", body: "PNRR, Horizon Europe — non-repayable for innovative projects." },
      ],
    },
    {
      id: "stage",
      kind: "comparison",
      title: "Match to stage",
      leftLabel: "Wrong",
      rightLabel: "Right",
      comparison: [
        { left: "Idea-stage founder pitching VCs.", right: "Idea-stage founder bootstrapping + applying for grants." },
        { left: "Series A startup taking a personal bank loan.", right: "Series A startup raising VC with proper diligence." },
        { left: "FFF without a written agreement.", right: "FFF with clear terms in writing — preserves relationships." },
      ],
      verdict: "Wrong-stage capital is harder to manage than no capital.",
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "List 2 capital sources you'll target in the next 6 months. Why those two specifically — given your stage, dilution tolerance, and timeline?",
    },
  ],
};

const M7: ExtendedModule = {
  moduleId: "m7-patents-trademarks",
  heroDiagram: "scales",
  hook:
    "IP protection is a strategic investment. Not everything needs a patent — but most things need a trademark. Knowing the difference saves money and conflict.",
  sections: [
    {
      id: "patent",
      kind: "principle-grid",
      title: "Patents — when worth it",
      items: [
        { title: "Requirements", body: "New (not disclosed), inventive (non-obvious), industrially applicable." },
        { title: "Pros", body: "20-year exclusivity. Blocks competitors. Monetizable via licensing. Increases company value." },
        { title: "Cons", body: "Expensive. Long timelines (years). Geographic — only valid where filed." },
        { title: "Alternative", body: "Trade secret can be more effective and cheaper." },
      ],
    },
    {
      id: "trademark",
      kind: "principle-grid",
      title: "Trademark — almost always worth it",
      items: [
        { title: "Italy", body: "UIBM (Italian Patent and Trademark Office)." },
        { title: "Europe", body: "EUIPO — one filing, all 27 EU countries." },
        { title: "World", body: "WIPO via Madrid system." },
        { title: "Duration", body: "10 years, renewable indefinitely." },
      ],
    },
    {
      id: "active-defense",
      kind: "callout-protip",
      title: "Active defense",
      body:
        "Registration alone isn't enough. Monitor the market for imitators. Register strategic web domains. Use cease-and-desist before lawsuits. License IP to generate revenue.",
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "List your IP assets: name, logo, code, patents, content. For each: protected? Replacement cost? What's missing?",
    },
  ],
};

const M8: ExtendedModule = {
  moduleId: "m8-legal",
  heroDiagram: "bridge",
  hook:
    "Legal isn't bureaucracy — it's a tool for giving concrete form to innovation. You don't need to be a lawyer, but you do need to know the basics.",
  sections: [
    {
      id: "areas",
      kind: "ordered-steps",
      title: "Five legal areas to know",
      items: [
        { title: "Incorporation", body: "When to form a company — and which form fits your stage." },
        { title: "Statute, cap table, shareholders' agreements", body: "How decisions are made and equity is shared." },
        { title: "IP protection", body: "Trademarks, patents, copyright on software and content." },
        { title: "Essential contracts", body: "Founders' agreement, NDAs, contractor letters, customer/supplier contracts." },
        { title: "Privacy & GDPR", body: "Even an email signup needs a clear privacy notice." },
      ],
    },
    {
      id: "captable",
      kind: "callout-warning",
      title: "Cap table & shareholders' agreement",
      body:
        "Cap table: who owns how much — keep it updated from day one. Shareholders' agreement: what the statute can't cover (vesting, anti-dilution, drag-along, tag-along, exit clauses). 50/50 splits without a written agreement are a textbook recipe for paralysis.",
    },
    {
      id: "mistakes",
      kind: "principle-grid",
      title: "Common mistakes",
      items: [
        { title: "Incorporating too early", body: "Without validation, you spend on a structure you might pivot away from." },
        { title: "Symbolic equity splits", body: "Equal splits ignore actual contribution." },
        { title: "Generic statute", body: "Copy-paste statutes lock you into rigidities." },
        { title: "Ignoring privacy", body: "GDPR fines aren't a startup-friendly cost." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Audit your legal posture. Founders' agreement signed? Cap table updated? Trademark registered? GDPR notice live? Pick the missing item and act this week.",
    },
  ],
};

const M9: ExtendedModule = {
  moduleId: "m9-corporate-forms",
  heroDiagram: "compass",
  hook:
    "VAT, S.r.l.s., S.r.l., cooperative — each form is a strategic choice. Don't open a company just to feel like a startup. Open one when the project actually needs it.",
  sections: [
    {
      id: "forms",
      kind: "comparison",
      title: "Two main paths",
      leftLabel: "Sole proprietorship / VAT",
      rightLabel: "Capital company (S.r.l. / S.r.l.s.)",
      comparison: [
        { left: "Fast, cheap, simple.", right: "Higher initial costs (notary, accountant, capital)." },
        { left: "Flat-rate up to €85k revenue.", right: "Ordinary accounting, IRES + IRAP." },
        { left: "Unlimited personal liability.", right: "Limited liability — personal assets protected." },
        { left: "No partners, no equity.", right: "Multi-shareholder, ready for investors." },
      ],
      verdict: "Sole proprietorship for solo testing. Capital company for any team / fundraising / scale.",
    },
    {
      id: "innovative",
      kind: "callout-protip",
      title: "Innovative startup status",
      body:
        "Apply after incorporating as a capital company. Requirements: <5 years, registered in Italy, <€5M revenue, no profit distribution, innovative purpose. Plus one of: 15% R&D, 1/3 PhDs (or 2/3 master's), or owned IP. Benefits: tax deductions for investors, exemption from incorporation duties, SME Guarantee Fund priority, stock options & WFE allowed.",
    },
    {
      id: "table",
      kind: "principle-grid",
      title: "Quick-reference comparison",
      items: [
        { title: "Sole proprietorship", body: "Best for: freelancers, market testing." },
        { title: "S.r.l.s.", body: "Best for: early-stage startups with little capital." },
        { title: "S.r.l.", body: "Best for: startups with growth ambitions." },
        { title: "Cooperative", body: "Best for: social enterprises, collective projects." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Decide your form. Justify with 3 reasons grounded in your stage, team, and 12-month plan. Talk to an accountant before signing.",
    },
  ],
};

const M10: ExtendedModule = {
  moduleId: "m10-being-entrepreneur",
  heroDiagram: "lighthouse",
  hook:
    "Doing business isn't a job. It's a way of acting under uncertainty — identifying opportunity, imagining solutions, and building organization to bring them to the world.",
  sections: [
    {
      id: "compare",
      kind: "comparison",
      title: "Employee vs entrepreneur",
      leftLabel: "Employee",
      rightLabel: "Entrepreneur",
      comparison: [
        { left: "Income fixed.", right: "Income variable, potentially uncapped." },
        { left: "Hours set.", right: "Hours flexible (often longer)." },
        { left: "Security high.", right: "Security low, especially early." },
        { left: "Decisions made by others.", right: "You decide." },
      ],
      verdict: "Neither is better — pick deliberately.",
    },
    {
      id: "traits",
      kind: "principle-grid",
      title: "Traits of those who actually build",
      items: [
        { title: "Intrinsic motivation", body: "Not just for money — because it makes sense." },
        { title: "Vision and ambition", body: "You see a problem and can't ignore it." },
        { title: "Adaptability", body: "Change plans when needed; learn continuously." },
        { title: "Tolerance for uncertainty", body: "Function without certainty." },
        { title: "Bias toward action", body: "An idea isn't enough — you want to ship." },
      ],
    },
    {
      id: "ferriss",
      kind: "quote-card",
      quote: {
        quote: "Ask for forgiveness, not permission. If it's not going to devastate those around you, try it and justify it afterward.",
        attribution: "Tim Ferriss",
      },
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Three honest answers: (1) Do you have a 6–12 month emergency fund? (2) Are you OK deciding without certainty? (3) Side-project, full-time, or hybrid — what's your transition strategy?",
    },
  ],
};

const M11: ExtendedModule = {
  moduleId: "m11-afc",
  heroDiagram: "compass",
  hook:
    "Numbers are your compass. Without an AFC system, you're navigating without one. Even a one-person startup needs the basics — start small, build the habit early.",
  sections: [
    {
      id: "why",
      kind: "ordered-steps",
      title: "Four reasons AFC matters from day one",
      items: [
        { title: "Cash flow + runway", body: "How many months you have left before money runs out." },
        { title: "Prevention", body: "Missing receipts, untracked transfers — small slips become big problems." },
        { title: "Smarter decisions", body: "Marketing or product? Hire or outsource? Without numbers, it's instinct." },
        { title: "Investor trust", body: "Nobody invests in a startup that can't account for itself." },
      ],
    },
    {
      id: "system",
      kind: "ordered-steps",
      title: "Build the system in 4 steps",
      items: [
        { title: "Assess current state", body: "How do you record income and expenses today?" },
        { title: "Standardize", body: "Shared file, monthly review date, separate business account, expense-approval threshold." },
        { title: "Use technology", body: "Wave, Xero, QuickBooks, Reviso for accounting; Sheets/Notion for budget; Stripe for payments." },
        { title: "Monthly internal audit", body: "Compare budget vs actual. Spot anomalies. Talk to an accountant for the rest." },
      ],
    },
    {
      id: "habits",
      kind: "principle-grid",
      title: "Lean but effective AFC habits",
      items: [
        { title: "Set monthly milestones", body: "Track gap between targets and actual results." },
        { title: "Classify expenses", body: "Essential vs non-essential. Personal expenses NEVER through company account." },
        { title: "Fixed monthly date", body: "Don't review when you remember — review when it's scheduled." },
        { title: "Plan ahead", body: "Stock options, incentives — structure today buys flexibility tomorrow." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Open a spreadsheet. Cell A1: cash on hand. Cell A2: average monthly burn. Cell A3: =A1/A2. That's your runway. If <6 months, what are 3 ways to extend it (cut, raise, sell)?",
    },
  ],
};

const M12: ExtendedModule = {
  moduleId: "m12-ai-for-startups",
  heroDiagram: "loop",
  hook:
    "AI doesn't replace vision, courage, or understanding of people — but it amplifies all three. For a solo founder, AI is the always-available teammate.",
  sections: [
    {
      id: "leverage",
      kind: "principle-grid",
      title: "Six leverage points",
      items: [
        { title: "Validate & refine ideas", body: "ChatGPT/Claude for assisted brainstorming, niche exploration, hybrid models." },
        { title: "Build identity & brand", body: "Canva AI, Midjourney, DALL·E for visuals." },
        { title: "Develop MVPs without a CTO", body: "Bubble, Webflow, Builder.ai, Replit AI." },
        { title: "Marketing without a team", body: "Jasper, Copy.ai, Notion AI for content at scale." },
        { title: "Collect & analyze feedback", body: "Typeform + GPT, sentiment analysis on reviews/forums." },
        { title: "Stay organized & automate", body: "Notion AI, ClickUp AI, Zapier + GPT." },
      ],
    },
    {
      id: "rules",
      kind: "principle-grid",
      title: "Smart usage rules",
      items: [
        { title: "Don't chase novelty", body: "Focus on value generated, not tools collected." },
        { title: "Experiment but measure", body: "AI without metrics is theater." },
        { title: "Maintain human control", body: "AI suggests, you decide. Verify outputs against real data." },
        { title: "Document usage", body: "What worked, what didn't — build institutional knowledge." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Pick 3 recurring tasks (writing, research, follow-ups). For each: which AI tool could speed it up by ≥50%? Try one this week.",
    },
  ],
};

// =============================================================================
// IRL 5 add-ons (Modules 32–34)
// =============================================================================

const M32: ExtendedModule = {
  moduleId: "m32-marketing-branding",
  heroDiagram: "bridge",
  hook:
    "Marketing isn't pushing — it's a bridge between what you do and who needs it. Listen, build trust, communicate consistently.",
  sections: [
    {
      id: "vp",
      kind: "callout-insight",
      title: "Value proposition first",
      body:
        "Why should someone choose you, right now? Answer: who's the ideal customer, what need you solve, what's the key benefit, what makes you different. Without a clear VP, every tactic dilutes.",
    },
    {
      id: "branding",
      kind: "principle-grid",
      title: "Branding fundamentals",
      items: [
        { title: "Values", body: "What guides your choices and promises." },
        { title: "Personality", body: "Technical and direct? Friendly and creative?" },
        { title: "Tone of voice", body: "Formal? Empathetic? Ironic?" },
        { title: "Visual elements", body: "Colors, font, photographic style, layout." },
      ],
    },
    {
      id: "channels",
      kind: "ordered-steps",
      title: "Strategic channel selection",
      items: [
        { title: "Define objective", body: "Visibility, leads, sales, trust — pick one primary." },
        { title: "Pick 1–2 channels", body: "Better depth than spread. LinkedIn (B2B), Instagram (visual), Facebook (local)." },
        { title: "Adapt content", body: "Same idea, different format per platform." },
        { title: "Measure results", body: "Reach, engagement, clicks, qualified leads." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Write your VP in one sentence. Read it aloud. If it doesn't sound specific enough that a stranger immediately understands, rewrite it.",
    },
  ],
};

const M33: ExtendedModule = {
  moduleId: "m33-editorial-plan",
  heroDiagram: "loop",
  hook:
    "Social isn't a megaphone — it's a conversation. A digital editorial plan turns sporadic posting into strategic, measurable activity.",
  sections: [
    {
      id: "framework",
      kind: "ordered-steps",
      title: "DEP framework",
      items: [
        { title: "Audience", body: "Who you're addressing — segment, role, interests." },
        { title: "Topics", body: "What you communicate — 3–5 recurring themes." },
        { title: "Objectives", body: "Visibility, leads, sales, trust." },
        { title: "Tone & format", body: "Voice + visual language." },
        { title: "Channels", body: "Where you publish (1–2, not all)." },
        { title: "Frequency & calendar", body: "Sustainable cadence — 2–3 quality posts/week beats 10 mediocre." },
      ],
    },
    {
      id: "rubrics",
      kind: "principle-grid",
      title: "Fixed content formats (rubrics)",
      items: [
        { title: "Tip of the week", body: "Practical advice in your domain — builds authority." },
        { title: "Customer story", body: "Real impact, real people — generates trust." },
        { title: "Behind the scenes", body: "Humanizes the brand." },
        { title: "Insight / reflection", body: "Industry takes that show thinking, not just doing." },
      ],
    },
    {
      id: "tools",
      kind: "principle-grid",
      title: "Tools for management",
      items: [
        { title: "Canva", body: "Graphics and visuals." },
        { title: "Notion / Trello", body: "Editorial calendar and planning." },
        { title: "Buffer / Hootsuite / Later", body: "Schedule across platforms." },
        { title: "Meta Business Suite", body: "Native scheduling for FB / IG." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Plan 8 posts for the next 4 weeks (2/week). For each: topic, format, channel, CTA. You don't need 30 posts — 8 well-chosen ones beat that.",
    },
  ],
};

const M34: ExtendedModule = {
  moduleId: "m34-abm",
  heroDiagram: "target",
  hook:
    "ABM reverses the funnel: instead of speaking to many, speak to a few selected accounts with highly personalized messaging. Especially powerful in B2B.",
  sections: [
    {
      id: "when",
      kind: "principle-grid",
      title: "When ABM fits",
      items: [
        { title: "High value per customer", body: "One client = significant revenue." },
        { title: "Complex B2B decision", body: "Multiple stakeholders, long cycle." },
        { title: "Limited market", body: "Small number of strategic accounts (e.g., medium-large companies in a vertical)." },
        { title: "Consultative sales", body: "Trust-building > transactional volume." },
      ],
    },
    {
      id: "process",
      kind: "ordered-steps",
      title: "5-step ABM process",
      items: [
        { title: "Identify strategic accounts", body: "5–20 specific companies that fit your ideal customer." },
        { title: "Research deeply", body: "Decision makers, pain points, communication channels." },
        { title: "Personalize content", body: "Custom landing pages, decks, demos for each." },
        { title: "Activate via right channels", body: "LinkedIn, events, warm intros — not cold mass campaigns." },
        { title: "Measure interactions", body: "Responses, meetings booked, pipeline created." },
      ],
    },
    {
      id: "metrics",
      kind: "callout-warning",
      title: "Don't measure ABM by impressions",
      body:
        "Vanity metrics destroy ABM. Measure: qualified meetings, pipeline created, deals closed. 3 meetings + 1 paid pilot from 10 accounts is a win.",
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "List 10 specific companies that fit your ideal customer. For each: 1 contact name, 1 pain you can address, 1 next step.",
    },
  ],
};

// =============================================================================
// IRL 6 — Revenue model (Modules 35–40)
// =============================================================================

const M35: ExtendedModule = {
  moduleId: "m35-financial-model",
  heroDiagram: "growth",
  hook:
    "Numbers are the operational translation of vision. A financial model tells you whether the idea is sustainable, when cash runs out, and which lever moves the business.",
  sections: [
    {
      id: "what",
      kind: "callout-insight",
      title: "What to actually build",
      body:
        "Forget full balance-sheet-quality outputs. Build a forecast income statement (revenues, costs, margins, P&L) plus a simple cash-flow projection (when money comes in vs goes out). These two answer: are you generating or burning cash, and how much runway is left?",
    },
    {
      id: "steps",
      kind: "ordered-steps",
      title: "7 steps",
      items: [
        { title: "Define the model's objective", body: "Why are you building it? Who reads it?" },
        { title: "Pick key KPIs", body: "Customers, average deal, conversion rate, variable cost." },
        { title: "Structure the model", body: "Separate sections for assumptions, revenue, costs, cash flow." },
        { title: "Start from revenues", body: "Then back-into the costs to support them." },
        { title: "Don't forget hidden costs", body: "Legal, hosting, banking — the 'small' costs add up." },
        { title: "Model cash flow carefully", body: "Account for collection times, advances, expense peaks." },
        { title: "Make formulas flexible", body: "Test best/worst/realistic scenarios with one assumption change." },
      ],
    },
    {
      id: "tools",
      kind: "principle-grid",
      title: "Tools",
      items: [
        { title: "Sheets / Excel", body: "Reliable, free, flexible. Start here." },
        { title: "Causal / Layer / Tiller", body: "More interactive modeling." },
        { title: "YC / Seedcamp templates", body: "Editable starting points." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Open a sheet. 12 monthly columns. Rows for revenues, costs, margin, cumulative cash. Compute when (if) you cross break-even.",
    },
  ],
};

const M36: ExtendedModule = {
  moduleId: "m36-scalability",
  heroDiagram: "growth",
  hook:
    "Scalability is the ability to grow revenues without growing costs at the same rate. It's what separates a startup from a small business.",
  sections: [
    {
      id: "kinds",
      kind: "principle-grid",
      title: "Four kinds of scalability",
      items: [
        { title: "Revenue", body: "More customers, markets, products. Up-sell, cross-sell." },
        { title: "Operational", body: "Handle more orders / users without linear cost growth." },
        { title: "Technological", body: "Infrastructure that handles 10× traffic / data." },
        { title: "Organizational", body: "Structures and processes ready for new people." },
      ],
    },
    {
      id: "design",
      kind: "ordered-steps",
      title: "Design for scale from the start",
      items: [
        { title: "Replicable business model", body: "Subscriptions, licenses, digital channels — repeatable units." },
        { title: "Standardizable processes", body: "Document, automate, delegate." },
        { title: "Modular technology", body: "Expandable, integrable, updatable." },
        { title: "Traceable customer journey", body: "If you can measure 5 customers, you can measure 500." },
      ],
    },
    {
      id: "warning",
      kind: "callout-warning",
      title: "Beware of false growth",
      body:
        "Costs growing faster than revenues. Quality dropping at scale. Loss of process control. Rising churn. Scaling badly is worse than not scaling at all.",
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Imagine 10× more customers next year. What breaks first — operations, tech, team, cash? Fix the weakest link before scaling.",
    },
  ],
};

const M37: ExtendedModule = {
  moduleId: "m37-management-control",
  heroDiagram: "compass",
  hook:
    "Management control isn't bureaucracy — it's how you turn numbers into decisions. Monitor performance, compare to objectives, adjust course.",
  sections: [
    {
      id: "elements",
      kind: "ordered-steps",
      title: "Five elements you need",
      items: [
        { title: "Budget + forecast", body: "Annual or quarterly. Periodically updated as forecast." },
        { title: "Cost monitoring", body: "Variable, fixed, strategic — separated and trended." },
        { title: "Revenue monitoring", body: "By source / segment / channel." },
        { title: "Variance analysis", body: "Budget vs actual — where the gap is, your assumptions were weakest." },
        { title: "KPI dashboard", body: "5 indicators max, monthly review." },
      ],
    },
    {
      id: "variance",
      kind: "callout-insight",
      title: "Variance is information, not blame",
      body:
        "When actuals diverge from plan, the response is analysis — not reflex. Was the marketing overspend ROI-positive? Did churn spike because of a price test or a product issue? Variance triggers learning.",
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Build a 1-page KPI dashboard: 2 financial, 2 operational, 1 leading indicator. Monthly target for each. Review every Friday.",
    },
  ],
};

const M38: ExtendedModule = {
  moduleId: "m38-crm",
  heroDiagram: "bridge",
  hook:
    "Real value lives in relationships, not single sales. A satisfied customer returns, recommends, becomes an ambassador. An ignored one leaves silently.",
  sections: [
    {
      id: "why",
      kind: "callout-insight",
      title: "Why even 5 customers need a CRM",
      body:
        "Without one: data scattered across emails, WhatsApp, Excel, the founder's head. Works at 5 customers, breaks at 50 — and you waste valuable opportunities.",
    },
    {
      id: "setup",
      kind: "ordered-steps",
      title: "Set up a lightweight CRM",
      items: [
        { title: "Map all touchpoints", body: "Forms, emails, social, events." },
        { title: "Centralize the database", body: "Sheets, Notion, Airtable, HubSpot Free." },
        { title: "Define a relationship funnel", body: "Awareness → interest → evaluation → purchase → retention." },
        { title: "Personalize communication", body: "Segment by type, customize messages." },
        { title: "Integrate marketing, sales, support", body: "Same data for everyone." },
      ],
    },
    {
      id: "tools",
      kind: "principle-grid",
      title: "Tool ladder",
      items: [
        { title: "Sheets / Excel", body: "Phase 1 — start here." },
        { title: "Notion / Trello / Airtable", body: "Phase 2 — visual + collaborative." },
        { title: "HubSpot Free", body: "Phase 3 — when you need real automation." },
        { title: "Pipedrive / Zoho / Streak", body: "Phase 4 — sales-team scale." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "List your last 10 customer conversations. Name, channel, status, next action, date. That's CRM v0.1 — keep updating weekly.",
    },
  ],
};

const M39: ExtendedModule = {
  moduleId: "m39-business-plan",
  heroDiagram: "compass",
  hook:
    "A business plan isn't a formal obligation — it's a tool to think, plan, and communicate. Most useful when grants, banks, or investors require it.",
  sections: [
    {
      id: "sections",
      kind: "ordered-steps",
      title: "8 essential sections",
      items: [
        { title: "Executive Summary", body: "Read first, written last. 2 pages max." },
        { title: "Context & problem", body: "Real data, not personal intuition." },
        { title: "Value proposition & business model", body: "Use the BMC." },
        { title: "Target market & marketing strategy", body: "Channels, target, KPIs." },
        { title: "Operational plan", body: "Team, milestones, quarterly roadmap." },
        { title: "Economic-financial plan", body: "Forecast P&L + investments + cash flow." },
        { title: "Team & governance", body: "People + their roles + advisors." },
        { title: "Growth strategy", body: "Where you'll be in 2 / 5 years." },
      ],
    },
    {
      id: "when-not",
      kind: "callout-warning",
      title: "When NOT to write one",
      body:
        "Still exploring without knowing your customer. Product not yet tested. Writing it 'to look good' and never reread. In those cases, use lighter tools first: BMC, Lean Canvas, hypothesis log.",
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Write a 1-page executive summary. Who you are, what problem, your solution, market, model, team, traction, what you need.",
    },
  ],
};

const M40: ExtendedModule = {
  moduleId: "m40-recruiting",
  heroDiagram: "bridge",
  hook:
    "People before processes. Hiring isn't a routine — it's a strategic lever. The team is the real growth multiplier.",
  sections: [
    {
      id: "first",
      kind: "principle-grid",
      title: "Who to hire first",
      items: [
        { title: "Self-starters", body: "Flexible, autonomous, can cover multiple areas." },
        { title: "Vision-motivated", body: "Not just salary — they care about the why." },
        { title: "Quick learners", body: "Processes don't exist yet; learning rate matters." },
        { title: "Broad over generalist", body: "Deep in 2–3 areas beats superficial in many." },
      ],
    },
    {
      id: "when",
      kind: "ordered-steps",
      title: "When and how",
      items: [
        { title: "When", body: "Recurring need uncovered, sustained workload growth, missing critical skills." },
        { title: "Clarify the profile", body: "Title, mission, top 3 responsibilities, success metric." },
        { title: "Search through right channels", body: "Network, LinkedIn, universities, communities." },
        { title: "Practical tests over CV review", body: "What can they actually do?" },
        { title: "Consider alternatives first", body: "Freelancer, internship, part-time, outsourcing." },
      ],
    },
    {
      id: "culture",
      kind: "callout-insight",
      title: "Culture, even at 3 people",
      body:
        "Culture is defined by how decisions are made, how conflict is managed, how mistakes are received, what language is used, what's tolerated. Coherence in behavior is what attracts and retains.",
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Write a 10-line job profile for your next hire. Title, mission, responsibilities, must-haves, contract type, what success looks like in 6 months.",
    },
  ],
};

// =============================================================================
// IRL 7 — High-fidelity MVP, fundraising, ESG (Modules 41–45)
// =============================================================================

const M41: ExtendedModule = {
  moduleId: "m41-industrial-plan",
  heroDiagram: "compass",
  hook:
    "An industrial plan transforms an idea into a concrete, sustainable, scalable company. The bridge between vision and execution.",
  sections: [
    {
      id: "sections",
      kind: "ordered-steps",
      title: "Core sections",
      items: [
        { title: "Executive summary", body: "Read first, written last." },
        { title: "Context & problem analysis", body: "With real data, not just personal observation." },
        { title: "Value proposition & business model", body: "Use the BMC as foundation." },
        { title: "Market & marketing strategy", body: "Target, channels, KPIs." },
        { title: "Operational plan", body: "Team, milestones, quarterly roadmap." },
        { title: "Economic-financial plan", body: "Forecast P&L + investments + cash flow." },
        { title: "Team & governance", body: "People + advisors + roles." },
        { title: "Growth strategy", body: "Where you'll be in 2–5 years." },
      ],
    },
    {
      id: "best",
      kind: "principle-grid",
      title: "Best practices",
      items: [
        { title: "Involve customers", body: "Test with a small group early." },
        { title: "Concrete > theoretical", body: "Actionable beats polished." },
        { title: "Few clear 12-month objectives", body: "Focus over breadth." },
        { title: "Review every 6 months", body: "Especially in evolving markets." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Build a 4-quarter operational roadmap. For each quarter: 3 milestones, key resources required, success metric.",
    },
  ],
};

const M42: ExtendedModule = {
  moduleId: "m42-fundraising",
  heroDiagram: "key",
  hook:
    "Fundraising is more than money — it's a strategic process defining the relationship between your startup and its ecosystem.",
  sections: [
    {
      id: "stages",
      kind: "ordered-steps",
      title: "Match capital to stage",
      items: [
        { title: "Pre-seed", body: "Bootstrapping, FFF, micro-grants." },
        { title: "Seed", body: "Angels, equity crowdfunding, small VC, accelerators." },
        { title: "Series A/B/C", body: "VC funds, sector funds, corporate venture." },
        { title: "Growth / Exit", body: "Large funds, Series A+, IPO, M&A." },
      ],
    },
    {
      id: "process",
      kind: "ordered-steps",
      title: "8-step process",
      items: [
        { title: "Define objectives & need", body: "Tied to a specific milestone." },
        { title: "Build the business plan", body: "Foundation of every conversation." },
        { title: "Prepare pitch deck", body: "10–15 slides, visual, simple, direct." },
        { title: "Map potential investors", body: "Right thesis, sector, stage." },
        { title: "Train storytelling", body: "Elevator + meeting + public pitch versions." },
        { title: "Manage negotiation", body: "Valuation, clauses, governance — get a lawyer." },
        { title: "Use funds with discipline", body: "Investors will ask how you spent it." },
        { title: "Nurture investor relationships", body: "Quarterly updates — they become allies." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Map 10 investors aligned with your stage and sector. For each: name, thesis, average ticket, notable portfolio, warm path to introduction.",
    },
  ],
};

const M43: ExtendedModule = {
  moduleId: "m43-crowdfunding",
  heroDiagram: "growth",
  hook:
    "Crowdfunding raises capital AND validates demand. More than a financing mechanism — a market test with money attached.",
  sections: [
    {
      id: "types",
      kind: "principle-grid",
      title: "Four types",
      items: [
        { title: "Reward-based", body: "Kickstarter, Indiegogo, Produzioni dal Basso. For tangible products." },
        { title: "Equity", body: "Mamacrowd, CrowdFundMe, Opstart. For scalable startups." },
        { title: "Donation", body: "GoFundMe, Rete del Dono. For social/territorial impact." },
        { title: "Lending", body: "Prestiamoci, BorsadelCredito. Peer loans with interest." },
      ],
    },
    {
      id: "preparation",
      kind: "ordered-steps",
      title: "Preparation makes or breaks the campaign",
      items: [
        { title: "Define objective + target", body: "Amount, timeline, purpose, audience." },
        { title: "Choose the platform", body: "Each has its own audience and rules." },
        { title: "Build a compelling story", body: "Storytelling is the heart." },
        { title: "Communication plan", body: "Mailing list, social, contacts, events, ambassadors." },
        { title: "Prepare rewards (if applicable)", body: "High perceived value, low cost for you." },
        { title: "Real-time management", body: "Daily monitoring, comments, updates." },
        { title: "Close with style", body: "Deliver promises, turn supporters into ambassadors." },
      ],
    },
    {
      id: "warning",
      kind: "callout-warning",
      title: "Lock 30–40% before going public",
      body:
        "Most campaigns fail because founders launch with no community pre-warmed. The first week is everything — secure pledges from your network before going live.",
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "If you ran a 30-day campaign next month: target amount, type, platform, top 3 reward tiers, list of 50 people to contact pre-launch.",
    },
  ],
};

const M44: ExtendedModule = {
  moduleId: "m44-wfe-stock-options",
  heroDiagram: "scales",
  hook:
    "When cash is short and skills are critical, equity-based compensation attracts and retains key people. Tools widely used in startups, increasingly in traditional businesses too.",
  sections: [
    {
      id: "wfe",
      kind: "callout-insight",
      title: "Work for Equity",
      body:
        "A collaborator is paid in shares (whole or part) instead of money. Useful in early stage when you need critical skills you can't afford. In Italy: mainly for innovative startups, requires capital company, formal contracts, declared share value.",
    },
    {
      id: "options",
      kind: "ordered-steps",
      title: "Stock options — key elements",
      items: [
        { title: "Vesting", body: "Time required for the right to mature. Typical: 4 years with 1-year cliff." },
        { title: "Strike price", body: "Predetermined purchase price (usually current valuation)." },
        { title: "Milestones (optional)", body: "Tie vesting to performance objectives." },
      ],
    },
    {
      id: "structure",
      kind: "ordered-steps",
      title: "How to structure WFE",
      items: [
        { title: "Estimate startup valuation", body: "Even rough — must be formalized." },
        { title: "Determine work value", body: "Market rate for the skills/time provided." },
        { title: "Set percentage proportionally", body: "Small but meaningful." },
        { title: "Draft a clear contract", body: "Role, duration, value, conditions, vesting." },
        { title: "Align expectations openly", body: "Risks, governance, time horizons." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "If you offered WFE to one critical role: which role, how many months, what % equity, what milestones unlock vesting, what happens if they leave early?",
    },
  ],
};

const M45: ExtendedModule = {
  moduleId: "m45-esg",
  heroDiagram: "lighthouse",
  hook:
    "ESG is no longer just CSR. It's a real opportunity to build resilient startups attractive to investors, customers, and talent.",
  sections: [
    {
      id: "three",
      kind: "principle-grid",
      title: "Three dimensions",
      items: [
        { title: "Environmental", body: "Resource management, impact reduction, energy, waste, carbon footprint." },
        { title: "Social", body: "Collaborators, customers, communities, inclusion, well-being." },
        { title: "Governance", body: "Transparency, ethics, risk management, stakeholder engagement." },
      ],
    },
    {
      id: "start",
      kind: "ordered-steps",
      title: "Start at idea stage",
      items: [
        { title: "Assess current and potential impact", body: "What's the environmental, social, governance footprint?" },
        { title: "Define micro-objectives", body: "10% energy consumption reduction, code of ethics on website, monthly inclusion check." },
        { title: "Maintain consistency", body: "Hiring, supplier choices, communication aligned with declared values." },
      ],
    },
    {
      id: "tools",
      kind: "principle-grid",
      title: "Free tools to start",
      items: [
        { title: "B Impact Assessment", body: "ESG framework, industry standard." },
        { title: "SDG Action Manager", body: "Aligns business with UN Sustainable Development Goals." },
        { title: "Code of ethics templates", body: "Available online and adaptable." },
        { title: "ESG Canvas", body: "Simplified BMC integrating ESG components." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Pick one initiative for each dimension: Environmental (e.g., remote-first), Social (e.g., flexible hours), Governance (e.g., advisory board). Commit to one this quarter.",
    },
  ],
};

// =============================================================================
// IRL 8 — Pitch, Company Formation, Accounting, Public Calls (Modules 46–49)
// =============================================================================

const M46: ExtendedModule = {
  moduleId: "m46-pitch",
  heroDiagram: "key",
  hook:
    "The pitch is where vision meets others. The goal: make people understand in a few minutes why your startup deserves attention, trust, and resources.",
  sections: [
    {
      id: "formats",
      kind: "comparison",
      title: "Three pitch formats",
      leftLabel: "Format",
      rightLabel: "Use case",
      comparison: [
        { left: "Elevator Pitch (30s–2min, oral)", right: "Informal settings — spark interest, get a meeting." },
        { left: "Pitch Deck (10–15 slides)", right: "Formal meetings, competitions, accelerators." },
        { left: "Investor Deck (more detail)", right: "Sent after a positive first meeting." },
      ],
    },
    {
      id: "structure",
      kind: "ordered-steps",
      title: "10-slide structure",
      items: [
        { title: "Initial hook", body: "Striking data or short story." },
        { title: "Problem", body: "Real, felt, with examples." },
        { title: "Solution", body: "Clear, customer-benefit-focused." },
        { title: "Validation", body: "Data, testimonials, MVP, awards." },
        { title: "Anticipated objections", body: "Address skepticism preemptively." },
        { title: "Market", body: "TAM-SAM-SOM, positioning." },
        { title: "Business model", body: "How you make money." },
        { title: "Strategy & roadmap", body: "Next 6–24 months." },
        { title: "Team", body: "Why you're the right team." },
        { title: "Call to action", body: "What you ask for + amount + conditions." },
      ],
    },
    {
      id: "principles",
      kind: "principle-grid",
      title: "Effective pitch principles",
      items: [
        { title: "Simplicity", body: "One slide = one idea." },
        { title: "Visual clarity", body: "Readable fonts, strong contrast, clear charts." },
        { title: "Concreteness", body: "Numbers, facts, customers — not vague claims." },
        { title: "Authenticity", body: "No buzzwords if you're not deep-tech." },
        { title: "Customization", body: "Investor wants returns; accelerator wants team & scalability." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Outline your 10 slides — one sentence per slide. Then summarize all 10 in a single 60-second elevator pitch.",
    },
  ],
};

const M47: ExtendedModule = {
  moduleId: "m47-company-formation",
  heroDiagram: "bridge",
  hook:
    "Establishing a startup means moving from planning to action. Don't open too early — but don't wait too long.",
  sections: [
    {
      id: "ready",
      kind: "principle-grid",
      title: "Signs you're ready",
      items: [
        { title: "Idea validated", body: "MVP tested, first customers or signals." },
        { title: "Team cohesive", body: "Roles understood, agreement in place." },
        { title: "Need to formalize", body: "Invoicing, formal contracts, hiring." },
        { title: "Public calls / investors", body: "Require legal entity." },
      ],
    },
    {
      id: "process",
      kind: "ordered-steps",
      title: "6-step formation",
      items: [
        { title: "Define team & partners", body: "Founders' agreement first, formal contracts after." },
        { title: "Choose name, purpose, registered office", body: "Verify availability, draft purpose broadly." },
        { title: "Draft statute & incorporation deed", body: "Standard for S.r.l.s.; customized for ordinary S.r.l." },
        { title: "Notarial deed", body: "Or online procedure for innovative startups." },
        { title: "Open VAT, INPS/INAIL, Chamber of Commerce", body: "Mandatory registrations." },
        { title: "Optional: innovative startup section", body: "Free; unlocks tax breaks, WFE, stock options." },
      ],
    },
    {
      id: "costs",
      kind: "comparison",
      title: "Costs at a glance",
      leftLabel: "Form",
      rightLabel: "Approximate cost",
      comparison: [
        { left: "S.r.l.s.", right: "Capital €1–9,999 · free notary · €200–400 fees" },
        { left: "Ordinary S.r.l.", right: "Capital €10k+ · notary €1,200–2,500 · accountant €1k+/year" },
        { left: "Innovative S.r.l. (online)", right: "Free registration, capital €1+, requires PEC + digital signature" },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Pre-formation checklist: founders' agreement · cap table · clear roles · registered office · accountant lined up · innovative-startup status decision. What's missing?",
    },
  ],
};

const M48: ExtendedModule = {
  moduleId: "m48-accounting",
  heroDiagram: "compass",
  hook:
    "Accounting is awareness, not paperwork. Once you've established your startup, accounting becomes a real responsibility — start simple, build the habit early.",
  sections: [
    {
      id: "regimes",
      kind: "comparison",
      title: "Two regimes",
      leftLabel: "Flat-rate",
      rightLabel: "Ordinary",
      comparison: [
        { left: "Sole proprietorships / professionals.", right: "S.r.l., S.r.l.s., innovative startups." },
        { left: "15% (5% first 5 years if eligible).", right: "Full accounting, IRES/IRAP/VAT." },
        { left: "Simple, low cost.", right: "Higher cost, more bureaucracy." },
        { left: "Costs not deductible.", right: "Costs deductible, equity possible, ready for investors." },
      ],
    },
    {
      id: "first-month",
      kind: "ordered-steps",
      title: "First-month essentials",
      items: [
        { title: "Choose a startup-experienced accountant", body: "They understand uncertainty, public calls, equity." },
        { title: "Open VAT + ATECO code", body: "Match your activity precisely." },
        { title: "Business bank account", body: "Never mix personal and business." },
        { title: "Electronic invoicing software", body: "Mandatory in Italy." },
        { title: "Digital signature + PEC", body: "Required for many filings." },
        { title: "Record all expenses", body: "Even pre-revenue startup costs." },
        { title: "Monthly income/expense table", body: "Build the habit from day one." },
      ],
    },
    {
      id: "tools",
      kind: "principle-grid",
      title: "Useful tools",
      items: [
        { title: "Fattureincloud / Debitoor / Danea", body: "Issue and record invoices." },
        { title: "Sheets / Excel", body: "Budget, forecasts, cash flow." },
        { title: "Notion / Trello", body: "Document and deadline tracking." },
        { title: "LexDo / Fiscozen / TaxDome", body: "Online accounting for freelancers/small teams." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Pick: 1 invoicing tool · 1 expense tool · 1 monthly review date · VAT cadence (monthly/quarterly). Share with your accountant.",
    },
  ],
};

const M49: ExtendedModule = {
  moduleId: "m49-public-calls",
  heroDiagram: "key",
  hook:
    "Public calls aren't just 'free money'. They're an opportunity to test the project, finance early growth, or access strategic services.",
  sections: [
    {
      id: "where",
      kind: "principle-grid",
      title: "Where to find calls",
      items: [
        { title: "Local", body: "Regions, Municipalities, Chambers of Commerce — non-repayable contributions or vouchers." },
        { title: "National", body: "Invitalia (Smart&Start €1.5M, ON for youth/women, Voucher 3i)." },
        { title: "European", body: "EIC Accelerator (Horizon Europe), Erasmus for Young Entrepreneurs, Interreg." },
        { title: "Local hubs", body: "Incubators, accelerators — Call4Startup, pre-acceleration." },
      ],
    },
    {
      id: "evaluate",
      kind: "ordered-steps",
      title: "How to evaluate a call",
      items: [
        { title: "Eligible beneficiaries", body: "S.r.l., innovative startup, informal teams?" },
        { title: "Eligible expenses", body: "Investments only? Personnel, consulting, marketing?" },
        { title: "Type of contribution", body: "Grant, subsidized loan, voucher?" },
        { title: "Timelines & advances", body: "When does money arrive?" },
        { title: "Total allocation + win probability", body: "Realistic chances?" },
        { title: "Administrative workload", body: "Reporting, DURC, financial statements." },
      ],
    },
    {
      id: "application",
      kind: "ordered-steps",
      title: "5-step effective application",
      items: [
        { title: "Read the call carefully", body: "Highlight all key points." },
        { title: "Prepare the dossier", body: "Chamber of Commerce, business plan, quotes, CVs." },
        { title: "Write a clear, coherent project", body: "Context, objectives, activities, timeline, budget, results." },
        { title: "Polish presentation", body: "Professional formatting." },
        { title: "Ask for support", body: "Accountant, association, incubator." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "Find 1 active call that fits your stage and sector. Map: eligibility, deadline, max funding, eligible expenses, required documents, your fit (1–10).",
    },
  ],
};

// =============================================================================
// IRL 9 — Open Innovation (Module 50)
// =============================================================================

const M50: ExtendedModule = {
  moduleId: "m50-open-innovation",
  heroDiagram: "bridge",
  hook:
    "Open Innovation isn't a buzzword. It's the collaboration model that lets startups access resources, channels, and credibility they could never build alone.",
  sections: [
    {
      id: "what",
      kind: "callout-insight",
      title: "What Open Innovation is",
      body:
        "A model where companies don't develop innovation exclusively internally — they open to external contributions, collaborations, and co-creation. For startups: corporate collaborations, hackathons & challenges, co-development, use of external tech, knowledge exchange.",
    },
    {
      id: "ways",
      kind: "ordered-steps",
      title: "Four ways to engage",
      items: [
        { title: "Call4Startup & challenges", body: "Large companies launch public calls for solutions to specific problems." },
        { title: "Hackathons & innovation contests", body: "1–3 day intensive events to solve concrete challenges with high-level partners." },
        { title: "Co-development / PoC", body: "Propose a low-risk pilot directly to a corporate that benefits from your solution." },
        { title: "Corporate acceleration programs", body: "Eni Joule, Terna Ideas, Bayer Grants4Apps, Enel Innovation Hub, TIM Open Innovation." },
      ],
    },
    {
      id: "best",
      kind: "principle-grid",
      title: "Best practices",
      items: [
        { title: "Study the partner first", body: "Understand their strategy, language, priorities." },
        { title: "Speak business, not tech", body: "Impact, savings, results — not jargon." },
        { title: "Ready clear materials", body: "Pitch deck, product sheets, use cases." },
        { title: "Listen before proposing", body: "Demonstrate openness." },
        { title: "Protect IP", body: "NDA when needed." },
        { title: "Consider your readiness", body: "Collaboration with structured players takes resources." },
      ],
    },
    {
      id: "outro",
      kind: "callout-protip",
      title: "Try this today",
      body:
        "List 5 corporates / institutions where your solution could plug into a real problem of theirs. For each: 1 contact, 1 proposed PoC scope, 1 expected outcome.",
    },
  ],
};

// =============================================================================
// Registry
// =============================================================================

export const EXTENDED_CONTENT: Record<string, ExtendedModule> = {
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

export function getExtendedContent(moduleId: string): ExtendedModule | null {
  return EXTENDED_CONTENT[moduleId] ?? null;
}

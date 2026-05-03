// Deep-dive content generator. Produces a rich, varied sequence of A2UI
// messages for a single concept beat.
//
// Strategy:
//   1) If ANTHROPIC_API_KEY is set: ask Claude (with strict tool-use) to
//      design a sequence of components personalized to the founder.
//   2) Always: fall back to a well-composed AUTHORED sequence so the dev
//      experience without a key is still beautiful.
//
// The authored fallback uses 4 distinct LAYOUT RECIPES, selected by a stable
// hash of the beat id. Combined with diagram-pool rotation and multi-element
// stat/quote/tip libraries, two different beats in the same module produce
// genuinely different surfaces — not the same template with different copy.

import { z } from "zod";
import { anthropic, MODEL_ORCHESTRATOR } from "@/lib/anthropic";
import {
  DIAGRAM_NAMES,
  type A2UIMessage,
  type Component,
  type DiagramName,
} from "./types";
import type { Beat } from "@/lib/modules/content";
import type { ModuleSummary } from "@/lib/modules/catalog";
import {
  getExtendedContent,
  type ExtendedModule,
  type ExtendedSection,
} from "@/lib/modules/extendedContent";
import { translateText, localeName } from "@/lib/i18n/serverTranslate";

interface BuildOpts {
  module: ModuleSummary;
  beat: Beat;
  surfaceId: string;
  founder?: { startupName?: string | null; industries?: string | null };
  locale?: "en" | "it";
}

// ----------------------------------------------------------------------------
// Stable hash so a given (module, beat) always picks the same recipe/diagram.
// ----------------------------------------------------------------------------

function stableHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ----------------------------------------------------------------------------
// Diagram pools — each section has its own thematic set; we rotate by hash so
// adjacent beats in the same module pick different diagrams.
// ----------------------------------------------------------------------------

const DIAGRAM_POOLS: Record<string, DiagramName[]> = {
  "irl-1": ["iceberg", "scales", "loop", "compass", "target"],
  "irl-2": ["target", "scales", "lighthouse", "growth", "compass"],
  "irl-3": ["iceberg", "scales", "key", "compass", "target"],
  "irl-4": ["loop", "scales", "growth", "target", "compass"],
  "irl-5": ["key", "growth", "bridge", "lighthouse", "target"],
};

function pickDiagram(mod: ModuleSummary, hash: number, offset = 0): DiagramName {
  const pool = DIAGRAM_POOLS[mod.section] ?? [...DIAGRAM_NAMES];
  return pool[(hash + offset) % pool.length];
}

// ----------------------------------------------------------------------------
// Multi-element libraries: pull from these by hash so neighboring beats get
// different stats / quotes / tips.
// ----------------------------------------------------------------------------

interface Stat {
  value: string;
  unit?: string;
  caption: string;
  source?: string;
}

const SECTION_STATS: Record<string, Stat[]> = {
  "irl-1": [
    { value: "10–20", unit: "interviews", caption: "is the threshold where patterns start to outweigh noise.", source: "HIVE field research" },
    { value: "9", unit: "BMC blocks", caption: "are all hypotheses until you have evidence behind each one." },
    { value: "1", unit: "core problem", caption: "is what every great startup is really about — not five." },
  ],
  "irl-2": [
    { value: "3+", unit: "competitors mapped", caption: "is the minimum to claim you understand your market." },
    { value: "0", unit: "true blue oceans", caption: "exist for most founders. The status quo is always a competitor." },
    { value: "1", unit: "wedge", caption: "you defend ferociously beats ten you sort of compete on." },
  ],
  "irl-3": [
    { value: "60", unit: "interviews", caption: "is when most founders finally hear the same problem in different words." },
    { value: "5×", caption: "your first interview's depth comes from what you ask AFTER they answer." },
    { value: "0", unit: "leading questions", caption: "is the goal. Open, present-tense, behavior-focused." },
  ],
  "irl-4": [
    { value: "5", unit: "tests", caption: "is the minimum cycle count before a pattern is real, not luck." },
    { value: "2", unit: "weeks max", caption: "is how long any MVP should take to build before testing." },
    { value: "1", unit: "hypothesis per test", caption: "or you won't know which variable moved the result." },
  ],
  "irl-5": [
    { value: "10", unit: "early adopters", caption: "is when retention data starts being meaningful, not anecdotal." },
    { value: "40%", caption: "is the famous Sean Ellis line — 'how would you feel if you couldn't use this?'" },
    { value: "2", unit: "validated channels", caption: "are the floor before you can claim repeatable acquisition." },
  ],
};

function pickStat(mod: ModuleSummary, hash: number): Stat | null {
  const pool = SECTION_STATS[mod.section];
  if (!pool || pool.length === 0) return null;
  return pool[hash % pool.length];
}

// Multiple memorable quotes per module. recipe selects by hash.
const MODULE_QUOTES: Record<string, string[]> = {
  "m13-defining-the-problem": [
    "Fall in love with the problem, not your solution.",
    "If you can't describe the pain in one sentence, you don't know it yet.",
    "The customer's words are worth more than your slide deck.",
  ],
  "m14-bmc": [
    "If you can't put it on one page, you don't understand it yet.",
    "Every BMC block is a hypothesis until you've tested it.",
    "Start with the right side. The left side will follow.",
  ],
  "m15-cv-and-team": [
    "Ideas pivot. Teams persist.",
    "Investors back people, not pitches.",
    "A weak idea with a strong team beats a strong idea with the wrong team.",
  ],
  "m16-experiments": [
    "An experiment is a question with skin in the game.",
    "Stop debating. Start testing.",
    "If you can predict the outcome, you don't have an experiment.",
  ],
  "m17-competitive-analysis": [
    "Even Excel is a competitor. Especially Excel.",
    "Every market has alternatives. Find them or be surprised.",
    "Differentiation isn't being best — it's being clearly different.",
  ],
  "m18-positioning": [
    "It's better to be the best fit for a few than invisible to many.",
    "If your positioning fits everyone, it fits no one.",
    "A clear no makes a stronger yes possible.",
  ],
  "m19-networking": [
    "Give before you ask. Then ask less than you think.",
    "Your network is the speed limit on your growth.",
    "Strong relationships beat polished cold emails every time.",
  ],
  "m20-mission-vision": [
    "Direction beats speed.",
    "A clear north makes every other choice easier.",
    "Mission decides what you DON'T do.",
  ],
  "m21-market-analysis": [
    "A defensible niche beats a generous estimate every time.",
    "TAM is dreaming. SOM is your weekly to-do.",
    "Top-down and bottom-up should agree — or your assumptions are bad.",
  ],
  "m22-startup-tools": [
    "The right tool replaces a meeting. The wrong one adds three.",
    "Workflow first. Tools follow.",
    "Subscriptions accumulate; outcomes don't.",
  ],
  "m23-project-management": [
    "Cadence beats willpower.",
    "Sprint length is sacred. Scope is negotiable.",
    "If your retro can't fail, it's a status meeting.",
  ],
  "m24-mvp": [
    "An MVP isn't a small product — it's a sharp question.",
    "Less is more, when designed well.",
    "Ship the riskiest assumption first, not the easiest feature.",
  ],
  "m25-customer-journey": [
    "Awareness is cheap. Retention is the moat.",
    "Every touchpoint is either an investment or a leak.",
    "Design the experience, not just the product.",
  ],
  "m26-kpis": [
    "What you measure shapes what you build.",
    "Vanity metrics feel good. Real metrics fund payroll.",
    "Three KPIs beat thirty.",
  ],
  "m27-first-customer": [
    "First customers don't arrive — they're found.",
    "Cold outreach today beats inbound someday.",
    "Personal beats polished.",
  ],
  "m28-ecosystem": [
    "Every startup is a node in a network.",
    "Allies are made before they're needed.",
    "Map the ecosystem or be surprised by it.",
  ],
  "m29-sales": [
    "Sell less. Listen more. Close better.",
    "Trust is built one specific question at a time.",
    "The fastest sales are slow conversations honored.",
  ],
  "m30-presence": [
    "A clear presence opens doors before you knock.",
    "Clarity beats polish.",
    "Brand is the trace your work leaves behind.",
  ],
  "m31-social-startups": [
    "Mission and economics aren't a contradiction — they compound.",
    "Impact you can measure is impact you can grow.",
    "Profit is fuel; mission is direction.",
  ],
};

function pickQuote(mod: ModuleSummary, beat: Beat, hash: number): string {
  const pool = MODULE_QUOTES[mod.id];
  if (!pool || pool.length === 0) return `${beat.title}.`;
  return pool[hash % pool.length];
}

// Multiple actionable tips per module
const MODULE_TIPS: Record<string, string[]> = {
  "m13-defining-the-problem": [
    "Schedule three 20-minute calls this week with people who probably have this problem. Ask one open question and shut up.",
    "Re-listen to your last interview. Highlight every emotional word — that's where the real problem lives.",
    "Write one sharp sentence describing the problem. If you hesitate on a word, that's where to dig.",
  ],
  "m14-bmc": [
    "Fill the right side of your BMC in 15 minutes. Don't optimize. The blocks you struggle with are tomorrow's experiments.",
    "Pick the BMC block you're least sure about. Design one experiment for that block this week.",
    "Show your BMC to a stranger in your industry. Their first question is your weakest hypothesis.",
  ],
  "m15-cv-and-team": [
    "List the top three skills your startup needs in the next six months. For each, name who covers it — or admit nobody does.",
    "Have an honest 30-minute conversation with your co-founder about what each of you would NOT compromise on.",
    "Identify one critical role nobody owns yet. Decide today: hire, outsource, or learn.",
  ],
  "m16-experiments": [
    "Pick the riskiest hypothesis you have right now. Design a 1-week test. Predict the outcome before you run it.",
    "Open a sheet. List 5 hypotheses. Score each on impact, ease, and confidence (0–10). Top of the list is next.",
    "Set a Friday slot for your weekly experiment review. Same time every week. Cadence wins.",
  ],
  "m17-competitive-analysis": [
    "Build a 3-row benchmark today. Three competitors. Strength, weakness, gap you can own.",
    "Open a Notion page titled 'Status quo'. Write down everything users already do INSTEAD of your thing.",
    "Read your top competitor's last 5 customer reviews. The complaints are your opening.",
  ],
  "m18-positioning": [
    "Write the For-Who-We-Offer-Unlike formula in one sentence. Read it out loud. If it doesn't sound sharp, rewrite.",
    "Pick the segment you're NOT serving. State it explicitly. Saying no makes the yes louder.",
    "Test your positioning sentence on three people. If they can't paraphrase it, it isn't ready.",
  ],
  "m19-networking": [
    "Identify three people you can give value to this week — without asking for anything in return.",
    "After your next coffee chat, send a 'three takeaways' note within 24 hours. Specific. No ask.",
    "Pick one community (Slack/Discord/local). Show up weekly for 60 days. Then ask.",
  ],
  "m20-mission-vision": [
    "Draft a one-sentence mission and a one-sentence vision. Don't optimize. Iterate next week.",
    "Read your mission to your team. If it doesn't help one current decision, it's too generic.",
    "List three decisions your mission would make easier. If zero, rewrite.",
  ],
  "m21-market-analysis": [
    "Estimate TAM top-down and SOM bottom-up. The gap between the two reveals where your assumptions are weakest.",
    "Pick one assumption and find a public data point that confirms or shatters it.",
    "Write one sentence: 'In year one, we will win €X by serving Y customers at price Z.' Defend each variable.",
  ],
  "m22-startup-tools": [
    "Audit your stack today. Anything not used weekly? Cut it. Anything covered by a free tier? Downgrade.",
    "Replace your three most-used tools with a single Notion + spreadsheet for one week. Notice what you actually missed.",
    "Pick one repeating manual task. Automate it before Friday — Zapier, Make, or a script.",
  ],
  "m23-project-management": [
    "Define your next 2-week sprint with 3–5 outcomes (not tasks). Friday: review honestly.",
    "Replace your standup with a written 5-line update for one week. Notice what's actually different.",
    "End every sprint with one keep / one drop / one try. No more, no less.",
  ],
  "m24-mvp": [
    "Pick the riskiest hypothesis. Sketch the smallest MVP that could disconfirm it. Ship in two weeks, not two months.",
    "Run a fake-door test today. A landing page with a 'Buy now' button → 'coming soon'. Count the clicks.",
    "Replace your next feature with a concierge MVP. Do the work manually for 5 users. Learn before you build.",
  ],
  "m25-customer-journey": [
    "Map your journey across the five stages. Where's the biggest drop-off? That's where to invest first.",
    "Walk through your own onboarding as a fresh user. Note every moment of friction. Fix the worst by Friday.",
    "Pick one stage and ask 3 users: 'what almost stopped you here?'. Their answers ARE the to-do list.",
  ],
  "m26-kpis": [
    "List 3 KPIs you'll track this month. Define each. Pick a 30-day target. Hold yourself to it.",
    "Drop one vanity metric you've been quoting. Replace it with a behavior-based one.",
    "Build a one-screen dashboard. If you can't glance at it daily, it's the wrong design.",
  ],
  "m27-first-customer": [
    "Send one outreach message today. Personal, specific, short. The first 'no' teaches you more than the first 'yes'.",
    "Make a list of 20 named people who probably have your problem. Email three. Today.",
    "Offer a paid pilot to five people in your network at half price. Sales is research at this stage.",
  ],
  "m28-ecosystem": [
    "Map 10 actors in your ecosystem. For one, propose a micro-collaboration this week.",
    "Pick one trade association or community and become useful in it for 60 days before asking anything.",
    "Identify one institution with budget aligned to your work. Find the right person and request 20 minutes.",
  ],
  "m29-sales": [
    "Schedule 3 first-conversations next week. Don't pitch. Ask about their problem and listen for 80%.",
    "Build a 3-step value ladder: free chat → paid pilot → full engagement. Price each.",
    "Send a follow-up to the last 5 prospects who went cold. One specific question, no pressure.",
  ],
  "m30-presence": [
    "Audit your one-pager: name, what you do, who for, how to start. Anything unclear? Fix today.",
    "Look at your LinkedIn / website through a stranger's eyes. Ask: 'do I trust this?'. Fix the weakest signal.",
    "Pick ONE social channel and commit to 2 posts/week for 60 days. Drop the others.",
  ],
  "m31-social-startups": [
    "Write 3 impact metrics specific to your startup. How would you measure each every month?",
    "Draft one paragraph for your annual impact report — even before you have one.",
    "Identify one stakeholder (community, supplier, partner) who'd benefit from your model. Engage this week.",
  ],
};

function pickTip(mod: ModuleSummary, hash: number): string {
  const pool = MODULE_TIPS[mod.id];
  if (!pool || pool.length === 0)
    return "Pick the smallest action this lesson points to. Do it before the day is over.";
  return pool[hash % pool.length];
}

// ----------------------------------------------------------------------------
// Beat-derived helpers
// ----------------------------------------------------------------------------

function trim(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

function splitBody(body: string): { sentences: string[]; firstHalf: string; secondHalf: string } {
  const sentences = body.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  const cut = Math.ceil(sentences.length / 2);
  return {
    sentences,
    firstHalf: sentences.slice(0, cut).join(" "),
    secondHalf: sentences.slice(cut).join(" "),
  };
}

function captionForDiagram(name: DiagramName): string {
  const map: Record<DiagramName, string> = {
    iceberg: "What people say is the tip. What they actually do is the iceberg.",
    loop: "Build → Measure → Learn. Compress the cycle to compress your timeline.",
    funnel: "TAM is theoretical. SOM is what your team can actually win in year one.",
    scales: "Hypotheses tip the scale until evidence does the talking.",
    target: "Be relevant to a few. Don't try to be the best to everyone.",
    growth: "Growth is rarely linear — it's a long flat line that suddenly turns.",
    compass: "Direction beats speed. A clear north makes every other choice easier.",
    key: "Your first paid customer is the lock that unlocks the next ten.",
    bridge: "No startup grows alone. Build connections deliberately.",
    lighthouse: "A vision visible from far away pulls you through the fog.",
  };
  return map[name];
}

function principlesFromBody(beat: Beat, sentences: string[]): { title: string; body: string }[] {
  // Try to derive principles from a body that lists numbered or bulleted items.
  const items: { title: string; body: string }[] = [];
  const numLine = /^\s*\d+[\)\.]\s+(.+)$/;
  const bullet = /^\s*[-•·]\s+(.+)$/;
  const lines = (beat.body ?? "").split(/\n+/);
  for (const l of lines) {
    let m = numLine.exec(l) ?? bullet.exec(l);
    if (m) {
      const text = m[1];
      const colon = text.indexOf(":");
      if (colon > 0 && colon < 60) {
        items.push({ title: text.slice(0, colon).trim(), body: text.slice(colon + 1).trim() });
      } else {
        items.push({ title: trim(text, 40), body: trim(text, 120) });
      }
    }
  }
  if (items.length >= 2) return items.slice(0, 4);
  // Fallback: split first 2-4 sentences into title-only items
  return sentences
    .slice(0, Math.min(4, sentences.length))
    .map(s => ({ title: trim(s, 80), body: "" }));
}

function defaultComparisons(): { left: string; right: string }[] {
  return [
    { left: "Asks 'would you use this?'", right: "Asks 'how do you solve it today?'" },
    { left: "Trusts opinion", right: "Trusts observed behavior" },
    { left: "Polished but untested", right: "Rough but real" },
  ];
}

// ----------------------------------------------------------------------------
// Layout RECIPES — four distinct structural compositions.
// Each takes the beat's content + helpers and emits a unique sequence.
// Recipe is selected by stableHash(beatId) % 4 so two beats in the same
// module get visibly different compositions.
// ----------------------------------------------------------------------------

interface Ctx {
  mod: ModuleSummary;
  beat: Beat;
  founder?: BuildOpts["founder"];
  hash: number;
  diagramA: DiagramName;
  diagramB: DiagramName;
  stat: Stat | null;
  quote: string;
  tip: string;
  body: string;
  sentences: string[];
  firstHalf: string;
  secondHalf: string;
  personalTouch: string;
}

function makeCtx(opts: BuildOpts): Ctx {
  const hash = stableHash(`${opts.module.id}:${opts.beat.id}`);
  const body = opts.beat.body ?? "";
  const split = splitBody(body);
  const personalTouch = opts.founder?.startupName
    ? `For ${opts.founder.startupName}, this isn't theory — it's the next move.`
    : "This isn't theory — it's the next move.";
  return {
    mod: opts.module,
    beat: opts.beat,
    founder: opts.founder,
    hash,
    diagramA: pickDiagram(opts.module, hash, 0),
    diagramB: pickDiagram(opts.module, hash, 2), // offset to a different diagram
    stat: pickStat(opts.module, hash),
    quote: pickQuote(opts.module, opts.beat, hash),
    tip: pickTip(opts.module, hash),
    body,
    sentences: split.sentences,
    firstHalf: split.firstHalf,
    secondHalf: split.secondHalf,
    personalTouch,
  };
}

// Recipe A — "The Mentor Tour"  (diagram-led, steps-heavy)
function recipeMentorTour(ctx: Ctx): Component[] {
  const { beat, mod, body, sentences, firstHalf, secondHalf, diagramA, diagramB, stat, tip, personalTouch } = ctx;
  const components: Component[] = [];
  components.push({
    id: `dd-${beat.id}-A-intro`,
    type: "DeepDiveIntro",
    props: {
      eyebrow: `${mod.shortTitle} · the mentor tour`,
      title: beat.title,
      hook: firstHalf || beat.title,
      diagram: diagramA,
    },
  });
  components.push({
    id: `dd-${beat.id}-A-insight`,
    type: "Callout",
    props: { variant: "insight", title: "Why this matters", body: body || beat.title },
  });
  components.push({
    id: `dd-${beat.id}-A-diagram`,
    type: "IllustratedDiagram",
    props: { name: diagramB, caption: captionForDiagram(diagramB) },
  });
  if (sentences.length >= 3) {
    components.push({
      id: `dd-${beat.id}-A-steps`,
      type: "OrderedSteps",
      props: {
        title: "How to put it into practice",
        steps: sentences.slice(0, Math.min(4, sentences.length)).map(s => ({ title: trim(s, 90) })),
      },
    });
  } else {
    components.push({
      id: `dd-${beat.id}-A-grid`,
      type: "PrincipleGrid",
      props: { title: "Core principles", items: principlesFromBody(beat, sentences) },
    });
  }
  if (stat) components.push({ id: `dd-${beat.id}-A-stat`, type: "StatHighlight", props: stat });
  components.push({
    id: `dd-${beat.id}-A-protip`,
    type: "Callout",
    props: { variant: "protip", title: "Try this today", body: `${tip}\n\n${personalTouch}` },
  });
  return components;
}

// Recipe B — "The Story First"  (narrative + quote-heavy, no top diagram)
function recipeStoryFirst(ctx: Ctx): Component[] {
  const { beat, mod, body, secondHalf, sentences, diagramA, quote, tip, personalTouch } = ctx;
  const components: Component[] = [];
  components.push({
    id: `dd-${beat.id}-B-intro`,
    type: "DeepDiveIntro",
    props: {
      eyebrow: `${mod.shortTitle} · the story first`,
      title: beat.title,
      hook: secondHalf || body || beat.title,
      // intentionally NO diagram in the hero
    },
  });
  components.push({
    id: `dd-${beat.id}-B-story`,
    type: "Callout",
    props: { variant: "story", title: "From the field", body: body || beat.title },
  });
  components.push({ id: `dd-${beat.id}-B-quote`, type: "QuoteCard", props: { quote, attribution: beat.citation ?? mod.source } });
  components.push({
    id: `dd-${beat.id}-B-grid`,
    type: "PrincipleGrid",
    props: { title: "What the best founders do", items: principlesFromBody(beat, sentences) },
  });
  components.push({
    id: `dd-${beat.id}-B-compare`,
    type: "ComparisonTable",
    props: {
      title: "The two versions of the same idea",
      leftLabel: "Weak version",
      rightLabel: "Sharp version",
      leftTone: "warn",
      rightTone: "good",
      rows: defaultComparisons(),
      verdict: "Sharpen the right column. Cut the left.",
    },
  });
  components.push({
    id: `dd-${beat.id}-B-protip`,
    type: "Callout",
    props: { variant: "protip", title: "Try this today", body: `${tip}\n\n${personalTouch}` },
  });
  return components;
}

// Recipe C — "The Visual Essay"  (stat-led, two diagrams, comparison)
function recipeVisualEssay(ctx: Ctx): Component[] {
  const { beat, mod, body, firstHalf, diagramA, diagramB, stat, quote, tip, personalTouch } = ctx;
  const components: Component[] = [];
  components.push({
    id: `dd-${beat.id}-C-intro`,
    type: "DeepDiveIntro",
    props: {
      eyebrow: `${mod.shortTitle} · the visual essay`,
      title: beat.title,
      hook: firstHalf || beat.title,
      diagram: diagramA,
    },
  });
  if (stat) components.push({ id: `dd-${beat.id}-C-stat`, type: "StatHighlight", props: stat });
  components.push({
    id: `dd-${beat.id}-C-insight`,
    type: "Callout",
    props: { variant: "insight", title: "The principle", body: body || beat.title },
  });
  components.push({
    id: `dd-${beat.id}-C-compare`,
    type: "ComparisonTable",
    props: {
      title: "Watch the difference",
      leftLabel: "What founders do",
      rightLabel: "What works",
      leftTone: "warn",
      rightTone: "good",
      rows: defaultComparisons(),
    },
  });
  components.push({
    id: `dd-${beat.id}-C-diagram`,
    type: "IllustratedDiagram",
    props: { name: diagramB, caption: captionForDiagram(diagramB) },
  });
  components.push({ id: `dd-${beat.id}-C-quote`, type: "QuoteCard", props: { quote, attribution: mod.source } });
  components.push({
    id: `dd-${beat.id}-C-protip`,
    type: "Callout",
    props: { variant: "protip", title: "Try this today", body: `${tip}\n\n${personalTouch}` },
  });
  return components;
}

// Recipe D — "The Field Manual"  (warning-led, steps-heavy, terse)
function recipeFieldManual(ctx: Ctx): Component[] {
  const { beat, mod, body, firstHalf, secondHalf, sentences, diagramA, quote, tip, personalTouch } = ctx;
  const components: Component[] = [];
  components.push({
    id: `dd-${beat.id}-D-intro`,
    type: "DeepDiveIntro",
    props: {
      eyebrow: `${mod.shortTitle} · the field manual`,
      title: beat.title,
      hook: firstHalf || beat.title,
      diagram: diagramA,
    },
  });
  components.push({
    id: `dd-${beat.id}-D-warning`,
    type: "Callout",
    props: { variant: "warning", title: "Where founders fail", body: secondHalf || body || beat.title },
  });
  if (sentences.length >= 2) {
    components.push({
      id: `dd-${beat.id}-D-steps`,
      type: "OrderedSteps",
      props: {
        title: "What works instead",
        steps: sentences.slice(0, Math.min(5, sentences.length)).map(s => ({ title: trim(s, 90) })),
      },
    });
  }
  components.push({
    id: `dd-${beat.id}-D-grid`,
    type: "PrincipleGrid",
    props: { title: "Operating principles", items: principlesFromBody(beat, sentences) },
  });
  components.push({ id: `dd-${beat.id}-D-quote`, type: "QuoteCard", props: { quote, attribution: mod.source } });
  components.push({
    id: `dd-${beat.id}-D-protip`,
    type: "Callout",
    props: { variant: "protip", title: "Try this today", body: `${tip}\n\n${personalTouch}` },
  });
  return components;
}

const RECIPES: Array<(ctx: Ctx) => Component[]> = [
  recipeMentorTour,
  recipeStoryFirst,
  recipeVisualEssay,
  recipeFieldManual,
];

function authoredSequence(opts: BuildOpts): Component[] {
  const ctx = makeCtx(opts);
  const recipe = RECIPES[ctx.hash % RECIPES.length];
  return recipe(ctx);
}

// ----------------------------------------------------------------------------
// Extended-content composer — turns PDF-faithful ExtendedSections directly
// into A2UI components. Adds a hero on top and a personalized closer.
// This is the PRIMARY path now: deep dives are content-driven, not generated.
// ----------------------------------------------------------------------------

function extendedSectionToComponent(
  s: ExtendedSection,
  modShortTitle: string,
  beatId: string
): Component | null {
  const baseId = `dd-${beatId}-${s.id}`;
  switch (s.kind) {
    case "callout-insight":
      return { id: baseId, type: "Callout", props: { variant: "insight", title: s.title, body: s.body ?? "" } };
    case "callout-story":
      return { id: baseId, type: "Callout", props: { variant: "story", title: s.title, body: s.body ?? "" } };
    case "callout-warning":
      return { id: baseId, type: "Callout", props: { variant: "warning", title: s.title, body: s.body ?? "" } };
    case "callout-protip":
      return { id: baseId, type: "Callout", props: { variant: "protip", title: s.title, body: s.body ?? "" } };
    case "callout-quote":
      return { id: baseId, type: "Callout", props: { variant: "quote", title: s.title, body: s.body ?? "" } };
    case "ordered-steps":
      if (!s.items || s.items.length < 2) return null;
      return {
        id: baseId,
        type: "OrderedSteps",
        props: { title: s.title, steps: s.items.slice(0, 7) },
      };
    case "principle-grid":
      if (!s.items || s.items.length < 2) return null;
      return {
        id: baseId,
        type: "PrincipleGrid",
        props: {
          title: s.title,
          items: s.items.slice(0, 6).map(it => ({
            title: it.title,
            body: it.body ?? "",
          })),
        },
      };
    case "comparison":
      if (!s.comparison || s.comparison.length < 2) return null;
      return {
        id: baseId,
        type: "ComparisonTable",
        props: {
          title: s.title,
          leftLabel: s.leftLabel ?? "Weak version",
          rightLabel: s.rightLabel ?? "Sharp version",
          leftTone: "warn",
          rightTone: "good",
          rows: s.comparison.slice(0, 6),
          verdict: s.verdict,
        },
      };
    case "stat":
      if (!s.stat) return null;
      return { id: baseId, type: "StatHighlight", props: s.stat };
    case "quote-card":
      if (!s.quote) return null;
      return { id: baseId, type: "QuoteCard", props: s.quote };
    case "diagram":
      if (!s.diagram) return null;
      return {
        id: baseId,
        type: "IllustratedDiagram",
        props: { name: s.diagram, caption: s.diagramCaption },
      };
    default:
      return null;
  }
}

function buildFromExtended(opts: BuildOpts, ext: ExtendedModule): Component[] {
  const { module: mod, beat, founder } = opts;
  const components: Component[] = [];

  // Hero with the module's hook + suggested diagram
  components.push({
    id: `dd-${beat.id}-hero`,
    type: "DeepDiveIntro",
    props: {
      eyebrow: `${mod.shortTitle} · deep dive`,
      title: beat.title,
      hook: ext.hook,
      diagram: ext.heroDiagram ?? pickDiagram(mod, stableHash(beat.id)),
    },
  });

  // Each extended section becomes one component (in PDF order)
  for (const s of ext.sections) {
    const c = extendedSectionToComponent(s, mod.shortTitle, beat.id);
    if (c) components.push(c);
  }

  // Sprinkle in a contextual diagram in the middle if the module has many
  // text-heavy sections in a row, to keep visual rhythm.
  if (components.length > 6 && !components.some(c => c.type === "IllustratedDiagram")) {
    const midDiagram = pickDiagram(mod, stableHash(beat.id), 2);
    components.splice(Math.ceil(components.length / 2), 0, {
      id: `dd-${beat.id}-mid-diagram`,
      type: "IllustratedDiagram",
      props: { name: midDiagram, caption: captionForDiagram(midDiagram) },
    });
  }

  // Personalized footer if founder context is available — appended only when
  // the module's last section isn't already a protip-style closer.
  const lastIsProtip =
    components.length > 0 &&
    components[components.length - 1].type === "Callout" &&
    (components[components.length - 1].props as { variant?: string }).variant === "protip";

  if (founder?.startupName && !lastIsProtip) {
    components.push({
      id: `dd-${beat.id}-personal`,
      type: "Callout",
      props: {
        variant: "protip",
        title: `For ${founder.startupName}`,
        body: "Pick the smallest action this lesson points to and do it before the day is over. Real progress starts with a single concrete step.",
      },
    });
  }

  return components;
}

// ----------------------------------------------------------------------------
// Main entry — yields A2UI messages for the deep dive
// ----------------------------------------------------------------------------

export async function* buildDeepDiveMessages(
  opts: BuildOpts
): AsyncGenerator<A2UIMessage> {
  yield { kind: "createSurface", surfaceId: opts.surfaceId };

  // Source priority:
  //   1. Claude with extendedContent as the source-of-truth (best UX) — when
  //      a locale is set, Claude writes directly in that language.
  //   2. Authored extendedContent rendered directly (PDF-faithful, fast). For
  //      non-English locales we run components through serverTranslate.
  //   3. Authored beat-only sequence (last-resort fallback) — also translated.
  const ext = getExtendedContent(opts.module.id);
  const claudeComponents = await tryClaude(opts, ext);
  let components =
    claudeComponents ??
    (ext ? buildFromExtended(opts, ext) : authoredSequence(opts));

  // Localize authored components when needed (Claude already writes in locale).
  if (opts.locale && opts.locale !== "en" && !claudeComponents) {
    components = await localizeComponents(components, opts.locale);
  }

  for (const c of components) {
    yield { kind: "addComponent", surfaceId: opts.surfaceId, component: c };
  }
  yield { kind: "complete", surfaceId: opts.surfaceId };
}

// ----------------------------------------------------------------------------
// Translate the user-visible text props of an A2UI component sequence.
// ----------------------------------------------------------------------------

async function localizeComponents(
  components: Component[],
  locale: "en" | "it"
): Promise<Component[]> {
  return Promise.all(components.map(c => localizeComponent(c, locale)));
}

async function localizeComponent(c: Component, locale: "en" | "it"): Promise<Component> {
  const t = (s: string | undefined) =>
    s ? translateText(s, locale) : Promise.resolve(s ?? "");
  switch (c.type) {
    case "DeepDiveIntro":
      return {
        ...c,
        props: {
          ...c.props,
          eyebrow: await t(c.props.eyebrow),
          title: await t(c.props.title),
          hook: await t(c.props.hook),
        },
      };
    case "Callout":
      return {
        ...c,
        props: {
          ...c.props,
          title: c.props.title ? await t(c.props.title) : c.props.title,
          body: await t(c.props.body),
        },
      };
    case "IllustratedDiagram":
      return {
        ...c,
        props: {
          ...c.props,
          caption: c.props.caption ? await t(c.props.caption) : c.props.caption,
        },
      };
    case "OrderedSteps":
      return {
        ...c,
        props: {
          ...c.props,
          title: c.props.title ? await t(c.props.title) : c.props.title,
          steps: await Promise.all(
            c.props.steps.map(async step => ({
              title: await t(step.title),
              body: step.body ? await t(step.body) : step.body,
            }))
          ),
        },
      };
    case "ComparisonTable":
      return {
        ...c,
        props: {
          ...c.props,
          title: c.props.title ? await t(c.props.title) : c.props.title,
          leftLabel: await t(c.props.leftLabel),
          rightLabel: await t(c.props.rightLabel),
          rows: await Promise.all(
            c.props.rows.map(async r => ({
              left: await t(r.left),
              right: await t(r.right),
            }))
          ),
          verdict: c.props.verdict ? await t(c.props.verdict) : c.props.verdict,
        },
      };
    case "StatHighlight":
      return {
        ...c,
        props: {
          ...c.props,
          // Don't translate the numeric value/unit — keep stats stable
          caption: await t(c.props.caption),
          source: c.props.source ? await t(c.props.source) : c.props.source,
        },
      };
    case "QuoteCard":
      return {
        ...c,
        props: {
          ...c.props,
          quote: await t(c.props.quote),
          attribution: c.props.attribution ? await t(c.props.attribution) : c.props.attribution,
        },
      };
    case "PrincipleGrid":
      return {
        ...c,
        props: {
          ...c.props,
          title: c.props.title ? await t(c.props.title) : c.props.title,
          items: await Promise.all(
            c.props.items.map(async it => ({
              title: await t(it.title),
              body: await t(it.body),
            }))
          ),
        },
      };
    default:
      return c;
  }
}

// ----------------------------------------------------------------------------
// Claude path — strict tool use, schema-validated
// ----------------------------------------------------------------------------

const ComponentSchema: z.ZodType<Component> = z.union([
  z.object({
    id: z.string(),
    type: z.literal("DeepDiveIntro"),
    props: z.object({
      eyebrow: z.string(),
      title: z.string(),
      hook: z.string(),
      diagram: z.enum([...DIAGRAM_NAMES] as [DiagramName, ...DiagramName[]]).optional(),
    }),
  }),
  z.object({
    id: z.string(),
    type: z.literal("Callout"),
    props: z.object({
      variant: z.enum(["insight", "story", "warning", "protip", "quote"]),
      title: z.string().optional(),
      body: z.string(),
    }),
  }),
  z.object({
    id: z.string(),
    type: z.literal("IllustratedDiagram"),
    props: z.object({
      name: z.enum([...DIAGRAM_NAMES] as [DiagramName, ...DiagramName[]]),
      caption: z.string().optional(),
    }),
  }),
  z.object({
    id: z.string(),
    type: z.literal("OrderedSteps"),
    props: z.object({
      title: z.string().optional(),
      steps: z.array(z.object({ title: z.string(), body: z.string().optional() })).min(2).max(7),
    }),
  }),
  z.object({
    id: z.string(),
    type: z.literal("ComparisonTable"),
    props: z.object({
      title: z.string().optional(),
      leftLabel: z.string(),
      rightLabel: z.string(),
      leftTone: z.enum(["warn", "neutral"]).optional(),
      rightTone: z.enum(["good", "neutral"]).optional(),
      rows: z.array(z.object({ left: z.string(), right: z.string() })).min(2).max(6),
      verdict: z.string().optional(),
    }),
  }),
  z.object({
    id: z.string(),
    type: z.literal("StatHighlight"),
    props: z.object({
      value: z.string(),
      unit: z.string().optional(),
      caption: z.string(),
      source: z.string().optional(),
    }),
  }),
  z.object({
    id: z.string(),
    type: z.literal("QuoteCard"),
    props: z.object({
      quote: z.string(),
      attribution: z.string().optional(),
    }),
  }),
  z.object({
    id: z.string(),
    type: z.literal("PrincipleGrid"),
    props: z.object({
      title: z.string().optional(),
      items: z.array(z.object({ title: z.string(), body: z.string() })).min(2).max(6),
    }),
  }),
]);

const SequenceSchema = z.object({
  components: z.array(ComponentSchema).min(5).max(11),
});

async function tryClaude(
  opts: BuildOpts,
  ext: ExtendedModule | null
): Promise<Component[] | null> {
  if (!anthropic) return null;
  const { module: mod, beat, founder } = opts;
  if (!beat.body && !ext) return null;

  const founderCtx = [
    founder?.startupName ? `Startup: ${founder.startupName}` : null,
    founder?.industries ? `Industries: ${founder.industries}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const allowedDiagrams = [...DIAGRAM_NAMES].join(", ");

  // Compress extended sections into a compact reference block Claude can
  // faithfully use as source material.
  const extBlock = ext
    ? `Authoritative source material from the HIVE Content Modules PDF:

Hook: ${ext.hook}
Suggested hero diagram: ${ext.heroDiagram ?? "(choose appropriately)"}

Sections (use these as the SOURCE OF TRUTH — do not invent beyond them):
${ext.sections
  .map(
    (s, i) =>
      `[${i + 1}] kind=${s.kind}` +
      (s.title ? ` · title="${s.title}"` : "") +
      (s.body ? `\n  body: ${s.body}` : "") +
      (s.items ? `\n  items: ${s.items.map(it => `"${it.title}"${it.body ? ` — ${it.body}` : ""}`).join(" | ")}` : "") +
      (s.comparison ? `\n  comparison: ${s.comparison.map(c => `"${c.left}" vs "${c.right}"`).join(" | ")}` : "") +
      (s.stat ? `\n  stat: ${s.stat.value} ${s.stat.unit ?? ""} — ${s.stat.caption}` : "") +
      (s.quote ? `\n  quote: "${s.quote.quote}" — ${s.quote.attribution ?? ""}` : "")
  )
  .join("\n")}`
    : "";

  // Pick a recipe-suggestion to nudge Claude toward varied compositions.
  const hash = stableHash(`${mod.id}:${beat.id}`);
  const suggestionLabels = [
    "Mentor Tour: hero+diagram → insight → diagram → ordered steps → stat → protip",
    "Story First: hero (no diagram) → story → quote → principle grid → comparison → protip",
    "Visual Essay: hero+diagram → stat → insight → comparison → second diagram → quote → protip",
    "Field Manual: hero+diagram → warning → steps → principle grid → quote → protip",
  ];
  const suggestion = suggestionLabels[hash % suggestionLabels.length];

  const lang = localeName(opts.locale ?? "en");
  const system = `You are an editorial designer composing a beautiful, varied,
streaming "deep dive" lesson surface for a startup founder. You output only by
calling the emit_deep_dive tool — never plain text.

You will be given:
- A module title and section
- The authored "key idea" body
- Authoritative source material from the HIVE Content Modules PDF (the SOURCE OF TRUTH)
- Founder context (startup name + industries, when available)
- A composition style suggestion

Your job:
- Compose a sequence of 7 to 11 components from the closed catalog below.
- About 80% of your prose MUST come faithfully from the authoritative source
  material — paraphrase tightly, do not invent facts, do not add stats not present.
- The remaining 20% is your editorial framing: a sharp hero hook, varied callout
  variants, a personalized closer.
- Faithfully reflect each authoritative section in the right component shape
  (e.g., a 'principle-grid' kind → PrincipleGrid; 'comparison' kind → ComparisonTable).
- Make each deep dive feel DIFFERENT from neighboring beats. Vary the diagram,
  vary which sections lead, vary emphasis.
- Always start with DeepDiveIntro. End with a Callout(variant="protip") that
  references the founder's startup name or industry when provided.
- Keep prose tight. No fluff, no filler, no LLM tells.
- Component ids must be unique within the response.
- IMPORTANT: Write ALL user-visible text (titles, bodies, quotes, captions,
  steps, principles, verdict, etc.) in ${lang}. Use second-person singular
  ("tu") for Italian. Keep startup terms like BMC/MVP/KPI/TAM/SAM/SOM in English.
  Component "id" fields and the "type" field are technical and stay in English.

Component catalog (allowed types only):
- DeepDiveIntro { eyebrow, title, hook, diagram? } -- diagram in: ${allowedDiagrams}
- Callout { variant: insight|story|warning|protip|quote, title?, body }
- IllustratedDiagram { name, caption? } -- name in: ${allowedDiagrams}
- OrderedSteps { title?, steps: [{title, body?}] }   (2-7 steps)
- ComparisonTable { title?, leftLabel, rightLabel, leftTone?, rightTone?, rows: [{left, right}] (2-6), verdict? }
- StatHighlight { value, unit?, caption, source? }
- QuoteCard { quote, attribution? }
- PrincipleGrid { title?, items: [{title, body}] }   (2-6 items)`;

  const userBlock = `Module: ${mod.title}  (${mod.section})
Source PDF: ${mod.source}
${founderCtx ? `Founder context: ${founderCtx}` : ""}

Authored key idea — title:
${beat.title}

Authored beat body:
${beat.body ?? "(none — use authoritative source material below)"}

${extBlock}

Suggested composition style for THIS beat: ${suggestion}

Compose the deep-dive sequence. Use emit_deep_dive exactly once.`;

  try {
    const resp = await anthropic.messages.create({
      model: MODEL_ORCHESTRATOR,
      max_tokens: 3000,
      system: [
        {
          type: "text",
          text: system,
          cache_control: { type: "ephemeral" },
        },
      ] as unknown as string,
      tools: [
        {
          name: "emit_deep_dive",
          description: "Emit the structured deep-dive A2UI sequence for this beat.",
          input_schema: {
            type: "object",
            properties: {
              components: {
                type: "array",
                minItems: 5,
                maxItems: 11,
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    type: {
                      type: "string",
                      enum: [
                        "DeepDiveIntro",
                        "Callout",
                        "IllustratedDiagram",
                        "OrderedSteps",
                        "ComparisonTable",
                        "StatHighlight",
                        "QuoteCard",
                        "PrincipleGrid",
                      ],
                    },
                    props: { type: "object" },
                  },
                  required: ["id", "type", "props"],
                },
              },
            },
            required: ["components"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "emit_deep_dive" },
      messages: [{ role: "user", content: userBlock }],
    });

    const toolUse = resp.content.find(c => c.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") return null;

    const parsed = SequenceSchema.safeParse(toolUse.input);
    if (!parsed.success) {
      console.error("[deep-dive] schema mismatch", parsed.error.format());
      return null;
    }
    return parsed.data.components;
  } catch (e) {
    console.error("[deep-dive] Claude call failed:", e);
    return null;
  }
}

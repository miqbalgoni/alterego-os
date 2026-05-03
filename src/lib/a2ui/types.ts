// A2UI-compatible wire format. We follow the shape of Google's A2UI v0.9 spec
// (https://a2ui.org) but use a simplified message subset suited to lesson
// delivery. The renderer is small and replaceable; we can swap to a full A2UI
// runtime (e.g. @copilotkitnext/a2ui-renderer) later.
//
// All UI Claude can request is constrained to the components in this file —
// the trust boundary that makes A2UI safe.

// ============================================================================
// Trusted component catalog
// ============================================================================

export type ComponentType =
  // ----- Core lesson catalog -----
  | "LessonHeader"
  | "KeyIdeaCard"
  | "ExampleCallout"
  | "QuizMultipleChoice"
  | "ChecklistInteractive"
  | "BmcMiniCanvas"
  | "ValuePropFormula"
  | "TamSamSomCalculator"
  | "ApplyToMyStartupForm"
  | "StepperProgress"
  | "OutroCard"
  // ----- Deep-dive catalog -----
  | "DeepDiveIntro"
  | "Callout"
  | "IllustratedDiagram"
  | "OrderedSteps"
  | "ComparisonTable"
  | "StatHighlight"
  | "QuoteCard"
  | "PrincipleGrid";

// Named diagrams the IllustratedDiagram component can render. Hand-crafted
// SVGs — Claude can ONLY pick from this list (the trust boundary).
//
// IMPORTANT: This module is imported from BOTH server-side code (deepDive.ts,
// route handlers) AND client components. Keep it free of React / "use client"
// so it can be imported from anywhere.

export const DIAGRAM_NAMES = [
  "iceberg",     // visible vs hidden — for "what people don't say"
  "loop",        // build-measure-learn cycle
  "funnel",      // TAM-SAM-SOM, conversion
  "scales",      // hypothesis vs evidence, trade-offs
  "target",      // positioning, focus
  "growth",      // hockey-stick / growth chart
  "compass",     // direction, mission, alignment
  "key",         // unlocking value, first customers
  "bridge",      // connecting people, partnerships
  "lighthouse", // vision, guidance
] as const;

export type DiagramName = (typeof DIAGRAM_NAMES)[number];

export interface QuizOption {
  id: string; // stable per-option id
  text: string;
  // Note: we DON'T leak `correct` or `feedback` to the client — they're
  // resolved by /api/lesson/quiz when the user submits.
}

export interface ComponentProps {
  LessonHeader: {
    title: string;
    sectionLabel: string;     // e.g. "IRL 1 — Idea & BMC"
    estMinutes: number;
    beatIndex: number;
    totalBeats: number;
  };
  KeyIdeaCard: {
    title: string;
    body: string;
    citation?: string;
    // Optional refs for the "Go deeper" deep-dive feature. When provided,
    // the card renders a button that opens a nested deep-dive surface.
    moduleId?: string;
    beatId?: string;
  };
  ExampleCallout: {
    title?: string;
    body: string;
  };
  QuizMultipleChoice: {
    moduleId: string;
    beatId: string;
    question: string;
    options: QuizOption[];
  };
  ChecklistInteractive: {
    title: string;
    items: { id: string; label: string }[];
  };
  BmcMiniCanvas: {
    moduleId: string;
    beatId: string;
    // Pre-fills from existing Answer rows when available
    prefill?: Partial<Record<BmcBlock, string>>;
  };
  ValuePropFormula: {
    moduleId: string;
    beatId: string;
    prefill?: Partial<Record<"target" | "problem" | "solution" | "result" | "competitors", string>>;
  };
  TamSamSomCalculator: {
    moduleId: string;
    beatId: string;
  };
  ApplyToMyStartupForm: {
    moduleId: string;
    beatId: string;
    prompt: string;
    placeholder?: string;
  };
  StepperProgress: {
    current: number;
    total: number;
  };
  OutroCard: {
    moduleId: string;
    title: string;
    body: string;
    nextAction?: string; // CTA label for "I'm done"
  };

  // ----- Deep-dive components -----
  DeepDiveIntro: {
    eyebrow: string;       // small kicker text, e.g. "Going deeper"
    title: string;
    hook: string;          // 1–2 sentence atmospheric hook
    diagram?: DiagramName; // optional accent
  };
  Callout: {
    variant: "insight" | "story" | "warning" | "protip" | "quote";
    title?: string;
    body: string;
  };
  IllustratedDiagram: {
    name: DiagramName;
    caption?: string;
  };
  OrderedSteps: {
    title?: string;
    steps: { title: string; body?: string }[];
  };
  ComparisonTable: {
    title?: string;
    leftLabel: string;
    rightLabel: string;
    leftTone?: "warn" | "neutral";   // visual tint
    rightTone?: "good" | "neutral";
    rows: { left: string; right: string }[];
    verdict?: string;
  };
  StatHighlight: {
    value: string;          // e.g. "10–20"
    unit?: string;          // e.g. "interviews"
    caption: string;        // e.g. "is the sweet spot for problem discovery"
    source?: string;
  };
  QuoteCard: {
    quote: string;
    attribution?: string;
  };
  PrincipleGrid: {
    title?: string;
    items: { title: string; body: string }[]; // 2..6 items
  };
}

export type BmcBlock =
  | "customerSegments"
  | "valuePropositions"
  | "channels"
  | "customerRelationships"
  | "revenueStreams"
  | "keyResources"
  | "keyActivities"
  | "keyPartners"
  | "costStructure";

// Discriminated union so the renderer can switch on `type`.
export type Component = {
  [K in ComponentType]: { id: string; type: K; props: ComponentProps[K] };
}[ComponentType];

// ============================================================================
// Wire messages (streamed from server -> client)
// ============================================================================

export type A2UIMessage =
  | { kind: "createSurface"; surfaceId: string }
  | { kind: "addComponent"; surfaceId: string; component: Component }
  | { kind: "patchComponent"; surfaceId: string; id: string; props: Record<string, unknown> }
  | { kind: "complete"; surfaceId: string };

// Helper: compose a unique id for a component.
export function compId(beatId: string, type: ComponentType): string {
  return `${beatId}:${type}`;
}

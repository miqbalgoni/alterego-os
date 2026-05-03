// Server-side helpers: turn a module's authored beats into a stream of A2UI
// messages. Optionally personalizes concept-beat bodies via Claude using the
// founder's startup context.

import type {
  A2UIMessage,
  Component,
  ComponentType,
} from "./types";
import { compId } from "./types";
import type { Beat, ModuleContent } from "@/lib/modules/content";
import type { ModuleSummary } from "@/lib/modules/catalog";
import { anthropic, MODEL_ASKME } from "@/lib/anthropic";

// ----------------------------------------------------------------------------
// Per-beat -> messages
// ----------------------------------------------------------------------------

export interface BuildBeatOpts {
  module: ModuleSummary;
  content: ModuleContent;
  beat: Beat;
  beatIndex: number;
  surfaceId: string;
  // Founder context for personalization in concept beats.
  founder?: {
    startupName?: string | null;
    industries?: string | null;
  };
  // BMC prefill from existing Answer rows.
  bmcPrefill?: Record<string, string>;
}

const HEADER_FOR_FIRST = (m: ModuleSummary, total: number, idx: number): Component => ({
  id: compId("header", "LessonHeader"),
  type: "LessonHeader",
  props: {
    title: m.title,
    sectionLabel: sectionLabel(m.section),
    estMinutes: m.estMinutes,
    beatIndex: idx,
    totalBeats: total,
  },
});

export function* buildBeatMessages(opts: BuildBeatOpts): Generator<A2UIMessage> {
  const { module: mod, content, beat, beatIndex, surfaceId, bmcPrefill } = opts;

  // Always update the stepper progress at the top of every beat
  yield {
    kind: "patchComponent",
    surfaceId,
    id: compId("header", "LessonHeader"),
    props: { beatIndex: beatIndex + 1 },
  };

  if (beatIndex === 0) {
    // Add header + stepper on the very first beat
    yield {
      kind: "addComponent",
      surfaceId,
      component: HEADER_FOR_FIRST(mod, content.beats.length, beatIndex + 1),
    };
  }

  switch (beat.kind) {
    case "intro":
    case "concept":
      yield {
        kind: "addComponent",
        surfaceId,
        component: {
          id: compId(beat.id, "KeyIdeaCard"),
          type: "KeyIdeaCard",
          props: {
            title: beat.title,
            body: beat.body ?? "",
            citation: beat.citation,
            // Refs that let the card render a "Go deeper" button that
            // opens a nested A2UI deep-dive surface.
            moduleId: mod.id,
            beatId: beat.id,
          },
        },
      };
      break;

    case "example":
      yield {
        kind: "addComponent",
        surfaceId,
        component: {
          id: compId(beat.id, "ExampleCallout"),
          type: "ExampleCallout",
          props: {
            title: beat.title,
            body: beat.body ?? "",
          },
        },
      };
      break;

    case "check":
      if (beat.quiz) {
        yield {
          kind: "addComponent",
          surfaceId,
          component: {
            id: compId(beat.id, "QuizMultipleChoice"),
            type: "QuizMultipleChoice",
            props: {
              moduleId: mod.id,
              beatId: beat.id,
              question: beat.quiz.question,
              options: beat.quiz.options.map((o, i) => ({
                id: `opt_${i}`,
                text: o.text,
              })),
            },
          },
        };
      }
      break;

    case "exercise":
      if (beat.exercise) {
        const ex = beat.exercise;
        const baseProps = { moduleId: mod.id, beatId: beat.id };
        let comp: Component;
        switch (ex.kind) {
          case "bmc":
            comp = {
              id: compId(beat.id, "BmcMiniCanvas"),
              type: "BmcMiniCanvas",
              props: { ...baseProps, prefill: bmcPrefill },
            };
            break;
          case "value-prop":
            comp = {
              id: compId(beat.id, "ValuePropFormula"),
              type: "ValuePropFormula",
              props: { ...baseProps },
            };
            break;
          case "tam-sam-som":
            comp = {
              id: compId(beat.id, "TamSamSomCalculator"),
              type: "TamSamSomCalculator",
              props: { ...baseProps },
            };
            break;
          case "checklist":
            comp = {
              id: compId(beat.id, "ChecklistInteractive"),
              type: "ChecklistInteractive",
              props: {
                title: beat.title,
                items: parseChecklistItems(ex.prompt),
              },
            };
            break;
          case "free-text":
          default:
            comp = {
              id: compId(beat.id, "ApplyToMyStartupForm"),
              type: "ApplyToMyStartupForm",
              props: {
                ...baseProps,
                prompt: ex.prompt,
                placeholder: "Write your response here…",
              },
            };
            break;
        }
        yield { kind: "addComponent", surfaceId, component: comp };
      }
      break;

    case "outro":
      yield {
        kind: "addComponent",
        surfaceId,
        component: {
          id: compId(beat.id, "OutroCard"),
          type: "OutroCard",
          props: {
            moduleId: mod.id,
            title: beat.title,
            body: beat.body ?? "",
            nextAction: "Mark module complete",
          },
        },
      };
      break;
  }
}

// ----------------------------------------------------------------------------
// Whole-module builder used by /api/lesson
// ----------------------------------------------------------------------------

export interface BuildModuleOpts {
  module: ModuleSummary;
  content: ModuleContent;
  surfaceId: string;
  founder?: BuildBeatOpts["founder"];
  bmcPrefill?: Record<string, string>;
}

export function* buildModuleMessages(
  opts: BuildModuleOpts
): Generator<A2UIMessage> {
  yield { kind: "createSurface", surfaceId: opts.surfaceId };
  for (let i = 0; i < opts.content.beats.length; i++) {
    yield* buildBeatMessages({
      module: opts.module,
      content: opts.content,
      beat: opts.content.beats[i],
      beatIndex: i,
      surfaceId: opts.surfaceId,
      founder: opts.founder,
      bmcPrefill: opts.bmcPrefill,
    });
  }
  yield { kind: "complete", surfaceId: opts.surfaceId };
}

// ----------------------------------------------------------------------------
// Optional Claude personalization for a single concept beat.
// Returns the personalized body (or null on failure / no key).
// ----------------------------------------------------------------------------

export async function personalizeConceptBody(
  beat: Beat,
  founder?: BuildBeatOpts["founder"]
): Promise<string | null> {
  if (!anthropic) return null;
  if (!founder?.startupName && !founder?.industries) return null;
  if (!beat.body) return null;
  if (beat.kind !== "concept" && beat.kind !== "intro") return null;

  try {
    const ctx = [
      founder.startupName ? `Startup: ${founder.startupName}` : null,
      founder.industries ? `Industries: ${founder.industries}` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    const resp = await anthropic.messages.create({
      model: MODEL_ASKME,
      max_tokens: 280,
      system:
        "You're a startup mentor. Rephrase the lesson body to feel personal to the founder's context, keeping it concise (≤120 words), preserving the teaching, and weaving in 1 concrete reference to their startup or industry. No introductions; output only the rewritten body.",
      messages: [
        {
          role: "user",
          content: `Founder context: ${ctx}\n\nLesson title: ${beat.title}\n\nOriginal body:\n${beat.body}`,
        },
      ],
    });
    const text = resp.content
      .filter(c => c.type === "text")
      .map(c => (c.type === "text" ? c.text : ""))
      .join("");
    return text.trim() || null;
  } catch (e) {
    console.error("[personalizeConceptBody] failed:", e);
    return null;
  }
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function sectionLabel(section: string): string {
  const map: Record<string, string> = {
    "irl-1": "IRL 1 — Idea & Business Model",
    "irl-2": "IRL 2 — Market & Competition",
    "irl-3": "IRL 3 — Validation & Value Prop",
    "irl-4": "IRL 4 — MVP & Testing",
    "irl-5": "IRL 5 — Product/Market Fit",
  };
  return map[section] ?? section;
}

// Parse a checklist prompt: each line that starts with "- " becomes an item.
// Falls back to a single item if no bullets are found.
function parseChecklistItems(prompt: string): { id: string; label: string }[] {
  const lines = prompt
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.startsWith("- ") || l.startsWith("· ") || l.startsWith("• "));
  if (lines.length === 0) {
    return [{ id: "item_0", label: prompt }];
  }
  return lines.map((l, i) => ({
    id: `item_${i}`,
    label: l.replace(/^[-·•]\s*/, ""),
  }));
}

export type { ComponentType };

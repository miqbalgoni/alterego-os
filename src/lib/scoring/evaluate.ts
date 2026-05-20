// Claude-powered evaluator: takes a section's answers + rubric and returns a
// structured score + diagnosis + strengths + gaps + gapTags.
//
// We use Anthropic's tool use to enforce structured output (more reliable than
// JSON-mode prompting). Single tool, single call, no streaming.

import { z } from "zod";
import { anthropic, MODEL_ORCHESTRATOR } from "@/lib/anthropic";
import { QUESTION_BY_ID } from "@/lib/questions";
import { RUBRIC_VERSION, type SectionRubric } from "./rubrics";
import { getEffectiveRubric } from "./rubricOverrides";

// ---------- Output schema ----------------------------------------------------

export const AssessmentResult = z.object({
  score: z.number().int().min(0).max(100),
  diagnosis: z.string().min(1).max(280),
  strengths: z.array(z.string()).min(0).max(5),
  gaps: z.array(z.string()).min(0).max(5),
  gapTags: z.array(z.string()).min(0).max(8),
});

export type AssessmentResultT = z.infer<typeof AssessmentResult>;

// ---------- Heuristic fallback (no API key, no model, etc.) ------------------
// Keeps the app functional in dev without an API key. Not great, but unblocks
// the whole UI flow.

function heuristicScore(
  rubric: SectionRubric,
  answers: Record<string, unknown>
): AssessmentResultT {
  let total = 0;
  let count = 0;
  const gaps: string[] = [];
  const strengths: string[] = [];
  const gapTags = new Set<string>();

  for (const qid of rubric.questionIds) {
    const q = QUESTION_BY_ID[qid];
    if (!q) continue;
    const v = answers[qid];
    count += 1;
    // Crude scoring: penalize "No"/"None"/"0"/"Never"; reward "Yes"/"3 or more".
    const text = Array.isArray(v) ? v.join(", ") : String(v ?? "");
    const lower = text.toLowerCase();
    let pts = 50; // neutral default
    if (/^(no|none|0|never|not|i haven't|i have not|not yet)/.test(lower)) pts = 15;
    else if (/^(yes|3 or more|10 or more|60 or more|4 or more|20 or more|highly|very|several|>3)/.test(lower)) pts = 90;
    else if (/^(only|partial|partially|some|quite|approxim|a few|few examples|1\b|2\b)/.test(lower)) pts = 55;
    total += pts;

    if (pts <= 25 && q.label) gaps.push(q.label);
    if (pts >= 80 && q.label) strengths.push(q.label);
  }
  const score = count ? Math.round(total / count) : 50;

  // Map a couple of obvious tags so the rec engine has *something* to work with.
  if (rubric.section === "irl-1") {
    if (/^no$/i.test(String(answers.q6 ?? ""))) gapTags.add("bmc_incomplete");
    if (/^no$/i.test(String(answers.q15 ?? ""))) gapTags.add("hypotheses_unstructured");
    if (/^(no|i have not identified it yet)/i.test(String(answers.q11 ?? ""))) gapTags.add("problem_unverified");
    if (/^no$/i.test(String(answers.q14 ?? ""))) gapTags.add("no_experiments");
  }

  return {
    score,
    diagnosis: `Heuristic score for ${rubric.title}. Set ANTHROPIC_API_KEY for richer feedback.`,
    strengths: strengths.slice(0, 3),
    gaps: gaps.slice(0, 3),
    gapTags: [...gapTags].slice(0, 5),
  };
}

// ---------- Main evaluator ---------------------------------------------------

export interface EvaluateOptions {
  section: string;
  answers: Record<string, unknown>;
  // Optional founder context for grounded feedback ("you said your customer is X").
  startupName?: string | null;
  industries?: string | null;
  // BCP-47 short code used to instruct Claude what language to write in.
  locale?: "en" | "it";
}

export async function evaluateSection(
  opts: EvaluateOptions
): Promise<AssessmentResultT & { rubricVer: string }> {
  const rubric = await getEffectiveRubric(opts.section);
  if (!rubric) throw new Error(`Unknown section: ${opts.section}`);

  // Filter to just the rubric's questions, with their labels for context
  const scoped: Record<string, { question: string; answer: unknown }> = {};
  for (const qid of rubric.questionIds) {
    const q = QUESTION_BY_ID[qid];
    if (!q) continue;
    scoped[qid] = {
      question: q.label,
      answer: opts.answers[qid] ?? null,
    };
  }

  if (!anthropic) {
    return { ...heuristicScore(rubric, opts.answers), rubricVer: RUBRIC_VERSION };
  }

  const allowedTags = rubric.allowedGapTags.join(", ");
  const lang =
    opts.locale === "it" ? "Italian (warm, professional, second person 'tu')" : "English";

  const system = `You are an expert startup evaluator for HIVE Business Accelerator. \
You score a founder's IRL (Investment Readiness Level) section based on their \
answers and a rubric. You are honest, specific, and constructive — not generic.

Rules:
- Score is 0–100. 0–34 = early-stage / major gaps. 35–64 = developing. 65–84 = ready. 85+ = strong.
- "diagnosis" is ONE sentence (≤280 chars), specific to this founder's actual answers.
- "strengths" and "gaps" each: 0–5 short bullets, each pointing to a concrete answer.
- "gapTags" come ONLY from this allowed vocabulary: ${allowedTags}.
- Pick tags that ACTUALLY match the gaps you observed. Never invent new tags.
- Be honest. Don't pad scores or hide weaknesses.
- Do NOT call any tools other than emit_assessment.
- IMPORTANT: Write "diagnosis", "strengths", and "gaps" in ${lang}. Tags stay in English (controlled vocabulary).

Section: ${rubric.title}
Rubric:
${rubric.criteria}`;

  const founderCtx = [
    opts.startupName ? `Startup: ${opts.startupName}` : null,
    opts.industries ? `Industries: ${opts.industries}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const userBlock = `${founderCtx ? founderCtx + "\n\n" : ""}Founder's answers:
${JSON.stringify(scoped, null, 2)}

Score this section. Use the emit_assessment tool exactly once.`;

  try {
    const resp = await anthropic.messages.create({
      model: MODEL_ORCHESTRATOR,
      max_tokens: 800,
      system: [
        {
          type: "text",
          text: system,
          cache_control: { type: "ephemeral" },
        },
      ] as unknown as string,
      tools: [
        {
          name: "emit_assessment",
          description:
            "Emit the structured assessment for this IRL section. Call exactly once.",
          input_schema: {
            type: "object",
            properties: {
              score: { type: "integer", minimum: 0, maximum: 100 },
              diagnosis: { type: "string", maxLength: 280 },
              strengths: {
                type: "array",
                items: { type: "string" },
                maxItems: 5,
              },
              gaps: {
                type: "array",
                items: { type: "string" },
                maxItems: 5,
              },
              gapTags: {
                type: "array",
                items: { type: "string", enum: rubric.allowedGapTags as unknown as string[] },
                maxItems: 8,
              },
            },
            required: ["score", "diagnosis", "strengths", "gaps", "gapTags"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "emit_assessment" },
      messages: [{ role: "user", content: userBlock }],
    });

    // Find the tool_use block
    const toolUse = resp.content.find(c => c.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      throw new Error("Model did not emit a tool call");
    }
    const parsed = AssessmentResult.parse(toolUse.input);
    return { ...parsed, rubricVer: RUBRIC_VERSION };
  } catch (e) {
    console.error("[evaluate] Falling back to heuristic:", e);
    return { ...heuristicScore(rubric, opts.answers), rubricVer: RUBRIC_VERSION };
  }
}

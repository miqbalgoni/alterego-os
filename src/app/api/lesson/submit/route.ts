// POST /api/lesson/submit  { moduleId, beatId, kind, outputs }
// Saves a structured exercise submission. Writes to ModuleProgress.outputs
// (keyed by beatId), and — when the exercise has a meaningful mapping — also
// writes back to relevant Answer rows so the founder's IRL re-take score
// actually moves.

import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, getLocaleFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { upsertAnswer } from "@/lib/session";
import { anthropic, MODEL_ASKME } from "@/lib/anthropic";
import { localeName } from "@/lib/i18n/serverTranslate";

const Body = z.object({
  moduleId: z.string().min(1),
  beatId: z.string().min(1),
  kind: z.enum(["bmc", "value-prop", "tam-sam-som", "checklist", "free-text"]),
  outputs: z.record(z.unknown()),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { moduleId, beatId, kind, outputs } = parsed.data;

  // --- Persist to ModuleProgress.outputs (merged JSON keyed by beatId) ---
  const existing = await prisma.moduleProgress.findUnique({
    where: { userId_moduleId: { userId: user.id, moduleId } },
  });
  let merged: Record<string, unknown> = {};
  if (existing?.outputs) {
    try { merged = JSON.parse(existing.outputs); } catch { merged = {}; }
  }
  merged[beatId] = { kind, outputs, savedAt: new Date().toISOString() };

  await prisma.moduleProgress.upsert({
    where: { userId_moduleId: { userId: user.id, moduleId } },
    create: {
      userId: user.id,
      moduleId,
      status: "started",
      startedAt: new Date(),
      outputs: JSON.stringify(merged),
    },
    update: {
      outputs: JSON.stringify(merged),
    },
  });

  // --- Write back to assessment Answers when applicable ---
  await writeBackToAnswers(user.id, kind, outputs);

  // --- Optional: Claude feedback for free-text submissions ---
  let feedback: string | null = null;
  if (kind === "free-text" && anthropic) {
    const locale = getLocaleFromCookies();
    feedback = await generateMentorFeedback(
      String(outputs.response ?? ""),
      moduleId,
      beatId,
      { startupName: user.startupName, industries: user.industries },
      locale
    );
  }

  return NextResponse.json({ ok: true, feedback });
}

// ----------------------------------------------------------------------------
// Write-back logic — turn module outputs into changes to the founder's
// assessment answers.
// ----------------------------------------------------------------------------

async function writeBackToAnswers(
  userId: string,
  kind: string,
  outputs: Record<string, unknown>
) {
  // BMC: if the user filled at least one block, we can update q6 (BMC done?),
  // q8 (which blocks have hypotheses).
  if (kind === "bmc") {
    const filled = Object.entries(outputs)
      .filter(([_, v]) => typeof v === "string" && (v as string).trim().length > 0)
      .map(([k]) => k);
    if (filled.length > 0) {
      await upsertAnswer(userId, "q6", "YES");
      const blockMap: Record<string, string> = {
        valuePropositions: "Value Proposition",
        customerSegments: "Customer Segments",
        channels: "Channels",
        customerRelationships: "Customer Relationships",
        revenueStreams: "Revenue Streams",
        keyResources: "Key Resources",
        keyActivities: "Key Activities",
        keyPartners: "Key Partners",
        costStructure: "Cost Structure",
      };
      const labels = filled
        .map(k => blockMap[k])
        .filter((x): x is string => !!x);
      if (labels.length > 0) {
        await upsertAnswer(userId, "q8", labels);
      }
    }
  }

  // Value prop submission: doesn't directly map to a question, but signals
  // structured thinking — bump q26 (structured competitive analysis).
  if (kind === "value-prop") {
    const ok = ["target", "problem", "solution", "result", "competitors"].every(
      k => typeof outputs[k] === "string" && (outputs[k] as string).trim().length > 0
    );
    if (ok) {
      await upsertAnswer(userId, "q26", "Yes");
    }
  }

  // TAM-SAM-SOM submission: signals q23/q24 are now grounded.
  if (kind === "tam-sam-som") {
    const hasNumbers =
      typeof outputs.tam === "string" && (outputs.tam as string).trim().length > 0 &&
      typeof outputs.assumptions === "string" && (outputs.assumptions as string).trim().length > 0;
    if (hasNumbers) {
      // q24: "Public data / sector reports" if the user wrote real assumptions
      await upsertAnswer(userId, "q24", "Public data / sector reports");
    }
  }
}

// ----------------------------------------------------------------------------
// Lightweight personalized feedback for free-text submissions.
// ----------------------------------------------------------------------------

async function generateMentorFeedback(
  response: string,
  moduleId: string,
  beatId: string,
  founder: { startupName?: string | null; industries?: string | null },
  locale: "en" | "it"
): Promise<string | null> {
  if (!anthropic || !response.trim()) return null;
  try {
    const ctx = [
      founder.startupName ? `Startup: ${founder.startupName}` : null,
      founder.industries ? `Industries: ${founder.industries}` : null,
    ].filter(Boolean).join(" · ");

    const lang = localeName(locale);
    const resp = await anthropic.messages.create({
      model: MODEL_ASKME,
      max_tokens: 260,
      system:
        `You are a startup mentor reviewing a founder's exercise submission. Give concise, specific, actionable feedback (2–4 sentences). Point out 1 strength + 1 thing to sharpen. Be warm but direct. Don't be generic. Write in ${lang}${locale === "it" ? " using second person 'tu'" : ""}.`,
      messages: [
        {
          role: "user",
          content: `Founder context: ${ctx || "(none)"}\nModule: ${moduleId}, beat: ${beatId}\n\nFounder's submission:\n${response}\n\nGive feedback.`,
        },
      ],
    });
    const text = resp.content
      .filter(c => c.type === "text")
      .map(c => (c.type === "text" ? c.text : ""))
      .join("");
    return text.trim() || null;
  } catch (e) {
    console.error("[generateMentorFeedback]", e);
    return null;
  }
}

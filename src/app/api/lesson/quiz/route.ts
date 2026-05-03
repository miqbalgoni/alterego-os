// POST /api/lesson/quiz  { moduleId, beatId, optionId }
// Grades a quiz answer against the authored content. Returns
// { correct, feedback, correctOptionId }. The "correct" flag and authored
// feedback string never leak to the client until the user submits.

import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { getModuleContent } from "@/lib/modules/content";

const Body = z.object({
  moduleId: z.string().min(1),
  beatId: z.string().min(1),
  optionId: z.string().min(1),
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
  const { moduleId, beatId, optionId } = parsed.data;

  const content = getModuleContent(moduleId);
  if (!content) {
    return NextResponse.json({ error: "Unknown module" }, { status: 404 });
  }
  const beat = content.beats.find(b => b.id === beatId);
  if (!beat || beat.kind !== "check" || !beat.quiz) {
    return NextResponse.json({ error: "No quiz on this beat" }, { status: 400 });
  }

  // Recover option index from id (we wrote them as opt_{i}).
  const m = /^opt_(\d+)$/.exec(optionId);
  const idx = m ? parseInt(m[1], 10) : -1;
  const opt = beat.quiz.options[idx];
  if (!opt) {
    return NextResponse.json({ error: "Unknown option" }, { status: 400 });
  }

  const correct = !!opt.correct;
  const feedback =
    opt.feedback ??
    (correct
      ? "Right — that's the strongest answer."
      : "Not quite — re-read the key idea above and try the logic again.");

  // Find the correctOptionId for UI to highlight (if any explicitly correct).
  const correctIdx = beat.quiz.options.findIndex(o => o.correct);
  const correctOptionId = correctIdx >= 0 ? `opt_${correctIdx}` : undefined;

  return NextResponse.json({ correct, feedback, correctOptionId });
}

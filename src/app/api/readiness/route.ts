// GET /api/readiness
// Returns the founder's latest IrlAssessment per section (1..9) plus a flag
// for whether each section has answers. Used by the review-page radar.

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { loadResumeState } from "@/lib/session";
import { SECTIONS, QUESTION_BY_ID } from "@/lib/questions";
import { getRubric } from "@/lib/scoring/rubrics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SectionStatus {
  section: string;            // "irl-1" .. "irl-9"
  index: number;              // 1..9
  shortLabel: string;
  score: number | null;       // latest assessment score, null if never assessed
  diagnosis: string | null;
  hasAnswers: boolean;        // any required questions answered?
  hasRubric: boolean;         // is this section scoreable yet (irl-1..irl-5)?
  assessmentId: string | null;
}

const SHORT_LABELS: Record<string, string> = {
  "irl-1": "Idea & BMC",
  "irl-2": "Market",
  "irl-3": "Validation",
  "irl-4": "MVP",
  "irl-5": "PMF",
  "irl-6": "Revenue",
  "irl-7": "Prototype",
  "irl-8": "Operations",
  "irl-9": "Metrics",
};

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Latest assessment per section — pull all rows then dedupe by section,
  // keeping the most recent per section.
  const allAssessments = await prisma.irlAssessment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  const latestBySection = new Map<string, typeof allAssessments[number]>();
  for (const a of allAssessments) {
    if (!latestBySection.has(a.section)) latestBySection.set(a.section, a);
  }

  // Whether the founder has touched each section
  const state = await loadResumeState(user.email);
  const answered = state.answersByQuestion;

  function sectionHasAnswers(sectionId: string): boolean {
    const sec = SECTIONS.find(s => s.id === sectionId);
    if (!sec) return false;
    for (const qid of sec.questionIds) {
      const q = QUESTION_BY_ID[qid];
      if (!q?.required) continue;
      const v = answered[qid];
      if (v !== undefined && v !== null && v !== "" &&
          !(Array.isArray(v) && v.length === 0)) {
        return true;
      }
    }
    return false;
  }

  const sections: SectionStatus[] = [];
  for (let i = 1; i <= 9; i++) {
    const sectionId = `irl-${i}`;
    const a = latestBySection.get(sectionId) ?? null;
    sections.push({
      section: sectionId,
      index: i,
      shortLabel: SHORT_LABELS[sectionId] ?? sectionId,
      score: a?.score ?? null,
      diagnosis: a?.diagnosis ?? null,
      hasAnswers: sectionHasAnswers(sectionId),
      hasRubric: !!getRubric(sectionId),
      assessmentId: a?.id ?? null,
    });
  }

  // Composite score: average of assessed sections (null if none)
  const assessed = sections.filter(s => s.score !== null);
  const composite =
    assessed.length > 0
      ? Math.round(
          assessed.reduce((sum, s) => sum + (s.score ?? 0), 0) / assessed.length
        )
      : null;

  return NextResponse.json({
    composite,
    assessedCount: assessed.length,
    sections,
    threshold: 65,
  });
}

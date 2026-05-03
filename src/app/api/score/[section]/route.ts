// POST /api/score/irl-1 (or irl-2..irl-5)
// Evaluates the founder's answers for a section, persists IrlAssessment,
// returns score + recommended modules. Idempotent in spirit but creates a
// new row each call (we want history for re-takes).

import { NextResponse } from "next/server";
import { getCurrentUser, getLocaleFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { loadResumeState } from "@/lib/session";
import { evaluateSection } from "@/lib/scoring/evaluate";
import { getRubric } from "@/lib/scoring/rubrics";
import { recommendModules } from "@/lib/modules/recommend";
import { MODULE_BY_ID } from "@/lib/modules/catalog";
import { localizeModule } from "@/i18n/getters";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: { section: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const sectionId = params.section.startsWith("irl-")
      ? params.section
      : `irl-${params.section}`;

    const rubric = getRubric(sectionId);
    if (!rubric) {
      return NextResponse.json({ error: "Unknown section" }, { status: 400 });
    }

    const state = await loadResumeState(user.email);

    const locale = getLocaleFromCookies();
    const result = await evaluateSection({
      section: sectionId,
      answers: state.answersByQuestion,
      startupName: user.startupName,
      industries: user.industries,
      locale,
    });

    // Persist
    const assessment = await prisma.irlAssessment.create({
      data: {
        userId: user.id,
        section: sectionId,
        score: result.score,
        diagnosis: result.diagnosis,
        strengths: JSON.stringify(result.strengths),
        gaps: JSON.stringify(result.gaps),
        gapTags: JSON.stringify(result.gapTags),
        rubricVer: result.rubricVer,
      },
    });

    // What modules has the user already completed/skipped?
    const progress = await prisma.moduleProgress.findMany({
      where: { userId: user.id },
    });
    const completedIds = new Set(
      progress.filter(p => p.status === "completed" || p.status === "skipped").map(p => p.moduleId)
    );

    const recs = recommendModules({
      section: sectionId,
      score: result.score,
      threshold: rubric.threshold,
      gapTags: result.gapTags,
      excludeIds: completedIds,
    });

    // Mark recommended modules (both required AND optional) as "suggested" if
    // not already tracked. The optional bucket is informational, but persisting
    // them lets us surface "completed" badges next time.
    for (const m of [...recs.required, ...recs.optional]) {
      const existing = progress.find(p => p.moduleId === m.id);
      if (!existing) {
        await prisma.moduleProgress.create({
          data: { userId: user.id, moduleId: m.id, status: "suggested" },
        });
      }
    }

    return NextResponse.json({
      assessmentId: assessment.id,
      section: sectionId,
      score: result.score,
      diagnosis: result.diagnosis,
      strengths: result.strengths,
      gaps: result.gaps,
      gapTags: result.gapTags,
      threshold: rubric.threshold,
      passed: result.score >= rubric.threshold,
      // Localize module title/blurb/shortTitle so the result page UI receives
      // strings in the user's locale.
      recommendations: recs.required.map(m => localizeModule(m, locale)),
      optional: recs.optional.map(m => localizeModule(m, locale)),
      completedModuleIds: [...completedIds].filter(id => {
        const m = MODULE_BY_ID[id];
        return m && m.section === sectionId;
      }),
    });
  } catch (e) {
    console.error("[/api/score]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

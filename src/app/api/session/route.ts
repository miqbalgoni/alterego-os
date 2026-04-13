// POST /api/session  -> returns resume state (answers + currentStep) for the
// authenticated user. Identity comes from the auth cookie, not the body.

import { NextResponse } from "next/server";
import { loadResumeState, upsertAnswer, updateSessionStep } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const state = await loadResumeState(user.email);
    await upsertAnswer(state.userId, "p_email", state.email);
    await updateSessionStep(state.userId, state.currentStep);

    const fresh = await prisma.user.findUnique({ where: { id: state.userId } });

    return NextResponse.json({
      userId: state.userId,
      email: state.email,
      answers: { ...state.answersByQuestion, p_email: state.email },
      currentStep: state.currentStep,
      submitted: state.submitted,
      user: {
        fullName: fresh?.fullName ?? null,
        startupName: fresh?.startupName ?? null,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

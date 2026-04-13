// POST /api/submit  -> finalize and mark session submitted.
// Identity comes from the auth cookie.

import { NextResponse } from "next/server";
import { markSubmitted, loadResumeState, sectionComplete } from "@/lib/session";
import { SECTIONS } from "@/lib/questions";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const state = await loadResumeState(user.email);

    const incomplete: string[] = [];
    for (const s of SECTIONS) {
      const { missing } = sectionComplete(s.id, state.answersByQuestion);
      incomplete.push(...missing);
    }
    if (incomplete.length > 0) {
      return NextResponse.json(
        { error: "Incomplete", missing: incomplete },
        { status: 400 }
      );
    }

    await markSubmitted(user.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/answer  { questionId, value }
// Identity comes from the auth cookie. Autosave endpoint — called on every
// field change/blur.

import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertAnswer } from "@/lib/session";
import { QUESTION_BY_ID } from "@/lib/questions";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const Body = z.object({
  questionId: z.string().min(1),
  value: z.any(),
});

const USER_MIRROR: Record<string, string> = {
  p_email: "email",
  p_fullName: "fullName",
  p_phone: "phone",
  p_address: "address",
  p_startupName: "startupName",
  p_industries: "industries",
  p_stage: "stage",
};

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const { questionId, value } = parsed.data;

    if (!QUESTION_BY_ID[questionId]) {
      return NextResponse.json({ error: "Unknown question" }, { status: 400 });
    }

    // p_email is fixed to the authenticated user's email — never overwrite it
    if (questionId === "p_email") {
      return NextResponse.json({ ok: true, ignored: true });
    }

    await upsertAnswer(user.id, questionId, value);

    if (USER_MIRROR[questionId]) {
      const col = USER_MIRROR[questionId];
      const data: Record<string, unknown> = {};
      data[col] = Array.isArray(value) ? JSON.stringify(value) : String(value ?? "");
      await prisma.user.update({ where: { id: user.id }, data }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

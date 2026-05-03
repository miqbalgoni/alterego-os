// POST /api/lesson/complete  { moduleId }
// Marks a module as completed. Returns { ok, section } so the OutroCard can
// route the founder back to the right readiness review.

import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getModule } from "@/lib/modules/catalog";

const Body = z.object({
  moduleId: z.string().min(1),
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

  const { moduleId } = parsed.data;
  await prisma.moduleProgress.upsert({
    where: { userId_moduleId: { userId: user.id, moduleId } },
    create: {
      userId: user.id,
      moduleId,
      status: "completed",
      startedAt: new Date(),
      completedAt: new Date(),
    },
    update: {
      status: "completed",
      completedAt: new Date(),
    },
  });

  const mod = getModule(moduleId);
  return NextResponse.json({ ok: true, section: mod?.section ?? null });
}

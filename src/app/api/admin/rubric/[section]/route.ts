import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin";
import { RUBRICS } from "@/lib/scoring/rubrics";

const Body = z.object({
  criteria: z.string().min(20).max(8000),
  threshold: z.number().int().min(0).max(100),
  notes: z.string().max(500).optional(),
});

export async function POST(req: Request, { params }: { params: { section: string } }) {
  try {
    const admin = await requireAdmin();
    if (!RUBRICS[params.section]) {
      return NextResponse.json({ error: "Unknown section" }, { status: 404 });
    }
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    // Deactivate any prior overrides for this section
    await prisma.rubricOverride.updateMany({
      where: { section: params.section, active: true },
      data: { active: false },
    });
    const version = `${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 6)}`;
    const created = await prisma.rubricOverride.create({
      data: {
        section: params.section,
        version,
        active: true,
        rubricJson: JSON.stringify({
          criteria: parsed.data.criteria,
          threshold: parsed.data.threshold,
          notes: parsed.data.notes ?? "",
        }),
        notes: parsed.data.notes ?? null,
        createdById: admin.id,
      },
    });
    await logAdminAction({
      adminId: admin.id,
      action: "rubric.update",
      resourceType: "rubric",
      resourceId: params.section,
      metadata: { version: created.version, threshold: parsed.data.threshold },
    });
    return NextResponse.json({ ok: true, version: created.version });
  } catch (e) {
    if (String(e).includes("Forbidden")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { section: string } }) {
  try {
    const admin = await requireAdmin();
    await prisma.rubricOverride.updateMany({
      where: { section: params.section, active: true },
      data: { active: false },
    });
    await logAdminAction({
      adminId: admin.id,
      action: "rubric.revert",
      resourceType: "rubric",
      resourceId: params.section,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (String(e).includes("Forbidden")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin();
    const body = (await req.json()) as { flagged?: boolean; flagReason?: string | null };
    if (typeof body.flagged !== "boolean") {
      return NextResponse.json({ error: "flagged must be boolean" }, { status: 400 });
    }
    await prisma.chatLog.update({
      where: { id: params.id },
      data: {
        flagged: body.flagged,
        flagReason: body.flagged ? (body.flagReason ?? null) : null,
      },
    });
    await logAdminAction({
      adminId: admin.id,
      action: body.flagged ? "chat.flag" : "chat.unflag",
      resourceType: "chat",
      resourceId: params.id,
      metadata: body.flagReason ? { reason: body.flagReason } : null,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (String(e).includes("Forbidden")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

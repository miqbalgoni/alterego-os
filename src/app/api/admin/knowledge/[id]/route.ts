import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin();
    const doc = await prisma.knowledgeDocument.findUnique({ where: { id: params.id } });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await prisma.knowledgeDocument.delete({ where: { id: params.id } });
    await logAdminAction({
      adminId: admin.id,
      action: "doc.delete",
      resourceType: "document",
      resourceId: params.id,
      metadata: { title: doc.title },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (String(e).includes("Forbidden")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin();
    const body = (await req.json()) as { status?: "active" | "archived" };
    if (!body.status || !["active", "archived"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    await prisma.knowledgeDocument.update({
      where: { id: params.id },
      data: { status: body.status },
    });
    await logAdminAction({
      adminId: admin.id,
      action: `doc.${body.status === "archived" ? "archive" : "restore"}`,
      resourceType: "document",
      resourceId: params.id,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (String(e).includes("Forbidden")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

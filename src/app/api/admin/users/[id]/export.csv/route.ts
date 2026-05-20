import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin";
import { QUESTION_BY_ID } from "@/lib/questions";

function csvCell(v: unknown): string {
  if (v == null) return "";
  const s = typeof v === "string" ? v : JSON.stringify(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin();
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        answers: true,
        assessments: { orderBy: { createdAt: "desc" } },
        modules: true,
        sessions: true,
      },
    });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await logAdminAction({
      adminId: admin.id,
      action: "export.csv",
      resourceType: "user",
      resourceId: user.id,
    });

    const lines: string[] = [];
    lines.push(["section", "questionId", "questionLabel", "value"].map(csvCell).join(","));
    for (const a of user.answers) {
      const q = QUESTION_BY_ID[a.questionId];
      lines.push([
        q?.section ?? "",
        a.questionId,
        q?.label ?? "",
        a.value,
      ].map(csvCell).join(","));
    }
    lines.push("");
    lines.push(["section", "score", "diagnosis", "gapTags", "createdAt"].map(csvCell).join(","));
    for (const x of user.assessments) {
      lines.push([
        x.section, x.score, x.diagnosis, x.gapTags, x.createdAt.toISOString(),
      ].map(csvCell).join(","));
    }

    const safeName = (user.email || user.id).replace(/[^a-z0-9._-]/gi, "_");
    return new Response(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${safeName}.csv"`,
      },
    });
  } catch (e) {
    if (String(e).includes("Forbidden")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

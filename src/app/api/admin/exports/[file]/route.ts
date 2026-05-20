import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin";

function csvCell(v: unknown): string {
  if (v == null) return "";
  const s = typeof v === "string" ? v : v instanceof Date ? v.toISOString() : JSON.stringify(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function row(cells: unknown[]) {
  return cells.map(csvCell).join(",");
}

export async function GET(_req: Request, { params }: { params: { file: string } }) {
  try {
    const admin = await requireAdmin();
    const fname = params.file;

    let csv = "";
    let filename = "export.csv";

    if (fname === "users.csv") {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "asc" },
        include: {
          sessions: { orderBy: { updatedAt: "desc" }, take: 1 },
          _count: { select: { assessments: true, modules: true } },
        },
      });
      csv += row(["id", "email", "fullName", "role", "startupName", "stage", "industries", "currentStep", "submitted", "submittedAt", "assessmentsCount", "modulesCount", "createdAt", "lastSeenAt"]) + "\n";
      for (const u of users) {
        const s = u.sessions[0];
        csv += row([
          u.id, u.email, u.fullName, u.role, u.startupName, u.stage, u.industries,
          s?.currentStep, s?.submitted, s?.submittedAt, u._count.assessments, u._count.modules,
          u.createdAt, u.lastSeenAt,
        ]) + "\n";
      }
      filename = "founders.csv";
    } else if (fname === "assessments.csv") {
      const rows = await prisma.irlAssessment.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { email: true } } },
      });
      csv += row(["id", "userId", "userEmail", "section", "score", "diagnosis", "strengths", "gaps", "gapTags", "rubricVer", "createdAt"]) + "\n";
      for (const r of rows) {
        csv += row([r.id, r.userId, r.user?.email, r.section, r.score, r.diagnosis, r.strengths, r.gaps, r.gapTags, r.rubricVer, r.createdAt]) + "\n";
      }
      filename = "assessments.csv";
    } else if (fname === "answers.csv") {
      const rows = await prisma.answer.findMany({
        orderBy: [{ userId: "asc" }, { questionId: "asc" }],
        include: { user: { select: { email: true } } },
      });
      csv += row(["userId", "userEmail", "questionId", "value", "updatedAt"]) + "\n";
      for (const r of rows) {
        csv += row([r.userId, r.user?.email, r.questionId, r.value, r.updatedAt]) + "\n";
      }
      filename = "answers.csv";
    } else if (fname === "modules.csv") {
      const rows = await prisma.moduleProgress.findMany({
        orderBy: { updatedAt: "desc" },
        include: { user: { select: { email: true } } },
      });
      csv += row(["userId", "userEmail", "moduleId", "status", "beatIndex", "startedAt", "completedAt", "updatedAt"]) + "\n";
      for (const r of rows) {
        csv += row([r.userId, r.user?.email, r.moduleId, r.status, r.beatIndex, r.startedAt, r.completedAt, r.updatedAt]) + "\n";
      }
      filename = "modules.csv";
    } else if (fname === "chat-logs.csv") {
      const rows = await prisma.chatLog.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { email: true } } },
      });
      csv += row(["id", "userEmail", "locale", "userMessage", "assistantMessage", "ragSources", "flagged", "flagReason", "createdAt"]) + "\n";
      for (const r of rows) {
        csv += row([r.id, r.user?.email, r.locale, r.userMessage, r.assistantMessage, r.ragSources, r.flagged, r.flagReason, r.createdAt]) + "\n";
      }
      filename = "chat-logs.csv";
    } else {
      return NextResponse.json({ error: "Unknown export" }, { status: 404 });
    }

    await logAdminAction({
      adminId: admin.id,
      action: "export.csv",
      resourceType: "export",
      resourceId: filename,
    });

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    if (String(e).includes("Forbidden")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

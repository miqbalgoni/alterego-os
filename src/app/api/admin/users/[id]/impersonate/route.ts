import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin";
import { createSessionCookie } from "@/lib/auth";

// POST /api/admin/users/[id]/impersonate
// Replaces the current admin session cookie with a founder session cookie for
// the target user. The admin "loses" their session — they must re-login to
// return to admin. We log the action.
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin();
    const target = await prisma.user.findUnique({ where: { id: params.id } });
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (target.id === admin.id) {
      return NextResponse.json({ error: "Cannot impersonate yourself" }, { status: 400 });
    }
    await logAdminAction({
      adminId: admin.id,
      action: "user.impersonate",
      resourceType: "user",
      resourceId: target.id,
      metadata: { targetEmail: target.email },
    });
    await createSessionCookie(target.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (String(e).includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

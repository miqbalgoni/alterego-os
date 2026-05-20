import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentAdmin, isSuperAdminRole, logAdminAction } from "@/lib/admin";

const Body = z.object({
  role: z.enum(["FOUNDER", "ADMIN", "SUPERADMIN"]),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const me = await getCurrentAdmin();
    if (!me || !isSuperAdminRole(me.role)) {
      return NextResponse.json({ error: "Super-admin only" }, { status: 403 });
    }
    if (params.id === me.id) {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
    }
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const target = await prisma.user.findUnique({ where: { id: params.id } });
    if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const prev = target.role;
    await prisma.user.update({ where: { id: target.id }, data: { role: parsed.data.role } });
    await logAdminAction({
      adminId: me.id,
      action: parsed.data.role === "FOUNDER" ? "admin.demote" : "admin.promote",
      resourceType: "user",
      resourceId: target.id,
      metadata: { from: prev, to: parsed.data.role, targetEmail: target.email },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

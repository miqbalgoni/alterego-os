import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentAdmin, isSuperAdminRole, logAdminAction } from "@/lib/admin";

const Body = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "SUPERADMIN"]),
});

export async function POST(req: Request) {
  try {
    const me = await getCurrentAdmin();
    if (!me || !isSuperAdminRole(me.role)) {
      return NextResponse.json({ error: "Super-admin only" }, { status: 403 });
    }
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    const email = parsed.data.email.trim().toLowerCase();
    const target = await prisma.user.findUnique({ where: { email } });
    if (!target) {
      return NextResponse.json({ error: "No user with that email. They must sign up first." }, { status: 404 });
    }
    await prisma.user.update({ where: { id: target.id }, data: { role: parsed.data.role } });
    await logAdminAction({
      adminId: me.id,
      action: "admin.promote",
      resourceType: "user",
      resourceId: target.id,
      metadata: { targetEmail: email, newRole: parsed.data.role },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

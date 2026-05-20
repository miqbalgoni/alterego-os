import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword, createSessionCookie } from "@/lib/auth";
import { reconcileAdminRole, isAdminRole } from "@/lib/admin";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const email = parsed.data.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }
    await createSessionCookie(user.id);
    await reconcileAdminRole(user.id, email);
    await prisma.user.update({ where: { id: user.id }, data: { lastSeenAt: new Date() } });
    const fresh = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } });
    return NextResponse.json({
      ok: true,
      userId: user.id,
      email: user.email,
      isAdmin: isAdminRole(fresh?.role),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

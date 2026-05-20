import { NextResponse } from "next/server";
import { z } from "zod";
import { consumeResetToken } from "@/lib/passwordReset";
import { createSessionCookie } from "@/lib/auth";
import { reconcileAdminRole, isAdminRole } from "@/lib/admin";
import { prisma } from "@/lib/db";

const Body = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});

// POST /api/auth/reset { token, password }
// On success: sets the new password, signs the user in (creates session cookie),
// reconciles admin role, returns { ok: true, isAdmin }.
export async function POST(req: Request) {
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const result = await consumeResetToken({
      token: parsed.data.token,
      newPassword: parsed.data.password,
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { id: result.userId },
      select: { id: true, email: true, role: true },
    });
    if (!user) return NextResponse.json({ error: "User vanished" }, { status: 500 });

    await createSessionCookie(user.id);
    await reconcileAdminRole(user.id, user.email);
    const fresh = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { lastSeenAt: new Date() },
    });
    return NextResponse.json({ ok: true, isAdmin: isAdminRole(fresh?.role) });
  } catch (e) {
    console.error("[auth/reset]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

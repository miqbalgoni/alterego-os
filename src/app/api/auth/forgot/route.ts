import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createResetToken } from "@/lib/passwordReset";
import { sendEmail, passwordResetEmail, getAppUrl } from "@/lib/email";

const Body = z.object({
  email: z.string().email(),
});

// POST /api/auth/forgot { email }
// Always returns 200 with the same "if an account exists…" message to avoid
// leaking which emails are registered. If the email matches a user we silently
// generate a token and email the link.
export async function POST(req: Request) {
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }
    const email = parsed.data.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const token = await createResetToken(user.id);
      const url = `${getAppUrl()}/reset-password?token=${token}`;
      const { text, html } = passwordResetEmail({ resetUrl: url });
      await sendEmail({
        to: email,
        subject: "Reset your ALTEREGO OS password",
        text,
        html,
      });
    }
    return NextResponse.json({
      ok: true,
      message: "If an account exists for that email, we've sent a reset link.",
    });
  } catch (e) {
    console.error("[auth/forgot]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

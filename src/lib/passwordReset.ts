// Password reset token generation + validation.
//
// Security model:
// - Token is 32 random bytes encoded as base64url (43 chars).
// - We store ONLY the SHA-256 hash in the DB. The plaintext lives only in the
//   email link and the user's browser URL. A DB leak doesn't grant resets.
// - Tokens are single-use (usedAt). Each reset request invalidates prior unused
//   tokens for the same user.
// - 1-hour expiry. Short enough to limit window, long enough to handle email
//   delays / users opening on a different device.

import crypto from "node:crypto";
import { prisma } from "./db";
import { hashPassword } from "./auth";

const EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createResetToken(userId: string): Promise<string> {
  // Invalidate any prior unused tokens for this user
  await prisma.passwordResetToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });
  const raw = crypto.randomBytes(32).toString("base64url");
  await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash: hashToken(raw),
      expiresAt: new Date(Date.now() + EXPIRY_MS),
    },
  });
  return raw;
}

export async function consumeResetToken(opts: {
  token: string;
  newPassword: string;
}): Promise<{ ok: true; userId: string } | { ok: false; reason: string }> {
  if (!opts.token || typeof opts.token !== "string") {
    return { ok: false, reason: "Missing token." };
  }
  if (opts.newPassword.length < 8) {
    return { ok: false, reason: "Password must be at least 8 characters." };
  }
  const tokenHash = hashToken(opts.token);
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });
  if (!record) return { ok: false, reason: "Invalid or expired reset link." };
  if (record.usedAt) return { ok: false, reason: "This reset link has already been used." };
  if (record.expiresAt.getTime() < Date.now()) {
    return { ok: false, reason: "This reset link has expired. Request a new one." };
  }
  const passwordHash = await hashPassword(opts.newPassword);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);
  return { ok: true, userId: record.userId };
}

export async function isValidToken(token: string): Promise<boolean> {
  if (!token) return false;
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });
  if (!record) return false;
  if (record.usedAt) return false;
  return record.expiresAt.getTime() >= Date.now();
}

// One-off: generate a password reset link for a given email and print it.
// Usage: npx tsx scripts/generate-reset-link.ts user@example.com [baseUrl]
//
// Use this when email isn't configured yet (RESEND_API_KEY missing) and you
// need to unlock an account manually. The link expires in 1 hour.

import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";

const prisma = new PrismaClient();

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function main() {
  const email = (process.argv[2] || "").trim().toLowerCase();
  const baseUrl = process.argv[3] || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
  if (!email) {
    console.error("Usage: npx tsx scripts/generate-reset-link.ts user@example.com [baseUrl]");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No user found with email: ${email}`);
    process.exit(2);
  }

  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });
  const raw = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash: hashToken(raw), expiresAt },
  });

  console.log("\n========== PASSWORD RESET LINK ==========");
  console.log(`User:    ${email}`);
  console.log(`Role:    ${user.role}`);
  console.log(`Expires: ${expiresAt.toISOString()} (1 hour)`);
  console.log("");
  console.log(`${baseUrl}/reset-password?token=${raw}`);
  console.log("=========================================\n");

  await prisma.$disconnect();
}

main().catch(async e => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

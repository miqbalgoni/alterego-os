// Admin authorization helpers.
//
// Admin model: role lives on User ("FOUNDER" | "ADMIN" | "SUPERADMIN").
// Bootstrap: ADMIN_EMAILS env var (comma-separated) is the source of truth for
// SUPERADMINs — those emails are auto-promoted on any sign-in. Additional ADMINs
// can be promoted from the admin UI by a SUPERADMIN.
//
// Why env-based bootstrap: avoids a chicken-and-egg problem (no admin exists to
// promote the first admin) and means seizing the database alone is not enough
// to grant admin without also having env access.

import { prisma } from "./db";
import { getCurrentUser } from "./auth";

export type Role = "FOUNDER" | "ADMIN" | "SUPERADMIN";

export function isAdminRole(role: string | null | undefined): boolean {
  return role === "ADMIN" || role === "SUPERADMIN";
}

export function isSuperAdminRole(role: string | null | undefined): boolean {
  return role === "SUPERADMIN";
}

function envAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isEnvAdminEmail(email: string): boolean {
  return envAdminEmails().includes(email.trim().toLowerCase());
}

/**
 * Reconcile a user's role with the ADMIN_EMAILS env list.
 * Called on every login + signup. Idempotent.
 *
 * - If email is in ADMIN_EMAILS and role < SUPERADMIN: promote to SUPERADMIN.
 * - We do NOT auto-demote — admins removed from env keep their role until a
 *   SUPERADMIN demotes them via the UI. (Prevents accidental lockout.)
 */
export async function reconcileAdminRole(userId: string, email: string): Promise<void> {
  if (!isEnvAdminEmail(email)) return;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user) return;
  if (user.role !== "SUPERADMIN") {
    await prisma.user.update({
      where: { id: userId },
      data: { role: "SUPERADMIN" },
    });
  }
}

/**
 * Resolve the current admin user or null. Used by /api/admin/* routes and
 * /admin pages to gate access.
 */
export async function getCurrentAdmin() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!isAdminRole(user.role)) return null;
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentAdmin();
  if (!user) throw new Error("Forbidden");
  return user;
}

/**
 * Append an entry to the admin audit log. Never throws — audit failures
 * should not break the underlying action.
 */
export async function logAdminAction(opts: {
  adminId: string;
  action: string;
  resourceType?: string | null;
  resourceId?: string | null;
  metadata?: Record<string, unknown> | null;
}): Promise<void> {
  try {
    await prisma.adminLog.create({
      data: {
        adminId: opts.adminId,
        action: opts.action,
        resourceType: opts.resourceType ?? null,
        resourceId: opts.resourceId ?? null,
        metadata: opts.metadata ? JSON.stringify(opts.metadata) : null,
      },
    });
  } catch (e) {
    console.error("[admin] logAdminAction failed", e);
  }
}

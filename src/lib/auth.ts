import { cookies } from "next/headers";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const SESSION_COOKIE = "alterego_auth";
const LOCALE_COOKIE = "alterego_locale";
const SESSION_MAX_AGE_S = 60 * 60 * 24 * 30; // 30 days

const SECRET =
  process.env.AUTH_SECRET ||
  "dev-only-insecure-secret-please-set-AUTH_SECRET-in-env";

function sign(payload: string): string {
  const h = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${h}`;
}

function verify(token: string): string | null {
  const idx = token.lastIndexOf(".");
  if (idx < 0) return null;
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  return payload;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function createSessionCookie(userId: string) {
  const token = sign(`${userId}.${Date.now()}`);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_S,
  });
}

export function clearSessionCookie() {
  cookies().delete(SESSION_COOKIE);
  cookies().delete(LOCALE_COOKIE);
}

export function getUserIdFromCookies(): string | null {
  const c = cookies().get(SESSION_COOKIE)?.value;
  if (!c) return null;
  const payload = verify(c);
  if (!payload) return null;
  const [userId] = payload.split(".");
  return userId || null;
}

export async function getCurrentUser() {
  const id = getUserIdFromCookies();
  if (!id) return null;
  return prisma.user.findUnique({ where: { id } });
}

export const SUPPORTED_LOCALES = ["en", "es", "fr", "de", "it", "pt"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function getLocaleFromCookies(): Locale {
  const v = cookies().get(LOCALE_COOKIE)?.value as Locale | undefined;
  return v && (SUPPORTED_LOCALES as readonly string[]).includes(v) ? v : "en";
}

export function setLocaleCookie(locale: Locale) {
  cookies().set(LOCALE_COOKIE, locale, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_S,
  });
}

export { SESSION_COOKIE, LOCALE_COOKIE };

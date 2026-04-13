import { NextResponse } from "next/server";
import { z } from "zod";
import { setLocaleCookie, SUPPORTED_LOCALES, type Locale } from "@/lib/auth";

const Body = z.object({ locale: z.enum(SUPPORTED_LOCALES) });

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }
  setLocaleCookie(parsed.data.locale as Locale);
  return NextResponse.json({ ok: true, locale: parsed.data.locale });
}

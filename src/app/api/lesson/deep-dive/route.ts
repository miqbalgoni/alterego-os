// GET /api/lesson/deep-dive?moduleId=xxx&beatId=yyy
// Streams a rich A2UI sequence (newline-delimited JSON) for a single concept
// beat. Each addComponent message is paced ~120ms apart so the UI feels alive.

import { getCurrentUser, getLocaleFromCookies } from "@/lib/auth";
import { getModule } from "@/lib/modules/catalog";
import { getModuleContent } from "@/lib/modules/content";
import { buildDeepDiveMessages } from "@/lib/a2ui/deepDive";
import { serverT } from "@/i18n/getters";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(req.url);
  const moduleId = url.searchParams.get("moduleId") ?? "";
  const beatId = url.searchParams.get("beatId") ?? "";

  const mod = getModule(moduleId);
  const content = getModuleContent(moduleId);
  if (!mod || !content) {
    return new Response("Unknown module", { status: 404 });
  }
  const beat = content.beats.find(b => b.id === beatId);
  if (!beat) return new Response("Unknown beat", { status: 404 });

  const surfaceId = `deep-${moduleId}-${beatId}`;
  const encoder = new TextEncoder();
  const locale = getLocaleFromCookies();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const gen = buildDeepDiveMessages({
          module: mod,
          beat,
          surfaceId,
          locale,
          founder: {
            startupName: user.startupName,
            industries: user.industries,
          },
        });
        for await (const msg of gen) {
          controller.enqueue(encoder.encode(JSON.stringify(msg) + "\n"));
          if (msg.kind === "addComponent") {
            await new Promise(r => setTimeout(r, 120));
          }
        }
        controller.close();
      } catch (e) {
        console.error("[deep-dive stream]", e);
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              kind: "addComponent",
              surfaceId,
              component: {
                id: "deep-error",
                type: "Callout",
                props: {
                  variant: "warning",
                  title: serverT(locale, "a2ui.deepDive.unavailable"),
                  body: serverT(locale, "a2ui.deepDive.unavailableBody"),
                },
              },
            }) + "\n"
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

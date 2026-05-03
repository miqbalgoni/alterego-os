// GET /api/lesson?moduleId=xxx
// Streams A2UI messages (newline-delimited JSON) for the requested module.
// Each beat becomes one or more messages. The client renderer composes them
// into a live, interactive lesson.
//
// We use a small artificial delay between beats to give the UI a "streaming"
// feel even when content is authored (rather than LLM-generated).

import { getCurrentUser, getLocaleFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getModule } from "@/lib/modules/catalog";
import { getModuleContent } from "@/lib/modules/content";
import { buildModuleMessages } from "@/lib/a2ui/builder";
import { translateText } from "@/lib/i18n/serverTranslate";
import {
  serverT,
  getLocalizedBeatTitle,
  getSectionLongLabel,
  localizeModule,
} from "@/i18n/getters";
import type { A2UIMessage, Component } from "@/lib/a2ui/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BMC_QUESTION_TO_BLOCK: Record<string, string> = {
  // Map IRL 1 BMC questions to canvas block ids (best-effort prefill).
  // q8 is a multi-select listing which BMC blocks already have hypotheses.
  // Full per-block text isn't captured in answers — we use what's available.
};

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const url = new URL(req.url);
  const moduleId = url.searchParams.get("moduleId") ?? "";
  const mod = getModule(moduleId);
  const content = getModuleContent(moduleId);
  if (!mod || !content) {
    return new Response("Unknown module", { status: 404 });
  }

  // Mark module as started (idempotent — only updates first time)
  prisma.moduleProgress
    .upsert({
      where: { userId_moduleId: { userId: user.id, moduleId } },
      create: { userId: user.id, moduleId, status: "started", startedAt: new Date() },
      update: { status: "started", startedAt: new Date() },
    })
    .catch(err => console.error("[lesson] progress upsert failed", err));

  // Best-effort BMC prefill from previously-saved outputs of this module
  let bmcPrefill: Record<string, string> | undefined;
  const existing = await prisma.moduleProgress.findUnique({
    where: { userId_moduleId: { userId: user.id, moduleId } },
  });
  if (existing?.outputs) {
    try {
      const parsed = JSON.parse(existing.outputs) as Record<string, unknown>;
      // outputs is keyed by beatId -> { kind, outputs }
      for (const v of Object.values(parsed)) {
        const o = v as { kind?: string; outputs?: Record<string, string> };
        if (o.kind === "bmc" && o.outputs) {
          bmcPrefill = o.outputs;
          break;
        }
      }
    } catch {
      /* ignore */
    }
  }

  const surfaceId = `lesson-${moduleId}`;
  const locale = getLocaleFromCookies();
  const localizedMod = localizeModule(mod, locale);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messages = buildModuleMessages({
          module: localizedMod,
          content,
          surfaceId,
          founder: {
            startupName: user.startupName,
            industries: user.industries,
          },
          bmcPrefill,
        });
        for (const msg of messages) {
          const localized = await localizeMessage(msg, locale, moduleId);
          controller.enqueue(encoder.encode(JSON.stringify(localized) + "\n"));
          if (msg.kind === "addComponent") {
            await new Promise(r => setTimeout(r, 90));
          }
        }
        controller.close();
      } catch (e) {
        console.error("[lesson stream]", e);
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              kind: "addComponent",
              surfaceId,
              component: {
                id: "error",
                type: "KeyIdeaCard",
                props: {
                  title: serverT(locale, "lesson.loadFailed"),
                  body: serverT(locale, "common.tryAgain"),
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

// Localize a single A2UI message before streaming.
// Short labels (titles, section labels) come from authored translations
// (instant, deterministic). Long body text goes through Claude (cached).
async function localizeMessage(
  msg: A2UIMessage,
  locale: "en" | "it",
  moduleId: string
): Promise<A2UIMessage> {
  if (locale === "en") return msg;
  if (msg.kind !== "addComponent") return msg;
  const c = msg.component;
  switch (c.type) {
    case "LessonHeader":
      return {
        ...msg,
        component: {
          ...c,
          props: {
            ...c.props,
            sectionLabel: getSectionLongLabel(
              moduleId.startsWith("m") ? sectionFromModule(moduleId) : c.props.sectionLabel,
              locale
            ),
          },
        },
      } as A2UIMessage;
    case "KeyIdeaCard":
      return {
        ...msg,
        component: {
          ...c,
          props: {
            ...c.props,
            title:
              c.props.beatId
                ? getLocalizedBeatTitle(moduleId, c.props.beatId, c.props.title, locale)
                : c.props.title,
            body: await translateText(c.props.body, locale),
            citation: c.props.citation
              ? await translateText(c.props.citation, locale)
              : c.props.citation,
          },
        },
      } as A2UIMessage;
    case "ExampleCallout":
      return {
        ...msg,
        component: {
          ...c,
          props: {
            ...c.props,
            title: c.props.title ? await translateText(c.props.title, locale) : c.props.title,
            body: await translateText(c.props.body, locale),
          },
        },
      } as A2UIMessage;
    case "QuizMultipleChoice":
      return {
        ...msg,
        component: {
          ...c,
          props: {
            ...c.props,
            question: await translateText(c.props.question, locale),
            options: await Promise.all(
              c.props.options.map(async o => ({
                id: o.id,
                text: await translateText(o.text, locale),
              }))
            ),
          },
        },
      } as A2UIMessage;
    case "ApplyToMyStartupForm":
      return {
        ...msg,
        component: {
          ...c,
          props: {
            ...c.props,
            prompt: await translateText(c.props.prompt, locale),
          },
        },
      } as A2UIMessage;
    case "ChecklistInteractive":
      return {
        ...msg,
        component: {
          ...c,
          props: {
            ...c.props,
            title: await translateText(c.props.title, locale),
            items: await Promise.all(
              c.props.items.map(async it => ({
                id: it.id,
                label: await translateText(it.label, locale),
              }))
            ),
          },
        },
      } as A2UIMessage;
    case "OutroCard":
      return {
        ...msg,
        component: {
          ...c,
          props: {
            ...c.props,
            title: await translateText(c.props.title, locale),
            body: await translateText(c.props.body, locale),
            nextAction: c.props.nextAction
              ? await translateText(c.props.nextAction, locale)
              : c.props.nextAction,
          },
        },
      } as A2UIMessage;
    default:
      return msg;
  }
}

function sectionFromModule(moduleId: string): string {
  // moduleId like "m13-defining-the-problem" → IRL section comes from catalog
  // (we already have the localized module above, but defaulting here keeps
  // this helper standalone). Caller can override.
  const map: Record<string, string> = {
    m13: "irl-1", m14: "irl-1", m15: "irl-1", m16: "irl-1",
    m17: "irl-2", m18: "irl-2", m19: "irl-2",
    m20: "irl-3", m21: "irl-3", m22: "irl-3", m23: "irl-3",
    m24: "irl-4", m25: "irl-4", m26: "irl-4", m27: "irl-4",
    m28: "irl-5", m29: "irl-5", m30: "irl-5", m31: "irl-5",
  };
  const short = moduleId.split("-")[0];
  return map[short] ?? "irl-1";
}

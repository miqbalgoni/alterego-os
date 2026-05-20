// POST /api/chat  { messages: [{role, content}] }
// Streaming chat for the "Ask Me" floating widget.
// Gracefully degrades if ANTHROPIC_API_KEY is missing.

import { anthropic, MODEL_ASKME, isAnthropicConfigured } from "@/lib/anthropic";
import { retrieveContextDetailed } from "@/lib/rag";
import { getLocaleFromCookies, getUserIdFromCookies } from "@/lib/auth";
import { localeName } from "@/lib/i18n/serverTranslate";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const SYSTEM_PROMPT_BASE = `You are "Ask Me", the HIVE onboarding assistant inside ALTEREGO OS —
an Entrepreneur Guidance Platform. You help aspiring startup founders who are filling out
the HIVE check-in questionnaire (Investment Readiness Level, IRL 1–9). Your job is to
clarify questions, define terms (Business Model Canvas, early adopters, KPIs, product/market
fit, revenue streams, scalability, Italian Startup Act), and give concise, actionable guidance.

Rules:
- Be concise. 2–5 sentences unless the user explicitly asks for depth.
- Never fill in answers for the user — guide them to answer themselves.
- If asked about Italian Startup Act or HIVE-specific programs, use the retrieved context
  below when available. If context is missing, say what you know broadly and flag that
  specifics should be verified with HIVE staff.
- Tone: warm, professional, encouraging — like a seasoned startup mentor.`;

export async function POST(req: Request) {
  const { messages } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  const client = anthropic;
  if (!isAnthropicConfigured() || !client) {
    const fallback =
      "Ask Me is not configured yet. Add API_KEY to .env.local and restart the dev server to enable me.";
    return new Response(fallback, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // Pull the latest user turn for RAG retrieval
  const lastUser = [...messages].reverse().find(m => m.role === "user")?.content ?? "";
  const { context: ragContext, sources: ragSources } = await retrieveContextDetailed(lastUser);

  const locale = getLocaleFromCookies();
  const userId = getUserIdFromCookies();
  const lang = localeName(locale);
  const localeRule = `\n\nIMPORTANT: Reply in ${lang}${locale === "it" ? " using second person 'tu'" : ""}, regardless of the language the user wrote in.`;
  const SYSTEM_PROMPT = SYSTEM_PROMPT_BASE + localeRule;

  const system = ragContext
    ? `${SYSTEM_PROMPT}\n\n<retrieved_context>\n${ragContext}\n</retrieved_context>`
    : SYSTEM_PROMPT;

  const encoder = new TextEncoder();
  let fullReply = "";
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const resp = await client.messages.stream({
          model: MODEL_ASKME,
          max_tokens: 600,
          // Prompt cache the system block — reused across every turn.
          // cache_control is accepted by the API; casting around SDK type gap.
          system: [
            {
              type: "text",
              text: system,
              cache_control: { type: "ephemeral" },
            },
          ] as unknown as string,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
        });
        for await (const event of resp) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const t = event.delta.text;
            fullReply += t;
            controller.enqueue(encoder.encode(t));
          }
        }
        controller.close();
      } catch (e) {
        controller.enqueue(encoder.encode("\n[Ask Me error: " + String(e) + "]"));
        controller.close();
      } finally {
        // Best-effort log — failures here never affect the user response.
        if (lastUser && fullReply) {
          prisma.chatLog
            .create({
              data: {
                userId: userId,
                locale,
                userMessage: lastUser.slice(0, 4000),
                assistantMessage: fullReply.slice(0, 8000),
                ragSources: ragSources.length > 0 ? JSON.stringify(ragSources) : null,
              },
            })
            .catch(err => console.error("[chat] log failed", err));
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}

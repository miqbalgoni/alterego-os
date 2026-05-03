// Server-side text translator backed by Claude with an in-memory cache.
// Used for long body text (beat bodies, extended-section bodies, deep-dive
// AI generations, mentor feedback) where authoring per-locale strings would
// be unsustainable.
//
// Cache: keyed by `${target}:${hash(text)}`. Never invalidated for the
// process lifetime — translations are deterministic for our purposes and
// users don't expect them to change. If you ever need to bust the cache,
// restart the Node process.

import { anthropic } from "@/lib/anthropic";

type Target = "en" | "it";

// Process-lifetime LRU-ish cache (just a Map; no eviction needed at our
// volumes — 19 modules × ~15 sections × 1 locale ≈ 300 entries max).
const cache = new Map<string, string>();

const MODEL = process.env.ANTHROPIC_MODEL_TRANSLATE ?? "claude-haiku-4-5-20251001";

function hashKey(target: Target, text: string): string {
  // Cheap stable hash — adequate for cache keys
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) - h + text.charCodeAt(i)) | 0;
  }
  return `${target}:${Math.abs(h)}`;
}

const SYSTEM_PROMPT = `You translate startup mentoring content. Output ONLY the translated text — no preface, no notes, no quotes around the result.

Rules:
- Preserve formatting: line breaks, bullet markers (-, •, ·), numbered lists, em-dashes, ellipses.
- Use professional, warm Italian — second person singular ("tu"), not "Lei".
- Preserve common startup terms in English when they're standard in Italian usage: BMC, MVP, KPI, TAM, SAM, SOM, pivot, runway, burn rate, fit, churn.
- Don't translate startup company names, product names, or technical proper nouns.
- Don't pad. Don't add commentary. Match length closely.
- If text is empty or already in the target language, return it unchanged.`;

export async function translateText(text: string, target: Target): Promise<string> {
  if (!text || target === "en") return text;
  const trimmed = text.trim();
  if (!trimmed) return text;

  const key = hashKey(target, trimmed);
  const hit = cache.get(key);
  if (hit !== undefined) return hit;

  if (!anthropic) return text;

  try {
    const resp = await anthropic.messages.create({
      model: MODEL,
      max_tokens: Math.min(2000, Math.ceil(trimmed.length * 1.5) + 200),
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Translate the following text to ${target === "it" ? "Italian" : "English"}:\n\n${trimmed}`,
        },
      ],
    });
    const out = resp.content
      .filter(c => c.type === "text")
      .map(c => (c.type === "text" ? c.text : ""))
      .join("")
      .trim();
    const final = out || text;
    cache.set(key, final);
    return final;
  } catch (e) {
    console.error("[serverTranslate] failed:", e);
    return text;
  }
}

// Translate many strings in parallel, bounded concurrency. Order is preserved.
export async function translateMany(
  texts: string[],
  target: Target,
  concurrency = 6
): Promise<string[]> {
  if (target === "en") return texts;
  const results: string[] = new Array(texts.length);
  let i = 0;
  async function worker() {
    while (true) {
      const idx = i++;
      if (idx >= texts.length) return;
      results[idx] = await translateText(texts[idx], target);
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, texts.length) }, worker);
  await Promise.all(workers);
  return results;
}

// Locale name in the target language — used in Claude system prompts to
// instruct AI generations to respond in the user's locale.
export function localeName(locale: Target): string {
  return locale === "it" ? "Italian" : "English";
}

// RAG retrieval — combines admin-uploaded KnowledgeChunks (Postgres) with
// the legacy static data/rag-chunks.json baseline. DB results take precedence;
// the JSON file is a fallback for installs that haven't uploaded anything yet.
//
// TODO (production):
//   - Replace keyword scoring with embeddings (Voyage/OpenAI) + pgvector
//   - Persist chunk metadata (source URL, doc title, page)
//   - Add re-ranking

import { promises as fs } from "fs";
import path from "path";
import { retrieveFromDb } from "./knowledge";

interface Chunk {
  id: string;
  source: string;
  text: string;
}

let cache: Chunk[] | null = null;

async function loadChunks(): Promise<Chunk[]> {
  if (cache) return cache;
  const file = path.join(process.cwd(), "data", "rag-chunks.json");
  try {
    const raw = await fs.readFile(file, "utf-8");
    cache = JSON.parse(raw) as Chunk[];
  } catch {
    cache = [];
  }
  return cache!;
}

/**
 * Return top-k chunks concatenated into a string, or null if nothing indexed.
 * Tries the admin-uploaded KnowledgeChunk table first; falls back to the static
 * data/rag-chunks.json baseline if no DB hits.
 *
 * Also returns the chunk source identifiers so callers (e.g. /api/chat) can
 * log which sources were used for an answer.
 */
export async function retrieveContextDetailed(
  query: string,
  topK = 3,
): Promise<{ context: string | null; sources: string[] }> {
  // 1) Admin-uploaded knowledge in the DB
  const fromDb = await retrieveFromDb(query, topK);
  if (fromDb.context) return fromDb;

  // 2) Fallback: legacy static JSON
  const chunks = await loadChunks();
  if (chunks.length === 0) return { context: null, sources: [] };

  const tokens = query
    .toLowerCase()
    .replace(/[^a-z0-9àèéìòù\s]/gi, " ")
    .split(/\s+/)
    .filter(t => t.length > 3);
  if (tokens.length === 0) return { context: null, sources: [] };

  const scored = chunks.map(c => {
    const text = c.text.toLowerCase();
    let score = 0;
    for (const t of tokens) {
      const matches = text.split(t).length - 1;
      score += matches;
    }
    return { chunk: c, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter(s => s.score > 0).slice(0, topK);
  if (top.length === 0) return { context: null, sources: [] };

  return {
    context: top.map(s => `[${s.chunk.source}]\n${s.chunk.text}`).join("\n\n---\n\n"),
    sources: top.map(s => `static:${s.chunk.id}`),
  };
}

/** Back-compat wrapper for callers that only need the string. */
export async function retrieveContext(query: string, topK = 3): Promise<string | null> {
  const { context } = await retrieveContextDetailed(query, topK);
  return context;
}

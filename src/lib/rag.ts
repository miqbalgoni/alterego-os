// RAG retrieval — scaffold only. Reads plain text chunks from data/rag-chunks.json
// (produced by scripts/ingest-rag.ts) and returns a naive keyword-scored match.
//
// TODO (production):
//   - Replace with real embeddings (Voyage/OpenAI) and pgvector / Pinecone / Supabase Vector
//   - Persist chunk metadata (source URL, doc title, page)
//   - Add re-ranking

import { promises as fs } from "fs";
import path from "path";

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
 * Naive TF scoring over lowercased tokens — swap for vector search in prod.
 */
export async function retrieveContext(query: string, topK = 3): Promise<string | null> {
  const chunks = await loadChunks();
  if (chunks.length === 0) return null;

  const tokens = query
    .toLowerCase()
    .replace(/[^a-z0-9àèéìòù\s]/gi, " ")
    .split(/\s+/)
    .filter(t => t.length > 3);
  if (tokens.length === 0) return null;

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
  if (top.length === 0) return null;

  return top
    .map(s => `[${s.chunk.source}]\n${s.chunk.text}`)
    .join("\n\n---\n\n");
}

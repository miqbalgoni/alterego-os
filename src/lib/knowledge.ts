// Knowledge base ingestion + retrieval.
//
// Admins upload .txt/.md/.pdf files via /admin/knowledge. We extract plain text,
// chunk it, and store in KnowledgeDocument + KnowledgeChunk. /api/chat retrieves
// the best chunks at query time via Postgres full-text search.
//
// Why not embeddings (yet): keeping infra simple. Postgres FTS works for the
// volumes HIVE will see (hundreds of docs, not millions) and we can layer
// pgvector on top later without changing the data shape.

import { prisma } from "./db";

const CHUNK_TARGET_CHARS = 1200;
const CHUNK_OVERLAP_CHARS = 150;

/** Split text into overlapping chunks on paragraph/sentence boundaries when possible. */
export function chunkText(input: string): string[] {
  const text = input.replace(/\r\n/g, "\n").trim();
  if (text.length === 0) return [];
  if (text.length <= CHUNK_TARGET_CHARS) return [text];

  // Prefer splits on double-newline (paragraphs), then single newline, then sentence end, then char window
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + CHUNK_TARGET_CHARS, text.length);
    let cut = end;
    if (end < text.length) {
      const slice = text.slice(i, end);
      const para = slice.lastIndexOf("\n\n");
      const line = slice.lastIndexOf("\n");
      const sent = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("? "), slice.lastIndexOf("! "));
      if (para > CHUNK_TARGET_CHARS * 0.4) cut = i + para;
      else if (line > CHUNK_TARGET_CHARS * 0.4) cut = i + line;
      else if (sent > CHUNK_TARGET_CHARS * 0.4) cut = i + sent + 1;
    }
    chunks.push(text.slice(i, cut).trim());
    if (cut >= text.length) break;
    i = Math.max(cut - CHUNK_OVERLAP_CHARS, cut);
  }
  return chunks.filter(c => c.length > 0);
}

/**
 * Extract text from a buffer based on mime type / filename.
 * Supports text/markdown directly. PDF extraction returns null with a hint
 * so the admin UI can show "PDF support coming soon" rather than crashing —
 * adding pdf-parse would require a new dependency the user hasn't approved yet.
 */
export async function extractText(opts: {
  buffer: Buffer;
  mimeType: string | null;
  filename: string | null;
}): Promise<{ text: string | null; warning?: string }> {
  const mime = (opts.mimeType || "").toLowerCase();
  const name = (opts.filename || "").toLowerCase();

  if (mime.startsWith("text/") || name.endsWith(".txt") || name.endsWith(".md") || name.endsWith(".markdown")) {
    return { text: opts.buffer.toString("utf-8") };
  }
  if (mime === "application/json" || name.endsWith(".json")) {
    // Treat JSON as text — admins sometimes paste structured knowledge as JSON
    return { text: opts.buffer.toString("utf-8") };
  }
  if (mime === "application/pdf" || name.endsWith(".pdf")) {
    return {
      text: null,
      warning: "PDF extraction not enabled. Paste the document text as .txt or .md instead, or install pdf-parse.",
    };
  }
  // Default: try utf-8 — works for many text-ish files
  try {
    const decoded = opts.buffer.toString("utf-8");
    if (/[\x00\x01-\x08\x0e-\x1f]/.test(decoded)) {
      return { text: null, warning: "File appears to be binary. Convert to .txt or .md first." };
    }
    return { text: decoded };
  } catch {
    return { text: null, warning: "Unsupported file type." };
  }
}

export async function ingestDocument(opts: {
  title: string;
  source: string;
  filename?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  uploadedById?: string | null;
  rawText: string;
  tags?: string[];
}): Promise<{ documentId: string; chunkCount: number }> {
  const chunks = chunkText(opts.rawText);
  const doc = await prisma.knowledgeDocument.create({
    data: {
      title: opts.title,
      source: opts.source,
      filename: opts.filename ?? null,
      mimeType: opts.mimeType ?? null,
      sizeBytes: opts.sizeBytes ?? null,
      uploadedById: opts.uploadedById ?? null,
      tags: opts.tags ? JSON.stringify(opts.tags) : null,
      chunks: {
        create: chunks.map((text, ordinal) => ({
          ordinal,
          text,
          tokens: Math.ceil(text.length / 4), // rough estimate
        })),
      },
    },
    select: { id: true },
  });
  return { documentId: doc.id, chunkCount: chunks.length };
}

/**
 * Score chunks against a query using a hybrid:
 *  - Postgres ILIKE for fast substring match on top tokens
 *  - In-memory TF scoring for ranking
 *
 * Returns top-k chunks formatted for the system prompt.
 */
export async function retrieveFromDb(
  query: string,
  topK = 4,
): Promise<{ context: string | null; sources: string[] }> {
  const tokens = query
    .toLowerCase()
    .replace(/[^a-z0-9àèéìòù\s]/gi, " ")
    .split(/\s+/)
    .filter(t => t.length > 3);
  if (tokens.length === 0) return { context: null, sources: [] };

  // Build a candidate set: chunks containing at least one of the top tokens.
  // To keep the query bounded, take the 5 longest distinct tokens.
  const probe = [...new Set(tokens)].sort((a, b) => b.length - a.length).slice(0, 5);
  const ors = probe.map(t => ({ text: { contains: t, mode: "insensitive" as const } }));

  const candidates = await prisma.knowledgeChunk.findMany({
    where: {
      document: { status: "active" },
      OR: ors,
    },
    take: 200, // safety cap
    include: { document: { select: { source: true, title: true, id: true } } },
  });

  if (candidates.length === 0) return { context: null, sources: [] };

  const scored = candidates.map(c => {
    const lower = c.text.toLowerCase();
    let score = 0;
    for (const t of tokens) {
      const matches = lower.split(t).length - 1;
      score += matches;
    }
    return { c, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter(s => s.score > 0).slice(0, topK);
  if (top.length === 0) return { context: null, sources: [] };

  const context = top
    .map(s => `[${s.c.document.source}]\n${s.c.text}`)
    .join("\n\n---\n\n");
  const sources = top.map(s => `${s.c.document.id}:${s.c.ordinal}`);
  return { context, sources };
}

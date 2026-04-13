// RAG ingestion scaffold.
//
// Downloads a small set of reference documents (Italian Startup Act, HIVE program
// materials) into ./data/raw/, splits them into ~800-char chunks, and writes
// ./data/rag-chunks.json which is read by src/lib/rag.ts at query time.
//
// This is intentionally minimal for offline testing. Replace with real embeddings
// + vector DB (pgvector, Pinecone, Supabase Vector) before production.
//
// Run:   npm run rag:ingest

import { promises as fs } from "fs";
import path from "path";

interface Source {
  name: string;
  url: string;
  filename: string;
}

// Edit/extend these sources as needed. URLs must be direct links to text-bearing
// resources (HTML, plain text, or PDF).
const SOURCES: Source[] = [
  {
    name: "Italian Startup Act — MIMIT overview (EN)",
    url: "https://www.mimit.gov.it/images/stories/documenti/The_Italian_Startup_Act_-_Executive_Summary.pdf",
    filename: "italian-startup-act.pdf",
  },
  // TODO: Add HIVE program materials once you have direct URLs.
  // {
  //   name: "HIVE Business Accelerator — program overview",
  //   url: "https://example.com/hive-program.pdf",
  //   filename: "hive-program.pdf",
  // },
];

const DATA_DIR = path.join(process.cwd(), "data");
const RAW_DIR = path.join(DATA_DIR, "raw");
const CHUNK_FILE = path.join(DATA_DIR, "rag-chunks.json");

async function ensureDirs() {
  await fs.mkdir(RAW_DIR, { recursive: true });
}

async function download(src: Source): Promise<Buffer | null> {
  const dest = path.join(RAW_DIR, src.filename);
  try {
    const existing = await fs.readFile(dest);
    console.log(`  ✓ cached: ${src.filename}`);
    return existing;
  } catch { /* not cached */ }

  console.log(`  ↓ downloading: ${src.url}`);
  try {
    const res = await fetch(src.url);
    if (!res.ok) {
      console.warn(`  ! ${res.status} — skipping ${src.name}`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(dest, buf);
    return buf;
  } catch (e) {
    console.warn(`  ! network error: ${e} — skipping ${src.name}`);
    return null;
  }
}

// Very lightweight text extraction. Handles plain text and naive PDF stripping.
// For production use a real PDF parser (pdf-parse, pdfjs-dist).
function extractText(buf: Buffer, filename: string): string {
  const head = buf.subarray(0, 5).toString("latin1");
  if (head.startsWith("%PDF-")) {
    // crude PDF text extract — good enough for RAG keyword matching demo
    const s = buf.toString("latin1");
    const matches = s.match(/\(([^)]{3,})\)/g) ?? [];
    return matches
      .map(m => m.slice(1, -1))
      .join(" ")
      .replace(/\\[nrt]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  return buf.toString("utf-8");
}

function chunk(text: string, size = 800, overlap = 120): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= size) return clean ? [clean] : [];
  const out: string[] = [];
  let i = 0;
  while (i < clean.length) {
    out.push(clean.slice(i, i + size));
    i += size - overlap;
  }
  return out;
}

async function main() {
  console.log("📚 RAG ingestion starting…");
  await ensureDirs();

  const allChunks: { id: string; source: string; text: string }[] = [];

  for (const src of SOURCES) {
    console.log(`• ${src.name}`);
    const buf = await download(src);
    if (!buf) continue;
    const text = extractText(buf, src.filename);
    const chunks = chunk(text);
    console.log(`  → ${chunks.length} chunks`);
    chunks.forEach((c, i) =>
      allChunks.push({ id: `${src.filename}-${i}`, source: src.name, text: c })
    );
  }

  await fs.writeFile(CHUNK_FILE, JSON.stringify(allChunks, null, 2));
  console.log(`✅ Wrote ${allChunks.length} chunks to ${CHUNK_FILE}`);
  console.log("   Ask Me will use these automatically at query time.");
}

main().catch(e => { console.error(e); process.exit(1); });

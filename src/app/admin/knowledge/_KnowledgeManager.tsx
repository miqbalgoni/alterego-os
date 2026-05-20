"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Trash2, Archive, Plus, ClipboardPaste } from "lucide-react";
import { Card, Stat, Pill, Table, Th, Td, EmptyState } from "../_components/AdminUI";

type Doc = {
  id: string;
  title: string;
  source: string;
  filename: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  chunks: number;
  status: string;
  createdAt: string;
  uploadedBy: string | null;
};

function fmtBytes(n: number | null) {
  if (n == null) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function KnowledgeManager({ initialDocs, totalChunks }: { initialDocs: Doc[]; totalChunks: number }) {
  const router = useRouter();
  const [docs, setDocs] = useState(initialDocs);
  const [mode, setMode] = useState<"file" | "paste">("file");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [fileTitle, setFileTitle] = useState("");
  const [fileSource, setFileSource] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [pasteTitle, setPasteTitle] = useState("");
  const [pasteSource, setPasteSource] = useState("");
  const [pasteText, setPasteText] = useState("");

  async function uploadFile(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !fileTitle) return;
    setBusy(true); setError(null); setSuccess(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", fileTitle);
      fd.append("source", fileSource || fileTitle);
      const r = await fetch("/api/admin/knowledge", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Upload failed");
      setSuccess(`Indexed “${fileTitle}” into ${j.chunkCount} chunks.`);
      setFileTitle(""); setFileSource(""); setFile(null);
      (document.getElementById("knowledge-file-input") as HTMLInputElement | null)?.value && (
        (document.getElementById("knowledge-file-input") as HTMLInputElement).value = ""
      );
      router.refresh();
    } catch (e: any) {
      setError(String(e.message || e));
    } finally {
      setBusy(false);
    }
  }

  async function pasteSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pasteTitle || !pasteText) return;
    setBusy(true); setError(null); setSuccess(null);
    try {
      const r = await fetch("/api/admin/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "paste",
          title: pasteTitle,
          source: pasteSource || pasteTitle,
          text: pasteText,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Failed");
      setSuccess(`Indexed “${pasteTitle}” into ${j.chunkCount} chunks.`);
      setPasteTitle(""); setPasteSource(""); setPasteText("");
      router.refresh();
    } catch (e: any) {
      setError(String(e.message || e));
    } finally {
      setBusy(false);
    }
  }

  async function deleteDoc(id: string, title: string) {
    if (!confirm(`Delete “${title}” and all its chunks? AskMe will stop using it.`)) return;
    const r = await fetch(`/api/admin/knowledge/${id}`, { method: "DELETE" });
    if (r.ok) {
      setDocs(d => d.filter(x => x.id !== id));
      router.refresh();
    } else {
      alert("Delete failed.");
    }
  }

  async function toggleArchive(id: string, current: string) {
    const next = current === "active" ? "archived" : "active";
    const r = await fetch(`/api/admin/knowledge/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (r.ok) {
      setDocs(d => d.map(x => x.id === id ? { ...x, status: next } : x));
      router.refresh();
    }
  }

  const activeCount = docs.filter(d => d.status === "active").length;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Stat label="Documents" value={docs.length} hint={`${activeCount} active`} />
        <Stat label="Chunks indexed" value={totalChunks} />
        <Stat
          label="Status"
          value={activeCount > 0 ? "Live" : "Empty"}
          hint={activeCount > 0 ? "AskMe is using these" : "Add docs to power AskMe"}
        />
        <Stat label="Retrieval" value="FTS" hint="Postgres keyword search" />
      </div>

      <Card title="Add to knowledge base" className="mb-6">
        <div className="flex gap-2 mb-4 text-sm">
          <button
            onClick={() => setMode("file")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${
              mode === "file" ? "bg-hive-orange text-white border-hive-orange" : "border-[#EFE6D2] text-hive-grey"
            }`}
          >
            <Upload size={14} /> Upload file
          </button>
          <button
            onClick={() => setMode("paste")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${
              mode === "paste" ? "bg-hive-orange text-white border-hive-orange" : "border-[#EFE6D2] text-hive-grey"
            }`}
          >
            <ClipboardPaste size={14} /> Paste text
          </button>
        </div>

        {error && (
          <div className="mb-3 px-3 py-2 rounded-md bg-rose-50 border border-rose-200 text-sm text-rose-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-3 px-3 py-2 rounded-md bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {mode === "file" ? (
          <form onSubmit={uploadFile} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Document title" required>
                <input
                  value={fileTitle}
                  onChange={e => setFileTitle(e.target.value)}
                  placeholder="e.g. Italian Startup Act 2026 — Section 4"
                  className="w-full px-3 py-2 text-sm rounded-md border border-[#EFE6D2]"
                  required
                />
              </Field>
              <Field label="Source label" hint="Shown in AskMe citations (defaults to title)">
                <input
                  value={fileSource}
                  onChange={e => setFileSource(e.target.value)}
                  placeholder="e.g. Italian Startup Act §4"
                  className="w-full px-3 py-2 text-sm rounded-md border border-[#EFE6D2]"
                />
              </Field>
            </div>
            <Field label="File" hint=".txt or .md (PDFs: convert to text first)">
              <input
                id="knowledge-file-input"
                type="file"
                accept=".txt,.md,.markdown,.json,text/plain,text/markdown"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm"
              />
            </Field>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={busy || !file || !fileTitle}
                className="px-4 py-2 rounded-md bg-hive-orange text-white font-medium hover:bg-hive-amber disabled:opacity-50"
              >
                {busy ? "Indexing…" : "Upload & index"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={pasteSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Document title" required>
                <input
                  value={pasteTitle}
                  onChange={e => setPasteTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-md border border-[#EFE6D2]"
                  required
                />
              </Field>
              <Field label="Source label" hint="Defaults to title">
                <input
                  value={pasteSource}
                  onChange={e => setPasteSource(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-md border border-[#EFE6D2]"
                />
              </Field>
            </div>
            <Field label="Text" required>
              <textarea
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                rows={10}
                placeholder="Paste the document text here…"
                className="w-full px-3 py-2 text-sm rounded-md border border-[#EFE6D2] font-mono"
                required
              />
            </Field>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={busy || !pasteTitle || pasteText.length < 20}
                className="px-4 py-2 rounded-md bg-hive-orange text-white font-medium hover:bg-hive-amber disabled:opacity-50"
              >
                {busy ? "Indexing…" : "Index"}
              </button>
            </div>
          </form>
        )}
      </Card>

      <Card title={`Documents (${docs.length})`} subtitle="Active docs are searched by AskMe. Archived docs stay in the DB but are skipped.">
        {docs.length === 0 ? (
          <EmptyState
            title="No knowledge documents yet"
            hint="Upload a file or paste text above to start improving AskMe's answers."
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Title</Th>
                <Th>Source</Th>
                <Th>Chunks</Th>
                <Th>Size</Th>
                <Th>Status</Th>
                <Th>Uploaded</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {docs.map(d => (
                <tr key={d.id}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-hive-orange" />
                      <span className="font-medium">{d.title}</span>
                    </div>
                    {d.filename && <div className="text-xs text-hive-grey mt-0.5">{d.filename}</div>}
                  </Td>
                  <Td className="text-hive-grey">{d.source}</Td>
                  <Td className="tabular-nums">{d.chunks}</Td>
                  <Td className="text-hive-grey">{fmtBytes(d.sizeBytes)}</Td>
                  <Td>
                    <Pill tone={d.status === "active" ? "ok" : "neutral"}>{d.status}</Pill>
                  </Td>
                  <Td className="text-hive-grey">
                    {fmtDate(d.createdAt)}
                    {d.uploadedBy && <div className="text-xs">{d.uploadedBy}</div>}
                  </Td>
                  <Td>
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => toggleArchive(d.id, d.status)}
                        title={d.status === "active" ? "Archive" : "Restore"}
                        className="p-1.5 rounded hover:bg-[#FAF3E2] text-hive-grey"
                      >
                        <Archive size={14} />
                      </button>
                      <button
                        onClick={() => deleteDoc(d.id, d.title)}
                        title="Delete"
                        className="p-1.5 rounded hover:bg-rose-50 text-rose-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-hive-dark mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-hive-grey mt-1">{hint}</span>}
    </label>
  );
}

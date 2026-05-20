"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Save } from "lucide-react";

export function RubricEditor({
  section,
  initialCriteria,
  defaultCriteria,
  initialThreshold,
  defaultThreshold,
  initialNotes,
  hasOverride,
  allowedGapTags,
}: {
  section: string;
  initialCriteria: string;
  defaultCriteria: string;
  initialThreshold: number;
  defaultThreshold: number;
  initialNotes: string;
  hasOverride: boolean;
  allowedGapTags: readonly string[];
}) {
  const router = useRouter();
  const [criteria, setCriteria] = useState(initialCriteria);
  const [threshold, setThreshold] = useState(initialThreshold);
  const [notes, setNotes] = useState(initialNotes);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  const dirty =
    criteria !== initialCriteria ||
    threshold !== initialThreshold ||
    notes !== initialNotes;

  async function save() {
    setBusy(true); setMsg(null);
    try {
      const r = await fetch(`/api/admin/rubric/${section}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criteria, threshold, notes }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Failed");
      setMsg({ tone: "ok", text: `Saved as ${j.version}.` });
      router.refresh();
    } catch (e: any) {
      setMsg({ tone: "err", text: String(e.message || e) });
    } finally {
      setBusy(false);
    }
  }

  async function revert() {
    if (!confirm("Revert to the default rubric for this section? The override row will be deactivated.")) return;
    setBusy(true); setMsg(null);
    try {
      const r = await fetch(`/api/admin/rubric/${section}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Revert failed");
      setCriteria(defaultCriteria);
      setThreshold(defaultThreshold);
      setNotes("");
      setMsg({ tone: "ok", text: "Reverted to default." });
      router.refresh();
    } catch (e: any) {
      setMsg({ tone: "err", text: String(e.message || e) });
    } finally {
      setBusy(false);
    }
  }

  function loadDefault() {
    setCriteria(defaultCriteria);
    setThreshold(defaultThreshold);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <label className="block col-span-1">
          <span className="block text-xs font-medium text-hive-dark mb-1">Pass threshold</span>
          <input
            type="number"
            min={0}
            max={100}
            value={threshold}
            onChange={e => setThreshold(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 text-sm rounded-md border border-[#EFE6D2] tabular-nums"
          />
          <span className="block text-xs text-hive-grey mt-1">Default: {defaultThreshold}</span>
        </label>
        <div className="col-span-2">
          <span className="block text-xs font-medium text-hive-dark mb-1">Allowed gap tags (read-only)</span>
          <div className="flex flex-wrap gap-1 px-3 py-2 text-xs rounded-md border border-[#EFE6D2] bg-[#FAF7EF]">
            {allowedGapTags.map(t => (
              <code key={t} className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">{t}</code>
            ))}
          </div>
        </div>
      </div>

      <label className="block">
        <span className="block text-xs font-medium text-hive-dark mb-1">
          Criteria (injected verbatim into Claude's scoring prompt)
        </span>
        <textarea
          value={criteria}
          onChange={e => setCriteria(e.target.value)}
          rows={Math.min(14, Math.max(6, criteria.split("\n").length + 1))}
          className="w-full px-3 py-2 text-sm rounded-md border border-[#EFE6D2] font-mono leading-snug"
        />
      </label>

      <label className="block">
        <span className="block text-xs font-medium text-hive-dark mb-1">Internal notes (not sent to Claude)</span>
        <input
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Why was this changed? Optional."
          className="w-full px-3 py-2 text-sm rounded-md border border-[#EFE6D2]"
        />
      </label>

      {msg && (
        <div className={`text-sm px-3 py-2 rounded-md border ${
          msg.tone === "ok"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-rose-50 border-rose-200 text-rose-700"
        }`}>
          {msg.text}
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={loadDefault}
          disabled={busy}
          className="px-3 py-2 text-sm rounded-md border border-[#EFE6D2] text-hive-grey hover:bg-[#FAF3E2]"
        >
          Load default text
        </button>
        {hasOverride && (
          <button
            type="button"
            onClick={revert}
            disabled={busy}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border border-rose-200 text-rose-700 hover:bg-rose-50"
          >
            <RotateCcw size={14} /> Revert to default
          </button>
        )}
        <button
          type="button"
          onClick={save}
          disabled={busy || !dirty}
          className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-hive-orange text-white font-medium hover:bg-hive-amber disabled:opacity-50"
        >
          <Save size={14} /> {busy ? "Saving…" : "Save override"}
        </button>
      </div>
    </div>
  );
}

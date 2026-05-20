"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const STAGES = ["Initial idea", "Pre-seed", "Market-ready", "Growth"];

export function UsersSearchBar({
  initialQ,
  initialStage,
  initialStatus,
}: {
  initialQ: string;
  initialStage: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ);
  const [stage, setStage] = useState(initialStage);
  const [status, setStatus] = useState(initialStatus);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (stage) params.set("stage", stage);
    if (status) params.set("status", status);
    const qs = params.toString();
    router.push(`/admin/users${qs ? `?${qs}` : ""}`);
  }

  function clear() {
    setQ("");
    setStage("");
    setStatus("");
    router.push("/admin/users");
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[240px]">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-hive-grey" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search by name, email, or startup…"
          className="w-full pl-8 pr-3 py-2 text-sm rounded-md border border-[#EFE6D2] focus:outline-none focus:border-hive-orange"
        />
      </div>
      <select
        value={stage}
        onChange={e => setStage(e.target.value)}
        className="px-3 py-2 text-sm rounded-md border border-[#EFE6D2] bg-white"
      >
        <option value="">All stages</option>
        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="px-3 py-2 text-sm rounded-md border border-[#EFE6D2] bg-white"
      >
        <option value="">All statuses</option>
        <option value="submitted">Submitted</option>
        <option value="in-progress">In progress</option>
      </select>
      <button
        type="submit"
        className="px-3 py-2 text-sm rounded-md bg-hive-orange text-white font-medium hover:bg-hive-amber"
      >
        Filter
      </button>
      {(q || stage || status) && (
        <button
          type="button"
          onClick={clear}
          className="px-3 py-2 text-sm rounded-md border border-[#EFE6D2] text-hive-grey hover:bg-[#FAF3E2]"
        >
          Clear
        </button>
      )}
    </form>
  );
}

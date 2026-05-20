"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Download } from "lucide-react";

export function UserActions({ userId, email }: { userId: string; email: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function impersonate() {
    if (!confirm(`Impersonate ${email}? You will be signed in as this founder. Your admin session will be cleared — sign back in to return.`)) {
      return;
    }
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/users/${userId}/impersonate`, { method: "POST" });
      if (r.ok) {
        window.location.href = "/onboarding";
      } else {
        const j = await r.json().catch(() => ({}));
        alert(j.error || "Could not impersonate.");
        setBusy(false);
      }
    } catch (e) {
      alert(String(e));
      setBusy(false);
    }
  }

  return (
    <>
      <a
        href={`/api/admin/users/${userId}/export.csv`}
        className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border border-[#EFE6D2] text-hive-dark hover:bg-[#FAF3E2]"
      >
        <Download size={14} /> Export
      </a>
      <button
        onClick={impersonate}
        disabled={busy}
        className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-hive-dark text-white hover:bg-black disabled:opacity-50"
      >
        <Eye size={14} /> {busy ? "Switching…" : "View as user"}
      </button>
    </>
  );
}

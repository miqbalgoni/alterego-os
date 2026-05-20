"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flag } from "lucide-react";

export function FlagButton({ id, flagged }: { id: string; flagged: boolean }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function toggle() {
    setBusy(true);
    let reason: string | null = null;
    if (!flagged) {
      reason = prompt("Why are you flagging this turn? (optional)") || null;
    }
    const r = await fetch(`/api/admin/chat-logs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flagged: !flagged, flagReason: reason }),
    });
    setBusy(false);
    if (r.ok) router.refresh();
    else alert("Failed to update flag.");
  }
  return (
    <button
      onClick={toggle}
      disabled={busy}
      title={flagged ? "Unflag" : "Flag for review"}
      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md border transition-colors ${
        flagged
          ? "border-rose-300 bg-rose-50 text-rose-700"
          : "border-[#EFE6D2] text-hive-grey hover:bg-[#FAF3E2]"
      }`}
    >
      <Flag size={12} />
      {flagged ? "Flagged" : "Flag"}
    </button>
  );
}

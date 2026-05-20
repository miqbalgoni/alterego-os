"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RoleActionsClient({ userId, role }: { userId: string; role: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setRole(next: string) {
    if (!confirm(`Set role to ${next}?`)) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/admins/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: next }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        alert(j.error || "Failed");
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex gap-1 justify-end">
      {role === "ADMIN" ? (
        <button
          onClick={() => setRole("SUPERADMIN")}
          disabled={busy}
          className="text-xs px-2 py-1 rounded-md border border-[#EFE6D2] hover:bg-[#FAF3E2]"
        >
          → Super
        </button>
      ) : (
        <button
          onClick={() => setRole("ADMIN")}
          disabled={busy}
          className="text-xs px-2 py-1 rounded-md border border-[#EFE6D2] hover:bg-[#FAF3E2]"
        >
          → Admin
        </button>
      )}
      <button
        onClick={() => setRole("FOUNDER")}
        disabled={busy}
        className="text-xs px-2 py-1 rounded-md border border-rose-200 text-rose-700 hover:bg-rose-50"
      >
        Demote
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminsManager() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "SUPERADMIN">("ADMIN");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  async function promote(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      const r = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Failed");
      setMsg({ tone: "ok", text: `Promoted ${email} to ${role}.` });
      setEmail("");
      router.refresh();
    } catch (e: any) {
      setMsg({ tone: "err", text: String(e.message || e) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={promote} className="flex items-end gap-2">
      <label className="block flex-1">
        <span className="block text-xs font-medium text-hive-dark mb-1">Email of existing user</span>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="user@example.com"
          className="w-full px-3 py-2 text-sm rounded-md border border-[#EFE6D2]"
        />
      </label>
      <label className="block">
        <span className="block text-xs font-medium text-hive-dark mb-1">Role</span>
        <select
          value={role}
          onChange={e => setRole(e.target.value as any)}
          className="px-3 py-2 text-sm rounded-md border border-[#EFE6D2] bg-white"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="SUPERADMIN">SUPERADMIN</option>
        </select>
      </label>
      <button
        type="submit"
        disabled={busy || !email}
        className="px-4 py-2 text-sm rounded-md bg-hive-orange text-white font-medium hover:bg-hive-amber disabled:opacity-50"
      >
        {busy ? "Promoting…" : "Promote"}
      </button>
      {msg && (
        <div className={`text-xs px-3 py-2 rounded-md ${
          msg.tone === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
        }`}>{msg.text}</div>
      )}
    </form>
  );
}

"use client";

import { LogOut } from "lucide-react";

export function AdminSignOutButton() {
  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }
  return (
    <button
      onClick={signOut}
      title="Sign out"
      className="px-2 py-1.5 rounded-md hover:bg-white/5 text-[#E8DFCB]"
    >
      <LogOut size={14} />
    </button>
  );
}

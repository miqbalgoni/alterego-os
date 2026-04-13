"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, Mail } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

interface Props {
  email: string;
  fullName: string | null;
}

export function ProfileMenu({ email, fullName }: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const initial = (fullName?.trim()[0] || email[0] || "?").toUpperCase();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      try {
        localStorage.removeItem("alterego_session");
      } catch {}
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-hive-orange text-white font-bold text-sm shadow-soft hover:bg-hive-amber transition"
        aria-label={t("header.profile")}
      >
        {initial}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-hive-cream bg-white shadow-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-hive-cream/70">
            <div className="flex items-center gap-2 text-sm font-semibold text-hive-dark">
              <User className="w-4 h-4 text-hive-orange" />
              {fullName || email.split("@")[0]}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-hive-grey">
              <Mail className="w-3.5 h-3.5" />
              <span className="truncate">{email}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-hive-dark hover:bg-hive-cream/50 transition disabled:opacity-60"
          >
            <LogOut className="w-4 h-4" />
            {t("header.logout")}
          </button>
        </div>
      )}
    </div>
  );
}

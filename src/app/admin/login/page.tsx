"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

function AdminLoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/.+@.+\..+/.test(email)) return setError("Enter a valid email.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setLoading(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const j = await r.json();
      if (!r.ok) {
        setError(j.error || "Invalid credentials.");
        return;
      }
      if (!j.isAdmin) {
        setError("This account doesn't have admin access.");
        // Sign back out so a stray founder session isn't left behind on this device.
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        return;
      }
      router.push(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[#1F1A14] text-[#F5EEDD] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-hive-orange/15 border border-hive-orange/30 mb-3">
            <ShieldCheck className="w-6 h-6 text-hive-orange" />
          </div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-hive-orange/80 font-semibold">
            ALTEREGO OS
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Staff sign-in</h1>
          <p className="mt-1 text-xs text-[#C9BFA8]">
            For HIVE administrators only. Founders use the standard sign-in.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-[#2A241B] border border-white/10 rounded-xl p-6 shadow-2xl"
        >
          <label className="block">
            <span className="block text-[11px] font-medium uppercase tracking-wider text-[#C9BFA8] mb-1.5">
              Work email
            </span>
            <div className="flex items-center gap-2.5 rounded-md border border-white/10 bg-[#1F1A14] px-3 py-2.5 focus-within:border-hive-orange transition">
              <Mail className="w-4 h-4 text-[#8C8270]" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
                required
                placeholder="you@hive.example"
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-[#6B6354]"
              />
            </div>
          </label>

          <label className="block mt-4">
            <span className="block text-[11px] font-medium uppercase tracking-wider text-[#C9BFA8] mb-1.5">
              Password
            </span>
            <div className="flex items-center gap-2.5 rounded-md border border-white/10 bg-[#1F1A14] px-3 py-2.5 focus-within:border-hive-orange transition">
              <Lock className="w-4 h-4 text-[#8C8270]" />
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                className="flex-1 bg-transparent outline-none text-sm text-white"
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                tabIndex={-1}
                className="text-[#8C8270] hover:text-hive-orange transition"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </label>

          {error && (
            <div className="mt-3 flex items-start gap-2 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-md px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-md bg-hive-orange hover:bg-hive-amber text-white text-sm font-semibold py-2.5 transition disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in to admin"}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="mt-4 flex items-center justify-between text-[11px] text-[#8C8270]">
            <Link href="/forgot-password" className="hover:text-hive-orange transition">
              Forgot password?
            </Link>
            <Link href="/login" className="hover:text-hive-orange transition">
              Founder sign-in →
            </Link>
          </div>
        </form>

        <p className="mt-5 text-center text-[11px] text-[#6B6354]">
          Admin access is granted via <code className="text-[#C9BFA8]">ADMIN_EMAILS</code> or by a super-admin.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginInner />
    </Suspense>
  );
}

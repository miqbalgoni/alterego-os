"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HiveLogo } from "@/components/HiveLogo";
import { Lock, Eye, EyeOff, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";

function ResetInner() {
  const router = useRouter();
  const search = useSearchParams();
  const token = search.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ isAdmin: boolean } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords don't match.");
    setLoading(true);
    try {
      const r = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const j = await r.json();
      if (!r.ok) {
        setError(j.error || "Could not reset password.");
        return;
      }
      setDone({ isAdmin: !!j.isAdmin });
      setTimeout(() => {
        router.push(j.isAdmin ? "/admin/users" : "/onboarding");
        router.refresh();
      }, 1500);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <Wrapper>
        <div className="text-center">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h1
            className="text-2xl font-extrabold text-hive-dark"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            <span className="italic">Invalid reset link</span>
          </h1>
          <p className="mt-3 text-sm text-hive-grey">
            This link is missing its token. Request a fresh reset email.
          </p>
          <Link
            href="/forgot-password"
            className="mt-6 inline-block text-sm text-hive-orange font-semibold hover:underline"
          >
            Request a new reset link
          </Link>
        </div>
      </Wrapper>
    );
  }

  if (done) {
    return (
      <Wrapper>
        <div className="text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h1
            className="text-2xl font-extrabold text-hive-dark"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            <span className="italic">Password updated</span>
          </h1>
          <p className="mt-3 text-sm text-hive-grey">
            You're signed in. Taking you to {done.isAdmin ? "the admin dashboard" : "your check-in"}…
          </p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <h1
        className="text-2xl sm:text-3xl font-extrabold text-hive-dark text-center"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        <span className="italic">Set a new password</span>
      </h1>
      <p className="mt-2 text-center text-sm text-hive-grey">
        Choose a password of at least 8 characters.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-xs font-semibold text-hive-grey uppercase tracking-wider">
            New password
          </span>
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-hive-cream bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-hive-orange/40 focus-within:border-hive-orange transition">
            <Lock className="w-4 h-4 text-hive-grey" />
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="flex-1 outline-none text-sm"
              minLength={8}
              autoFocus
              required
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              tabIndex={-1}
              className="text-hive-grey hover:text-hive-orange transition"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-hive-grey uppercase tracking-wider">
            Confirm password
          </span>
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-hive-cream bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-hive-orange/40 focus-within:border-hive-orange transition">
            <Lock className="w-4 h-4 text-hive-grey" />
            <input
              type={show ? "text" : "password"}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="flex-1 outline-none text-sm"
              minLength={8}
              required
            />
          </div>
        </label>

        {error && <div className="text-xs text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-hive-orange px-6 py-3.5 text-sm font-semibold text-white shadow-soft hover:bg-hive-amber transition disabled:opacity-60"
        >
          {loading ? "Updating…" : "Set new password"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/" className="flex justify-center">
        <HiveLogo size={60} />
      </Link>
      <div className="mt-8 w-full max-w-md bg-white/85 backdrop-blur rounded-2xl sm:rounded-3xl shadow-soft border border-hive-cream p-6 sm:p-8 fade-up">
        {children}
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetInner />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { HiveLogo } from "@/components/HiveLogo";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/.+@.+\..+/.test(email)) return setError("Enter a valid email.");
    setLoading(true);
    try {
      const r = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const j = await r.json();
      if (!r.ok) {
        setError(j.error || "Something went wrong.");
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/" className="flex justify-center">
        <HiveLogo size={60} />
      </Link>

      <div className="mt-8 w-full max-w-md bg-white/85 backdrop-blur rounded-2xl sm:rounded-3xl shadow-soft border border-hive-cream p-6 sm:p-8 fade-up">
        {sent ? (
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h1
              className="text-2xl font-extrabold text-hive-dark"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              <span className="italic">Check your email</span>
            </h1>
            <p className="mt-3 text-sm text-hive-grey">
              If an account exists for <strong className="text-hive-dark">{email}</strong>, we just
              sent a password reset link. It expires in 1 hour.
            </p>
            <p className="mt-2 text-xs text-hive-grey/80">
              Don't see it? Check spam, or try again in a minute.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-2 text-sm text-hive-orange font-semibold hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-hive-dark text-center"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              <span className="italic">Reset your password</span>
            </h1>
            <p className="mt-2 text-center text-sm text-hive-grey">
              Enter your email and we'll send you a link to set a new password.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-xs font-semibold text-hive-grey uppercase tracking-wider">
                  Email
                </span>
                <div className="mt-2 flex items-center gap-3 rounded-xl border border-hive-cream bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-hive-orange/40 focus-within:border-hive-orange transition">
                  <Mail className="w-4 h-4 text-hive-grey" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 outline-none text-sm"
                    autoFocus
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
                {loading ? "Sending…" : "Send reset link"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-hive-grey">
              Remembered it?{" "}
              <Link href="/login" className="text-hive-orange font-semibold hover:underline">
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

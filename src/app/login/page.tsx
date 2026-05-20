"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { HiveLogo } from "@/components/HiveLogo";
import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { LanguageMenu } from "@/components/LanguageMenu";

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const { t } = useI18n();
  const next = search.get("next") || "/onboarding";
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/.+@.+\..+/.test(email)) return setError(t("common.invalidEmail"));
    if (password.length < 8) return setError(t("auth.passwordHint"));
    setLoading(true);
    try {
      const url = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="absolute top-4 right-4">
        <LanguageMenu />
      </div>
      <Link href="/" className="flex justify-center">
        <HiveLogo size={60} />
      </Link>

      <div className="mt-8 w-full max-w-md bg-white/85 backdrop-blur rounded-2xl sm:rounded-3xl shadow-soft border border-hive-cream p-6 sm:p-8 fade-up">
        <h1
          className="text-2xl sm:text-3xl font-extrabold text-hive-dark text-center"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          <span className="italic">
            {mode === "signup" ? t("auth.signupTitle") : t("auth.loginTitle")}
          </span>
        </h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-hive-grey uppercase tracking-wider">
              {t("auth.email")}
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

          <label className="block">
            <span className="text-xs font-semibold text-hive-grey uppercase tracking-wider">
              {t("auth.password")}
            </span>
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-hive-cream bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-hive-orange/40 focus-within:border-hive-orange transition">
              <Lock className="w-4 h-4 text-hive-grey" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t("auth.passwordHint")}
                className="flex-1 outline-none text-sm"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-hive-grey hover:text-hive-orange transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {mode === "signup" && (
              <p className="mt-1 text-[11px] text-hive-grey/80">{t("auth.passwordHint")}</p>
            )}
          </label>

          {error && <div className="text-xs text-red-600">{error}</div>}

          {mode === "login" && (
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-xs text-hive-grey hover:text-hive-orange hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-hive-orange px-6 py-3.5 text-sm font-semibold text-white shadow-soft hover:bg-hive-amber transition disabled:opacity-60"
          >
            {loading ? t("common.loading") : mode === "signup" ? t("auth.signupCta") : t("auth.loginCta")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-hive-grey">
          {mode === "signup" ? (
            <>
              {t("auth.haveAccount")}{" "}
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); }}
                className="text-hive-orange font-semibold hover:underline"
              >
                {t("auth.switchToLogin")}
              </button>
            </>
          ) : (
            <>
              {t("auth.noAccount")}{" "}
              <button
                type="button"
                onClick={() => { setMode("signup"); setError(""); }}
                className="text-hive-orange font-semibold hover:underline"
              >
                {t("auth.switchToSignup")}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

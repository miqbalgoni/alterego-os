"use client";

import Link from "next/link";
import { useEffect } from "react";
import { HiveLogo } from "@/components/HiveLogo";
import { CheckCircle2, Home, FileText } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function ThankYouPage() {
  const { t } = useI18n();

  useEffect(() => {
    // Optional: clear local session so a fresh start begins cleanly
    // localStorage.removeItem("alterego_session");
  }, []);

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-5 py-10 sm:py-12 text-center">
      <HiveLogo size={60} />

      <div className="mt-8 sm:mt-10 w-full max-w-xl bg-white/85 backdrop-blur rounded-2xl sm:rounded-3xl shadow-soft border border-hive-cream p-7 sm:p-10 fade-up">
        <div className="mx-auto w-16 h-16 rounded-full bg-hive-cream flex items-center justify-center pulse-glow">
          <CheckCircle2 className="w-9 h-9 text-hive-orange" />
        </div>

        <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-hive-dark">
          {t("thankYou.title")}
        </h1>
        <p className="mt-3 text-base text-hive-grey">
          {t("thankYou.subtitle")}
        </p>
        <p className="mt-2 text-sm text-hive-grey">
          {t("thankYou.subtitleExtra")}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/onboarding/report-card"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-hive-orange to-hive-amber px-6 py-3 text-sm font-semibold text-white shadow-soft hover:opacity-95 transition"
          >
            <FileText className="w-4 h-4" /> {t("thankYou.viewReport")}
          </Link>
          <Link
            href="/onboarding/personal"
            className="inline-flex items-center gap-2 rounded-full border border-hive-cream bg-white px-6 py-3 text-sm font-semibold text-hive-dark hover:bg-hive-cream/40 transition"
          >
            <Home className="w-4 h-4" /> {t("thankYou.cta")}
          </Link>
        </div>
      </div>
    </main>
  );
}

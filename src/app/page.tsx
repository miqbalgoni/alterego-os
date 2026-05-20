"use client";

import Link from "next/link";
import { HiveLogo } from "@/components/HiveLogo";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { LanguageMenu } from "@/components/LanguageMenu";

export default function LandingPage() {
  const { t } = useI18n();
  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-5 py-10 sm:py-12">
      <header className="w-full max-w-5xl flex items-center justify-between pt-2 sm:pt-4">
        <div className="w-12" /> {/* spacer */}
        <HiveLogo size={72} />
        <div className="flex items-center">
          <LanguageMenu />
        </div>
      </header>

      <section className="flex-1 w-full max-w-3xl flex flex-col items-center justify-center text-center mt-8 sm:mt-10 fade-up">
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-hive-dark leading-tight whitespace-nowrap">
          <span className="italic font-medium tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
            {t("landing.title.welcome")}
          </span>{" "}
          <span className="text-hive-orange">{t("landing.title.brand")}</span>
        </h1>
        <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-hive-grey max-w-2xl">
          {t("landing.subtitle")}
        </p>
        <p
          className="mt-3 text-base sm:text-lg md:text-xl text-hive-grey/90 max-w-2xl leading-relaxed italic"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {t("landing.description")}
        </p>

        <Link
          href="/login"
          className="mt-8 sm:mt-10 group relative inline-flex items-center gap-3 rounded-full bg-hive-orange px-7 sm:px-8 py-4 text-base md:text-lg font-semibold text-white shadow-soft hover:bg-hive-amber active:scale-95 transition-all pulse-glow w-full max-w-xs sm:w-auto sm:max-w-none justify-center"
        >
          {t("landing.cta")}
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>

        <p className="mt-4 text-[11px] sm:text-xs text-hive-grey/70 px-4">
          {t("landing.note")}
        </p>
      </section>

      <footer className="w-full max-w-5xl text-center text-[11px] sm:text-xs text-hive-grey/60 pt-8 sm:pt-10 safe-pb">
        © {new Date().getFullYear()} HIVE Business Accelerator · ALTEREGO OS
        <span className="mx-2 text-hive-grey/30">·</span>
        <Link href="/admin/login" className="hover:text-hive-orange transition">
          Staff
        </Link>
      </footer>
    </main>
  );
}

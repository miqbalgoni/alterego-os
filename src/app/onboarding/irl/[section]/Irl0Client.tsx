"use client";

// IRL 0 — Foundation library page.
//
// IRL 0 doesn't have an assessment in the source PDF (questions q6–q59 cover
// IRL 1–9 only). Instead it's a library of foundational learning modules
// (1–12) with curated videos. This page lets users browse them before — or
// alongside — the scored questionnaire.

import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, ArrowLeft } from "lucide-react";
import { HiveLogo } from "@/components/HiveLogo";
import { SectionVideos } from "@/components/SectionVideos";
import { useI18n } from "@/i18n/I18nProvider";

interface ModuleCardData {
  id: string;
  title: string;
  shortTitle: string;
  blurb: string;
  estMinutes: number;
}

interface Props {
  modules: ModuleCardData[];
}

export function Irl0Client({ modules }: Props) {
  const router = useRouter();
  const { t } = useI18n();

  const modulesCountLabel = t("irl0.modulesCount").replace(
    "{count}",
    String(modules.length)
  );

  return (
    <main className="min-h-[100dvh] px-3 sm:px-4 pt-6 sm:pt-10 pb-20 sm:pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-5 sm:mb-6">
          <HiveLogo size={48} />
        </div>

        <div className="bg-white/85 backdrop-blur rounded-2xl sm:rounded-3xl shadow-soft border border-hive-cream p-5 sm:p-8 md:p-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-hive-orange">
              {t("irl0.eyebrow")}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-hive-dark leading-tight">
            {t("irl0.title")}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-hive-grey">
            {t("irl0.subtitle")}
          </p>

          {/* Curated foundation videos for this section */}
          <div className="mt-5 sm:mt-6">
            <SectionVideos sectionId="irl-0" />
          </div>

          {/* Module library */}
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <BookOpen className="w-4 h-4 text-hive-orange" />
              <span className="text-sm font-semibold text-hive-dark">
                {modulesCountLabel}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {modules.map(m => (
                <button
                  key={m.id}
                  onClick={() => router.push(`/learn/${m.id}`)}
                  className="group text-left rounded-2xl border border-hive-cream bg-white p-4 sm:p-5 shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-hive-grey font-semibold">
                        {m.shortTitle}
                      </span>
                      <h3 className="mt-0.5 font-bold text-hive-dark text-base sm:text-lg leading-snug">
                        {m.title}
                      </h3>
                    </div>
                    <span className="shrink-0 text-[10px] text-hive-grey/70 whitespace-nowrap">
                      {m.estMinutes} {t("common.minute")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-hive-grey leading-relaxed line-clamp-3">
                    {m.blurb}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-hive-orange group-hover:text-hive-amber">
                    {t("irl0.openModule")} <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation actions */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:justify-between">
            <button
              onClick={() => router.push("/onboarding/personal")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-hive-cream px-5 py-3 text-sm font-semibold text-hive-grey hover:bg-hive-cream/40 transition"
            >
              <ArrowLeft className="w-4 h-4" /> {t("irl0.backToPersonal")}
            </button>
            <button
              onClick={() => router.push("/onboarding/irl/1")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-hive-orange px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-hive-amber transition"
            >
              {t("irl0.continueToIrl1")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

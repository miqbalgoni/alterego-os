"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  CheckCircle2,
  Edit3,
} from "lucide-react";
import { HiveLogo } from "@/components/HiveLogo";
import { LanguageMenu } from "@/components/LanguageMenu";
import { A2UIRenderer } from "@/components/lesson/A2UIRenderer";
import { useI18n } from "@/i18n/I18nProvider";
import {
  localizeModule,
  getSectionLongLabel,
} from "@/i18n/getters";
import { MODULE_BY_ID } from "@/lib/modules/catalog";

interface PeerModule {
  id: string;
  shortTitle: string;
  title: string;
}

interface Props {
  moduleId: string;
  title: string;
  shortTitle: string;
  section: string;          // "irl-1" .. "irl-5"
  sectionLabel: string;     // human-readable
  estMinutes: number;
  peers: PeerModule[];
  currentIndex: number;     // index of this module within its section
  prevModule: PeerModule | null;
  nextModule: PeerModule | null;
}

export function LessonClient({
  moduleId,
  title,
  shortTitle,
  section,
  sectionLabel,
  estMinutes,
  peers,
  currentIndex,
  prevModule,
  nextModule,
}: Props) {
  const router = useRouter();
  const { t, locale } = useI18n();
  const surfaceId = `lesson-${moduleId}`;
  const sectionNum = section.replace("irl-", "");
  const backToReadiness = `/onboarding/irl/${sectionNum}/result`;

  // Localize labels live
  const localSectionLabel = getSectionLongLabel(section, locale);
  const localShortTitle = (() => {
    const m = MODULE_BY_ID[moduleId];
    return m ? localizeModule(m, locale).shortTitle : shortTitle;
  })();
  const localPeers = peers.map(p => {
    const m = MODULE_BY_ID[p.id];
    return m ? { ...p, ...localizeModule(m, locale) } : p;
  });
  const localPrevModule = prevModule
    ? (() => {
        const m = MODULE_BY_ID[prevModule.id];
        return m ? { id: m.id, shortTitle: localizeModule(m, locale).shortTitle, title: localizeModule(m, locale).title } : prevModule;
      })()
    : null;
  const localNextModule = nextModule
    ? (() => {
        const m = MODULE_BY_ID[nextModule.id];
        return m ? { id: m.id, shortTitle: localizeModule(m, locale).shortTitle, title: localizeModule(m, locale).title } : nextModule;
      })()
    : null;

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-hive-cream/30 to-white">
      {/* ============================================================
          Sticky top bar — Back to readiness · breadcrumbs · home logo
          ============================================================ */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/85 border-b border-hive-cream">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3 flex items-center gap-3">
          <Link
            href={backToReadiness}
            className="inline-flex items-center gap-1.5 rounded-full border border-hive-cream px-3 py-1.5 text-xs font-semibold text-hive-grey hover:bg-hive-cream/40 hover:text-hive-dark transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("lesson.backFull")}</span>
            <span className="sm:hidden">{t("lesson.back")}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1.5 text-xs text-hive-grey min-w-0 flex-1">
            <Link href="/onboarding" className="hover:text-hive-dark truncate">
              {t("section.personal").startsWith("Inform") ? "Onboarding" : "Onboarding"}
            </Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <Link href={backToReadiness} className="hover:text-hive-dark truncate">
              {localSectionLabel}
            </Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-hive-dark font-semibold truncate">{localShortTitle}</span>
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-hive-grey">
              <Clock className="w-3 h-3" /> {estMinutes} {t("common.minute")}
            </span>
            <LanguageMenu />
            <Link href="/" aria-label={t("header.home")} className="hidden sm:block">
              <HiveLogo size={28} />
            </Link>
          </div>
        </div>

        {/* Secondary nav row — explicit links back to the IRL section
            (the form where the founder originally entered answers) and the
            readiness review. Always visible so the path back is obvious. */}
        <div className="border-t border-hive-cream/60 bg-hive-cream/20">
          <div className="max-w-3xl mx-auto px-3 sm:px-4 py-1.5 flex items-center gap-2 text-[11px] flex-wrap">
            <span className="text-hive-grey font-semibold uppercase tracking-wider hidden sm:inline">
              {localSectionLabel}
            </span>
            <span className="text-hive-grey/60 hidden sm:inline">·</span>
            <Link
              href={`/onboarding/irl/${sectionNum}`}
              className="inline-flex items-center gap-1 rounded-full border border-hive-cream bg-white px-2.5 py-1 font-semibold text-hive-grey hover:border-hive-orange/50 hover:text-hive-dark transition"
            >
              <Edit3 className="w-3 h-3" />
              {t("common.edit")} IRL {sectionNum}
            </Link>
            <Link
              href={backToReadiness}
              className="inline-flex items-center gap-1 rounded-full border border-hive-cream bg-white px-2.5 py-1 font-semibold text-hive-grey hover:border-hive-orange/50 hover:text-hive-dark transition"
            >
              <ArrowLeft className="w-3 h-3" />
              {t("lesson.backFull")}
            </Link>
          </div>
        </div>

        {/* Module index strip — chips for every module in this IRL section */}
        {localPeers.length > 1 && (
          <div className="border-t border-hive-cream/70">
            <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-thin">
              <span className="shrink-0 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-hive-grey font-bold mr-1">
                <BookOpen className="w-3 h-3" />
                {t("lesson.modules")}
              </span>
              {localPeers.map((p, i) => {
                const isCurrent = p.id === moduleId;
                return (
                  <Link
                    key={p.id}
                    href={`/learn/${p.id}`}
                    title={p.title}
                    className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition border ${
                      isCurrent
                        ? "bg-hive-orange text-white border-hive-orange shadow-sm"
                        : "bg-white text-hive-grey border-hive-cream hover:border-hive-orange/50 hover:text-hive-dark"
                    }`}
                  >
                    <span className="text-[10px] opacity-75">{i + 1}.</span>
                    {p.shortTitle}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* ============================================================
          Lesson surface (A2UI)
          ============================================================ */}
      <div className="max-w-2xl mx-auto px-3 sm:px-4 pt-6 pb-10">
        <A2UIRenderer
          streamUrl={`/api/lesson?moduleId=${encodeURIComponent(moduleId)}`}
          surfaceId={surfaceId}
        />

        {/* ============================================================
            End-of-module pager
            ============================================================ */}
        <nav className="mt-10 pt-6 border-t border-hive-cream grid grid-cols-1 sm:grid-cols-2 gap-3">
          {localPrevModule ? (
            <Link
              href={`/learn/${localPrevModule.id}`}
              className="group bg-white rounded-2xl border border-hive-cream p-4 hover:border-hive-orange/50 hover:shadow-soft transition"
            >
              <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-hive-grey font-semibold mb-1">
                <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                {t("lesson.prevModule")}
              </div>
              <div className="text-sm font-bold text-hive-dark leading-snug">
                {localPrevModule.title}
              </div>
            </Link>
          ) : (
            <div />
          )}
          {localNextModule ? (
            <Link
              href={`/learn/${localNextModule.id}`}
              className="group bg-white rounded-2xl border border-hive-cream p-4 hover:border-hive-orange/50 hover:shadow-soft transition text-right"
            >
              <div className="flex items-center justify-end gap-1 text-[11px] uppercase tracking-wider text-hive-grey font-semibold mb-1">
                {t("lesson.nextModule")}
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-sm font-bold text-hive-dark leading-snug">
                {localNextModule.title}
              </div>
            </Link>
          ) : (
            <Link
              href={backToReadiness}
              className="group bg-gradient-to-br from-hive-orange to-hive-amber text-white rounded-2xl border border-hive-orange p-4 hover:shadow-soft transition text-right"
            >
              <div className="flex items-center justify-end gap-1 text-[11px] uppercase tracking-wider text-white/85 font-semibold mb-1">
                <CheckCircle2 className="w-3 h-3" />
                {t("lesson.youreDone")}
              </div>
              <div className="text-sm font-bold leading-snug">
                {t("lesson.backToReview")}
              </div>
            </Link>
          )}
        </nav>

        <p className="mt-6 text-center text-[11px] text-hive-grey/70">
          {t("lesson.moduleOf")
            .replace("{{a}}", String(currentIndex + 1))
            .replace("{{b}}", String(localPeers.length))} · {localSectionLabel}
        </p>
      </div>
    </main>
  );
}

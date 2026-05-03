"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ReadinessGauge } from "@/components/ReadinessGauge";
import { ModuleCard } from "@/components/ModuleCard";
import { HiveLogo } from "@/components/HiveLogo";
import { ArrowRight, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { getSectionLongLabel } from "@/i18n/getters";

interface ModuleRec {
  id: string;
  title: string;
  shortTitle: string;
  estMinutes: number;
  blurb: string;
}

interface ScoreResponse {
  assessmentId: string;
  section: string;
  score: number;
  diagnosis: string;
  strengths: string[];
  gaps: string[];
  threshold: number;
  passed: boolean;
  recommendations: ModuleRec[];
  optional: ModuleRec[];
  completedModuleIds: string[];
}

interface Props {
  sectionId: string; // "irl-1"
}

export function ResultClient({ sectionId }: Props) {
  const router = useRouter();
  const { t, locale } = useI18n();
  const [data, setData] = useState<ScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [skipped, setSkipped] = useState<Set<string>>(new Set());

  useEffect(() => {
    const sectionNum = sectionId.replace("irl-", "");
    fetch(`/api/score/${sectionNum}`, { method: "POST" })
      .then(async r => {
        if (r.status === 401) {
          router.replace("/login");
          return null;
        }
        if (r.status === 400) {
          // No rubric for this section yet (e.g., IRL 6–9). Just continue.
          router.replace(nextHref(sectionId));
          return null;
        }
        if (!r.ok) throw new Error(`Score request failed (${r.status})`);
        return r.json();
      })
      .then((d: ScoreResponse | null) => {
        if (d) setData(d);
      })
      .catch(e => setError(String(e)));
  }, [sectionId, router]);

  const visibleRecs = useMemo(
    () => data?.recommendations.filter(r => !skipped.has(r.id)) ?? [],
    [data, skipped]
  );

  const visibleOptional = useMemo(
    () => data?.optional.filter(r => !skipped.has(r.id)) ?? [],
    [data, skipped]
  );

  const completedSet = useMemo(
    () => new Set(data?.completedModuleIds ?? []),
    [data]
  );

  if (error) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-soft border border-hive-cream p-6 max-w-md text-center">
          <p className="text-hive-grey">{t("result.error")}</p>
          <p className="text-xs text-hive-grey/60 mt-2">{error}</p>
          <button
            onClick={() => router.push(nextHref(sectionId))}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-hive-orange px-5 py-2.5 text-sm font-semibold text-white"
          >
            {t("common.continue")}
          </button>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-hive-grey">
            <Sparkles className="w-5 h-5 text-hive-orange animate-pulse" />
            {t("result.reviewing")}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] px-3 sm:px-4 pt-6 sm:pt-10 pb-24 sm:pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-5 sm:mb-6">
          <HiveLogo size={48} />
        </div>

        <div className="bg-white/85 backdrop-blur rounded-2xl sm:rounded-3xl shadow-soft border border-hive-cream p-5 sm:p-8 md:p-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-hive-grey font-semibold">
              {`IRL ${sectionId.replace("irl-", "")}`}
            </p>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-hive-dark mt-1">
              {t("result.title")}
            </h1>
          </div>

          <div className="mt-6 sm:mt-8 flex justify-center">
            <ReadinessGauge
              score={data.score}
              threshold={data.threshold}
              size={210}
              label={t("result.score.label")}
            />
          </div>

          <p className="mt-6 text-center text-sm sm:text-base text-hive-dark leading-relaxed max-w-xl mx-auto">
            {data.diagnosis}
          </p>

          {/* Strengths & gaps */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.strengths.length > 0 && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-700 font-semibold text-sm mb-2">
                  <CheckCircle2 className="w-4 h-4" /> {t("result.strengths")}
                </div>
                <ul className="space-y-1.5 text-sm text-green-900/80">
                  {data.strengths.map((s, i) => (
                    <li key={i} className="leading-snug">• {s}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.gaps.length > 0 && (
              <div className="bg-hive-cream/60 border border-hive-cream rounded-xl p-4">
                <div className="flex items-center gap-2 text-hive-amber font-semibold text-sm mb-2">
                  <AlertCircle className="w-4 h-4" /> {t("result.gaps")}
                </div>
                <ul className="space-y-1.5 text-sm text-hive-dark/80">
                  {data.gaps.map((g, i) => (
                    <li key={i} className="leading-snug">• {g}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {visibleRecs.length > 0 ? (
            <div className="mt-8">
              <div className="text-center mb-4">
                <h2 className="text-base sm:text-lg font-bold text-hive-dark">
                  {t("result.recommendations.headline")
                    .replace("{{n}}", String(visibleRecs.length))
                    .replace(
                      "{{module}}",
                      visibleRecs.length === 1
                        ? (locale === "it" ? "modulo" : "module")
                        : (locale === "it" ? "moduli" : "modules")
                    )}
                </h2>
                <p className="text-xs text-hive-grey mt-1">
                  {t("result.recommendations.subheadline").replace(
                    "{{m}}",
                    String(visibleRecs.reduce((s, m) => s + m.estMinutes, 0))
                  )}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {visibleRecs.map(rec => (
                  <ModuleCard
                    key={rec.id}
                    id={rec.id}
                    title={rec.title}
                    blurb={rec.blurb}
                    estMinutes={rec.estMinutes}
                    onSkip={() =>
                      setSkipped(prev => new Set(prev).add(rec.id))
                    }
                  />
                ))}
              </div>
            </div>
          ) : data.passed ? (
            <div className="mt-8 bg-green-50 border border-green-100 rounded-xl p-5 text-center">
              <p className="text-green-800 font-semibold">
                {t("result.passed")}
              </p>
            </div>
          ) : null}

          {/* Optional modules — always offered. */}
          {visibleOptional.length > 0 && (
            <div className="mt-10 pt-6 border-t border-hive-cream">
              <div className="text-center mb-4">
                <span className="inline-block px-3 py-1 rounded-full bg-hive-cream text-hive-amber text-[11px] font-bold uppercase tracking-wider">
                  {t("result.optional.eyebrow")}
                </span>
                <h2 className="mt-2 text-base sm:text-lg font-bold text-hive-dark">
                  {t("result.optional.title")} {getSectionLongLabel(sectionId, locale)}
                </h2>
                <p className="text-xs text-hive-grey mt-1">
                  {t("result.optional.subtitle")}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {visibleOptional.map(rec => {
                  const done = completedSet.has(rec.id);
                  return (
                    <div key={rec.id} className="relative">
                      {done && (
                        <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                          {t("result.optional.completed")}
                        </span>
                      )}
                      <div className={done ? "opacity-70" : ""}>
                        <ModuleCard
                          id={rec.id}
                          title={rec.title}
                          blurb={rec.blurb}
                          estMinutes={rec.estMinutes}
                          onSkip={() =>
                            setSkipped(prev => new Set(prev).add(rec.id))
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Continue */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => router.push(nextHref(sectionId))}
              className="inline-flex items-center gap-2 rounded-full bg-hive-orange px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-hive-amber transition"
            >
              {t("result.continue")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-hive-grey/70 px-4">
          {t("result.savedNote")}
        </p>
      </div>
    </main>
  );
}

function nextHref(sectionId: string): string {
  const num = parseInt(sectionId.replace("irl-", ""), 10);
  if (Number.isNaN(num)) return "/onboarding/review";
  if (num >= 9) return "/onboarding/review";
  return `/onboarding/irl/${num + 1}`;
}

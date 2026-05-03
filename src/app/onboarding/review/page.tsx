"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HiveLogo } from "@/components/HiveLogo";
import {
  ReadinessRadar,
  ReadinessLegend,
  type RadarPoint,
} from "@/components/ReadinessRadar";
import { SECTIONS, QUESTION_BY_ID } from "@/lib/questions";
import {
  ArrowLeft,
  CheckCircle2,
  Edit2,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import {
  localizeQuestion,
  localizeSection,
  getSectionShortLabel,
} from "@/i18n/getters";

interface SessionData {
  userId: string;
  email: string;
  answers: Record<string, unknown>;
}

interface ReadinessData {
  composite: number | null;
  assessedCount: number;
  threshold: number;
  sections: {
    section: string;
    index: number;
    shortLabel: string;
    score: number | null;
    diagnosis: string | null;
    hasAnswers: boolean;
    hasRubric: boolean;
    assessmentId: string | null;
  }[];
}

export default function ReviewPage() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const [session, setSession] = useState<SessionData | null>(null);
  const [readiness, setReadiness] = useState<ReadinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scoringAll, setScoringAll] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/session", { method: "POST" }).then(async r => {
        if (r.status === 401) {
          router.replace("/login");
          return null;
        }
        return r.json();
      }),
      fetch("/api/readiness").then(async r => (r.ok ? r.json() : null)),
    ])
      .then(([sessionData, readinessData]) => {
        if (sessionData) {
          setSession({
            userId: sessionData.userId,
            email: sessionData.email,
            answers: sessionData.answers,
          });
        }
        if (readinessData) setReadiness(readinessData);
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function refreshReadiness() {
    const r = await fetch("/api/readiness");
    if (r.ok) setReadiness(await r.json());
  }

  // Score every IRL 1–5 section that has answers but no assessment yet.
  async function scoreAllRemaining() {
    if (!readiness) return;
    const targets = readiness.sections.filter(
      s => s.hasRubric && s.hasAnswers && s.score === null
    );
    if (targets.length === 0) return;
    setScoringAll(true);
    try {
      // Run sequentially — each call hits Claude; serial is gentler on rate limits
      for (const t of targets) {
        await fetch(`/api/score/${t.index}`, { method: "POST" });
      }
      await refreshReadiness();
    } finally {
      setScoringAll(false);
    }
  }

  async function onSubmit() {
    if (!session) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/submit", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        if (data?.missing?.length) {
          setError(
            `Please complete ${data.missing.length} required field(s) before submitting.`
          );
        } else {
          setError(data?.error ?? "Submit failed");
        }
        return;
      }
      router.push("/onboarding/thank-you");
    } catch {
      setError("Submit failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function editSection(id: string) {
    if (id === "personal") router.push("/onboarding/personal");
    else router.push(`/onboarding/irl/${id.replace("irl-", "")}`);
  }

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-hive-grey">
        {t("form.loadingSession")}
      </div>
    );
  }

  // Build radar points (short label localized via dictionary)
  const radarPoints: RadarPoint[] =
    readiness?.sections.map(s => ({
      axis: s.section,
      index: s.index,
      label: `IRL ${s.index}`,
      shortLabel: getSectionShortLabel(s.section, locale),
      score: s.score,
      diagnosis: s.diagnosis,
      hasAnswers: s.hasAnswers,
      hasRubric: s.hasRubric,
    })) ?? [];

  const remainingToScore = readiness?.sections.filter(
    s => s.hasRubric && s.hasAnswers && s.score === null
  ).length ?? 0;

  return (
    <main className="min-h-[100dvh] px-3 sm:px-4 pt-6 sm:pt-10 pb-36 sm:pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-5 sm:mb-6">
          <HiveLogo size={48} />
        </div>

        {/* ============================================================
            Readiness Map — the radar hero
            ============================================================ */}
        {readiness && radarPoints.length > 0 && (
          <section className="bg-white/85 backdrop-blur rounded-2xl sm:rounded-3xl shadow-soft border border-hive-cream p-5 sm:p-8 md:p-10 mb-6 sm:mb-8 fade-up">
            <div className="text-center mb-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] font-bold text-hive-orange">
                <Sparkles className="w-3 h-3" />
                {t("review.readinessMap")}
              </span>
              <h1 className="mt-2 text-xl sm:text-2xl md:text-3xl font-extrabold text-hive-dark leading-tight">
                {readiness.composite !== null
                  ? `${t("review.composite.prefix")} ${readiness.composite}${t("review.composite.suffix")}`
                  : t("review.headline.empty")}
              </h1>
              <p className="mt-2 text-sm text-hive-grey max-w-xl mx-auto">
                {readiness.assessedCount === 9
                  ? t("review.subheadline.complete")
                  : readiness.assessedCount > 0
                  ? `${readiness.assessedCount} ${t("review.subheadline.partial")}`
                  : t("review.subheadline.empty")}
              </p>
            </div>

            <div className="mt-4 flex flex-col items-center">
              <ReadinessRadar
                points={radarPoints}
                threshold={readiness.threshold}
              />
              <div className="mt-3 sm:mt-2">
                <ReadinessLegend
                  threshold={readiness.threshold}
                  assessedCount={readiness.assessedCount}
                  totalCount={9}
                />
              </div>
            </div>

            {/* Score-remaining CTA */}
            {remainingToScore > 0 && (
              <div className="mt-5 flex justify-center">
                <button
                  onClick={scoreAllRemaining}
                  disabled={scoringAll}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-hive-orange to-hive-amber px-5 py-2.5 text-sm font-bold text-white shadow-soft hover:opacity-95 transition disabled:opacity-60"
                >
                  <Wand2 className={`w-4 h-4 ${scoringAll ? "animate-spin" : ""}`} />
                  {scoringAll
                    ? t("review.computingReadiness")
                    : `${remainingToScore === 1 ? t("review.scoreRemaining") : t("review.scoreRemainingPlural")} (${remainingToScore})`}
                </button>
              </div>
            )}
          </section>
        )}

        {/* ============================================================
            Original review-of-answers panel
            ============================================================ */}
        <div className="bg-white/85 backdrop-blur rounded-2xl sm:rounded-3xl shadow-soft border border-hive-cream p-5 sm:p-8 md:p-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-hive-dark leading-tight">
            {t("review.title")}
          </h2>
          <p className="mt-2 text-sm text-hive-grey">
            {t("review.subtitle")}
          </p>

          <div className="mt-6 sm:mt-8 space-y-7 sm:space-y-8 sm:max-h-[55vh] sm:overflow-y-auto sm:pr-2">
            {SECTIONS.map(s => {
              const localSection = localizeSection(s, locale);
              return (
              <div key={s.id} className="border-b border-hive-cream pb-5 sm:pb-6 last:border-0">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base sm:text-lg font-bold text-hive-dark leading-tight">
                    {localSection.title}
                  </h3>
                  <button
                    onClick={() => editSection(s.id)}
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-hive-amber hover:underline active:scale-95"
                  >
                    <Edit2 className="w-3 h-3" /> {t("common.edit")}
                  </button>
                </div>
                <dl className="mt-4 space-y-3">
                  {s.questionIds.map(qid => {
                    const q = QUESTION_BY_ID[qid];
                    if (!q) return null;
                    const lq = localizeQuestion(q, locale);
                    const v = session.answers[qid];
                    return (
                      <div key={qid} className="text-sm">
                        <dt className="font-medium text-hive-grey">
                          {q.number != null && (
                            <span className="text-hive-orange mr-1">{q.number}.</span>
                          )}
                          {lq.label}
                        </dt>
                        <dd className="mt-0.5 text-hive-dark break-words">
                          {formatValue(v, t("common.notAnswered"))}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
              );
            })}
          </div>

          {error && <div className="mt-6 text-sm text-red-600">{error}</div>}

          {/* Desktop action row */}
          <div className="mt-8 hidden sm:flex flex-row gap-3 justify-between">
            <button
              onClick={() => router.push("/onboarding/irl/9")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-hive-cream px-5 py-3 text-sm font-semibold text-hive-grey hover:bg-hive-cream/40 transition"
            >
              <ArrowLeft className="w-4 h-4" /> {t("common.back")}
            </button>
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-hive-orange px-8 py-3.5 text-sm font-semibold text-white shadow-soft hover:bg-hive-amber transition disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? t("common.saving") : t("common.submit")}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-hive-cream safe-pb px-3 pt-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/onboarding/irl/9")}
            aria-label={t("common.back")}
            className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full border border-hive-cream text-hive-grey active:scale-95 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-hive-orange h-12 px-4 text-sm font-semibold text-white shadow-soft active:scale-95 transition disabled:opacity-60"
          >
            <CheckCircle2 className="w-4 h-4" />
            {submitting ? t("common.saving") : t("common.submit")}
          </button>
        </div>
      </div>
    </main>
  );
}

function formatValue(v: unknown, notAnsweredLabel: string): string {
  if (v === undefined || v === null || v === "") return notAnsweredLabel;
  if (Array.isArray(v)) return v.length ? v.join(", ") : notAnsweredLabel;
  return String(v);
}

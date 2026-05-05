"use client";

// The founder's "Report Card" — the showpiece view they reach after submitting
// their IRL assessment. It pairs the readiness radar with a per-dimension marks
// table and is print-friendly so the user can save it as a PDF straight from
// the browser. No external libs required.

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ReadinessRadar,
  type RadarPoint,
} from "@/components/ReadinessRadar";
import { HiveLogo } from "@/components/HiveLogo";
import {
  Award,
  CheckCircle2,
  Sparkles,
  Download,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CircleDashed,
  Star,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { getSectionShortLabel, getSectionLongLabel } from "@/i18n/getters";
import type { LocaleKey } from "@/i18n/dictionaries";

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

interface SessionData {
  email: string;
  user: { fullName: string | null; startupName: string | null };
}

export default function ReportCardPage() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const [readiness, setReadiness] = useState<ReadinessData | null>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/readiness").then(async r => (r.ok ? r.json() : null)),
      fetch("/api/session", { method: "POST" }).then(async r => {
        if (r.status === 401) {
          router.replace("/login");
          return null;
        }
        return r.ok ? r.json() : null;
      }),
    ])
      .then(([rd, sd]) => {
        if (rd) setReadiness(rd);
        if (sd) {
          setSession({
            email: sd.email,
            user: {
              fullName: sd.user?.fullName ?? null,
              startupName: sd.user?.startupName ?? null,
            },
          });
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const radarPoints: RadarPoint[] = useMemo(
    () =>
      readiness?.sections.map(s => ({
        axis: s.section,
        index: s.index,
        label: `IRL ${s.index}`,
        shortLabel: getSectionShortLabel(s.section, locale),
        score: s.score,
        diagnosis: s.diagnosis,
        hasAnswers: s.hasAnswers,
        hasRubric: s.hasRubric,
      })) ?? [],
    [readiness, locale]
  );

  const composite = readiness?.composite ?? null;
  const tierKey: LocaleKey =
    composite === null
      ? "report.tier.notReady"
      : composite >= 85
      ? "report.tier.exceptional"
      : composite >= 70
      ? "report.tier.strong"
      : composite >= 55
      ? "report.tier.developing"
      : composite >= 40
      ? "report.tier.early"
      : "report.tier.notReady";

  const dateStr = useMemo(() => {
    const d = new Date();
    try {
      return d.toLocaleDateString(locale === "it" ? "it-IT" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return d.toDateString();
    }
  }, [locale]);

  const [downloading, setDownloading] = useState(false);

  const founderName =
    session?.user.fullName?.trim() || session?.email?.split("@")[0] || "—";
  const startupName = session?.user.startupName?.trim() || "—";

  async function handleDownload() {
    if (!readiness) return;
    setDownloading(true);
    try {
      const [{ pdf }, { ReportPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/report/ReportPDF"),
      ]);

      const tierLabel = t(tierKey);

      const data = {
        founderName,
        startupName,
        email: session?.email ?? "",
        date: dateStr,
        composite,
        threshold: readiness.threshold,
        assessedCount: readiness.assessedCount,
        totalSections: readiness.sections.length,
        sections: readiness.sections.map(s => ({
          index: s.index,
          longLabel: getSectionLongLabel(s.section, locale),
          shortLabel: getSectionShortLabel(s.section, locale),
          score: s.score,
        })),
        i18n: {
          eyebrow: t("report.eyebrow"),
          title: t("report.title"),
          subtitle: t("report.subtitle"),
          issuedTo: t("report.issuedTo"),
          startup: t("report.startup"),
          date: t("report.date"),
          composite: t("report.compositeLabel"),
          compositeOf: t("report.compositeOf"),
          tier: tierLabel,
          profile: t("report.profile"),
          profileSub: t("report.profileSub"),
          marks: t("report.marks"),
          marksSub: t("report.marksSub"),
          colDimension: t("report.col.dimension"),
          colScore: t("report.col.score"),
          colStatus: t("report.col.status"),
          colSignal: t("report.col.signal"),
          statusPassed: t("report.status.passed"),
          statusGap: t("report.status.gap"),
          statusPending: t("report.status.pending"),
          notAssessed: t("report.notAssessed"),
          signature: t("report.signature"),
          signatureRole: t("report.signature.role"),
          seal: t("report.seal"),
          footnote: t("report.footnote"),
          assessed: locale === "it" ? "valutate" : "assessed",
          page: t("report.page"),
          of: t("report.of"),
        },
      };

      const blob = await pdf(<ReportPDF data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const safeStartup =
        startupName && startupName !== "—"
          ? startupName.replace(/[^a-z0-9-_]+/gi, "_")
          : "founder";
      a.href = url;
      a.download = `ALTEREGO-OS_Report_${safeStartup}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      console.error("PDF generation failed", e);
      alert("Sorry — couldn't generate the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  if (loading || !readiness) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center">
        <div className="inline-flex items-center gap-2 text-hive-grey">
          <Sparkles className="w-5 h-5 text-hive-orange animate-pulse" />
          {t("common.loading")}
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="report-page min-h-[100dvh] px-3 sm:px-6 pt-4 sm:pt-8 pb-32 sm:pb-16">
        {/* Action bar — hidden in print */}
        <div className="report-actions max-w-4xl mx-auto mb-4 sm:mb-6 flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 text-xs text-hive-grey">
            <Sparkles className="w-3.5 h-3.5 text-hive-orange" />
            <span className="uppercase tracking-[0.18em] font-bold">
              {t("report.eyebrow")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-hive-orange to-hive-amber px-5 py-2.5 text-sm font-bold text-white shadow-soft hover:opacity-95 active:scale-[0.98] transition disabled:opacity-70 disabled:cursor-wait"
            >
              <Download className="w-4 h-4" />
              {downloading ? t("report.downloading") : t("report.download")}
            </button>
            <button
              onClick={() => router.push("/onboarding/thank-you")}
              className="inline-flex items-center gap-2 rounded-full border border-hive-cream bg-white px-5 py-2.5 text-sm font-semibold text-hive-dark hover:bg-hive-cream/40 transition"
            >
              {t("report.continue")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The card itself */}
        <article className="report-card relative max-w-4xl mx-auto bg-white rounded-3xl shadow-soft border border-hive-cream overflow-hidden fade-up">
          {/* Decorative gradient ribbon at top */}
          <div
            aria-hidden
            className="report-ribbon absolute inset-x-0 top-0 h-2"
            style={{
              background:
                "linear-gradient(90deg, #F5A623 0%, #E89611 35%, #FFD27A 65%, #F5A623 100%)",
            }}
          />

          {/* Soft honeycomb watermark behind everything */}
          <div
            aria-hidden
            className="report-watermark absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 20%, #F5A623 0 2px, transparent 3px), radial-gradient(circle at 85% 70%, #F5A623 0 2px, transparent 3px), radial-gradient(circle at 50% 50%, #F5A623 0 2px, transparent 3px)",
              backgroundSize: "80px 80px, 80px 80px, 120px 120px",
            }}
          />

          {/* ============================================================
              HEADER — logo, eyebrow, founder, startup, date, seal
              ============================================================ */}
          <header className="relative px-6 sm:px-12 pt-10 sm:pt-12 pb-6 border-b border-hive-cream/70">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <HiveLogo size={48} />
                <div>
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-extrabold text-hive-orange">
                    {t("report.eyebrow")}
                  </p>
                  <h1 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-extrabold text-hive-dark leading-tight">
                    {t("report.title")}
                  </h1>
                </div>
              </div>

              {/* The "verified" wax-seal medallion */}
              <div className="report-seal relative shrink-0">
                <div className="absolute inset-0 rounded-full opacity-50 blur-md bg-hive-orange" />
                <div className="relative w-[88px] h-[88px] rounded-full bg-gradient-to-br from-hive-orange via-hive-amber to-[#B45309] flex items-center justify-center shadow-soft border-[3px] border-white">
                  <div className="absolute inset-1 rounded-full border border-white/30" />
                  <ShieldCheck className="w-7 h-7 text-white drop-shadow" />
                </div>
                <p className="mt-2 text-center text-[9px] uppercase tracking-[0.18em] font-extrabold text-hive-amber">
                  {t("report.seal")}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-hive-grey max-w-2xl leading-relaxed">
              {t("report.subtitle")}
            </p>

            {/* Founder / startup / date strip */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <MetaCell
                label={t("report.issuedTo")}
                value={founderName}
                accent
              />
              <MetaCell label={t("report.startup")} value={startupName} />
              <MetaCell label={t("report.date")} value={dateStr} />
            </div>
          </header>

          {/* ============================================================
              COMPOSITE + RADAR
              ============================================================ */}
          <section className="relative px-6 sm:px-12 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-8 items-center border-b border-hive-cream/70">
            {/* Composite block */}
            <div className="report-composite relative">
              <div
                aria-hidden
                className="absolute -inset-4 rounded-3xl opacity-60 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(245,166,35,0.18), transparent)",
                }}
              />
              <div className="relative">
                <p className="text-[11px] uppercase tracking-[0.22em] font-extrabold text-hive-amber inline-flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-hive-amber stroke-hive-amber" />
                  {t("report.compositeLabel")}
                </p>
                <div className="mt-2 flex items-end gap-3">
                  <span
                    className="font-extrabold text-hive-dark leading-none tracking-tight"
                    style={{ fontSize: "clamp(72px, 14vw, 130px)" }}
                  >
                    {composite ?? "—"}
                  </span>
                  <span className="pb-3 text-base sm:text-lg font-bold text-hive-grey">
                    /100
                  </span>
                </div>
                <div
                  className="mt-3 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider border"
                  style={tierPillStyle(composite)}
                >
                  <Award className="w-3.5 h-3.5" />
                  {t(tierKey)}
                </div>
                <p className="mt-4 text-sm text-hive-grey max-w-md leading-relaxed">
                  {t("report.compositeOf")} ·{" "}
                  {readiness.assessedCount}/9 {locale === "it" ? "valutate" : "assessed"}
                </p>
              </div>
            </div>

            {/* Radar */}
            <div className="report-radar flex flex-col items-center">
              <p className="text-[11px] uppercase tracking-[0.22em] font-extrabold text-hive-orange inline-flex items-center gap-1.5 self-start md:self-center">
                <Sparkles className="w-3.5 h-3.5" />
                {t("report.profile")}
              </p>
              <div className="w-full max-w-[440px] mt-2">
                <ReadinessRadar
                  points={radarPoints}
                  threshold={readiness.threshold}
                  onAxisClick={() => { /* read-only on report */ }}
                />
              </div>
              <p className="text-xs text-hive-grey/80 text-center max-w-sm mt-1 leading-relaxed">
                {t("report.profileSub")}
              </p>
            </div>
          </section>

          {/* ============================================================
              MARKS TABLE
              ============================================================ */}
          <section className="relative px-6 sm:px-12 py-8 sm:py-10">
            <div className="flex items-end justify-between gap-3 mb-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] font-extrabold text-hive-orange inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t("report.marks")}
                </p>
                <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-hive-dark">
                  {t("report.marksSub")}
                </h2>
              </div>
            </div>

            <div className="report-table-wrap rounded-2xl border border-hive-cream overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-hive-cream/70 to-hive-cream/30">
                    <th className="px-4 sm:px-5 py-3 text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold text-hive-dark/80 w-[44%]">
                      {t("report.col.dimension")}
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold text-hive-dark/80 w-[14%]">
                      {t("report.col.score")}
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold text-hive-dark/80 w-[16%]">
                      {t("report.col.status")}
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold text-hive-dark/80 w-[26%]">
                      {t("report.col.signal")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {readiness.sections.map((s, i) => {
                    const longLabel = getSectionLongLabel(s.section, locale);
                    const passed = s.score !== null && s.score >= readiness.threshold;
                    const pending = s.score === null;
                    return (
                      <tr
                        key={s.section}
                        className={`border-t border-hive-cream/70 transition ${
                          i % 2 === 1 ? "bg-hive-cream/10" : ""
                        }`}
                        style={{
                          animation: `fadeUp 480ms ease-out ${100 + i * 60}ms both`,
                        }}
                      >
                        <td className="px-4 sm:px-5 py-3.5 align-middle">
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-[10px] font-extrabold ${
                                pending
                                  ? "bg-gray-100 text-gray-500"
                                  : passed
                                  ? "bg-green-100 text-green-700"
                                  : "bg-hive-cream text-hive-amber"
                              }`}
                            >
                              {s.index}
                            </span>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-hive-dark leading-tight truncate">
                                {longLabel}
                              </div>
                              <div className="text-[11px] text-hive-grey leading-tight">
                                {getSectionShortLabel(s.section, locale)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 align-middle">
                          {pending ? (
                            <span className="text-sm font-bold text-gray-400">
                              —
                            </span>
                          ) : (
                            <div className="flex items-baseline gap-1">
                              <span
                                className={`text-lg sm:text-xl font-extrabold leading-none ${
                                  passed ? "text-green-700" : "text-hive-amber"
                                }`}
                              >
                                {s.score}
                              </span>
                              <span className="text-[11px] font-bold text-hive-grey">
                                /100
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 align-middle">
                          <StatusPill
                            kind={pending ? "pending" : passed ? "passed" : "gap"}
                            t={t}
                          />
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 align-middle">
                          {pending ? (
                            <span className="text-xs text-gray-400">
                              {t("report.notAssessed")}
                            </span>
                          ) : (
                            <ScoreBar
                              score={s.score!}
                              threshold={readiness.threshold}
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-[11px] text-hive-grey/80 leading-relaxed max-w-2xl">
              {t("report.footnote")}
            </p>
          </section>

          {/* ============================================================
              FOOTER — signature
              ============================================================ */}
          <footer className="relative px-6 sm:px-12 pb-10 pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-hive-cream/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-hive-orange to-hive-amber flex items-center justify-center text-white">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-hive-dark leading-tight">
                  {t("report.signature")}
                </p>
                <p className="text-[11px] text-hive-grey leading-tight">
                  {t("report.signature.role")}
                </p>
              </div>
            </div>
            <div
              className="text-[10px] uppercase tracking-[0.22em] font-extrabold text-hive-grey/70"
            >
              ALTEREGO · OS — {dateStr}
            </div>
          </footer>
        </article>
      </main>

      {/* ----------------------------------------------------------------
          Print stylesheet — tight, single-card, no chrome.
          ---------------------------------------------------------------- */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm 10mm;
          }
          html, body {
            background: #ffffff !important;
          }
          /* Preserve gradients and accent colors when printed/saved as PDF */
          body * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Classic isolation trick — hide everything, then re-show the card.
             This neutralizes the AppHeader, AskMe widget, action bar, etc.,
             without coupling the print rules to their internal class names. */
          body * {
            visibility: hidden;
          }
          .report-card,
          .report-card * {
            visibility: visible;
          }
          .report-card {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: 1px solid #FFE9C9 !important;
            border-radius: 0 !important;
            max-width: 100% !important;
            page-break-inside: avoid;
          }
          .report-watermark {
            opacity: 0.04 !important;
          }
        }
      `}</style>
    </>
  );
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function MetaCell({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        accent
          ? "bg-gradient-to-br from-hive-cream/70 to-white border-hive-orange/40"
          : "bg-white border-hive-cream"
      }`}
    >
      <p className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-hive-amber">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-hive-dark truncate">{value}</p>
    </div>
  );
}

function StatusPill({
  kind,
  t,
}: {
  kind: "passed" | "gap" | "pending";
  t: (k: LocaleKey) => string;
}) {
  const map = {
    passed: {
      bg: "bg-green-100",
      text: "text-green-800",
      ring: "border-green-300",
      icon: <CheckCircle2 className="w-3 h-3" />,
      label: t("report.status.passed"),
    },
    gap: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      ring: "border-hive-orange/60",
      icon: <AlertTriangle className="w-3 h-3" />,
      label: t("report.status.gap"),
    },
    pending: {
      bg: "bg-gray-100",
      text: "text-gray-600",
      ring: "border-gray-300",
      icon: <CircleDashed className="w-3 h-3" />,
      label: t("report.status.pending"),
    },
  } as const;
  const v = map[kind];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${v.bg} ${v.text} ${v.ring} px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider`}
    >
      {v.icon}
      {v.label}
    </span>
  );
}

function ScoreBar({
  score,
  threshold,
}: {
  score: number;
  threshold: number;
}) {
  const pct = Math.max(0, Math.min(100, score));
  const passed = score >= threshold;
  const fillFrom = passed ? "#16a34a" : "#F5A623";
  const fillTo = passed ? "#22c55e" : "#E89611";
  return (
    <div className="relative w-full">
      <div className="h-2.5 rounded-full bg-hive-cream/70 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${fillFrom} 0%, ${fillTo} 100%)`,
            transition: "width 800ms cubic-bezier(0.22, 0.61, 0.36, 1)",
            boxShadow: passed
              ? "0 0 12px rgba(34,197,94,0.35)"
              : "0 0 10px rgba(245,166,35,0.35)",
          }}
        />
      </div>
      {/* threshold tick */}
      <div
        className="absolute top-[-2px] bottom-[-2px] w-px bg-green-600/60"
        style={{ left: `${threshold}%` }}
        aria-hidden
      />
    </div>
  );
}

function tierPillStyle(score: number | null): React.CSSProperties {
  if (score === null) {
    return {
      background: "#F3F4F6",
      color: "#4B5563",
      borderColor: "#E5E7EB",
    };
  }
  if (score >= 70) {
    return {
      background: "linear-gradient(90deg, #DCFCE7, #BBF7D0)",
      color: "#15803D",
      borderColor: "#86EFAC",
    };
  }
  if (score >= 55) {
    return {
      background: "linear-gradient(90deg, #FEF3C7, #FFE9C9)",
      color: "#B45309",
      borderColor: "#F5A623",
    };
  }
  return {
    background: "linear-gradient(90deg, #FEE2E2, #FECACA)",
    color: "#B91C1C",
    borderColor: "#FCA5A5",
  };
}

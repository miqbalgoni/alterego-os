"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Trophy } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

interface Props {
  moduleId: string;
  title: string;
  body: string;
  nextAction?: string;
}

export function OutroCard({ moduleId, title, body, nextAction }: Props) {
  const router = useRouter();
  const { t } = useI18n();
  const [completing, setCompleting] = useState(false);
  const [done, setDone] = useState(false);

  async function complete() {
    setCompleting(true);
    try {
      const r = await fetch("/api/lesson/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId }),
      });
      // The API returns { ok, section } when known so we can route the user
      // back to the right readiness review.
      let section: string | null = null;
      try {
        const data = await r.json();
        section = data?.section ?? null;
      } catch {
        /* ignore */
      }
      setDone(true);
      // Brief celebration, then back to the readiness review for this section
      // (or to /onboarding if the section couldn't be inferred).
      setTimeout(() => {
        if (section?.startsWith("irl-")) {
          router.push(`/onboarding/${section.replace("irl-", "irl/")}/result`);
        } else {
          router.push("/onboarding");
        }
      }, 1400);
    } finally {
      setCompleting(false);
    }
  }

  return (
    <article className="bg-gradient-to-br from-hive-cream to-white rounded-2xl border border-hive-cream shadow-soft p-5 sm:p-6 animate-[fadeUp_400ms_ease-out]">
      <div className="flex items-center gap-2 text-hive-orange mb-2">
        <Trophy className="w-4 h-4" />
        <span className="text-[11px] font-semibold uppercase tracking-wider">
          {t("a2ui.outroEyebrow")}
        </span>
      </div>
      <h3 className="text-base sm:text-lg font-bold text-hive-dark leading-snug">
        {title}
      </h3>
      <p className="mt-2 text-sm text-hive-dark/85 leading-relaxed whitespace-pre-line">
        {body}
      </p>

      <div className="mt-5">
        {done ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-100 text-green-800 px-4 py-2.5 text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4" /> {t("a2ui.outroDone")}
          </div>
        ) : (
          <button
            onClick={complete}
            disabled={completing}
            className="inline-flex items-center gap-2 rounded-full bg-hive-orange px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-hive-amber transition disabled:opacity-50"
          >
            {completing ? t("common.saving") : (nextAction ?? t("a2ui.outroNext"))}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </article>
  );
}

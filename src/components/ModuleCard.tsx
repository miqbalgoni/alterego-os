"use client";

import { Clock, ArrowRight, Sparkles, BookmarkPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

interface Props {
  id: string;
  title: string;
  blurb: string;
  estMinutes: number;
  onSkip?: () => void;
  onSave?: () => void;
}

/**
 * A clickable recommendation card. "Start now" routes to the lesson player.
 */
export function ModuleCard({ id, title, blurb, estMinutes, onSkip, onSave }: Props) {
  const router = useRouter();
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);

  function start() {
    setBusy(true);
    router.push(`/learn/${id}`);
  }

  return (
    <div className="group relative bg-white rounded-2xl border border-hive-cream shadow-soft p-5 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-full bg-hive-cream flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-hive-orange" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] uppercase tracking-wider text-hive-grey font-semibold">
              {t("moduleCard.suggested")}
            </span>
            <span className="text-[10px] text-hive-grey/70 inline-flex items-center gap-1">
              <Clock className="w-3 h-3" /> {estMinutes} {t("common.minute")}
            </span>
          </div>
          <h3 className="font-bold text-hive-dark text-lg leading-snug">{title}</h3>
          <p className="mt-2 text-sm text-hive-grey leading-relaxed">{blurb}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={start}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full bg-hive-orange px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-hive-amber transition disabled:opacity-50"
        >
          {busy ? t("moduleCard.loading") : t("moduleCard.startNow")}
          <ArrowRight className="w-4 h-4" />
        </button>
        {onSave && (
          <button
            onClick={onSave}
            className="inline-flex items-center gap-1.5 rounded-full border border-hive-cream px-4 py-2 text-sm font-medium text-hive-grey hover:bg-hive-cream/40 transition"
          >
            <BookmarkPlus className="w-4 h-4" /> {t("moduleCard.saveForLater")}
          </button>
        )}
        {onSkip && (
          <button
            onClick={onSkip}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-hive-grey/70 hover:text-hive-grey transition"
          >
            <X className="w-3 h-3" /> {t("moduleCard.skip")}
          </button>
        )}
      </div>
    </div>
  );
}

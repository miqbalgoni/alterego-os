"use client";

import { Sparkles, Clock } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

interface Props {
  title: string;
  sectionLabel: string;
  estMinutes: number;
  beatIndex: number;
  totalBeats: number;
}

export function LessonHeader({
  title,
  sectionLabel,
  estMinutes,
  beatIndex,
  totalBeats,
}: Props) {
  const { t } = useI18n();
  const pct = Math.round(Math.max(0, Math.min(1, beatIndex / Math.max(1, totalBeats))) * 100);
  return (
    <div className="bg-gradient-to-br from-hive-cream to-white border border-hive-cream rounded-2xl p-5 sm:p-6 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-hive-grey">
            <Sparkles className="w-3.5 h-3.5 text-hive-orange" />
            {sectionLabel}
          </div>
          <h1 className="mt-1 text-xl sm:text-2xl font-extrabold text-hive-dark leading-tight">
            {title}
          </h1>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-medium text-hive-grey bg-white/80 px-2 py-1 rounded-full border border-hive-cream">
          <Clock className="w-3 h-3" /> {estMinutes} {t("common.minute")}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] text-hive-grey mb-1.5">
          <span>
            {t("a2ui.lessonHeaderStep")
              .replace("{{a}}", String(Math.min(beatIndex, totalBeats)))
              .replace("{{b}}", String(totalBeats))}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 bg-white rounded-full overflow-hidden border border-hive-cream">
          <div
            className="h-full bg-gradient-to-r from-hive-orange to-hive-amber transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

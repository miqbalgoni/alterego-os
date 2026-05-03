"use client";

import { Sparkle } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

interface Props {
  title?: string;
  body: string;
}

export function ExampleCallout({ title, body }: Props) {
  const { t } = useI18n();
  return (
    <article className="bg-hive-cream/50 border border-hive-cream rounded-2xl p-5 sm:p-6 animate-[fadeUp_400ms_ease-out]">
      <div className="flex items-center gap-2 text-hive-amber mb-2">
        <Sparkle className="w-4 h-4" />
        <span className="text-[11px] font-semibold uppercase tracking-wider">{t("a2ui.example")}</span>
      </div>
      {title && (
        <h3 className="text-base sm:text-lg font-bold text-hive-dark leading-snug">{title}</h3>
      )}
      <p className="mt-2 text-[15px] text-hive-dark/85 leading-relaxed whitespace-pre-line">
        {body}
      </p>
    </article>
  );
}

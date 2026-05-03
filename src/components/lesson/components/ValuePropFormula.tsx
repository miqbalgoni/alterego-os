"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

interface Props {
  moduleId: string;
  beatId: string;
  prefill?: Partial<Record<"target" | "problem" | "solution" | "result" | "competitors", string>>;
}

const FIELD_IDS: ("target" | "problem" | "solution" | "result" | "competitors")[] = [
  "target", "problem", "solution", "result", "competitors",
];

export function ValuePropFormula({ moduleId, beatId, prefill }: Props) {
  const { t } = useI18n();
  const [vals, setVals] = useState<Record<string, string>>(() => prefill ?? {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const FIELD_LABELS: Record<string, string> = {
    target: t("vp.target"),
    problem: t("vp.problem"),
    solution: t("vp.solution"),
    result: t("vp.result"),
    competitors: t("vp.competitors"),
  };
  const FIELD_SENTENCES: Record<string, string> = {
    target: t("vp.sentence.target"),
    problem: t("vp.sentence.problem"),
    solution: t("vp.sentence.solution"),
    result: t("vp.sentence.result"),
    competitors: t("vp.sentence.competitors"),
  };

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/lesson/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId,
          beatId,
          kind: "value-prop",
          outputs: vals,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2400);
    } finally {
      setSaving(false);
    }
  }

  const preview =
    `${t("vp.sentence.target")} ${vals.target || "[" + t("vp.target").toLowerCase() + "]"} ` +
    `${t("vp.sentence.problem")} ${vals.problem || "[" + t("vp.problem").toLowerCase() + "]"}, ` +
    `${t("vp.sentence.solution")} ${vals.solution || "[" + t("vp.solution").toLowerCase() + "]"} ` +
    `${t("vp.sentence.result")} ${vals.result || "[" + t("vp.result").toLowerCase() + "]"}, ` +
    `${t("vp.sentence.competitors")} ${vals.competitors || "[" + t("vp.competitors").toLowerCase() + "]"}.`;

  return (
    <article className="bg-white rounded-2xl border border-hive-cream shadow-soft p-5 sm:p-6 animate-[fadeUp_400ms_ease-out]">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-hive-orange">
          {t("a2ui.applyToStartup")}
        </span>
      </div>
      <h3 className="text-base sm:text-lg font-bold text-hive-dark leading-snug">
        {t("a2ui.valueProp")}
      </h3>

      <div className="mt-4 space-y-3">
        {FIELD_IDS.map(id => (
          <div key={id} className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="shrink-0 w-24 text-xs text-hive-grey font-semibold uppercase tracking-wide">
              {FIELD_SENTENCES[id]}
            </span>
            <input
              value={vals[id] ?? ""}
              onChange={e => setVals(prev => ({ ...prev, [id]: e.target.value }))}
              placeholder={FIELD_LABELS[id]}
              className="flex-1 rounded-lg border border-hive-cream bg-hive-cream/30 focus:bg-white focus:border-hive-orange focus:ring-0 text-sm px-3 py-2 transition"
            />
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl bg-hive-cream/50 border border-hive-cream p-4">
        <p className="text-[11px] uppercase tracking-wider text-hive-grey font-semibold mb-1">
          {t("a2ui.valueProp.preview")}
        </p>
        <p className="text-sm text-hive-dark leading-relaxed">{preview}</p>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-hive-orange px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-hive-amber transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? t("common.saving") : t("common.save")}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1 text-xs text-green-700">
            <Check className="w-4 h-4" /> {t("common.saved")}
          </span>
        )}
      </div>
    </article>
  );
}

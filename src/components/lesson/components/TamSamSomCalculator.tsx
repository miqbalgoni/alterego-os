"use client";

import { useMemo, useState } from "react";
import { Save, Check } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

interface Props {
  moduleId: string;
  beatId: string;
}

export function TamSamSomCalculator({ moduleId, beatId }: Props) {
  const { t } = useI18n();
  const [tam, setTam] = useState("");
  const [sam, setSam] = useState("");
  const [som, setSom] = useState("");
  const [assumptions, setAssumptions] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const samPct = useMemo(() => percent(sam, tam), [sam, tam]);
  const somPct = useMemo(() => percent(som, sam), [som, sam]);

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/lesson/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId,
          beatId,
          kind: "tam-sam-som",
          outputs: { tam, sam, som, assumptions },
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2400);
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="bg-white rounded-2xl border border-hive-cream shadow-soft p-5 sm:p-6 animate-[fadeUp_400ms_ease-out]">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-hive-orange">
          {t("a2ui.applyToStartup")}
        </span>
      </div>
      <h3 className="text-base sm:text-lg font-bold text-hive-dark leading-snug">
        {t("a2ui.tamSamSom")}
      </h3>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field label={t("a2ui.tamSamSom.tam")} value={tam} onChange={setTam} hint={t("a2ui.tamSamSom.totalMarket")} />
        <Field label={t("a2ui.tamSamSom.sam")} value={sam} onChange={setSam} hint={samPct ? `${samPct}% of TAM` : t("a2ui.tamSamSom.reachable")} />
        <Field label={t("a2ui.tamSamSom.som")} value={som} onChange={setSom} hint={somPct ? `${somPct}% of SAM` : t("a2ui.tamSamSom.year1Target")} />
      </div>

      <label className="block mt-4">
        <span className="text-xs text-hive-grey font-semibold uppercase tracking-wide">
          {t("a2ui.tamSamSom.assumptions")}
        </span>
        <textarea
          rows={3}
          value={assumptions}
          onChange={e => setAssumptions(e.target.value)}
          placeholder={t("a2ui.tamSamSom.assumptionsHelp")}
          className="mt-1 w-full rounded-lg border border-hive-cream bg-hive-cream/30 focus:bg-white focus:border-hive-orange focus:ring-0 text-sm p-2 transition resize-none"
        />
      </label>

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

function Field({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-hive-dark">{label}</span>
        {hint && <span className="text-[10px] text-hive-grey/70">{hint}</span>}
      </div>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        inputMode="numeric"
        placeholder="0"
        className="w-full rounded-lg border border-hive-cream bg-hive-cream/30 focus:bg-white focus:border-hive-orange focus:ring-0 text-sm px-3 py-2 transition"
      />
    </label>
  );
}

function percent(part: string, whole: string): string | null {
  const p = parseFloat(part.replace(/[^\d.]/g, ""));
  const w = parseFloat(whole.replace(/[^\d.]/g, ""));
  if (!isFinite(p) || !isFinite(w) || w <= 0) return null;
  return ((p / w) * 100).toFixed(1).replace(/\.0$/, "");
}

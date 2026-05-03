"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import type { LocaleKey } from "@/i18n/dictionaries";

type T = (key: LocaleKey) => string;

function bmcLabel(id: string, t: T): string {
  const map: Record<string, LocaleKey> = {
    customerSegments: "bmc.customerSegments",
    valuePropositions: "bmc.valuePropositions",
    channels: "bmc.channels",
    customerRelationships: "bmc.customerRelationships",
    revenueStreams: "bmc.revenueStreams",
    keyResources: "bmc.keyResources",
    keyActivities: "bmc.keyActivities",
    keyPartners: "bmc.keyPartners",
    costStructure: "bmc.costStructure",
  };
  return t(map[id] ?? "bmc.customerSegments");
}

function bmcHint(id: string, t: T): string {
  const map: Record<string, LocaleKey> = {
    customerSegments: "bmc.hint.customerSegments",
    valuePropositions: "bmc.hint.valuePropositions",
    channels: "bmc.hint.channels",
    customerRelationships: "bmc.hint.customerRelationships",
    revenueStreams: "bmc.hint.revenueStreams",
    keyResources: "bmc.hint.keyResources",
    keyActivities: "bmc.hint.keyActivities",
    keyPartners: "bmc.hint.keyPartners",
    costStructure: "bmc.hint.costStructure",
  };
  return t(map[id] ?? "bmc.hint.customerSegments");
}

interface Props {
  moduleId: string;
  beatId: string;
  prefill?: Record<string, string>;
}

const BLOCK_IDS: { id: string; side: "right" | "left" }[] = [
  { id: "customerSegments", side: "right" },
  { id: "valuePropositions", side: "right" },
  { id: "channels", side: "right" },
  { id: "customerRelationships", side: "right" },
  { id: "revenueStreams", side: "right" },
  { id: "keyResources", side: "left" },
  { id: "keyActivities", side: "left" },
  { id: "keyPartners", side: "left" },
  { id: "costStructure", side: "left" },
];

export function BmcMiniCanvas({ moduleId, beatId, prefill }: Props) {
  const { t } = useI18n();
  const [values, setValues] = useState<Record<string, string>>(() => prefill ?? {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const blocks = BLOCK_IDS.map(b => ({
    id: b.id,
    side: b.side,
    label: bmcLabel(b.id, t),
    hint: bmcHint(b.id, t),
  }));

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/lesson/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId,
          beatId,
          kind: "bmc",
          outputs: values,
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
        {t("a2ui.bmcTitle")}
      </h3>
      <p className="mt-1 text-xs text-hive-grey">{t("a2ui.bmcSubtitle")}</p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Right side */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-hive-grey">
            {t("a2ui.bmcRightSide")}
          </div>
          {blocks.filter(b => b.side === "right").map(b => (
            <Block
              key={b.id}
              label={b.label}
              hint={b.hint}
              placeholder={t("a2ui.bmcHypothesis")}
              value={values[b.id] ?? ""}
              onChange={v => setValues(prev => ({ ...prev, [b.id]: v }))}
            />
          ))}
        </div>
        {/* Left side */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-hive-grey">
            {t("a2ui.bmcLeftSide")}
          </div>
          {blocks.filter(b => b.side === "left").map(b => (
            <Block
              key={b.id}
              label={b.label}
              hint={b.hint}
              placeholder={t("a2ui.bmcHypothesis")}
              value={values[b.id] ?? ""}
              onChange={v => setValues(prev => ({ ...prev, [b.id]: v }))}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-hive-orange px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-hive-amber transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? t("common.saving") : t("a2ui.bmcSave")}
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

function Block({
  label,
  hint,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-hive-dark">{label}</span>
        <span className="text-[10px] text-hive-grey/70">{hint}</span>
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={2}
        className="w-full rounded-lg border border-hive-cream bg-hive-cream/30 focus:bg-white focus:border-hive-orange focus:ring-0 text-sm p-2 transition resize-none"
        placeholder={placeholder}
      />
    </label>
  );
}

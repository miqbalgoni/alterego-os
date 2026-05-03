"use client";

import { useState } from "react";
import { Save, Check, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

interface Props {
  moduleId: string;
  beatId: string;
  prompt: string;
  placeholder?: string;
}

export function ApplyToMyStartupForm({
  moduleId,
  beatId,
  prompt,
  placeholder,
}: Props) {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function save() {
    if (!text.trim()) return;
    setSaving(true);
    setFeedback(null);
    try {
      const r = await fetch("/api/lesson/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId,
          beatId,
          kind: "free-text",
          outputs: { response: text },
        }),
      });
      const data = await r.json();
      if (data?.feedback) setFeedback(data.feedback);
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
      <p className="text-[15px] text-hive-dark/85 leading-relaxed">{prompt}</p>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={5}
        placeholder={placeholder ?? t("a2ui.exerciseWritePrompt")}
        className="mt-4 w-full rounded-xl border border-hive-cream bg-hive-cream/30 focus:bg-white focus:border-hive-orange focus:ring-0 text-sm p-3 transition resize-none"
      />

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving || !text.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-hive-orange px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-hive-amber transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? t("common.saving") : t("a2ui.exerciseSubmit")}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1 text-xs text-green-700">
            <Check className="w-4 h-4" /> {t("common.saved")}
          </span>
        )}
      </div>

      {feedback && (
        <div className="mt-4 rounded-xl bg-hive-cream/50 border border-hive-cream p-4">
          <div className="flex items-center gap-2 text-hive-orange mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {t("a2ui.mentorFeedback")}
            </span>
          </div>
          <p className="text-sm text-hive-dark leading-relaxed">{feedback}</p>
        </div>
      )}
    </article>
  );
}

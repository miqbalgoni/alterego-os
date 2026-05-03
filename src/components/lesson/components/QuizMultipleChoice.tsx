"use client";

import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

interface Option {
  id: string;
  text: string;
}
interface Props {
  moduleId: string;
  beatId: string;
  question: string;
  options: Option[];
}

interface QuizResult {
  correct: boolean;
  feedback: string;
  correctOptionId?: string;
}

export function QuizMultipleChoice({ moduleId, beatId, question, options }: Props) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!selected || submitting) return;
    setSubmitting(true);
    try {
      const r = await fetch("/api/lesson/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, beatId, optionId: selected }),
      });
      const data = (await r.json()) as QuizResult;
      setResult(data);
    } catch {
      setResult({ correct: false, feedback: "Couldn't grade — try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="bg-white rounded-2xl border border-hive-cream shadow-soft p-5 sm:p-6 animate-[fadeUp_400ms_ease-out]">
      <div className="flex items-center gap-2 text-hive-orange mb-2">
        <HelpCircle className="w-4 h-4" />
        <span className="text-[11px] font-semibold uppercase tracking-wider">{t("a2ui.quickCheck")}</span>
      </div>
      <h3 className="text-base sm:text-lg font-bold text-hive-dark leading-snug">
        {question}
      </h3>

      <div className="mt-4 space-y-2">
        {options.map(opt => {
          const isPicked = selected === opt.id;
          const isCorrect = result?.correctOptionId === opt.id;
          const isWrongPick = result && isPicked && !result.correct;
          return (
            <button
              key={opt.id}
              disabled={!!result}
              onClick={() => setSelected(opt.id)}
              className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all
                ${
                  result
                    ? isCorrect
                      ? "border-green-300 bg-green-50 text-green-900"
                      : isWrongPick
                      ? "border-red-300 bg-red-50 text-red-900"
                      : "border-hive-cream text-hive-grey/70"
                    : isPicked
                    ? "border-hive-orange bg-hive-cream/40 text-hive-dark"
                    : "border-hive-cream hover:border-hive-orange/50 text-hive-dark"
                }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span>{opt.text}</span>
                {result && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />}
                {result && isWrongPick && <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>

      {result ? (
        <div
          className={`mt-4 rounded-xl p-4 text-sm leading-relaxed ${
            result.correct
              ? "bg-green-50 border border-green-100 text-green-900"
              : "bg-amber-50 border border-amber-100 text-amber-900"
          }`}
        >
          <p className="font-semibold mb-1">
            {result.correct ? t("a2ui.right") : t("a2ui.notQuite")}
          </p>
          <p>{result.feedback}</p>
        </div>
      ) : (
        <div className="mt-4">
          <button
            disabled={!selected || submitting}
            onClick={submit}
            className="inline-flex items-center gap-2 rounded-full bg-hive-orange px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-hive-amber transition disabled:opacity-50"
          >
            {submitting ? t("a2ui.checking") : t("a2ui.checkAnswer")}
          </button>
        </div>
      )}
    </article>
  );
}

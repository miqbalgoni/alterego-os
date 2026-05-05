"use client";
import { Question } from "@/lib/questions";
import clsx from "clsx";
import { Info } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

interface Props {
  q: Question;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

export function QuestionField({ q, value, onChange, error }: Props) {
  const { t } = useI18n();
  return (
    <div className="fade-up">
      <label className="flex items-start gap-2">
        <div className="flex-1">
          <div className="text-[15px] font-semibold text-hive-dark">
            {q.number != null && <span className="text-hive-orange mr-1">{q.number}.</span>}
            {q.label}
            {q.required && <span className="text-hive-orange ml-1">*</span>}
          </div>
          {q.help && (
            <div className="mt-1 flex items-start gap-1.5 text-xs text-hive-grey">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{q.help}</span>
            </div>
          )}
        </div>
      </label>

      <div className="mt-3">
        {renderInput(q, value, onChange, t("common.specify"))}
      </div>
      {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
    </div>
  );
}

function renderInput(
  q: Question,
  value: unknown,
  onChange: (v: unknown) => void,
  specifyPlaceholder: string,
) {
  switch (q.type) {
    case "text":
    case "email":
    case "tel":
      return (
        <input
          type={q.type}
          value={(value as string) ?? ""}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-xl border border-hive-cream bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-hive-orange/40 focus:border-hive-orange transition"
          placeholder={q.label}
        />
      );
    case "number":
      return (
        <input
          type="number"
          value={(value as string | number) ?? ""}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-xl border border-hive-cream bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-hive-orange/40 focus:border-hive-orange transition"
          placeholder="0"
        />
      );
    case "longtext":
      return (
        <textarea
          rows={3}
          value={(value as string) ?? ""}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-xl border border-hive-cream bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-hive-orange/40 focus:border-hive-orange transition"
          placeholder="Type here…"
        />
      );
    case "single":
      return (
        <div className="grid gap-2">
          {q.options?.map(opt => (
            <label
              key={opt}
              className={clsx(
                "flex items-center gap-3 rounded-xl border px-4 py-3.5 min-h-[48px] text-sm cursor-pointer transition active:scale-[0.99]",
                value === opt
                  ? "border-hive-orange bg-hive-cream/60 shadow-sm"
                  : "border-hive-cream bg-white hover:border-hive-orange/50 hover:bg-hive-cream/30"
              )}
            >
              <input
                type="radio"
                name={q.id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                className="accent-hive-orange w-4 h-4"
              />
              <span className="text-hive-dark flex-1">{opt}</span>
            </label>
          ))}
        </div>
      );
    case "multi": {
      const arr = Array.isArray(value) ? (value as string[]) : [];
      // Q30 ("Which tools have you used to validate your idea?") has an
      // "Other" option that should reveal an inline text input. The "Other"
      // entry is always the last option (true in EN and IT).
      const otherLabel =
        q.id === "q30" && q.options && q.options.length > 0
          ? q.options[q.options.length - 1]
          : null;
      const isOtherEntry = (s: string) =>
        !!otherLabel && (s === otherLabel || s.startsWith(`${otherLabel}:`));
      const otherEntry = otherLabel ? arr.find(isOtherEntry) : undefined;
      const otherChecked = !!otherEntry;
      const otherText =
        otherEntry && otherEntry.startsWith(`${otherLabel}:`)
          ? otherEntry.slice(otherLabel!.length + 1).trimStart()
          : "";

      const clamp = (next: string[]) =>
        q.maxSelect && next.length > q.maxSelect
          ? next.slice(next.length - q.maxSelect)
          : next;

      const toggle = (opt: string) => {
        if (otherLabel && opt === otherLabel) {
          if (otherChecked) {
            onChange(arr.filter(x => !isOtherEntry(x)));
          } else {
            onChange(clamp([...arr.filter(x => !isOtherEntry(x)), opt]));
          }
          return;
        }
        const has = arr.includes(opt);
        const next = has ? arr.filter(x => x !== opt) : [...arr, opt];
        onChange(clamp(next));
      };

      const setOtherText = (txt: string) => {
        const others = arr.filter(x => !isOtherEntry(x));
        const entry = txt.trim() ? `${otherLabel}: ${txt}` : otherLabel!;
        onChange(clamp([...others, entry]));
      };

      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {q.options?.map(opt => {
            const isOther = otherLabel === opt;
            const checked = isOther ? otherChecked : arr.includes(opt);
            const labelEl = (
              <label
                className={clsx(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 min-h-[48px] text-sm cursor-pointer transition active:scale-[0.99]",
                  isOther && checked ? "sm:flex-1" : "w-full",
                  checked
                    ? "border-hive-orange bg-hive-cream/60 shadow-sm"
                    : "border-hive-cream bg-white hover:border-hive-orange/50"
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(opt)}
                  className="accent-hive-orange w-4 h-4"
                />
                <span className="text-hive-dark flex-1">{opt}</span>
              </label>
            );
            if (isOther && checked) {
              return (
                <div
                  key={opt}
                  className="sm:col-span-2 flex flex-col sm:flex-row items-stretch gap-2"
                >
                  {labelEl}
                  <input
                    type="text"
                    value={otherText}
                    onChange={e => setOtherText(e.target.value)}
                    placeholder={specifyPlaceholder}
                    className="sm:flex-1 min-w-0 rounded-xl border border-hive-cream bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-hive-orange/40 focus:border-hive-orange transition"
                  />
                </div>
              );
            }
            return <div key={opt}>{labelEl}</div>;
          })}
        </div>
      );
    }
  }
}

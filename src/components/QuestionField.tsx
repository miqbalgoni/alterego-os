"use client";
import { Question } from "@/lib/questions";
import clsx from "clsx";
import { Info } from "lucide-react";

interface Props {
  q: Question;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

export function QuestionField({ q, value, onChange, error }: Props) {
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
        {renderInput(q, value, onChange)}
      </div>
      {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
    </div>
  );
}

function renderInput(q: Question, value: unknown, onChange: (v: unknown) => void) {
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
      const toggle = (opt: string) => {
        const has = arr.includes(opt);
        let next = has ? arr.filter(x => x !== opt) : [...arr, opt];
        if (q.maxSelect && next.length > q.maxSelect) {
          next = next.slice(next.length - q.maxSelect);
        }
        onChange(next);
      };
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {q.options?.map(opt => {
            const checked = arr.includes(opt);
            return (
              <label
                key={opt}
                className={clsx(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 min-h-[48px] text-sm cursor-pointer transition active:scale-[0.99]",
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
          })}
        </div>
      );
    }
  }
}

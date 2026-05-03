"use client";

import { Check, X } from "lucide-react";

interface Props {
  title?: string;
  leftLabel: string;
  rightLabel: string;
  leftTone?: "warn" | "neutral";
  rightTone?: "good" | "neutral";
  rows: { left: string; right: string }[];
  verdict?: string;
}

export function ComparisonTable({
  title,
  leftLabel,
  rightLabel,
  leftTone = "warn",
  rightTone = "good",
  rows,
  verdict,
}: Props) {
  const leftCls =
    leftTone === "warn"
      ? "bg-red-50 border-red-100 text-red-900"
      : "bg-hive-cream/50 border-hive-cream text-hive-dark";
  const rightCls =
    rightTone === "good"
      ? "bg-emerald-50 border-emerald-100 text-emerald-900"
      : "bg-hive-cream/50 border-hive-cream text-hive-dark";

  return (
    <article className="bg-white rounded-2xl border border-hive-cream shadow-soft p-5 sm:p-6 animate-[fadeUp_400ms_ease-out]">
      {title && (
        <h3 className="text-base sm:text-lg font-bold text-hive-dark leading-snug mb-3">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-2 gap-3">
        {/* Headers */}
        <div className={`rounded-xl border ${leftCls} px-3 py-2`}>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
            {leftTone === "warn" ? <X className="w-3.5 h-3.5" /> : null}
            {leftLabel}
          </div>
        </div>
        <div className={`rounded-xl border ${rightCls} px-3 py-2`}>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
            {rightTone === "good" ? <Check className="w-3.5 h-3.5" /> : null}
            {rightLabel}
          </div>
        </div>

        {/* Rows */}
        {rows.map((r, i) => (
          <div key={`row-${i}`} className="contents">
            <div className={`rounded-xl border ${leftCls} px-3 py-2.5 text-sm leading-snug`}>
              {r.left}
            </div>
            <div className={`rounded-xl border ${rightCls} px-3 py-2.5 text-sm leading-snug`}>
              {r.right}
            </div>
          </div>
        ))}
      </div>
      {verdict && (
        <p className="mt-4 text-center text-sm font-semibold text-hive-dark italic">
          {verdict}
        </p>
      )}
    </article>
  );
}

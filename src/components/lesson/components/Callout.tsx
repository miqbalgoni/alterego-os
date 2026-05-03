"use client";

import { Lightbulb, Heart, AlertTriangle, Sparkles, Quote } from "lucide-react";

type Variant = "insight" | "story" | "warning" | "protip" | "quote";

interface Props {
  variant: Variant;
  title?: string;
  body: string;
}

const STYLES: Record<
  Variant,
  {
    cls: string;
    iconCls: string;
    Icon: React.ComponentType<{ className?: string }>;
    eyebrow: string;
  }
> = {
  insight: {
    cls: "bg-amber-50 border-amber-200",
    iconCls: "text-amber-600",
    Icon: Lightbulb,
    eyebrow: "Insight",
  },
  story: {
    cls: "bg-rose-50 border-rose-200",
    iconCls: "text-rose-500",
    Icon: Heart,
    eyebrow: "Real story",
  },
  warning: {
    cls: "bg-red-50 border-red-200",
    iconCls: "text-red-600",
    Icon: AlertTriangle,
    eyebrow: "Common pitfall",
  },
  protip: {
    cls: "bg-emerald-50 border-emerald-200",
    iconCls: "text-emerald-600",
    Icon: Sparkles,
    eyebrow: "Pro tip",
  },
  quote: {
    cls: "bg-indigo-50 border-indigo-200",
    iconCls: "text-indigo-500",
    Icon: Quote,
    eyebrow: "Worth remembering",
  },
};

export function Callout({ variant, title, body }: Props) {
  const s = STYLES[variant] ?? STYLES.insight;
  const Icon = s.Icon;
  return (
    <article className={`rounded-2xl border ${s.cls} p-5 sm:p-6 animate-[fadeUp_400ms_ease-out]`}>
      <div className={`flex items-center gap-2 ${s.iconCls} mb-1.5`}>
        <Icon className="w-4 h-4" />
        <span className="text-[11px] font-bold uppercase tracking-wider">
          {s.eyebrow}
        </span>
      </div>
      {title && (
        <h3 className="text-base font-bold text-hive-dark mb-1 leading-snug">
          {title}
        </h3>
      )}
      <p className="text-[15px] text-hive-dark/85 leading-relaxed whitespace-pre-line">
        {body}
      </p>
    </article>
  );
}

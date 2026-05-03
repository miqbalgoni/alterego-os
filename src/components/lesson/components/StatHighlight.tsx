"use client";

interface Props {
  value: string;
  unit?: string;
  caption: string;
  source?: string;
}

export function StatHighlight({ value, unit, caption, source }: Props) {
  return (
    <article className="relative overflow-hidden bg-gradient-to-br from-hive-cream to-white rounded-2xl border border-hive-cream shadow-soft p-6 sm:p-7 animate-[fadeUp_400ms_ease-out] text-center">
      {/* faint background accent */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-hive-orange/10 blur-2xl" />
      <div className="relative">
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-hive-orange to-hive-amber bg-clip-text text-transparent">
            {value}
          </span>
          {unit && (
            <span className="text-base sm:text-lg font-semibold text-hive-grey">
              {unit}
            </span>
          )}
        </div>
        <p className="mt-3 text-sm sm:text-base text-hive-dark/85 leading-snug max-w-md mx-auto">
          {caption}
        </p>
        {source && (
          <p className="mt-2 text-[11px] text-hive-grey/70 italic">— {source}</p>
        )}
      </div>
    </article>
  );
}

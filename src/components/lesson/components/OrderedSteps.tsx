"use client";

interface Props {
  title?: string;
  steps: { title: string; body?: string }[];
}

export function OrderedSteps({ title, steps }: Props) {
  return (
    <article className="bg-white rounded-2xl border border-hive-cream shadow-soft p-5 sm:p-6 animate-[fadeUp_400ms_ease-out]">
      {title && (
        <h3 className="text-base sm:text-lg font-bold text-hive-dark leading-snug mb-3">
          {title}
        </h3>
      )}
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 group">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-hive-cream flex items-center justify-center font-bold text-hive-orange text-sm">
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className="absolute left-1/2 -translate-x-1/2 top-8 w-0.5 h-[calc(100%+8px)] bg-hive-cream" />
              )}
            </div>
            <div className="pb-2 flex-1 min-w-0">
              <p className="font-semibold text-hive-dark text-[15px] leading-snug">
                {s.title}
              </p>
              {s.body && (
                <p className="mt-1 text-sm text-hive-grey leading-relaxed">
                  {s.body}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}

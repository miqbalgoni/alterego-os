"use client";

interface Props {
  title?: string;
  items: { title: string; body: string }[];
}

export function PrincipleGrid({ title, items }: Props) {
  // Adapt grid columns based on item count
  const cols =
    items.length <= 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <article className="bg-white rounded-2xl border border-hive-cream shadow-soft p-5 sm:p-6 animate-[fadeUp_400ms_ease-out]">
      {title && (
        <h3 className="text-base sm:text-lg font-bold text-hive-dark leading-snug mb-3">
          {title}
        </h3>
      )}
      <div className={`grid ${cols} gap-3`}>
        {items.map((it, i) => (
          <div
            key={i}
            className="rounded-xl bg-hive-cream/40 border border-hive-cream p-4 hover:bg-hive-cream/70 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-md bg-hive-orange text-white flex items-center justify-center font-bold text-xs">
                {i + 1}
              </span>
              <h4 className="font-bold text-hive-dark text-sm leading-snug">
                {it.title}
              </h4>
            </div>
            <p className="text-sm text-hive-grey leading-relaxed">{it.body}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

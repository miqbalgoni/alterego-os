import { SECTIONS } from "@/lib/questions";
import clsx from "clsx";

export function ProgressBar({ current }: { current: string }) {
  const idx = SECTIONS.findIndex(s => s.id === current);
  const pct = ((idx + 1) / SECTIONS.length) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-medium text-hive-grey mb-2">
        <span>Step {idx + 1} of {SECTIONS.length}</span>
        <span>{Math.round(pct)}% complete</span>
      </div>
      <div className="w-full h-2 rounded-full bg-hive-cream overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-hive-orange to-hive-amber transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-3 hidden md:flex gap-1.5">
        {SECTIONS.map((s, i) => (
          <div
            key={s.id}
            className={clsx(
              "flex-1 h-1 rounded-full transition-colors",
              i <= idx ? "bg-hive-orange" : "bg-hive-cream"
            )}
            title={s.title}
          />
        ))}
      </div>
    </div>
  );
}

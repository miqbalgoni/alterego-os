"use client";

import { useState } from "react";
import { Check, Save } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

interface Item {
  id: string;
  label: string;
}
interface Props {
  title: string;
  items: Item[];
}

export function ChecklistInteractive({ title, items }: Props) {
  const { t } = useI18n();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const completed = Object.values(done).filter(Boolean).length;

  return (
    <article className="bg-white rounded-2xl border border-hive-cream shadow-soft p-5 sm:p-6 animate-[fadeUp_400ms_ease-out]">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-hive-orange">
          {t("a2ui.applyToStartup")}
        </span>
      </div>
      <h3 className="text-base sm:text-lg font-bold text-hive-dark leading-snug">
        {title}
      </h3>

      <ul className="mt-4 space-y-2">
        {items.map(it => (
          <li key={it.id}>
            <label className="flex items-start gap-3 cursor-pointer group">
              <span
                className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition
                ${
                  done[it.id]
                    ? "bg-hive-orange border-hive-orange"
                    : "border-hive-cream group-hover:border-hive-orange/50"
                }`}
              >
                {done[it.id] && <Check className="w-3 h-3 text-white" />}
              </span>
              <input
                type="checkbox"
                checked={!!done[it.id]}
                onChange={e => setDone(prev => ({ ...prev, [it.id]: e.target.checked }))}
                className="sr-only"
              />
              <span
                className={`text-sm leading-snug ${
                  done[it.id] ? "text-hive-grey line-through" : "text-hive-dark"
                }`}
              >
                {it.label}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-hive-grey">
        {t("a2ui.checklistDone")
          .replace("{{a}}", String(completed))
          .replace("{{b}}", String(items.length))}
      </p>
    </article>
  );
}

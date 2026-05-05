"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useI18n } from "@/i18n/I18nProvider";
import { getSectionLongLabel } from "@/i18n/getters";

const STEPS = Array.from({ length: 9 }, (_, i) => i + 1);

export function IRLNavStrip() {
  const pathname = usePathname() ?? "";
  const { locale } = useI18n();

  // Match /onboarding/irl/<N> and /onboarding/irl/<N>/...  (e.g., /result)
  const match = pathname.match(/\/onboarding\/irl\/(\d+)(?:\/|$)/);
  const activeNum = match ? parseInt(match[1], 10) : null;

  return (
    <nav
      aria-label="IRL sections"
      className="flex items-center justify-center gap-0.5 sm:gap-1 overflow-x-auto px-2 py-0.5"
    >
      {STEPS.map((n, idx) => {
        const isActive = activeNum === n;
        const sectionId = `irl-${n}`;
        const label = getSectionLongLabel(sectionId, locale);
        return (
          <div key={n} className="flex items-center gap-0.5 sm:gap-1">
            <Link
              href={`/onboarding/irl/${n}`}
              title={label}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className={clsx(
                "inline-flex items-center justify-center shrink-0 rounded-full text-[10px] sm:text-[11px] font-bold transition-all",
                "w-5 h-5 sm:w-6 sm:h-6 border",
                isActive
                  ? "bg-hive-orange text-white border-hive-orange shadow-soft"
                  : "bg-white text-hive-grey border-hive-cream hover:border-hive-orange hover:text-hive-orange"
              )}
            >
              {n}
            </Link>
            {idx < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className="text-hive-cream/80 text-[9px] select-none"
              >
                ›
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

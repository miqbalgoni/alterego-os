"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useI18n } from "@/i18n/I18nProvider";
import { getSectionLongLabel } from "@/i18n/getters";
import type { LocaleKey } from "@/i18n/dictionaries";

interface Step {
  key: string;          // unique key for matching active state
  pill: string;         // text shown inside the pill
  href: string;
  labelKey: LocaleKey;  // tooltip / aria-label
}

const STEPS: Step[] = [
  { key: "personal", pill: "P", href: "/onboarding/personal", labelKey: "section.personal" },
  { key: "0",        pill: "0", href: "/onboarding/irl/0",     labelKey: "irl.long.0" },
  { key: "1",        pill: "1", href: "/onboarding/irl/1",     labelKey: "irl.long.1" },
  { key: "2",        pill: "2", href: "/onboarding/irl/2",     labelKey: "irl.long.2" },
  { key: "3",        pill: "3", href: "/onboarding/irl/3",     labelKey: "irl.long.3" },
  { key: "4",        pill: "4", href: "/onboarding/irl/4",     labelKey: "irl.long.4" },
  { key: "5",        pill: "5", href: "/onboarding/irl/5",     labelKey: "irl.long.5" },
  { key: "6",        pill: "6", href: "/onboarding/irl/6",     labelKey: "irl.long.6" },
  { key: "7",        pill: "7", href: "/onboarding/irl/7",     labelKey: "irl.long.7" },
  { key: "8",        pill: "8", href: "/onboarding/irl/8",     labelKey: "irl.long.8" },
  { key: "9",        pill: "9", href: "/onboarding/irl/9",     labelKey: "irl.long.9" },
];

export function IRLNavStrip() {
  const pathname = usePathname() ?? "";
  const { t } = useI18n();

  let activeKey: string | null = null;
  if (pathname.startsWith("/onboarding/personal")) {
    activeKey = "personal";
  } else {
    const m = pathname.match(/\/onboarding\/irl\/(\d+)(?:\/|$)/);
    if (m) activeKey = m[1];
  }

  return (
    <nav
      aria-label="Sections"
      className="flex items-center justify-center gap-0.5 sm:gap-1 overflow-x-auto px-2 py-0.5"
    >
      {STEPS.map((s, idx) => {
        const isActive = activeKey === s.key;
        const label = t(s.labelKey);
        return (
          <div key={s.key} className="flex items-center gap-0.5 sm:gap-1">
            <Link
              href={s.href}
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
              {s.pill}
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

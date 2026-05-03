"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Check } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { DICTIONARIES, LOCALE_LABELS } from "@/i18n/dictionaries";
import clsx from "clsx";

type Locale = keyof typeof DICTIONARIES;

export function LanguageMenu() {
  const { locale, setLocale, t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 rounded-full border border-hive-cream bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-hive-dark hover:border-hive-orange/60 hover:bg-hive-cream/40 transition"
        aria-label={t("header.language")}
      >
        <Globe className="w-4 h-4 text-hive-orange" />
        <span className="hidden sm:inline">{LOCALE_LABELS[locale]}</span>
        <span className="sm:hidden uppercase">{locale}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-hive-cream bg-white shadow-lg overflow-hidden">
          {(Object.keys(DICTIONARIES) as Locale[]).map(l => (
            <button
              key={l}
              type="button"
              onClick={async () => {
                await setLocale(l);
                setOpen(false);
                // Hard refresh — guarantees every server component, every
                // API-rendered string, every cached page re-runs with the
                // new cookie. Anything less leaves stale English in the UI.
                if (typeof window !== "undefined") {
                  window.location.reload();
                } else {
                  router.refresh();
                }
              }}
              className={clsx(
                "flex w-full items-center justify-between px-4 py-2.5 text-sm hover:bg-hive-cream/50 transition",
                locale === l ? "text-hive-orange font-semibold" : "text-hive-dark"
              )}
            >
              {LOCALE_LABELS[l]}
              {locale === l && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

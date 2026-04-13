"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { DICTIONARIES, type LocaleKey } from "./dictionaries";

type Locale = keyof typeof DICTIONARIES;

interface I18nCtx {
  locale: Locale;
  setLocale: (l: Locale) => Promise<void>;
  t: (key: LocaleKey) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback(async (l: Locale) => {
    setLocaleState(l);
    try {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: l }),
      });
    } catch {
      // non-fatal — locale still applied client-side for this tab
    }
  }, []);

  const t = useCallback(
    (key: LocaleKey) => DICTIONARIES[locale][key] ?? DICTIONARIES.en[key] ?? key,
    [locale]
  );

  return <Ctx.Provider value={{ locale, setLocale, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

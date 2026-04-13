"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { LanguageMenu } from "./LanguageMenu";
import { ProfileMenu } from "./ProfileMenu";

interface Props {
  fullName: string | null;
  email: string;
}

export function AppHeader({ fullName, email }: Props) {
  const { t } = useI18n();
  const firstName = (fullName?.trim().split(/\s+/)[0]) || email.split("@")[0];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-hive-cream/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-baseline gap-2">
          <span
            className="italic text-hive-grey text-base sm:text-lg"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("header.welcome")},
          </span>
          <span className="font-semibold text-hive-orange text-base sm:text-lg tracking-wide">
            {firstName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageMenu />
          <ProfileMenu email={email} fullName={fullName} />
        </div>
      </div>
    </header>
  );
}

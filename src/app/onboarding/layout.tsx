import { redirect } from "next/navigation";
import { getCurrentUser, getLocaleFromCookies } from "@/lib/auth";
import { I18nProvider } from "@/i18n/I18nProvider";
import { AppHeader } from "@/components/AppHeader";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const locale = getLocaleFromCookies();

  return (
    <I18nProvider initialLocale={locale}>
      <AppHeader fullName={user.fullName} email={user.email} />
      {children}
    </I18nProvider>
  );
}

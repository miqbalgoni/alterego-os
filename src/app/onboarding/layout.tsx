import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/AppHeader";
import { ScrollToTopOnRouteChange } from "@/components/ScrollToTopOnRouteChange";

// I18nProvider lives in the ROOT layout so landing / login / etc. can use t()
// too. This layout only handles auth + the onboarding header chrome.
export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <>
      <ScrollToTopOnRouteChange />
      <AppHeader fullName={user.fullName} email={user.email} />
      {children}
    </>
  );
}

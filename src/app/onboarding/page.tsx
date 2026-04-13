import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { loadResumeState, upsertAnswer, updateSessionStep } from "@/lib/session";

export default async function OnboardingEntry() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const state = await loadResumeState(user.email);
  await upsertAnswer(state.userId, "p_email", state.email);
  await updateSessionStep(state.userId, state.currentStep);

  if (state.submitted) redirect("/onboarding/thank-you");
  const step = state.currentStep ?? "personal";
  if (step === "personal") redirect("/onboarding/personal");
  if (step === "review") redirect("/onboarding/review");
  redirect(`/onboarding/irl/${step.replace("irl-", "")}`);
}

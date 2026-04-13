"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionField } from "./QuestionField";
import { ProgressBar } from "./ProgressBar";
import { HiveLogo } from "./HiveLogo";
import { ArrowLeft, ArrowRight, Save, Check } from "lucide-react";
import type { IRLSection, Question } from "@/lib/questions";

interface Props {
  section: IRLSection;
  questions: Question[];
  prevSection: string | null;
  nextSection: string | null;
}

export function SectionForm({ section, questions, prevSection, nextSection }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savingMap, setSavingMap] = useState<Record<string, "idle" | "saving" | "saved">>({});
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Hydrate values from server. Identity comes from the auth cookie.
  useEffect(() => {
    fetch("/api/session", { method: "POST" })
      .then(async r => {
        if (r.status === 401) {
          router.replace("/login");
          return null;
        }
        return r.json();
      })
      .then(data => {
        if (data?.answers) setValues(data.answers);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const required = useMemo(() => questions.filter(q => q.required), [questions]);

  function updateValue(q: Question, value: unknown) {
    setValues(prev => ({ ...prev, [q.id]: value }));
    setErrors(prev => ({ ...prev, [q.id]: "" }));

    clearTimeout(debounceRef.current[q.id]);
    setSavingMap(m => ({ ...m, [q.id]: "saving" }));
    debounceRef.current[q.id] = setTimeout(async () => {
      try {
        await fetch("/api/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId: q.id, value }),
        });
        setSavingMap(m => ({ ...m, [q.id]: "saved" }));
        setTimeout(() => setSavingMap(m => ({ ...m, [q.id]: "idle" })), 1200);
      } catch {
        setSavingMap(m => ({ ...m, [q.id]: "idle" }));
      }
    }, 400);
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    for (const q of required) {
      const v = values[q.id];
      const empty =
        v === undefined ||
        v === null ||
        (typeof v === "string" && v.trim() === "") ||
        (Array.isArray(v) && v.length === 0);
      if (empty) next[q.id] = "This field is required.";
      if (q.type === "multi" && Array.isArray(v)) {
        if (q.minSelect && v.length < q.minSelect)
          next[q.id] = `Please select at least ${q.minSelect}.`;
        if (q.maxSelect && v.length > q.maxSelect)
          next[q.id] = `Please select at most ${q.maxSelect}.`;
      }
      if (q.type === "email" && typeof v === "string" && v && !/.+@.+\..+/.test(v)) {
        next[q.id] = "Enter a valid email address.";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function goNext() {
    if (!validate()) {
      // Scroll to first error
      const first = Object.keys(errors)[0] ?? required.find(q => !values[q.id])?.id;
      if (first) {
        const el = document.getElementById(`q_${first}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    if (nextSection) router.push(`/onboarding/irl/${nextSection.replace("irl-", "")}`);
    else router.push("/onboarding/review");
  }

  function goPrev() {
    if (!prevSection) { router.push("/onboarding"); return; }
    if (prevSection === "personal") router.push("/onboarding/personal");
    else router.push(`/onboarding/irl/${prevSection.replace("irl-", "")}`);
  }

  function saveAndExit() {
    alert("Your progress is saved. Log back in any time to resume right where you left off.");
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-hive-grey">
        Loading your session…
      </div>
    );
  }

  // Route IRL sections: nextSection is "irl-N" etc.; convert for personal -> "irl/1"
  const nextHref =
    nextSection === null
      ? "/onboarding/review"
      : nextSection === "personal"
      ? "/onboarding/personal"
      : `/onboarding/irl/${nextSection.replace("irl-", "")}`;

  return (
    <main className="min-h-[100dvh] px-3 sm:px-4 pt-6 sm:pt-10 pb-36 sm:pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-5 sm:mb-6">
          <HiveLogo size={48} />
        </div>

        <div className="mb-6 sm:mb-8">
          <ProgressBar current={section.id} />
        </div>

        <div className="bg-white/85 backdrop-blur rounded-2xl sm:rounded-3xl shadow-soft border border-hive-cream p-5 sm:p-8 md:p-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-hive-dark leading-tight">
            {section.title}
          </h1>
          {section.subtitle && (
            <p className="mt-2 text-sm text-hive-grey">{section.subtitle}</p>
          )}

          <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-7">
            {questions.map(q => (
              <div id={`q_${q.id}`} key={q.id}>
                <QuestionField
                  q={q}
                  value={values[q.id]}
                  onChange={v => updateValue(q, v)}
                  error={errors[q.id]}
                />
                {savingMap[q.id] === "saved" && (
                  <div className="mt-1 text-[11px] text-green-600 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Saved
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop action bar (inline) */}
          <div className="mt-10 hidden sm:flex flex-row gap-3 justify-between">
            <button
              onClick={goPrev}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-hive-cream px-5 py-3 text-sm font-semibold text-hive-grey hover:bg-hive-cream/40 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex flex-row gap-3">
              <button
                onClick={saveAndExit}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-hive-orange/50 px-5 py-3 text-sm font-semibold text-hive-amber hover:bg-hive-cream/40 transition"
              >
                <Save className="w-4 h-4" /> Save & Visit Later
              </button>
              <button
                onClick={goNext}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-hive-orange px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-hive-amber transition"
              >
                {nextSection ? "Next" : "Review Responses"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-hive-grey/70 px-4">
          Your answers are saved automatically as you type.
        </p>
      </div>

      {/* Mobile sticky action bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-hive-cream safe-pb px-3 pt-3">
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            aria-label="Back"
            className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full border border-hive-cream text-hive-grey active:scale-95 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={saveAndExit}
            className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full border border-hive-orange/50 px-3 h-12 text-xs font-semibold text-hive-amber active:scale-95 transition"
          >
            <Save className="w-4 h-4" /> Save
          </button>
          <button
            onClick={goNext}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-hive-orange h-12 px-4 text-sm font-semibold text-white shadow-soft active:scale-95 transition"
          >
            {nextSection ? "Next" : "Review"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </main>
  );
}

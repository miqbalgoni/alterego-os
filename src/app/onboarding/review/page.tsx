"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HiveLogo } from "@/components/HiveLogo";
import { SECTIONS, QUESTION_BY_ID } from "@/lib/questions";
import { ArrowLeft, CheckCircle2, Edit2 } from "lucide-react";

interface SessionData {
  userId: string;
  email: string;
  answers: Record<string, unknown>;
}

export default function ReviewPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
        if (data) {
          setSession({
            userId: data.userId,
            email: data.email,
            answers: data.answers,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function onSubmit() {
    if (!session) return;
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/submit", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        if (data?.missing?.length) {
          setError(
            `Please complete ${data.missing.length} required field(s) before submitting.`
          );
        } else {
          setError(data?.error ?? "Submit failed");
        }
        return;
      }
      router.push("/onboarding/thank-you");
    } catch {
      setError("Submit failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function editSection(id: string) {
    if (id === "personal") router.push("/onboarding/personal");
    else router.push(`/onboarding/irl/${id.replace("irl-", "")}`);
  }

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-hive-grey">
        Loading your responses…
      </div>
    );
  }

  return (
    <main className="min-h-[100dvh] px-3 sm:px-4 pt-6 sm:pt-10 pb-36 sm:pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-5 sm:mb-6"><HiveLogo size={48} /></div>

        <div className="bg-white/85 backdrop-blur rounded-2xl sm:rounded-3xl shadow-soft border border-hive-cream p-5 sm:p-8 md:p-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-hive-dark leading-tight">
            Review your responses
          </h1>
          <p className="mt-2 text-sm text-hive-grey">
            Confirm everything looks right. Tap <b>Edit</b> on any section to jump back.
          </p>

          <div className="mt-6 sm:mt-8 space-y-7 sm:space-y-8 sm:max-h-[65vh] sm:overflow-y-auto sm:pr-2">
            {SECTIONS.map(s => (
              <div key={s.id} className="border-b border-hive-cream pb-5 sm:pb-6 last:border-0">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base sm:text-lg font-bold text-hive-dark leading-tight">{s.title}</h2>
                  <button
                    onClick={() => editSection(s.id)}
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-hive-amber hover:underline active:scale-95"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                </div>
                <dl className="mt-4 space-y-3">
                  {s.questionIds.map(qid => {
                    const q = QUESTION_BY_ID[qid];
                    if (!q) return null;
                    const v = session.answers[qid];
                    return (
                      <div key={qid} className="text-sm">
                        <dt className="font-medium text-hive-grey">
                          {q.number != null && <span className="text-hive-orange mr-1">{q.number}.</span>}
                          {q.label}
                        </dt>
                        <dd className="mt-0.5 text-hive-dark break-words">
                          {formatValue(v)}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            ))}
          </div>

          {error && <div className="mt-6 text-sm text-red-600">{error}</div>}

          {/* Desktop action row */}
          <div className="mt-8 hidden sm:flex flex-row gap-3 justify-between">
            <button
              onClick={() => router.push("/onboarding/irl/9")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-hive-cream px-5 py-3 text-sm font-semibold text-hive-grey hover:bg-hive-cream/40 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-hive-orange px-8 py-3.5 text-sm font-semibold text-white shadow-soft hover:bg-hive-amber transition disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-hive-cream safe-pb px-3 pt-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/onboarding/irl/9")}
            aria-label="Back"
            className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full border border-hive-cream text-hive-grey active:scale-95 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-hive-orange h-12 px-4 text-sm font-semibold text-white shadow-soft active:scale-95 transition disabled:opacity-60"
          >
            <CheckCircle2 className="w-4 h-4" />
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </div>
    </main>
  );
}

function formatValue(v: unknown): string {
  if (v === undefined || v === null || v === "") return "— not answered —";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "— not answered —";
  return String(v);
}

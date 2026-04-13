"use client";

import Link from "next/link";
import { useEffect } from "react";
import { HiveLogo } from "@/components/HiveLogo";
import { CheckCircle2, Home } from "lucide-react";

export default function ThankYouPage() {
  useEffect(() => {
    // Optional: clear local session so a fresh start begins cleanly
    // localStorage.removeItem("alterego_session");
  }, []);

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-5 py-10 sm:py-12 text-center">
      <HiveLogo size={60} />

      <div className="mt-8 sm:mt-10 w-full max-w-xl bg-white/85 backdrop-blur rounded-2xl sm:rounded-3xl shadow-soft border border-hive-cream p-7 sm:p-10 fade-up">
        <div className="mx-auto w-16 h-16 rounded-full bg-hive-cream flex items-center justify-center pulse-glow">
          <CheckCircle2 className="w-9 h-9 text-hive-orange" />
        </div>

        <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-hive-dark">
          Thank you!
        </h1>
        <p className="mt-3 text-base text-hive-grey">
          Your ALTEREGO OS check-in has been submitted successfully.
        </p>
        <p className="mt-2 text-sm text-hive-grey">
          Our team will review your responses and get in touch soon with the next steps
          of your entrepreneurial journey.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-hive-orange px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-hive-amber transition"
        >
          <Home className="w-4 h-4" /> Back to home
        </Link>
      </div>
    </main>
  );
}

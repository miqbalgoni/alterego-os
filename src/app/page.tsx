import Link from "next/link";
import { HiveLogo } from "@/components/HiveLogo";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-5 py-10 sm:py-12">
      <header className="w-full max-w-5xl flex justify-center pt-2 sm:pt-4">
        <HiveLogo size={72} />
      </header>

      <section className="flex-1 w-full max-w-3xl flex flex-col items-center justify-center text-center mt-8 sm:mt-10 fade-up">
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-hive-dark leading-tight whitespace-nowrap">
          <span className="italic font-medium tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
            Welcome to
          </span>{" "}
          <span className="text-hive-orange">ALTEREGO OS</span>
        </h1>
        <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-hive-grey max-w-2xl">
          The check-in for your entrepreneurial future.
        </p>
        <p
          className="mt-3 text-base sm:text-lg md:text-xl text-hive-grey/90 max-w-2xl leading-relaxed italic"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Help us understand who you are, which stage you're in, and how we can best
          support you with tailored mentoring, training, financing and investments.
        </p>

        <Link
          href="/login"
          className="mt-8 sm:mt-10 group relative inline-flex items-center gap-3 rounded-full bg-hive-orange px-7 sm:px-8 py-4 text-base md:text-lg font-semibold text-white shadow-soft hover:bg-hive-amber active:scale-95 transition-all pulse-glow w-full max-w-xs sm:w-auto sm:max-w-none justify-center"
        >
          Start Your Journey
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>

        <p className="mt-4 text-[11px] sm:text-xs text-hive-grey/70 px-4">
          Takes ~15 minutes · Your progress is saved automatically
        </p>
      </section>

      <footer className="w-full max-w-5xl text-center text-[11px] sm:text-xs text-hive-grey/60 pt-8 sm:pt-10 safe-pb">
        © {new Date().getFullYear()} HIVE Business Accelerator · ALTEREGO OS
      </footer>
    </main>
  );
}

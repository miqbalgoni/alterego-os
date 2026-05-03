"use client";

import { Sparkles } from "lucide-react";
import { DIAGRAMS } from "./diagrams";
import type { DiagramName } from "@/lib/a2ui/types";

interface Props {
  eyebrow: string;
  title: string;
  hook: string;
  diagram?: DiagramName;
}

export function DeepDiveIntro({ eyebrow, title, hook, diagram }: Props) {
  const Diagram = diagram ? DIAGRAMS[diagram] : null;
  return (
    <article className="relative overflow-hidden rounded-3xl border border-hive-cream shadow-soft animate-[fadeUp_400ms_ease-out]">
      {/* deeper gradient: charcoal at the top-left fading into hive-orange so
          the white title sits on a darker, higher-contrast field */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2A2A2A] via-hive-amber to-hive-orange" />
      {/* subtle dot texture */}
      <div
        className="absolute inset-0 opacity-25 mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 22% 28%, rgba(255,255,255,0.5) 1px, transparent 1.5px), radial-gradient(circle at 72% 64%, rgba(255,255,255,0.3) 1px, transparent 1.5px)",
          backgroundSize: "26px 26px, 38px 38px",
        }}
      />
      {/* depth blur blobs */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/15 blur-3xl" />
      <div className="absolute -bottom-14 -left-10 w-44 h-44 rounded-full bg-black/20 blur-3xl" />
      {/* horizontal vignette to anchor the text */}
      <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/35 to-transparent" />

      <div className="relative p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4 items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/95 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
            <Sparkles className="w-3.5 h-3.5" />
            {eyebrow}
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white leading-[1.1] tracking-tight [text-shadow:0_2px_8px_rgba(0,0,0,0.35)]">
            {title}
          </h2>
          <p className="mt-3 text-[15px] sm:text-base text-white leading-relaxed [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">
            {hook}
          </p>
        </div>
        {Diagram && (
          <div className="hidden sm:block bg-white/95 rounded-2xl p-2 shadow-2xl ring-1 ring-black/5">
            <Diagram />
          </div>
        )}
      </div>
    </article>
  );
}

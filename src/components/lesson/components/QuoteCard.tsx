"use client";

import { Quote } from "lucide-react";

interface Props {
  quote: string;
  attribution?: string;
}

export function QuoteCard({ quote, attribution }: Props) {
  return (
    <article className="relative bg-white rounded-2xl border border-hive-cream shadow-soft p-6 sm:p-7 animate-[fadeUp_400ms_ease-out]">
      <Quote className="absolute -top-3 left-5 w-7 h-7 text-hive-orange bg-white rounded-full p-1 border border-hive-cream" />
      <blockquote className="text-lg sm:text-xl font-semibold text-hive-dark leading-snug italic">
        “{quote}”
      </blockquote>
      {attribution && (
        <p className="mt-4 text-xs uppercase tracking-wider text-hive-grey font-semibold">
          — {attribution}
        </p>
      )}
    </article>
  );
}

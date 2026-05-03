"use client";

import { DIAGRAMS } from "./diagrams";
import type { DiagramName } from "@/lib/a2ui/types";

interface Props {
  name: DiagramName;
  caption?: string;
}

export function IllustratedDiagram({ name, caption }: Props) {
  const Diagram = DIAGRAMS[name];
  if (!Diagram) return null;
  return (
    <article className="bg-white rounded-2xl border border-hive-cream shadow-soft p-5 sm:p-6 animate-[fadeUp_400ms_ease-out]">
      <div className="max-w-md mx-auto">
        <Diagram />
      </div>
      {caption && (
        <p className="mt-3 text-center text-xs text-hive-grey leading-relaxed">
          {caption}
        </p>
      )}
    </article>
  );
}

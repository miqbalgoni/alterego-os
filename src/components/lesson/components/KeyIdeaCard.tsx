"use client";

import { Lightbulb, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useState, lazy, Suspense } from "react";
import { useI18n } from "@/i18n/I18nProvider";

// We avoid an import cycle (A2UIRenderer -> KeyIdeaCard -> A2UIRenderer) by
// dynamically importing the renderer when the deep dive is opened.
const A2UIRenderer = lazy(() =>
  import("../A2UIRenderer").then(m => ({ default: m.A2UIRenderer }))
);

interface Props {
  title: string;
  body: string;
  citation?: string;
  // moduleId/beatId are injected by the renderer when the card is created
  // server-side via builder.ts. They're optional to stay backward-compatible.
  moduleId?: string;
  beatId?: string;
}

export function KeyIdeaCard({ title, body, citation, moduleId, beatId }: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const canDeepDive = !!moduleId && !!beatId;
  const surfaceId = `deep-${moduleId}-${beatId}`;

  function toggle() {
    if (!hasOpened) setHasOpened(true);
    setOpen(o => !o);
  }

  return (
    <article className="bg-white rounded-2xl border border-hive-cream shadow-soft p-5 sm:p-6 animate-[fadeUp_400ms_ease-out]">
      <div className="flex items-center gap-2 text-hive-orange mb-2">
        <Lightbulb className="w-4 h-4" />
        <span className="text-[11px] font-semibold uppercase tracking-wider">{t("a2ui.keyIdea")}</span>
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-hive-dark leading-snug">
        {title}
      </h2>
      <p className="mt-3 text-[15px] text-hive-dark/85 leading-relaxed whitespace-pre-line">
        {body}
      </p>
      {citation && (
        <p className="mt-4 text-[11px] text-hive-grey/70 italic">— {citation}</p>
      )}

      {canDeepDive && (
        <div className="mt-5 pt-4 border-t border-hive-cream/70">
          <button
            onClick={toggle}
            className="group inline-flex items-center gap-2 rounded-full border border-hive-orange/40 bg-gradient-to-r from-hive-cream/70 to-white px-4 py-2 text-sm font-semibold text-hive-amber hover:bg-hive-cream/90 hover:border-hive-orange transition-all"
            aria-expanded={open}
          >
            <Sparkles className="w-4 h-4 text-hive-orange group-hover:scale-110 transition-transform" />
            {open ? t("a2ui.deepDive.close") : hasOpened ? t("a2ui.deepDive.reopen") : t("a2ui.deepDive.go")}
            {open ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Once first opened, the renderer stays mounted; we just hide it
              on close so re-opening is instant and no fresh request is made. */}
          {hasOpened && (
            <div
              className={`mt-5 space-y-4 ${
                open ? "animate-[fadeUp_350ms_ease-out]" : "hidden"
              }`}
            >
              <Suspense
                fallback={
                  <div className="text-xs text-hive-grey/70 px-2 py-1 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-hive-orange animate-pulse" />
                    {t("a2ui.deepDive.crafting")}
                  </div>
                }
              >
                <A2UIRenderer
                  streamUrl={`/api/lesson/deep-dive?moduleId=${encodeURIComponent(
                    moduleId!
                  )}&beatId=${encodeURIComponent(beatId!)}`}
                  surfaceId={surfaceId}
                />
              </Suspense>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

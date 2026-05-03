"use client";

// Client-side A2UI renderer. Maintains a list of trusted components per
// surface and re-renders as messages arrive. The catalog is closed: Claude
// can only request these by `type`, never raw HTML.

import { useEffect, useReducer, useState } from "react";
import type {
  A2UIMessage,
  Component as A2UIComponent,
} from "@/lib/a2ui/types";
import { useI18n } from "@/i18n/I18nProvider";

import { LessonHeader } from "./components/LessonHeader";
import { KeyIdeaCard } from "./components/KeyIdeaCard";
import { ExampleCallout } from "./components/ExampleCallout";
import { QuizMultipleChoice } from "./components/QuizMultipleChoice";
import { ChecklistInteractive } from "./components/ChecklistInteractive";
import { BmcMiniCanvas } from "./components/BmcMiniCanvas";
import { ValuePropFormula } from "./components/ValuePropFormula";
import { TamSamSomCalculator } from "./components/TamSamSomCalculator";
import { ApplyToMyStartupForm } from "./components/ApplyToMyStartupForm";
import { OutroCard } from "./components/OutroCard";
import { DeepDiveIntro } from "./components/DeepDiveIntro";
import { Callout } from "./components/Callout";
import { IllustratedDiagram } from "./components/IllustratedDiagram";
import { OrderedSteps } from "./components/OrderedSteps";
import { ComparisonTable } from "./components/ComparisonTable";
import { StatHighlight } from "./components/StatHighlight";
import { QuoteCard } from "./components/QuoteCard";
import { PrincipleGrid } from "./components/PrincipleGrid";

interface State {
  // surfaceId -> ordered list of component instances
  surfaces: Record<string, A2UIComponent[]>;
  complete: boolean;
}

type Action =
  | { type: "createSurface"; surfaceId: string }
  | { type: "addComponent"; surfaceId: string; component: A2UIComponent }
  | { type: "patchComponent"; surfaceId: string; id: string; props: Record<string, unknown> }
  | { type: "complete" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "createSurface":
      return {
        ...state,
        surfaces: { ...state.surfaces, [action.surfaceId]: state.surfaces[action.surfaceId] ?? [] },
      };
    case "addComponent": {
      const list = state.surfaces[action.surfaceId] ?? [];
      // Replace by id if present, else append. Lets builder upsert.
      const existingIdx = list.findIndex(c => c.id === action.component.id);
      const next =
        existingIdx >= 0
          ? list.map((c, i) => (i === existingIdx ? action.component : c))
          : [...list, action.component];
      return { ...state, surfaces: { ...state.surfaces, [action.surfaceId]: next } };
    }
    case "patchComponent": {
      const list = state.surfaces[action.surfaceId] ?? [];
      const next = list.map(c =>
        c.id === action.id
          ? ({ ...c, props: { ...c.props, ...action.props } } as A2UIComponent)
          : c
      );
      return { ...state, surfaces: { ...state.surfaces, [action.surfaceId]: next } };
    }
    case "complete":
      return { ...state, complete: true };
  }
}

interface Props {
  // Stream URL — must return newline-delimited JSON, one A2UIMessage per line.
  streamUrl: string;
  surfaceId: string;
}

export function A2UIRenderer({ streamUrl, surfaceId }: Props) {
  const { t } = useI18n();
  const [state, dispatch] = useReducer(reducer, {
    surfaces: {},
    complete: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(streamUrl, { signal: ctrl.signal });
        if (cancelled) return;
        if (!r.ok || !r.body) {
          const text = await r.text().catch(() => "");
          console.error("[A2UI] stream failed:", r.status, text);
          setError(`stream failed (${r.status})${text ? `: ${text.slice(0, 200)}` : ""}`);
          return;
        }
        const reader = r.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        while (!cancelled) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n");
          buffer = parts.pop() ?? "";
          for (const line of parts) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            try {
              const msg = JSON.parse(trimmed) as A2UIMessage;
              applyMessage(msg, dispatch);
            } catch {
              console.warn("[A2UI] bad line:", trimmed);
            }
          }
        }
        // Flush remainder
        if (!cancelled && buffer.trim()) {
          try {
            applyMessage(JSON.parse(buffer.trim()), dispatch);
          } catch {
            /* ignore */
          }
        }
      } catch (e) {
        if ((e as { name?: string })?.name === "AbortError") return;
        console.error("[A2UI] stream error:", e);
        setError(String(e));
      }
    })();

    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, [streamUrl]);

  const components = state.surfaces[surfaceId] ?? [];

  return (
    <div className="space-y-4">
      {components.map(c => (
        <RenderComponent key={c.id} component={c} />
      ))}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 text-red-900 text-sm p-4">
          <p className="font-semibold mb-1">{t("lesson.loadFailed")}</p>
          <p className="text-xs opacity-80">{error}</p>
        </div>
      )}
      {!state.complete && !error && (
        <div className="flex items-center gap-2 text-xs text-hive-grey/70 px-2 py-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-hive-orange animate-pulse" />
          {components.length === 0 ? t("lesson.preparing") : t("lesson.loadingMore")}
        </div>
      )}
    </div>
  );
}

function applyMessage(msg: A2UIMessage, dispatch: (a: Action) => void) {
  switch (msg.kind) {
    case "createSurface":
      dispatch({ type: "createSurface", surfaceId: msg.surfaceId });
      break;
    case "addComponent":
      dispatch({ type: "addComponent", surfaceId: msg.surfaceId, component: msg.component });
      break;
    case "patchComponent":
      dispatch({
        type: "patchComponent",
        surfaceId: msg.surfaceId,
        id: msg.id,
        props: msg.props,
      });
      break;
    case "complete":
      dispatch({ type: "complete" });
      break;
  }
}

function RenderComponent({ component }: { component: A2UIComponent }) {
  switch (component.type) {
    case "LessonHeader":
      return <LessonHeader {...component.props} />;
    case "KeyIdeaCard":
      return <KeyIdeaCard {...component.props} />;
    case "ExampleCallout":
      return <ExampleCallout {...component.props} />;
    case "QuizMultipleChoice":
      return <QuizMultipleChoice {...component.props} />;
    case "ChecklistInteractive":
      return <ChecklistInteractive {...component.props} />;
    case "BmcMiniCanvas":
      return <BmcMiniCanvas {...component.props} />;
    case "ValuePropFormula":
      return <ValuePropFormula {...component.props} />;
    case "TamSamSomCalculator":
      return <TamSamSomCalculator {...component.props} />;
    case "ApplyToMyStartupForm":
      return <ApplyToMyStartupForm {...component.props} />;
    case "OutroCard":
      return <OutroCard {...component.props} />;
    case "DeepDiveIntro":
      return <DeepDiveIntro {...component.props} />;
    case "Callout":
      return <Callout {...component.props} />;
    case "IllustratedDiagram":
      return <IllustratedDiagram {...component.props} />;
    case "OrderedSteps":
      return <OrderedSteps {...component.props} />;
    case "ComparisonTable":
      return <ComparisonTable {...component.props} />;
    case "StatHighlight":
      return <StatHighlight {...component.props} />;
    case "QuoteCard":
      return <QuoteCard {...component.props} />;
    case "PrincipleGrid":
      return <PrincipleGrid {...component.props} />;
    default:
      // Unknown component type — defensive (should never happen since the
      // catalog is closed).
      console.warn("[A2UI] Unknown component type:", (component as { type: string }).type);
      return null;
  }
}

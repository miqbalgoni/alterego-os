import { notFound } from "next/navigation";
import { LessonClient } from "./LessonClient";
import {
  getModule,
  modulesForSection,
  type ModuleSummary,
} from "@/lib/modules/catalog";
import { getModuleContent } from "@/lib/modules/content";

export default function LessonPage({ params }: { params: { moduleId: string } }) {
  const mod = getModule(params.moduleId);
  const content = getModuleContent(params.moduleId);
  if (!mod || !content) return notFound();

  const peers = modulesForSection(mod.section);
  const idx = peers.findIndex(m => m.id === mod.id);
  const prevModule: ModuleSummary | null = idx > 0 ? peers[idx - 1] : null;
  const nextModule: ModuleSummary | null = idx >= 0 && idx < peers.length - 1 ? peers[idx + 1] : null;

  return (
    <LessonClient
      moduleId={params.moduleId}
      title={mod.title}
      shortTitle={mod.shortTitle}
      section={mod.section}
      sectionLabel={sectionLabel(mod.section)}
      estMinutes={mod.estMinutes}
      peers={peers.map(p => ({ id: p.id, shortTitle: p.shortTitle, title: p.title }))}
      currentIndex={idx}
      prevModule={prevModule ? { id: prevModule.id, shortTitle: prevModule.shortTitle, title: prevModule.title } : null}
      nextModule={nextModule ? { id: nextModule.id, shortTitle: nextModule.shortTitle, title: nextModule.title } : null}
    />
  );
}

function sectionLabel(section: string): string {
  const map: Record<string, string> = {
    "irl-1": "IRL 1 — Idea & Business Model",
    "irl-2": "IRL 2 — Market & Competition",
    "irl-3": "IRL 3 — Validation & Value Prop",
    "irl-4": "IRL 4 — MVP & Testing",
    "irl-5": "IRL 5 — Product/Market Fit",
  };
  return map[section] ?? section;
}

import { notFound } from "next/navigation";
import { SectionForm } from "@/components/SectionForm";
import { Irl0Client } from "./Irl0Client";
import {
  getSection,
  prevSectionId,
  nextSectionId,
  IRL_QUESTIONS,
} from "@/lib/questions";
import { getLocaleFromCookies } from "@/lib/auth";
import { localizedModulesForSection } from "@/i18n/getters";

export default function IRLSectionPage({ params }: { params: { section: string } }) {
  // IRL 0 is the foundation library (no scored questions in the source PDF).
  if (params.section === "0") {
    const locale = getLocaleFromCookies();
    const modules = localizedModulesForSection("irl-0", locale).map(m => ({
      id: m.id,
      title: m.title,
      shortTitle: m.shortTitle,
      blurb: m.blurb,
      estMinutes: m.estMinutes,
    }));
    return <Irl0Client modules={modules} />;
  }

  const sectionId = `irl-${params.section}`;
  const section = getSection(sectionId);
  if (!section) return notFound();

  const questions = IRL_QUESTIONS.filter(q => q.section === sectionId);

  return (
    <SectionForm
      section={section}
      questions={questions}
      prevSection={prevSectionId(sectionId)}
      nextSection={nextSectionId(sectionId)}
    />
  );
}

export function generateStaticParams() {
  // 0 = foundation library; 1–9 = scored assessments.
  return Array.from({ length: 10 }, (_, i) => ({ section: String(i) }));
}

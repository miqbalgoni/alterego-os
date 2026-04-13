import { notFound } from "next/navigation";
import { SectionForm } from "@/components/SectionForm";
import {
  getSection,
  prevSectionId,
  nextSectionId,
  IRL_QUESTIONS,
} from "@/lib/questions";

export default function IRLSectionPage({ params }: { params: { section: string } }) {
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
  return Array.from({ length: 9 }, (_, i) => ({ section: String(i + 1) }));
}

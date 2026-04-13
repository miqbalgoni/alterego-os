import { SectionForm } from "@/components/SectionForm";
import { PERSONAL_QUESTIONS, SECTIONS, getSection, prevSectionId, nextSectionId } from "@/lib/questions";

export default function PersonalPage() {
  const section = getSection("personal")!;
  return (
    <SectionForm
      section={section}
      questions={PERSONAL_QUESTIONS}
      prevSection={prevSectionId("personal")}
      nextSection={nextSectionId("personal")}
    />
  );
}

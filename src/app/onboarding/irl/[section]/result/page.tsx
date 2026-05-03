import { ResultClient } from "./ResultClient";
import { notFound } from "next/navigation";

export default function IRLResultPage({ params }: { params: { section: string } }) {
  const sectionId = `irl-${params.section}`;
  // Only IRL 1–5 have rubrics + content for now.
  const idx = parseInt(params.section, 10);
  if (Number.isNaN(idx) || idx < 1 || idx > 9) return notFound();
  return <ResultClient sectionId={sectionId} />;
}

export function generateStaticParams() {
  return Array.from({ length: 9 }, (_, i) => ({ section: String(i + 1) }));
}

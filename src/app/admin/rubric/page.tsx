import { RUBRICS, RUBRIC_VERSION } from "@/lib/scoring/rubrics";
import { listActiveOverrides } from "@/lib/scoring/rubricOverrides";
import { Card, PageHeader, Pill } from "../_components/AdminUI";
import { RubricEditor } from "./_RubricEditor";

export const dynamic = "force-dynamic";

export default async function AdminRubricPage() {
  const overrides = await listActiveOverrides();
  const overrideBySection = new Map(overrides.map(o => [o.section, o]));

  const sections = Object.values(RUBRICS).map(r => {
    const o = overrideBySection.get(r.section);
    let data: { criteria?: string; threshold?: number; notes?: string } = {};
    if (o) {
      try { data = JSON.parse(o.rubricJson); } catch {}
    }
    return {
      section: r.section,
      title: r.title,
      threshold: data.threshold ?? r.threshold,
      defaultThreshold: r.threshold,
      criteria: data.criteria ?? r.criteria,
      defaultCriteria: r.criteria,
      allowedGapTags: r.allowedGapTags,
      questionIds: r.questionIds,
      hasOverride: !!o,
      overrideId: o?.id ?? null,
      overrideVersion: o?.version ?? null,
      notes: data.notes ?? "",
    };
  });

  return (
    <>
      <PageHeader
        title="Scoring rubric"
        subtitle={`Active rubric: ${RUBRIC_VERSION}. Overrides re-route the evaluator without code changes.`}
      />

      <Card className="mb-4 bg-amber-50/40 border-amber-200">
        <div className="text-sm text-hive-dark">
          <strong>How overrides work:</strong> each section ships with default criteria
          embedded in Claude's scoring prompt. Saving an override stores a new version
          in the database; the evaluator merges it on every new score. Existing
          assessments aren't recomputed — re-trigger scoring from the founder's profile
          if you need to re-score under the new rubric.
        </div>
      </Card>

      <div className="space-y-4">
        {sections.map(s => (
          <Card
            key={s.section}
            title={s.title}
            subtitle={`${s.questionIds.length} questions · ${s.allowedGapTags.length} gap tags`}
            actions={
              s.hasOverride ? (
                <Pill tone="brand">override active · {s.overrideVersion}</Pill>
              ) : (
                <Pill tone="neutral">default</Pill>
              )
            }
          >
            <RubricEditor
              section={s.section}
              initialCriteria={s.criteria}
              defaultCriteria={s.defaultCriteria}
              initialThreshold={s.threshold}
              defaultThreshold={s.defaultThreshold}
              initialNotes={s.notes}
              hasOverride={s.hasOverride}
              allowedGapTags={s.allowedGapTags}
            />
          </Card>
        ))}
      </div>
    </>
  );
}

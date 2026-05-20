// Admin-editable overrides for the IRL scoring rubric.
//
// When an admin saves an override for a section, we store the new criteria text
// (and optionally a new threshold) as a RubricOverride row tagged active. The
// evaluator calls getEffectiveRubric() which merges the static rubric with the
// most recent active override.
//
// We never mutate the in-code rubric. This preserves the ability to revert by
// deleting the override row.

import { prisma } from "@/lib/db";
import { getRubric, type SectionRubric } from "./rubrics";

export interface RubricOverrideData {
  criteria?: string;
  threshold?: number;
  notes?: string;
}

export async function getEffectiveRubric(section: string): Promise<SectionRubric | null> {
  const base = getRubric(section);
  if (!base) return null;
  const override = await prisma.rubricOverride.findFirst({
    where: { section, active: true },
    orderBy: { createdAt: "desc" },
  });
  if (!override) return base;
  let data: RubricOverrideData = {};
  try { data = JSON.parse(override.rubricJson) as RubricOverrideData; } catch {}
  return {
    ...base,
    criteria: data.criteria ?? base.criteria,
    threshold: data.threshold ?? base.threshold,
  };
}

export async function listActiveOverrides() {
  return prisma.rubricOverride.findMany({
    where: { active: true },
    orderBy: { section: "asc" },
  });
}

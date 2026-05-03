// Module recommendation engine.
// Given an assessment's gapTags, pick the modules that best address them.
//
// Returns TWO lists:
//   - required: modules to address active gaps (only when score < threshold)
//   - optional: modules in the same section the founder hasn't done yet,
//     surfaced even when score >= threshold so the founder can keep learning.

import { MODULES, MODULE_BY_ID, type ModuleSummary } from "./catalog";

// Catalog index lookup — used to sort recommended modules into the same
// order they appear in the content file (M13 → M14 → M15 → ...). The picking
// logic below is still gap-driven (overlap × score), but the FINAL output is
// presented in pedagogical order so founders see modules in the natural
// progression rather than gap-density order.
const CATALOG_INDEX: Record<string, number> = Object.fromEntries(
  MODULES.map((m, i) => [m.id, i])
);
const sortByCatalogOrder = (a: ModuleSummary, b: ModuleSummary) =>
  (CATALOG_INDEX[a.id] ?? 9999) - (CATALOG_INDEX[b.id] ?? 9999);

export interface RecommendOpts {
  section: string;
  score: number;
  threshold: number;
  gapTags: string[];
  excludeIds?: Set<string>;
  maxModules?: number;       // for required
  maxMinutes?: number;        // for required
  maxOptional?: number;       // cap on optional bucket
}

export interface Recommendations {
  required: ModuleSummary[];
  optional: ModuleSummary[];
}

export function recommendModules(opts: RecommendOpts): Recommendations {
  const tagSet = new Set<string>(opts.gapTags);
  const exclude = opts.excludeIds ?? new Set<string>();
  const maxModules = opts.maxModules ?? 3;
  const maxMinutes = opts.maxMinutes ?? 30;
  const maxOptional = opts.maxOptional ?? 4;

  const passed = opts.score >= opts.threshold;

  // -------- REQUIRED bucket — only when below threshold ----------------------
  const required: ModuleSummary[] = [];
  if (!passed) {
    type Scored = { mod: ModuleSummary; score: number };
    const scored: Scored[] = [];
    for (const mod of MODULES) {
      if (exclude.has(mod.id)) continue;
      const overlap = mod.addressesTags.filter(t => tagSet.has(t)).length;
      if (overlap === 0) continue;
      let score = overlap * 10;
      if (mod.section === opts.section) score += 5;
      score += Math.max(0, 12 - mod.estMinutes) * 0.1;
      scored.push({ mod, score });
    }
    scored.sort((a, b) => b.score - a.score);

    const pickedIds = new Set<string>();
    let totalMins = 0;
    for (const { mod } of scored) {
      if (required.length >= maxModules) break;
      if (totalMins + mod.estMinutes > maxMinutes) continue;
      const unmet = mod.prerequisites.filter(
        pid => !pickedIds.has(pid) && !exclude.has(pid)
      );
      if (unmet.length > 0) {
        for (const pid of unmet) {
          const prereq = MODULE_BY_ID[pid];
          if (!prereq || pickedIds.has(prereq.id)) continue;
          if (totalMins + prereq.estMinutes > maxMinutes) continue;
          if (prereq.addressesTags.some(t => tagSet.has(t))) {
            required.push(prereq);
            pickedIds.add(prereq.id);
            totalMins += prereq.estMinutes;
            if (required.length >= maxModules) break;
          }
        }
        if (required.length >= maxModules) break;
      }
      if (!pickedIds.has(mod.id)) {
        required.push(mod);
        pickedIds.add(mod.id);
        totalMins += mod.estMinutes;
      }
    }
  }

  // Display required modules in catalog order (M13 → M14 → ...) so the user
  // sees them in the natural pedagogical progression, not by overlap density.
  required.sort(sortByCatalogOrder);

  // -------- OPTIONAL bucket — modules in this section not yet done -----------
  const requiredIds = new Set(required.map(m => m.id));
  const optional: ModuleSummary[] = [];
  for (const mod of MODULES) {
    if (mod.section !== opts.section) continue;
    if (exclude.has(mod.id)) continue;
    if (requiredIds.has(mod.id)) continue;
    optional.push(mod);
    if (optional.length >= maxOptional) break;
  }
  // Already in catalog order because we iterate MODULES, but be explicit.
  optional.sort(sortByCatalogOrder);

  return { required, optional };
}

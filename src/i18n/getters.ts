// Locale-aware getters that components/routes call instead of importing
// raw catalog data. They overlay Italian translations on top of the English
// source structure, falling back gracefully when a translation is missing.

import { QUESTION_BY_ID, SECTIONS, type Question, type IRLSection } from "@/lib/questions";
import { MODULES, type ModuleSummary } from "@/lib/modules/catalog";
import {
  type SupportedLocale,
  tQuestionLabel,
  tQuestionHelp,
  tQuestionOption,
  tModuleTitle,
  tModuleShortTitle,
  tModuleBlurb,
  tBeatTitle,
} from "./contentTranslations";
import {
  DICTIONARIES,
  type LocaleKey,
} from "./dictionaries";

// ---------------------------------------------------------------------------
// Server-side t() — same contract as the client useI18n.t() but usable in
// Server Components and API routes.
// ---------------------------------------------------------------------------

export function serverT(locale: SupportedLocale, key: LocaleKey): string {
  return DICTIONARIES[locale][key] ?? DICTIONARIES.en[key] ?? key;
}

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

export interface LocalizedQuestion extends Question {
  // The translated labels overwrite the originals so existing components that
  // read `q.label` / `q.help` / `q.options` keep working as-is.
}

export function localizeQuestion(q: Question, locale: SupportedLocale): LocalizedQuestion {
  if (locale === "en") return q;
  return {
    ...q,
    label: tQuestionLabel(q.id, locale, q.label),
    help: tQuestionHelp(q.id, locale, q.help),
    options: q.options
      ? q.options.map(o => tQuestionOption(q.id, o, locale))
      : undefined,
  };
}

export function localizeQuestions(qs: Question[], locale: SupportedLocale): LocalizedQuestion[] {
  return qs.map(q => localizeQuestion(q, locale));
}

export function getLocalizedQuestion(qid: string, locale: SupportedLocale): LocalizedQuestion | undefined {
  const q = QUESTION_BY_ID[qid];
  return q ? localizeQuestion(q, locale) : undefined;
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

export interface LocalizedSection extends IRLSection {}

export function localizeSection(s: IRLSection, locale: SupportedLocale): LocalizedSection {
  if (locale === "en") return s;
  if (s.id === "personal") {
    return { ...s, title: serverT(locale, "section.personal") };
  }
  const longKey = s.id.startsWith("irl-")
    ? (`irl.long.${s.id.replace("irl-", "")}` as LocaleKey)
    : null;
  const subtitleKey = s.id.startsWith("irl-")
    ? (`irl.subtitle.${s.id.replace("irl-", "")}` as LocaleKey)
    : null;
  return {
    ...s,
    title: longKey ? serverT(locale, longKey) : s.title,
    subtitle: subtitleKey ? serverT(locale, subtitleKey) : s.subtitle,
  };
}

export function localizedSections(locale: SupportedLocale): LocalizedSection[] {
  return SECTIONS.map(s => localizeSection(s, locale));
}

// ---------------------------------------------------------------------------
// Modules
// ---------------------------------------------------------------------------

export interface LocalizedModule extends ModuleSummary {}

export function localizeModule(m: ModuleSummary, locale: SupportedLocale): LocalizedModule {
  if (locale === "en") return m;
  return {
    ...m,
    title: tModuleTitle(m.id, locale, m.title),
    shortTitle: tModuleShortTitle(m.id, locale, m.shortTitle),
    blurb: tModuleBlurb(m.id, locale, m.blurb),
  };
}

export function localizedModulesForSection(
  section: string,
  locale: SupportedLocale
): LocalizedModule[] {
  return MODULES.filter(m => m.section === section).map(m =>
    localizeModule(m, locale)
  );
}

// ---------------------------------------------------------------------------
// Beat title localization
// ---------------------------------------------------------------------------

export function getLocalizedBeatTitle(
  moduleId: string,
  beatId: string,
  englishTitle: string,
  locale: SupportedLocale
): string {
  // moduleId looks like "m13-defining-the-problem"; beat-title map keys use "m13".
  const short = moduleId.split("-")[0];
  return tBeatTitle(short, beatId, locale, englishTitle);
}

// ---------------------------------------------------------------------------
// Section short-label (for radar etc.)
// ---------------------------------------------------------------------------

export function getSectionShortLabel(
  sectionId: string,
  locale: SupportedLocale
): string {
  const map: Record<string, LocaleKey> = {
    "irl-1": "irl.short.idea",
    "irl-2": "irl.short.market",
    "irl-3": "irl.short.validation",
    "irl-4": "irl.short.mvp",
    "irl-5": "irl.short.pmf",
    "irl-6": "irl.short.revenue",
    "irl-7": "irl.short.prototype",
    "irl-8": "irl.short.operations",
    "irl-9": "irl.short.metrics",
  };
  if (sectionId === "irl-0") return serverT(locale, "irl0.short");
  const key = map[sectionId];
  return key ? serverT(locale, key) : sectionId;
}

export function getSectionLongLabel(
  sectionId: string,
  locale: SupportedLocale
): string {
  if (!sectionId.startsWith("irl-")) return sectionId;
  const n = sectionId.replace("irl-", "");
  return serverT(locale, `irl.long.${n}` as LocaleKey);
}
